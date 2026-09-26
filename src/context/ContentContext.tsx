import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useData } from './DataContext';
import { FIBER_PRODUCTS } from '../data/mockData';
import { FiberProduct } from '../types';
import { contentKeys, createBackup, mergeBackup, validateBackup, ContentField } from '../lib/contentBackup';
import { loadProducts, persistProducts } from '../lib/productStore';
import * as sync from '../lib/supabaseSync';
import { useAboutContent } from './useAboutContent';
import { migrateAboutInfo, normalizeAbout, validateAbout } from '../lib/aboutContent';

const ContentContext = createContext<ReturnType<typeof useContentValue> | null>(null);
function useContentValue() {
  const data = useData();
  const about = useAboutContent(data);
  const [products, setProducts] = useState<FiberProduct[]>(() => {
    try { const cached = localStorage.getItem(contentKeys.products); if (cached) return validateBackup({ products: JSON.parse(cached) }).products; } catch { /* Use the catalogue until a valid cloud document arrives. */ }
    return FIBER_PRODUCTS;
  });
  const [productsReady, setReady] = useState(false);
  const [productError, setError] = useState('');
  const saving = useRef(false);
  useEffect(() => {
    let disposed = false;
    const refresh = async () => {
      if (saving.current) return;
      try {
        const saved = await loadProducts();
        if (disposed || saving.current) return;
        if (saved) { setProducts(saved); try { localStorage.setItem(contentKeys.products, JSON.stringify(saved)); } catch { /* Cloud is authoritative. */ } }
        setReady(true); setError('');
      } catch (e) { if (!disposed) { setReady(false); setError((e as Error).message); } }
    };
    void refresh();
    window.addEventListener('focus', refresh);
    const timer = window.setInterval(refresh, 30000);
    return () => { disposed = true; window.removeEventListener('focus', refresh); clearInterval(timer); };
  }, []);
  const saveProducts = async (next: FiberProduct[]) => {
    if (!data.isAdminAuthenticated) throw new Error('Please log in to Admin.');
    if (!productsReady || saving.current) throw new Error('Wait for the product catalogue to finish loading.');
    saving.current = true;
    try {
      await persistProducts(next);
      setProducts(next);
      try { localStorage.setItem(contentKeys.products, JSON.stringify(next)); } catch { /* A failed cache write does not undo the cloud save. */ }
    } finally { saving.current = false; }
  };
  const exportBackupData = (type: 'all' | 'projects' | 'knowledge' = 'all') => createBackup({ ...data, ...about, products }, type);
  const importBackupData = async (raw: any) => {
    try {
      if (!data.isAdminAuthenticated) throw new Error('Please log in to Admin.');
      const incoming = validateBackup(raw);
      const next = mergeBackup({ ...data, ...about, products }, incoming, 'merge');
      if (incoming.aboutInfo) {
        const migrated = migrateAboutInfo(incoming.aboutInfo);
        next.aboutInfo = { ...about.aboutInfo, ...Object.fromEntries(Object.entries(migrated).filter(([,v])=>v!==undefined)), aboutContentVersion:1, pageText:{...about.aboutInfo.pageText,...migrated.pageText}, partnerNetwork:{...about.aboutInfo.partnerNetwork,...migrated.partnerNetwork} };
      }
      const hasAbout = ['aboutInfo','leadershipHeads','advisoryMembers'].some(key => Object.hasOwn(incoming,key));
      const restoredAbout = hasAbout ? normalizeAbout({ aboutInfo: next.aboutInfo ?? about.aboutInfo, leadershipHeads: next.leadershipHeads ?? about.leadershipHeads, advisoryMembers: next.advisoryMembers ?? about.advisoryMembers }, about) : null;
      if (restoredAbout) { if (!about.aboutReady) throw new Error('Đợi tải xong About Us trước khi khôi phục.'); validateAbout(restoredAbout); }
      // Export a recovery copy before the first cloud mutation.
      const recovery = new Blob([JSON.stringify(exportBackupData(), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(recovery); const link = document.createElement('a');
      link.href = url; link.download = `hoki-before-restore-${Date.now()}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      const mustSave = async (name: string, action: Promise<boolean>) => { if (!await action) throw new Error(`${name} could not be saved to Supabase. Some earlier sections may already be saved. Keep the recovery backup and retry.`); };
      if (next.projects) for (const item of next.projects) await mustSave('Projects', sync.saveProjectToSupabase(item));
      if (next.articles) for (const item of next.articles) await mustSave('Knowledge', sync.saveArticleToSupabase(item));
      if (next.mediaItems) for (const item of next.mediaItems) await mustSave('Media', sync.saveMediaItemToSupabase(item));
      if (next.consultationRequests) for (const item of next.consultationRequests) await mustSave('Consultations', sync.saveConsultationToSupabase(item));
      if (next.branding) await mustSave('Branding / hotline / video', sync.saveBrandingToSupabase(next.branding));
      if (restoredAbout) await about.saveAboutContent(restoredAbout);
      if (next.epcSectionConfig) await mustSave('EPC configuration', sync.saveEpcConfigToSupabase(next.epcSectionConfig));
      if (next.epcPartners?.length) await mustSave('EPC partners', sync.saveEpcPartnersToSupabase(next.epcPartners));
      if (next.products) await persistProducts(next.products);
      for (const key of Object.keys(next) as ContentField[]) localStorage.setItem(contentKeys[key], JSON.stringify(next[key]));
      window.dispatchEvent(new Event('hoki-content-restored'));
      return { success: true, message: 'Backup merged and restored. Existing items absent from the file were kept.' };
    } catch (e) { return { success: false, message: (e as Error).message }; }
  };
  return { ...data, ...about, products, productsReady, productError, saveProducts, exportBackupData, importBackupData };
}
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const value = useContentValue();
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
export function useContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error('ContentProvider is missing.');
  return value;
}
