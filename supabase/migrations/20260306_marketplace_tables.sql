-- ============================================================
-- Trendyol Marketplace Integration — Phase 1 Tables & RLS
-- ============================================================

-- 1) marketplace_connections
CREATE TABLE IF NOT EXISTS public.marketplace_connections (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    marketplace text NOT NULL DEFAULT 'trendyol',
    status      text NOT NULL DEFAULT 'disconnected'
                    CHECK (status IN ('disconnected','connected','pending_test','error')),
    store_name  text,
    seller_id   text,
    last_sync_at timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, marketplace)
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_mc_user_id ON public.marketplace_connections(user_id);

-- RLS: user can only see/modify own connections
ALTER TABLE public.marketplace_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections"
    ON public.marketplace_connections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections"
    ON public.marketplace_connections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
    ON public.marketplace_connections FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections"
    ON public.marketplace_connections FOR DELETE
    USING (auth.uid() = user_id);


-- 2) marketplace_secrets (SECURE — no client access)
CREATE TABLE IF NOT EXISTS public.marketplace_secrets (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id   uuid NOT NULL UNIQUE REFERENCES public.marketplace_connections(id) ON DELETE CASCADE,
    encrypted_blob  text NOT NULL,
    key_version     int NOT NULL DEFAULT 1,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- RLS: completely block client access
ALTER TABLE public.marketplace_secrets ENABLE ROW LEVEL SECURITY;

-- No policies = no client access at all.
-- Only service_role key can read/write this table.


-- 3) marketplace_sync_logs
CREATE TABLE IF NOT EXISTS public.marketplace_sync_logs (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id   uuid NOT NULL REFERENCES public.marketplace_connections(id) ON DELETE CASCADE,
    sync_type       text NOT NULL CHECK (sync_type IN ('products','orders','test')),
    status          text NOT NULL CHECK (status IN ('success','failed','running')),
    message         text,
    started_at      timestamptz NOT NULL DEFAULT now(),
    finished_at     timestamptz
);

-- Index for connection lookups
CREATE INDEX IF NOT EXISTS idx_msl_connection_id ON public.marketplace_sync_logs(connection_id);

-- RLS: user can only READ logs for their own connections; writing is server-only
ALTER TABLE public.marketplace_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sync logs"
    ON public.marketplace_sync_logs FOR SELECT
    USING (
        connection_id IN (
            SELECT id FROM public.marketplace_connections
            WHERE user_id = auth.uid()
        )
    );

-- No INSERT/UPDATE/DELETE policies for clients.
-- Only service_role key can write logs.


-- 4) Auto-update updated_at triggers
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_mc_updated_at') THEN
        CREATE TRIGGER trg_mc_updated_at
            BEFORE UPDATE ON public.marketplace_connections
            FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ms_updated_at') THEN
        CREATE TRIGGER trg_ms_updated_at
            BEFORE UPDATE ON public.marketplace_secrets
            FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();
    END IF;
END;
$$;
