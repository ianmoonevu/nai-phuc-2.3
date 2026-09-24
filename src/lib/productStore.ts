import { getSupabase } from './supabase';
import { validateBackup } from './contentBackup';
import { FiberProduct } from '../types';

// Separate document: never replaces the live branding/default document.
export const PRODUCT_DOCUMENT_ID = 'product-catalogue';
export async function loadProducts(): Promise<FiberProduct[] | null> {
  const db = getSupabase();
  if (!db) throw new Error('Supabase is not configured.');
  const { data, error } = await db.from('site_branding').select('data').eq('id', PRODUCT_DOCUMENT_ID).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return validateBackup(data.data).products;
}
export async function persistProducts(products: FiberProduct[]) {
  validateBackup({ products });
  const db = getSupabase();
  if (!db) throw new Error('Supabase is not configured.');
  const { error } = await db.from('site_branding').upsert({ id: PRODUCT_DOCUMENT_ID, data: { products }, updated_at: new Date().toISOString() });
  if (error) throw new Error(`Products were not saved: ${error.message}`);
  const verified = await loadProducts();
  if (JSON.stringify(verified) !== JSON.stringify(products)) {
    // JSONB may reorder object keys; compare normalized values.
    const normalize = (value: any): any => Array.isArray(value) ? value.map(normalize) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, normalize(value[k])])) : value;
    if (JSON.stringify(normalize(verified)) !== JSON.stringify(normalize(products))) throw new Error('Could not verify the saved product catalogue. Reload before saving again.');
  }
}
