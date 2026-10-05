-- =========================================================================
-- AUREX STUDIO — OFFICIAL SUPABASE SQL TABLES SETUP
-- =========================================================================
-- Paste this script into your Supabase SQL Editor and click RUN:
-- (https://supabase.com/dashboard/project/_/sql)
-- =========================================================================

-- 1. MASTER UNIFIED SITE DATA STORE
CREATE TABLE IF NOT EXISTS public.site_data (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Site Data" ON public.site_data;
DROP POLICY IF EXISTS "Admin Full Access Site Data" ON public.site_data;

CREATE POLICY "Public Read Site Data" ON public.site_data
  FOR SELECT USING (true);

CREATE POLICY "Admin Full Access Site Data" ON public.site_data
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');


-- 2. CLIENT INQUIRIES & PROJECT REQUESTS
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  handle TEXT,
  service_id TEXT,
  service_name TEXT,
  budget_range TEXT,
  timeline TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Insert Inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin Access Inquiries" ON public.inquiries;

CREATE POLICY "Public Insert Inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin Access Inquiries" ON public.inquiries
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');


-- 3. VISITOR FEEDBACK & TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Verified Visitor',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Approved Feedback" ON public.feedback;
DROP POLICY IF EXISTS "Public Insert Feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admin Full Access Feedback" ON public.feedback;

CREATE POLICY "Public Read Approved Feedback" ON public.feedback
  FOR SELECT USING (status = 'approved' OR auth.role() = 'service_role');

CREATE POLICY "Public Insert Feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin Full Access Feedback" ON public.feedback
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
