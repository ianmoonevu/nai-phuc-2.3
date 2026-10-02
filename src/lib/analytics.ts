export function normalizeGa4Id(value: unknown): string {
  const id = typeof value === 'string' ? value.trim().toUpperCase() : '';
  return /^G-[A-Z0-9]{4,20}$/.test(id) ? id : '';
}

// Only content identifiers are included; form values, arbitrary query strings and hashes are omitted.
export function analyticsLocation(href: string): string {
  const url = new URL(href);
  const safe = new URL(url.origin + url.pathname);
  for (const key of ['product', 'id']) {
    const value = url.searchParams.get(key);
    if (value && /^[a-zA-Z0-9_-]{1,100}$/.test(value)) safe.searchParams.set(key, value);
  }
  return safe.href;
}

export function createPageTracker(send: (location: string, referrer: string) => void) {
  let last = '';
  return (href: string) => {
    const location = analyticsLocation(href);
    if (location === last) return;
    send(location, last);
    last = location;
  };
}
