import { useEffect, useRef, useState } from 'react';
import { EVOLUTION_TIMELINE } from '../data/mockData';
import { AboutDocument, normalizeAbout } from '../lib/aboutContent';
import { aboutRevision, loadAboutRow, persistAbout, unpackAboutRow } from '../lib/aboutStore';

export function useAboutContent(data: any) {
  const fallback = useRef<AboutDocument>({ aboutInfo: { ...data.aboutInfo, timeline: data.aboutInfo.timeline ?? EVOLUTION_TIMELINE }, leadershipHeads: data.leadershipHeads, advisoryMembers: data.advisoryMembers });
  const branding = useRef(data.branding);
  branding.current = data.branding;
  const [document, setDocument] = useState(() => normalizeAbout({},fallback.current));
  const [ready,setReady] = useState(false), [error,setError] = useState('');
  const [revision,setRevision] = useState<string|null>(null);
  const saving = useRef(false), generation = useRef(0);
  const apply = (row: any) => {
    const legacy = { ...fallback.current, leadershipHeads: fallback.current.leadershipHeads.map(p=>({...p,avatar:branding.current.aboutLeadershipAvatars?.[p.name]??p.avatar})), advisoryMembers: fallback.current.advisoryMembers.map(p=>({...p,avatar:branding.current.aboutAdvisoryAvatars?.[p.name]??p.avatar})) };
    const next = normalizeAbout(unpackAboutRow(row),legacy);
    setDocument(next); setRevision(aboutRevision(row)); setReady(true); setError('');
  };
  const refresh = async () => {
    if (saving.current) return;
    const ticket = ++generation.current;
    try { const row = await loadAboutRow(); if (ticket === generation.current && !saving.current) apply(row); }
    catch(e) { if(ticket===generation.current) setError((e as Error).message); }
  };
  useEffect(() => {
    void refresh();
    const focus=()=>void refresh(), timer=window.setInterval(focus,30000);
    window.addEventListener('focus',focus);
    return () => { generation.current++; clearInterval(timer); window.removeEventListener('focus',focus); };
  },[data.branding.aboutLeadershipAvatars,data.branding.aboutAdvisoryAvatars]);
  const saveAboutContent = async (next: AboutDocument, expected=revision) => {
    if (!data.isAdminAuthenticated) throw new Error('Anh cần đăng nhập Admin.');
    if (!ready || saving.current) throw new Error('Đợi tải xong About Us rồi lưu lại.');
    saving.current=true; generation.current++;
    try { const row = await persistAbout(next,expected); apply(row); return aboutRevision(row); }
    finally { saving.current=false; }
  };
  return { ...document, aboutReady:ready, aboutError:error, aboutRevision:revision, saveAboutContent, refreshAbout:refresh };
}
