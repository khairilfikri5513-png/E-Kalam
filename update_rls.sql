-- ==========================================
-- E-Kalam Database Fix RLS Script
-- ==========================================
-- Sila jalankan script ini di ruangan SQL Editor dalam Supabase Dashboard anda.

-- 1. Betulkan RLS untuk jadual `app_assets`
CREATE TABLE IF NOT EXISTS public.app_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_key text NOT NULL UNIQUE,
  title text NOT NULL,
  file_path text NOT NULL,
  public_url text NOT NULL,
  asset_type text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.app_assets ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'app_assets' AND policyname = 'Public boleh membaca assets'
    ) THEN
        CREATE POLICY "Public boleh membaca assets" ON public.app_assets FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'app_assets' AND policyname = 'Benarkan admin insert assets'
    ) THEN
        CREATE POLICY "Benarkan admin insert assets" ON public.app_assets FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'app_assets' AND policyname = 'Benarkan admin update assets'
    ) THEN
        CREATE POLICY "Benarkan admin update assets" ON public.app_assets FOR UPDATE USING (true);
    END IF;
END $$;
