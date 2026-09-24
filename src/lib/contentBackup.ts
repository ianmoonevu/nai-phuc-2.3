export const contentKeys = {
  projects: 'hoki_projects_v1', articles: 'hoki_articles_v1',
  mediaItems: 'hoki_media_v1', consultationRequests: 'hoki_consultations_v1',
  branding: 'hoki_branding_v1', epcPartners: 'hoki_epc_partners_v1',
  epcSectionConfig: 'hoki_epc_config_v1', aboutInfo: 'hoki_about_info_v1',
  leadershipHeads: 'hoki_leadership_v1', advisoryMembers: 'hoki_advisory_v1',
  products: 'hoki_products_v1',
} as const;
export type ContentField = keyof typeof contentKeys;
const objects = new Set(['branding', 'epcSectionConfig', 'aboutInfo']);
export function validateBackup(raw: any): Partial<Record<ContentField, any>> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid HOKI backup.');
  if (raw.version && !['3.0', '4.0'].includes(raw.version)) throw new Error('Unsupported backup version.');
  const result: Partial<Record<ContentField, any>> = {};
  for (const key of Object.keys(contentKeys) as ContentField[]) {
    if (!Object.hasOwn(raw, key)) continue;
    const value = raw[key];
    if (objects.has(key)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid ${key}.`);
    } else {
      if (!Array.isArray(value)) throw new Error(`Invalid ${key}.`);
      const ids = new Set<string>();
      for (const item of value) {
        const id = item?.id || (['leadershipHeads', 'advisoryMembers'].includes(key) ? item?.name : null);
        if (typeof id !== 'string' || !id || ids.has(id)) throw new Error(`Missing or duplicate ID in ${key}.`);
        ids.add(id);
        if (key === 'products') validateProduct(item);
      }
      if (key === 'products' && !value.length) throw new Error('Keep at least one product.');
    }
    result[key] = value;
  }
  if (!Object.keys(result).length) throw new Error('No recognized content in this backup.');
  return result;
}
export function validateProduct(p: any) {
  for (const key of ['id', 'name', 'series', 'subtitle', 'description', 'tensileStrength', 'aspectRatio', 'primaryApplication', 'fiberCountPerKg', 'geometry', 'diameter', 'length', 'coating']) {
    if (typeof p[key] !== 'string') throw new Error(`Product: invalid ${key}.`);
  }
  if (!p.name.trim() || !p.id.trim()) throw new Error('Product ID and name are required.');
  for (const key of ['keyMetric1', 'keyMetric2']) {
    if (typeof p[key]?.label !== 'string' || typeof p[key]?.value !== 'string') throw new Error(`Product: invalid ${key}.`);
  }
  for (const key of ['standards', 'codes', 'standardCodes', 'tensileClasses', 'applications']) {
    if ((key === 'standards' || p[key] !== undefined) && (!Array.isArray(p[key]) || p[key].some((s: unknown) => typeof s !== 'string'))) throw new Error(`Product: invalid ${key}.`);
  }
  if (p.image && !/^(https?:\/\/|\/(?!\/)|data:image\/(png|jpeg|webp|gif);base64,)/i.test(p.image)) throw new Error('Use an HTTPS image, a site image path, or an uploaded image.');
}
export function createBackup(content: Record<string, any>, type = 'all') {
  const fields = type === 'projects' ? ['projects'] : type === 'knowledge' ? ['articles'] : Object.keys(contentKeys);
  const data: Record<string, any> = { backupType: type, version: '4.0', exportedAt: new Date().toISOString() };
  for (const key of fields) data[key] = content[key];
  return JSON.parse(JSON.stringify(data));
}
export function mergeBackup(current: Record<string, any>, incoming: Record<string, any>, mode: 'merge' | 'replace') {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(incoming)) {
    if (mode === 'replace') result[key] = value;
    else if (Array.isArray(value)) {
      const rows = new Map((current[key] || []).map((item: any) => [item.id || item.name, item]));
      for (const item of value) rows.set(item.id || item.name, item);
      result[key] = [...rows.values()];
    } else result[key] = { ...current[key], ...value };
  }
  return result;
}
