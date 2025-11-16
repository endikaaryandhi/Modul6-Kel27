-- Tabel untuk data sensor
CREATE TABLE IF NOT EXISTS public.sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temperature numeric(6,2) NOT NULL,
  threshold_value numeric(6,2),
  recorded_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS sensor_readings_recorded_at_idx
  ON public.sensor_readings (recorded_at DESC);

-- Tabel untuk pengaturan threshold
CREATE TABLE IF NOT EXISTS public.threshold_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value numeric(6,2) NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS threshold_settings_created_at_idx
  ON public.threshold_settings (created_at DESC);

-- ======== MODIFIKASI AUTH (PENTING) ========

-- 1. Aktifkan Row Level Security (RLS) untuk tabel
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threshold_settings ENABLE ROW LEVEL SECURITY;

-- 2. Buat Kebijakan (Policies) RLS
-- sensor_readings: Siapapun (baik tamu/anon atau pengguna terotentikasi) dapat MEMBACA data.
-- Ini memungkinkan 'anon' key dari frontend (mode tamu) untuk membaca data monitoring.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sensor_readings;
CREATE POLICY "Enable read access for all users"
  ON public.sensor_readings FOR SELECT
  USING (true);

-- threshold_settings: Hanya pengguna yang TEROTENTIKASI (login) yang dapat
-- melihat (SELECT) atau mengubah (INSERT, UPDATE, DELETE) data.
-- Ini akan memblokir 'anon' key.
DROP POLICY IF EXISTS "Enable access for authenticated users only" ON public.threshold_settings;
CREATE POLICY "Enable access for authenticated users only"
  ON public.threshold_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');