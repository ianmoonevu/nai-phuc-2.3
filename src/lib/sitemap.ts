import { getProjectDetailPath, slugify } from '../utils/router';

export function normalizeSiteUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_SITE_URL must be an HTTPS origin, e.g. https://hokimetal.vn');
  }
  return url.origin;
}

export function sitemapUrls(origin: string, projects: { title: string; slug?: string }[], products: { id: string }[]) {
  const base = normalizeSiteUrl(origin);
  const paths = ['/', '/about-us', '/products', '/projects', '/knowledge', '/contact'];
  for (const project of projects) {
    const slug = slugify(project.slug || project.title);
    if (!slug) throw new Error('A project has no usable public slug. Check its title/slug before publishing.');
    paths.push(getProjectDetailPath(slug));
  }
  for (const product of products) {
    if (!product.id) throw new Error('A product is missing its ID.');
    paths.push(`/products?product=${encodeURIComponent(product.id)}`);
  }
  return [...new Set(paths)].map(path => base + path);
}

export function sitemapXml(urls: string[]) {
  if (urls.length > 50000) throw new Error('Sitemap exceeds 50,000 URLs; split it before publishing.');
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
}
