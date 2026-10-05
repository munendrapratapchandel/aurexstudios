-- =========================================================================
-- AUREX STUDIO — OFFICIAL SUPABASE CLOUD DATABASE SCHEMA
-- =========================================================================
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- It creates the master site data table, inquiries table, feedback table,
-- and configures storage policies for Aurex Studio.
-- =========================================================================

-- 1. MASTER UNIFIED SITE DATA STORE
-- Stores full site configuration, workspace cockpit, developer rosters,
-- services, projects, settings, and revision state.
CREATE TABLE IF NOT EXISTS public.site_data (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;

-- Drop old policies if re-running
DROP POLICY IF EXISTS "Public Read Site Data" ON public.site_data;
DROP POLICY IF EXISTS "Admin Full Access Site Data" ON public.site_data;

-- Public can read site data for frontend hydration
CREATE POLICY "Public Read Site Data" ON public.site_data
  FOR SELECT
  USING (true);

-- Authenticated / Service role has full CRUD access
CREATE POLICY "Admin Full Access Site Data" ON public.site_data
  FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');


-- 2. CLIENT INQUIRIES & PROJECT REQUESTS
-- Dedicated relational table for leads, client inquiries, budget tiers & status
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

-- Public visitors can submit new inquiries
CREATE POLICY "Public Insert Inquiries" ON public.inquiries
  FOR INSERT
  WITH CHECK (true);

-- Admin & Service Role can view/update/decline/accept inquiries
CREATE POLICY "Admin Access Inquiries" ON public.inquiries
  FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');


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

-- Anyone can read approved testimonials
CREATE POLICY "Public Read Approved Feedback" ON public.feedback
  FOR SELECT
  USING (status = 'approved' OR auth.role() = 'service_role');

-- Anyone can submit feedback
CREATE POLICY "Public Insert Feedback" ON public.feedback
  FOR INSERT
  WITH CHECK (true);

-- Admin can moderate (approve, reject, delete) feedback
CREATE POLICY "Admin Full Access Feedback" ON public.feedback
  FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');


-- 4. SUPABASE STORAGE BUCKET: aurex-media
-- For public asset hosting (logos, favicons, project screenshots, developer avatars)
INSERT INTO storage.buckets (id, name, public)
VALUES ('aurex-media', 'aurex-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS policies
DROP POLICY IF EXISTS "Public Read Aurex Media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Aurex Media" ON storage.objects;

CREATE POLICY "Public Read Aurex Media" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'aurex-media');

CREATE POLICY "Admin Upload Aurex Media" ON storage.objects
  FOR ALL
  USING (bucket_id = 'aurex-media' AND (auth.role() = 'service_role' OR auth.role() = 'authenticated'));
