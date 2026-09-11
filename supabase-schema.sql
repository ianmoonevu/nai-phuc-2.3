-- =========================================================================
-- HOKI GREEN ENGINEERING PLATFORM — SUPABASE POSTGRESQL SCHEMA SCRIPT
-- =========================================================================
-- Execute this entire script directly in the Supabase Dashboard -> SQL Editor.
-- This script creates all tables, idempotent column migrations, RLS policies,
-- Realtime publications, and default initial seed data.
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. TABLE: site_branding (Hotline, Social Links, Hero, Video, Logos, Avatars)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_branding (
    id TEXT PRIMARY KEY DEFAULT 'default',
    brand_name TEXT NOT NULL DEFAULT 'HOKI',
    tagline TEXT NOT NULL DEFAULT 'Innovative and Sustainable',
    header_logo_url TEXT,
    header_logo_height INTEGER DEFAULT 40,
    footer_logo_url TEXT,
    footer_logo_height INTEGER DEFAULT 48,
    favicon_url TEXT DEFAULT '/favicon.svg',
    
    -- Hotline Configuration
    hotline_phone TEXT DEFAULT '0916 576 156',
    hotline_label TEXT DEFAULT 'CALL NOW',
    hotline_subtitle TEXT DEFAULT 'Direct Engineering Desk',
    hotline_enabled BOOLEAN DEFAULT true,
    
    -- Social Media Links (JSONB for dynamic toggles)
    social_links JSONB DEFAULT '{
        "facebook": { "url": "https://facebook.com/hokimetal", "enabled": true },
        "zalo": { "url": "https://zalo.me/0916576156", "enabled": true },
        "linkedin": { "url": "https://linkedin.com/company/hoki-steel-fiber", "enabled": true },
        "youtube": { "url": "https://youtube.com/@hokimetal", "enabled": true },
        "tiktok": { "url": "https://tiktok.com/@hokisteelfiber", "enabled": true }
    }'::jsonb,
    
    -- Hero & About Us Visuals
    hero_image_url TEXT DEFAULT '/images/hoki-industrial-floor-hero.svg',
    hero_overlay_opacity INTEGER DEFAULT 15,
    about_hero_image_url TEXT DEFAULT '/images/hoki-greener-tomorrow-hero.svg',
    about_factory_image_url TEXT DEFAULT '/images/factory-alpha-hub.svg',
    about_leadership_avatars JSONB DEFAULT '{}'::jsonb,
    about_advisory_avatars JSONB DEFAULT '{}'::jsonb,
    
    -- YouTube Video Player
    main_page_youtube_url TEXT DEFAULT 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    main_page_video_title TEXT DEFAULT 'HOKI Precision 3D Steel Fiber & Laser Screed Field Pouring Telemetry',
    main_page_video_channel_url TEXT DEFAULT 'https://www.youtube.com/@hokimetal',
    main_page_video_channel_name TEXT DEFAULT '@hokimetal',
    main_page_video_autoplay BOOLEAN DEFAULT false,
    main_page_video_muted BOOLEAN DEFAULT false,
    main_page_video_default_open BOOLEAN DEFAULT true,
    
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Idempotent column check for site_branding
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS brand_name TEXT NOT NULL DEFAULT 'HOKI';
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS tagline TEXT NOT NULL DEFAULT 'Innovative and Sustainable';
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS header_logo_url TEXT;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS header_logo_height INTEGER DEFAULT 40;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS footer_logo_url TEXT;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS footer_logo_height INTEGER DEFAULT 48;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT '/favicon.svg';
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS hotline_phone TEXT DEFAULT '0916 576 156';
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS hotline_label TEXT DEFAULT 'CALL NOW';
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS hotline_subtitle TEXT DEFAULT 'Direct Engineering Desk';
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS hotline_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS hero_overlay_opacity INTEGER DEFAULT 15;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS about_hero_image_url TEXT;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS about_factory_image_url TEXT;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS about_leadership_avatars JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS about_advisory_avatars JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS main_page_youtube_url TEXT;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS main_page_video_title TEXT;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS main_page_video_channel_url TEXT;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS main_page_video_channel_name TEXT;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS main_page_video_autoplay BOOLEAN DEFAULT false;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS main_page_video_muted BOOLEAN DEFAULT false;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS main_page_video_default_open BOOLEAN DEFAULT true;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -------------------------------------------------------------------------
-- 2. TABLE: projects (Civil & Industrial Flooring Case Studies)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    code TEXT,
    title TEXT NOT NULL,
    client TEXT,
    facility_type TEXT,
    sector TEXT DEFAULT 'industrial',
    sector_label TEXT,
    location TEXT,
    area TEXT,
    year TEXT,
    description TEXT,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    challenge TEXT,
    solution TEXT,
    verification TEXT,
    is_highlight BOOLEAN DEFAULT false,
    metrics JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{
        "fiberSeries": "HF-8060",
        "dosage": "25 kg/m³",
        "concreteGrade": "C30/37",
        "jointSpacing": "Jointless 40m x 40m"
    }'::jsonb,
    client_quote TEXT,
    quote_author TEXT,
    drawings_available BOOLEAN DEFAULT true,
    drone_video_available BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Idempotent column check for projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS facility_type TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sector TEXT DEFAULT 'industrial';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sector_label TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS challenge TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS solution TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS verification TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_highlight BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_quote TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS quote_author TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS drawings_available BOOLEAN DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS drone_video_available BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -------------------------------------------------------------------------
