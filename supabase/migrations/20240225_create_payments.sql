-- ============================================================
-- Shopier Payments Table
-- Tracks all payment attempts for Kârnet Pro subscriptions
-- ============================================================

CREATE TABLE IF NOT EXISTS public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan text NOT NULL CHECK (plan IN ('pro_monthly', 'pro_yearly')),
    amount_try integer NOT NULL,
    status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
    provider text NOT NULL DEFAULT 'shopier',
    provider_order_id text UNIQUE NOT NULL,
    provider_tx_id text,
    created_at timestamptz NOT NULL DEFAULT now(),
    paid_at timestamptz,
    raw_payload jsonb
);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can only read their own payment rows
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Only service-role (server) can insert/update
-- No insert/update policies for authenticated role → server uses service role key

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id ON public.payments(provider_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
