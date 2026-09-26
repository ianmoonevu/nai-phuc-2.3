import { ABOUT_DEFAULTS, ABOUT_FIELDS, ABOUT_NETWORK } from '../data/aboutDefaults.ts';

export interface AboutDocument {
  aboutInfo: Record<string, any>;
  leadershipHeads: Record<string, any>[];
  advisoryMembers: Record<string, any>[];
}
// Migrate the older editor's names without discarding any unrecognized content.
export function migrateAboutInfo(raw: Record<string, any>) {
  const info = { ...raw };
  if (info.aboutContentVersion !== 1) {
    const aliases = { title: 'heroTitle', subtitle: 'heroSubtitle', missionTitle: 'missionQuoteTitle', heroImageBadge: 'heroBannerBadge', heroImageCaption: 'heroBannerCaption', leadershipTitle: 'leadershipHeading', leadershipSubtitle: 'leadershipSubheading', advisoryTitle: 'advisoryHeading', advisorySubtitle: 'advisorySubheading' };
    for (const [target, source] of Object.entries(aliases)) {
      if (typeof info[source] === 'string' && (['title','subtitle','missionTitle','heroImageBadge','heroImageCaption'].includes(target) || info[target] == null)) info[target] = info[source];
    }
    if (['brandStoryP1','brandStoryP2','brandStoryP3'].some(k => typeof info[k] === 'string')) info.description = ['brandStoryP1','brandStoryP2','brandStoryP3'].map(k => info[k]).filter(v => typeof v === 'string' && v.length).join('\n\n');
    info.subtitle ??= info.tagline;
    info.missionTitle ??= info.missionLabel;
  }
  return info;
}
export function normalizeAbout(input: Partial<AboutDocument>, fallback: AboutDocument): AboutDocument {
  const info = migrateAboutInfo(input.aboutInfo ?? fallback.aboutInfo);
  const defaults = Object.fromEntries(ABOUT_FIELDS.filter(f => f.nested).map(f => [f.key, f.default]));
  const normalized = { ...ABOUT_DEFAULTS, ...Object.fromEntries(Object.entries(info).filter(([,v]) => v != null)), pageText: { ...defaults, ...info.pageText }, timeline: info.timeline ?? fallback.aboutInfo.timeline ?? [], partnerNetwork: Object.fromEntries(Object.entries(ABOUT_NETWORK).map(([key,value]) => [key, { ...value, ...info.partnerNetwork?.[key] }])) };
  return { aboutInfo: normalized, leadershipHeads: input.leadershipHeads ?? fallback.leadershipHeads, advisoryMembers: input.advisoryMembers ?? fallback.advisoryMembers };
}
export function validateAbout(doc: AboutDocument) {
  if (!doc.aboutInfo || typeof doc.aboutInfo !== 'object' || Array.isArray(doc.aboutInfo)) throw new Error('Nội dung About Us không hợp lệ.');
  const info = doc.aboutInfo;
  for (const field of ABOUT_FIELDS) {
    const value = field.nested ? info.pageText?.[field.key] : info[field.key];
    if (typeof value !== 'string') throw new Error(`Nội dung không hợp lệ: ${field.label}`);
  }
  const image = (url: any) => { if (url != null && (typeof url !== 'string' || (url && !/^(https?:\/\/|\/(?!\/)|data:image\/(png|jpeg|webp|gif);base64,)/i.test(url)))) throw new Error('Đường dẫn ảnh không hợp lệ.'); };
  image(info.heroImageUrl); image(info.factoryImageUrl);
  for (const list of [doc.leadershipHeads, doc.advisoryMembers]) {
    if (!Array.isArray(list)) throw new Error('Danh sách nhân sự không hợp lệ.');
    const ids = new Set();
    for (const person of list) {
      const id = person?.id || person?.name;
      if (typeof person?.name !== 'string' || !person.name.trim() || typeof id !== 'string' || ids.has(id)) throw new Error('Nhân sự cần có tên và mã riêng.');
      ids.add(id); image(person.avatar);
      for (const key of ['department','title','credentials','focus','bio','role','specialization','actionText']) if (person[key] != null && typeof person[key] !== 'string') throw new Error('Thông tin nhân sự không hợp lệ.');
    }
  }
  if (!Array.isArray(info.timeline) || info.timeline.some((row: any) => !row || ['year','title','description'].some(k => typeof row[k] !== 'string'))) throw new Error('Lịch sử công ty không hợp lệ.');
  for (const key of Object.keys(ABOUT_NETWORK)) {
    const region = info.partnerNetwork?.[key];
    if (!region || typeof region.regionName !== 'string' || typeof region.summary !== 'string' || !Array.isArray(region.hubs) || region.hubs.some((v: any) => typeof v !== 'string')) throw new Error('Mạng lưới đối tác không hợp lệ.');
  }
}
export function aboutPayload(doc: AboutDocument) {
  validateAbout(doc);
  return { ...doc.aboutInfo, aboutContentVersion: 1, leadershipHeads: doc.leadershipHeads, advisoryMembers: doc.advisoryMembers };
}
