-- ==========================================
-- E-Kalam Database Setup Script
-- ==========================================
-- Sila jalankan script ini di ruangan SQL Editor dalam Supabase Dashboard anda.
-- Ia akan mencipta jadual `unit_videos` dan menetapkan RLS (Row Level Security) 
-- yang selamat mengikut spesifikasi yang diminta.

-- 1. Cipta jadual `unit_videos` jika belum wujud
CREATE TABLE IF NOT EXISTS public.unit_videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id text NOT NULL,
  title text NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  video_url text,
  mime_type text,
  file_size bigint,
  uploaded_by text,
  uploaded_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  status text DEFAULT 'active'
);

-- 2. Aktifkan RLS
ALTER TABLE public.unit_videos ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Paparan Guru (Public) boleh membaca video yang berstatus 'active' sahaja
CREATE POLICY "Public boleh membaca video aktif" 
ON public.unit_videos
FOR SELECT
USING (status = 'active');

-- 4. Policy: Memandangkan projek ini menggunakan admin login secara manual tanpa Supabase Auth penuh,
-- kita membenarkan INSERT dan UPDATE supaya endpoint API (yang menggunakan anon key) boleh menyimpan rekod.
-- Jika projek ini dinaiktaraf kepada Supabase Auth yang lengkap kelak, tukarkan `true` kepada `auth.role() = 'authenticated'`
CREATE POLICY "Benarkan admin (anon/API) insert metadata" 
ON public.unit_videos
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Benarkan admin (anon/API) update metadata" 
ON public.unit_videos
FOR UPDATE
USING (true);

-- ==========================================
-- Selesai! Anda kini boleh memuat naik video
-- dari panel admin dan ia akan dipaparkan di
-- aplikasi.
-- ==========================================
