-- ============================================================
-- Trendyol Raw Data Tables — Phase 2
-- ============================================================

-- 1) trendyol_products_raw
CREATE TABLE IF NOT EXISTS public.trendyol_products_raw (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    connection_id       uuid NOT NULL REFERENCES public.marketplace_connections(id) ON DELETE CASCADE,
    external_product_id text NOT NULL,
    merchant_sku        text,
    barcode             text,
    title               text NOT NULL,
    brand               text,
    category_path       text,
    sale_price          numeric,
    raw_json            jsonb NOT NULL DEFAULT '{}',
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    UNIQUE(connection_id, external_product_id)
);

CREATE INDEX IF NOT EXISTS idx_tpr_user_id ON public.trendyol_products_raw(user_id);
CREATE INDEX IF NOT EXISTS idx_tpr_connection_id ON public.trendyol_products_raw(connection_id);

-- RLS: user reads own data; writes via server only
ALTER TABLE public.trendyol_products_raw ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products_raw"
    ON public.trendyol_products_raw FOR SELECT
    USING (auth.uid() = user_id);
-- No INSERT/UPDATE/DELETE policies → server-only writes via service_role


-- 2) trendyol_orders_raw
CREATE TABLE IF NOT EXISTS public.trendyol_orders_raw (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    connection_id       uuid NOT NULL REFERENCES public.marketplace_connections(id) ON DELETE CASCADE,
    order_number        text NOT NULL,
    order_date          timestamptz,
    status              text,
    total_price         numeric,
    raw_json            jsonb NOT NULL DEFAULT '{}',
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    UNIQUE(connection_id, order_number)
);

CREATE INDEX IF NOT EXISTS idx_tor_user_id ON public.trendyol_orders_raw(user_id);
CREATE INDEX IF NOT EXISTS idx_tor_connection_id ON public.trendyol_orders_raw(connection_id);

-- RLS: user reads own data; writes via server only
ALTER TABLE public.trendyol_orders_raw ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders_raw"
    ON public.trendyol_orders_raw FOR SELECT
    USING (auth.uid() = user_id);
-- No INSERT/UPDATE/DELETE policies → server-only writes via service_role


-- 3) Auto-update triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_tpr_updated_at') THEN
        CREATE TRIGGER trg_tpr_updated_at
            BEFORE UPDATE ON public.trendyol_products_raw
            FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_tor_updated_at') THEN
        CREATE TRIGGER trg_tor_updated_at
            BEFORE UPDATE ON public.trendyol_orders_raw
            FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();
    END IF;
END;
$$;
