-- Add product_id and href columns to notifications table
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS product_id UUID,
ADD COLUMN IF NOT EXISTS href TEXT;
