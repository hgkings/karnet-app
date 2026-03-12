-- Add is_pro and plan_type columns to profiles for PayTR integration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type text DEFAULT null;