-- 3. TABLE: articles (Technical Monographs & Research Papers)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT,
    category_slug TEXT DEFAULT 'standards',
    date TEXT,
    read_time TEXT,
    author TEXT,
    standards TEXT,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    is_flagship BOOLEAN DEFAULT false,
    content_snippet TEXT,
    sections JSONB DEFAULT '[]'::jsonb,
    full_content JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Idempotent column check for articles
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS category_slug TEXT DEFAULT 'standards';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS read_time TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS standards TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_flagship BOOLEAN DEFAULT false;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS content_snippet TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS full_content JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -------------------------------------------------------------------------
-- 4. TABLE: consultation_requests (RFQs & 1-on-1 Engineering Bookings)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultation_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    firm TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT,
    slab_area TEXT,
    target_date TEXT,
    submitted_at TEXT,
    notes TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Idempotent column check for consultation_requests
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS firm TEXT;
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS project_type TEXT;
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS slab_area TEXT;
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS target_date TEXT;
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS submitted_at TEXT;
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.consultation_requests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Compatibility table/alias: consultations
CREATE TABLE IF NOT EXISTS public.consultations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    firm TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT,
    slab_area TEXT,
    target_date TEXT,
    submitted_at TEXT,
    notes TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- 5. TABLE: media_items (Centralized Media Asset Library)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    size TEXT,
    uploaded_at TEXT,
    category TEXT DEFAULT 'general',
    dimensions TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS uploaded_at TEXT;
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS dimensions TEXT;
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -------------------------------------------------------------------------
-- 6. TABLE: epc_partners (Strategic EPC Contractor Ticker)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.epc_partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    role TEXT,
    origin TEXT,
    logo_url TEXT,
    website TEXT,
    website_url TEXT,
    order_index INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Idempotent column check for epc_partners
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS origin TEXT;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -------------------------------------------------------------------------
-- 7. TABLE: about_page_info & about_info (Story, Mission, & Leadership)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.about_page_info (
    id TEXT PRIMARY KEY DEFAULT 'default',
    title TEXT DEFAULT 'Engineering Tomorrow’s Concrete Infrastructure with Micro-Scale Metallurgy',
    tagline TEXT DEFAULT 'Pioneering net-zero steel fiber reinforcement across APAC and global civil infrastructure since 2021.',
    description TEXT DEFAULT 'HOKI is a precision manufacturing and structural engineering enterprise dedicated to eliminating traditional rebar and welded wire mesh in concrete slabs, tunneling shotcrete, and precast civil segments.',
    mission_label TEXT DEFAULT 'Our Engineering Mission',
    mission_quote TEXT DEFAULT 'Every metric ton of cold-drawn hooked steel fiber we deploy displaces up to 2.5 metric tons of conventional heavy rebar, eliminating thousands of tons of embodied carbon while tripling concrete fatigue life.',
    mission_author TEXT DEFAULT 'HOKI Technical Directorate',
    leadership_heading TEXT DEFAULT 'Executive Leadership & Technical Directorate',
    leadership_subheading TEXT DEFAULT 'Meet the structural metallurgists, concrete rheologists, and civil infrastructure leaders directing HOKI.',
    advisory_heading TEXT DEFAULT 'Global Technical Advisory Board',
    advisory_subheading TEXT DEFAULT 'Independent peer-reviewers and international code authors ensuring uncompromising structural compliance.',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.about_info (
    id TEXT PRIMARY KEY DEFAULT 'default',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- 8. TABLE: epc_section_config (EPC Section Headings)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.epc_section_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    title TEXT DEFAULT 'Trusted by Leading Civil General Contractors & Flooring EPCs',
    subtitle TEXT DEFAULT 'Displacing welded wire mesh across 1,000,000+ m² of heavy industrial floors and logistics hubs.',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
-- Enable RLS on all tables
ALTER TABLE public.site_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epc_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_page_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epc_section_config ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read access to all content tables
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_branding' AND policyname = 'Public Access site_branding') THEN
    CREATE POLICY "Public Access site_branding" ON public.site_branding FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Public Access projects') THEN
    CREATE POLICY "Public Access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public Access articles') THEN
    CREATE POLICY "Public Access articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'consultation_requests' AND policyname = 'Public Access consultation_requests') THEN
    CREATE POLICY "Public Access consultation_requests" ON public.consultation_requests FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'consultations' AND policyname = 'Public Access consultations') THEN
    CREATE POLICY "Public Access consultations" ON public.consultations FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_items' AND policyname = 'Public Access media_items') THEN
    CREATE POLICY "Public Access media_items" ON public.media_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'epc_partners' AND policyname = 'Public Access epc_partners') THEN
    CREATE POLICY "Public Access epc_partners" ON public.epc_partners FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'about_page_info' AND policyname = 'Public Access about_page_info') THEN
    CREATE POLICY "Public Access about_page_info" ON public.about_page_info FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'about_info' AND policyname = 'Public Access about_info') THEN
    CREATE POLICY "Public Access about_info" ON public.about_info FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'epc_section_config' AND policyname = 'Public Access epc_section_config') THEN
    CREATE POLICY "Public Access epc_section_config" ON public.epc_section_config FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =========================================================================
-- REALTIME REPLICATION CONFIGURATION
-- =========================================================================
-- Enable Supabase Realtime for all tables so multi-browser clients get instant updates
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_branding;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.consultation_requests;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.media_items;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.epc_partners;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.about_page_info;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.about_info;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.epc_section_config;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =========================================================================
-- 9. SUPABASE STORAGE: 'media' BUCKET PROVISIONING & POLICIES
-- =========================================================================
-- Automatically provision the public 'media' storage bucket for photos and CAD assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- Storage policies for the 'media' bucket (Public read, write, update, delete)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access media bucket'
  ) THEN
    CREATE POLICY "Public Access media bucket" ON storage.objects
      FOR ALL
      USING (bucket_id = 'media')
      WITH CHECK (bucket_id = 'media');
  END IF;
END $$;

-- =========================================================================
-- SEED INITIAL DEFAULT RECORDS
-- =========================================================================
INSERT INTO public.site_branding (id, hotline_phone, hotline_label, hotline_subtitle, hotline_enabled)
VALUES ('default', '0916 576 156', 'CALL NOW', 'Direct Engineering Desk', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about_page_info (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.about_info (id, data) VALUES ('default', '{}'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.epc_section_config (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

