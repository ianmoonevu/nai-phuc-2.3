import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project credentials for HOKI Green Engineering Platform
export const DEFAULT_SUPABASE_URL = 'https://gfawpkgundnsrqnzrltl.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYXdwa2d1bmRuc3JxbnpybHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMTc4NjAsImV4cCI6MjEwNDU5Mzg2MH0.EX0Z10sSqhk5RWPYqOGKhglEFhaIFKAAdr86QRaTzVQ';

function normalizeSupabaseUrl(url: string): string {
  let clean = (url || '').trim();
  clean = clean.replace(/\/rest\/v1\/?$/, '');
  clean = clean.replace(/\/+$/, '');
  return clean;
}

// Helper to retrieve saved credentials from localStorage or environment variables
function getInitialCredentials() {
  const env = (import.meta as any).env || {};
  let savedConfig = { url: '', key: '' };
  
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('hoki_supabase_credentials') : null;
    if (raw) {
      savedConfig = JSON.parse(raw);
    }
  } catch (e) {
    // ignore parse error
  }

  const rawUrl = savedConfig.url || env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const rawKey = savedConfig.key || env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  const url = normalizeSupabaseUrl(rawUrl);
  const key = rawKey.trim();

  return { url, key };
}

let { url: supabaseUrl, key: supabaseAnonKey } = getInitialCredentials();

export function getSupabaseCredentials(): { url: string; key: string } {
  return { url: supabaseUrl, key: supabaseAnonKey };
}

export function setSupabaseCredentials(newUrl: string, newKey: string): boolean {
  const cleanUrl = normalizeSupabaseUrl(newUrl);
  const cleanKey = newKey.trim();

  supabaseUrl = cleanUrl || DEFAULT_SUPABASE_URL;
  supabaseAnonKey = cleanKey || DEFAULT_SUPABASE_ANON_KEY;

  try {
    if (typeof window !== 'undefined') {
      if (cleanUrl && cleanKey) {
        localStorage.setItem('hoki_supabase_credentials', JSON.stringify({ url: cleanUrl, key: cleanKey }));
      } else {
        localStorage.removeItem('hoki_supabase_credentials');
      }
    }
  } catch (e) {
    console.warn('LocalStorage error saving Supabase credentials:', e);
  }

  // Reset current instance so next getSupabase() creates a new client
  supabaseInstance = null;
  return checkIsConfigured();
}

function checkIsConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
}

// Verify if Supabase is properly configured
export const isSupabaseConfigured = checkIsConfigured();

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!checkIsConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

export const supabase = getSupabase();

