import { readFile, writeFile } from 'node:fs/promises';
import { loadEnv } from 'vite';
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from '../src/lib/supabase';
import { PROJECT_CASES, FIBER_PRODUCTS } from '../src/data/mockData';
import { mergeProjects } from '../src/lib/mergeProjects';
import { validateBackup } from '../src/lib/contentBackup';
import { normalizeSiteUrl, sitemapUrls, sitemapXml } from '../src/lib/sitemap';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const origin = normalizeSiteUrl(env.VITE_SITE_URL || 'https://hokimetal.vn');
const endpoint = (env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/+$/, '');
const key = env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
async function readRows(table: string, query: string) {
  const response = await fetch(`${endpoint}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Cannot read public ${table} for sitemap (HTTP ${response.status}). Build stopped to avoid publishing an incomplete sitemap.`);
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error('Invalid sitemap source response.');
  return rows;
}
const rows: any[] = [];
for (let offset = 0; ; offset += 500) {
  const batch = await readRows('projects', `select=*&order=id.asc&limit=500&offset=${offset}`);
  rows.push(...batch);
  if (batch.length < 500) break;
}
const projects = mergeProjects(PROJECT_CASES, rows.filter(row => row.data?._deleted !== true).map(row => ({ ...row, ...row.data, id: row.id })), rows.filter(row => row.data?._deleted === true).map(row => row.id));
const catalogue = await readRows('site_branding', 'select=data&id=eq.product-catalogue');
const products = catalogue.length ? validateBackup(catalogue[0].data).products : FIBER_PRODUCTS;
if (!Array.isArray(products)) throw new Error('Invalid product catalogue; sitemap was not generated.');
const urls = sitemapUrls(origin, projects, products);
await writeFile('dist/sitemap.xml', sitemapXml(urls), 'utf8');
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, 'utf8');
// Match initial HTML metadata to the configured production domain.
const index = await readFile('dist/index.html', 'utf8');
await writeFile('dist/index.html', index.replaceAll('https://hokimetal.vn', origin), 'utf8');
console.log(`Sitemap: ${urls.length} public URLs for ${origin}. Rebuild after adding/removing pages.`);
