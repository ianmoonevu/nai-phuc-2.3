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
    const sqlScript = `-- HOKI GREEN ENGINEERING PLATFORM - SUPABASE SCHEMA SETUP
CREATE TABLE IF NOT EXISTS site_branding (
  id TEXT PRIMARY KEY DEFAULT 'default',
  brand_name TEXT NOT NULL DEFAULT 'HOKI',
  tagline TEXT NOT NULL DEFAULT 'Innovative and Sustainable',
  logo_url TEXT,
  favicon_url TEXT,
  hero_image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  sector TEXT NOT NULL,
  sector_label TEXT NOT NULL,
  location TEXT NOT NULL,
  facility_type TEXT NOT NULL,
  area TEXT NOT NULL,
  year TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  specifications JSONB NOT NULL,
  metrics JSONB NOT NULL,
  gallery JSONB,
  client_quote TEXT,
  quote_author TEXT,
  is_highlight BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  standards TEXT NOT NULL,
  image TEXT NOT NULL,
  content_snippet TEXT NOT NULL,
  sections JSONB NOT NULL,
  gallery JSONB,
  is_flagship BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS consultations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  firm TEXT NOT NULL,
  project_type TEXT NOT NULL,
  slab_area TEXT,
  target_date TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS media_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  dimensions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS epc_partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS about_info (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE site_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE epc_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_branding' AND policyname = 'Public Access site_branding') THEN
    CREATE POLICY "Public Access site_branding" ON site_branding FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Public Access projects') THEN
    CREATE POLICY "Public Access projects" ON projects FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public Access articles') THEN
    CREATE POLICY "Public Access articles" ON articles FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'consultations' AND policyname = 'Public Access consultations') THEN
    CREATE POLICY "Public Access consultations" ON consultations FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_items' AND policyname = 'Public Access media_items') THEN
    CREATE POLICY "Public Access media_items" ON media_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'epc_partners' AND policyname = 'Public Access epc_partners') THEN
    CREATE POLICY "Public Access epc_partners" ON epc_partners FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'about_info' AND policyname = 'Public Access about_info') THEN
    CREATE POLICY "Public Access about_info" ON about_info FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE site_branding, projects, articles, consultations, media_items, epc_partners, about_info;`;

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
