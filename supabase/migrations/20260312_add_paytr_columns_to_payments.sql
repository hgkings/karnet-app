-- Add email and currency columns for PayTR integration
-- Also ensure provider 'paytr' is allowed
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_provider_check;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS currency text DEFAULT 'TRY';
