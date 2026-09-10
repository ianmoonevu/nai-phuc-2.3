import React, { useState } from 'react';
import {
  Database,
  Key,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Save,
  RotateCcw
} from 'lucide-react';
import {
  getSupabaseCredentials,
  setSupabaseCredentials,
  isSupabaseConfigured,
  getSupabase
} from '../lib/supabase';

interface AdminSupabaseConfigSectionProps {
  onShowToast: (msg: string) => void;
}

export const AdminSupabaseConfigSection: React.FC<AdminSupabaseConfigSectionProps> = ({ onShowToast }) => {
  const currentCreds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(currentCreds.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(currentCreds.key);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestConnection = async () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setTestStatus('error');
      setTestMessage('Please provide both a valid Supabase Project URL and Anon Public Key.');
      return;
    }

    if (!supabaseUrl.startsWith('https://')) {
      setTestStatus('error');
      setTestMessage('Supabase URL must start with https://');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Testing connection to Supabase cloud...');

    try {
      // Temporarily set credentials to test
      setSupabaseCredentials(supabaseUrl, supabaseAnonKey);
      const client = getSupabase();

      if (!client) {
        setTestStatus('error');
        setTestMessage('Failed to initialize Supabase client with the provided credentials.');
        return;
      }

      // Quick test query against site_branding
      const { data, error } = await client.from('site_branding').select('id').limit(1);

      if (error) {
        // Even if table doesn't exist yet, auth works if code is PGRST116 or 42P01
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
          setTestStatus('success');
          setTestMessage('Connected to Supabase! (Note: Tables are not created yet. Run the SQL setup script below).');
        } else {
          setTestStatus('error');
          setTestMessage(`Supabase error: ${error.message || error.details || 'Connection rejected'}`);
        }
      } else {
        setTestStatus('success');
        setTestMessage('Successfully connected to Supabase PostgreSQL database!');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`Connection test failed: ${err.message || 'Network error'}`);
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = supabaseUrl.trim();
    const cleanKey = supabaseAnonKey.trim();

    const ok = setSupabaseCredentials(cleanUrl, cleanKey);
    if (ok) {
      onShowToast('Supabase credentials saved successfully! Reloading connection...');
      setTestStatus('success');
      setTestMessage('Credentials active. Real-time synchronizer is now live.');
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else if (!cleanUrl && !cleanKey) {
      onShowToast('Cleared custom credentials. Reverted to environment defaults.');
      setTestStatus('idle');
      setTestMessage('Reverted to environment configuration.');
    } else {
      onShowToast('Credentials saved, but verification requires valid URL & Key.');
    }
  };

  const handleResetToEnv = () => {
    if (window.confirm('Clear custom saved Supabase credentials and reload defaults?')) {
      setSupabaseCredentials('', '');
      const creds = getSupabaseCredentials();
      setSupabaseUrl(creds.url);
      setSupabaseAnonKey(creds.key);
      onShowToast('Reset credentials to environment settings.');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const handleCopySql = () => {
    const sqlScript = `-- HOKI GREEN ENGINEERING PLATFORM — COMPLETE SUPABASE SCHEMA & MIGRATION SCRIPT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE: site_branding
CREATE TABLE IF NOT EXISTS public.site_branding (
  id TEXT PRIMARY KEY DEFAULT 'default',
  brand_name TEXT NOT NULL DEFAULT 'HOKI',
  tagline TEXT NOT NULL DEFAULT 'Innovative and Sustainable',
  header_logo_url TEXT,
  header_logo_height INTEGER DEFAULT 40,
  footer_logo_url TEXT,
  footer_logo_height INTEGER DEFAULT 48,
  favicon_url TEXT DEFAULT '/favicon.svg',
  hotline_phone TEXT DEFAULT '0916 576 156',
  hotline_label TEXT DEFAULT 'CALL NOW',
  hotline_subtitle TEXT DEFAULT 'Direct Engineering Desk',
  hotline_enabled BOOLEAN DEFAULT true,
  social_links JSONB DEFAULT '{}'::jsonb,
  hero_image_url TEXT DEFAULT '/images/hoki-industrial-floor-hero.svg',
  hero_overlay_opacity INTEGER DEFAULT 15,
  about_hero_image_url TEXT,
  about_factory_image_url TEXT,
  about_leadership_avatars JSONB DEFAULT '{}'::jsonb,
  about_advisory_avatars JSONB DEFAULT '{}'::jsonb,
  main_page_youtube_url TEXT,
  main_page_video_title TEXT,
  main_page_video_channel_url TEXT,
  main_page_video_channel_name TEXT,
  main_page_video_autoplay BOOLEAN DEFAULT false,
  main_page_video_muted BOOLEAN DEFAULT false,
  main_page_video_default_open BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS about_advisory_avatars JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS about_leadership_avatars JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.site_branding ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 2. TABLE: projects
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  code TEXT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  client TEXT,
  facility_type TEXT,
  sector TEXT DEFAULT 'industrial',
  sector_label TEXT,
  location TEXT,
  area TEXT,
  year TEXT,
  image TEXT NOT NULL,
  description TEXT,
  challenge TEXT,
  solution TEXT,
  verification TEXT,
  is_highlight BOOLEAN DEFAULT false,
  metrics JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  client_quote TEXT,
  quote_author TEXT,
  drawings_available BOOLEAN DEFAULT true,
  drone_video_available BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 3. TABLE: articles
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT,
  category_slug TEXT DEFAULT 'standards',
  author TEXT,
  date TEXT,
  read_time TEXT,
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

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 4. TABLE: consultation_requests & consultations
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

-- 5. TABLE: media_items
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

-- 6. TABLE: epc_partners
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

ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.epc_partners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 7. TABLE: about_page_info & about_info
CREATE TABLE IF NOT EXISTS public.about_page_info (
  id TEXT PRIMARY KEY DEFAULT 'default',
  title TEXT,
  tagline TEXT,
  description TEXT,
  mission_label TEXT,
  mission_quote TEXT,
  mission_author TEXT,
  leadership_heading TEXT,
  leadership_subheading TEXT,
  advisory_heading TEXT,
  advisory_subheading TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.about_info (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 8. TABLE: epc_section_config
CREATE TABLE IF NOT EXISTS public.epc_section_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  title TEXT,
  subtitle TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
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
    CREATE POLICY "Public Access media_items" ON media_items FOR ALL USING (true) WITH CHECK (true);
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

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.site_branding; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.projects; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.articles; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.consultation_requests; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.media_items; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.epc_partners; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.about_page_info; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.about_info; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.epc_section_config; EXCEPTION WHEN OTHERS THEN NULL; END $$;`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    onShowToast('Supabase PostgreSQL SQL script copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider bg-[#006e21]/10 px-2.5 py-0.5 rounded-full">
              Cloud Database & API Key Manager
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isSupabaseConfigured
                ? 'bg-[#006e21]/15 text-[#006e21] border border-[#006e21]/30'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-[#006e21] animate-pulse' : 'bg-amber-600'}`} />
              {isSupabaseConfigured ? 'Connected & Active' : 'Setup Required'}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-[#00356a]">
            Supabase Cloud Connection & API Keys
          </h3>
          <p className="text-xs text-[#00356a]/70 mt-1 max-w-2xl">
            Update your Supabase Project URL and public anon API key below. You can change keys anytime to point to a new project or environment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySql}
            className="px-4 py-2.5 rounded-xl bg-[#f4f6f8] hover:bg-[#e9edf1] text-[#00356a] border border-[#dce0e6] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-bubble-sm"
          >
            {copiedSql ? <Check className="w-4 h-4 text-[#006e21]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'SQL Script Copied!' : 'Copy Setup SQL'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveCredentials} className="space-y-4 pt-4 border-t border-[#e2e6eb]">
        <div>
          <label className="block text-xs font-bold uppercase text-[#00356a] mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#006e21]" />
            <span>Supabase Project URL</span>
          </label>
          <input
            type="text"
            required
            placeholder="https://your-project-id.supabase.co"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-xs font-mono text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
          />
          <span className="text-[10px] text-[#00356a]/60 mt-1 block">
            Found in your Supabase Dashboard under <strong>Project Settings &rarr; API &rarr; Project URL</strong>.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#00356a] mb-1.5 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Supabase Anon Public API Key (`anon` / `public`)</span>
          </label>
          <input
            type="text"
            required
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={supabaseAnonKey}
            onChange={(e) => setSupabaseAnonKey(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-xs font-mono text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
          />
          <span className="text-[10px] text-[#00356a]/60 mt-1 block">
            Found in your Supabase Dashboard under <strong>Project Settings &rarr; API &rarr; Project API keys (anon public)</strong>.
          </span>
        </div>

        {/* Status Message / Test Output */}
        {testStatus !== 'idle' && (
          <div className={`p-4 rounded-2xl text-xs font-medium flex items-start gap-3 ${
            testStatus === 'testing' ? 'bg-blue-50 text-blue-900 border border-blue-200' :
            testStatus === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
            'bg-rose-50 text-rose-900 border border-rose-200'
          }`}>
            {testStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-blue-600 mt-0.5" />}
            {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-[#006e21] shrink-0 mt-0.5" />}
            {testStatus === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
            <div className="flex-1">
              <span>{testMessage}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#e2e6eb]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-4 py-2.5 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-bubble-sm border border-[#dce0e6] transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>
            <button
              type="button"
              onClick={handleResetToEnv}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-[#f4f6f8] text-[#00356a]/70 hover:text-[#00356a] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border border-[#dce0e6]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Apply New Key</span>
          </button>
        </div>
      </form>
    </div>
  );
};
