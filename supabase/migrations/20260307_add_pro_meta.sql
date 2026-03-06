-- Add pro billing meta fields
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pro_expires_at') THEN
        ALTER TABLE public.profiles ADD COLUMN pro_expires_at timestamptz;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pro_renewal') THEN
        ALTER TABLE public.profiles ADD COLUMN pro_renewal boolean DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pro_started_at') THEN
        ALTER TABLE public.profiles ADD COLUMN pro_started_at timestamptz;
    END IF;
END $$;
