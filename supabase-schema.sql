-- =========================================================================
-- HOKI GREEN ENGINEERING PLATFORM — SUPABASE POSTGRESQL SCHEMA SCRIPT
-- =========================================================================
-- Execute this entire script directly in the Supabase Dashboard -> SQL Editor.
-- This script creates all tables, indexes, Row Level Security (RLS) policies,
-- Realtime publications, and default initial seed data.
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. TABLE: site_branding (Hotline, Social Links, Hero Image, Video, Logos)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_branding (
    id TEXT PRIMARY KEY DEFAULT 'default',
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
    full_content JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

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
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
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
    website_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- 7. TABLE: about_page_info (About Us Story, Mission, & Leadership Headers)
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
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epc_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_page_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epc_section_config ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read access to all content tables
CREATE POLICY "Allow public read access on site_branding" ON public.site_branding FOR SELECT USING (true);
CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on consultation_requests" ON public.consultation_requests FOR SELECT USING (true);
CREATE POLICY "Allow public read access on media_items" ON public.media_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access on epc_partners" ON public.epc_partners FOR SELECT USING (true);
CREATE POLICY "Allow public read access on about_page_info" ON public.about_page_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access on epc_section_config" ON public.epc_section_config FOR SELECT USING (true);

-- Allow public anonymous write/insert/update/delete (managed by frontend admin state)
CREATE POLICY "Allow public insert/update on site_branding" ON public.site_branding FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update on articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update on consultation_requests" ON public.consultation_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update on media_items" ON public.media_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update on epc_partners" ON public.epc_partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update on about_page_info" ON public.about_page_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update on epc_section_config" ON public.epc_section_config FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- REALTIME REPLICATION CONFIGURATION
-- =========================================================================
-- Enable Supabase Realtime for all tables so multi-browser clients get instant updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_branding;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultation_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.media_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.epc_partners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.about_page_info;
ALTER PUBLICATION supabase_realtime ADD TABLE public.epc_section_config;

-- =========================================================================
-- SEED INITIAL DEFAULT RECORDS
-- =========================================================================
INSERT INTO public.site_branding (id, hotline_phone, hotline_label, hotline_subtitle, hotline_enabled)
VALUES ('default', '0916 576 156', 'CALL NOW', 'Direct Engineering Desk', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about_page_info (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.epc_section_config (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
