import { PageRoute } from '../types';

export const ROUTE_PATH_MAP: Record<PageRoute, string> = {
  home: '/',
  about: '/about-us',
  products: '/products',
  projects: '/projects',
  'project-detail': '/projects',
  knowledge: '/knowledge',
  contact: '/contact',
  blog: '/knowledge',
  esg: '/knowledge',
  admin: '/admin',
};

export const normalizePath = (pathname: string): string => {
  if (!pathname) return '/';
  const clean = pathname.toLowerCase().trim();
  if (clean.length > 1 && clean.endsWith('/')) {
    return clean.slice(0, -1);
  }
  return clean || '/';
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

export const getProjectSlugFromPath = (pathname: string): string | null => {
  const normalized = normalizePath(pathname);
  if (normalized.startsWith('/projects/')) {
    const segments = normalized.split('/').filter(Boolean);
    if (segments.length >= 2 && segments[0] === 'projects') {
      return segments[1];
    }
  }
  return null;
};

export const getProjectDetailPath = (slugOrCodeOrId: string): string => {
  const cleanSlug = slugify(slugOrCodeOrId);
  return `/projects/${cleanSlug}`;
};

export const getRouteFromPath = (pathname: string): PageRoute => {
  const normalized = normalizePath(pathname);

  if (normalized === '/' || normalized === '/home') {
    return 'home';
  }
  if (normalized === '/about-us' || normalized === '/about' || normalized.startsWith('/about-us/') || normalized.startsWith('/about/')) {
    return 'about';
  }
  if (normalized === '/contact' || normalized.startsWith('/contact/')) {
    return 'contact';
  }
  if (normalized === '/products' || normalized.startsWith('/products/')) {
    return 'products';
  }
  if (normalized.startsWith('/projects/')) {
    const slug = getProjectSlugFromPath(normalized);
    if (slug) {
      return 'project-detail';
    }
    return 'projects';
  }
  if (normalized === '/projects') {
    return 'projects';
  }
  if (normalized === '/knowledge' || normalized.startsWith('/knowledge/')) {
    return 'knowledge';
  }
  if (normalized === '/blog' || normalized.startsWith('/blog/')) {
    return 'blog';
  }
  if (normalized === '/esg' || normalized.startsWith('/esg/')) {
    return 'esg';
  }
  if (normalized === '/admin' || normalized.startsWith('/admin/')) {
    return 'admin';
  }

  return 'home';
};

export const getPathForRoute = (route: PageRoute): string => {
  return ROUTE_PATH_MAP[route] || '/';
};
