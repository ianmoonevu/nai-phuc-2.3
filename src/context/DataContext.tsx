import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import {
  AdvisoryMember,
  AboutPageInfo,
  ConsultationRequest,
  EpcSectionConfig,
  JournalArticle,
  LeadershipHead,
  MediaItem,
  ProjectCaseStudy,
  SiteBranding,
  StrategicPartner
} from '../types';
import {
  ADVISORY_BOARD,
  INITIAL_ABOUT_INFO,
  INITIAL_EPC_CONFIG,
  INITIAL_STRATEGIC_PARTNERS,
  JOURNAL_ARTICLES,
  LEADERSHIP_HEADS,
  PROJECT_CASES
} from '../data/mockData';
import { apiJson } from '../utils/api';
import { slugify } from '../utils/router';
import { compressAndOptimizeImage } from '../utils/imageOptimizer';

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  { id: 'media-app-industrial', name: 'Industrial Flooring App Cover', url: '/images/applications/app-industrial-flooring.svg', size: '18 KB', dimensions: '1200 x 800', uploadedAt: 'Oct 28, 2024', category: 'knowledge' },
  { id: 'media-app-logistics', name: 'Logistics Jointless Bay', url: '/images/applications/app-logistics.svg', size: '22 KB', dimensions: '1200 x 800', uploadedAt: 'Oct 15, 2024', category: 'knowledge' },
  { id: 'media-app-port', name: 'Port Terminal Heavy Pavement', url: '/images/applications/app-port-terminal.svg', size: '19 KB', dimensions: '1200 x 800', uploadedAt: 'Sep 30, 2024', category: 'knowledge' },
  { id: 'media-app-tunnel', name: 'Precast Tunnel Segments', url: '/images/applications/app-tunnel-precast.svg', size: '21 KB', dimensions: '1200 x 800', uploadedAt: 'Sep 14, 2024', category: 'knowledge' },
  { id: 'media-prj-geely', name: 'Geely Automotive Plant Cover', url: '/images/projects/project-geely.svg', size: '24 KB', dimensions: '1200 x 800', uploadedAt: 'Oct 20, 2024', category: 'projects' },
  { id: 'media-prj-sailun', name: 'Sailun Tire Vietnam Complex', url: '/images/projects/project-sailun.svg', size: '26 KB', dimensions: '1200 x 800', uploadedAt: 'Sep 10, 2024', category: 'projects' },
  { id: 'media-prj-jinyu', name: 'Jinyu Vietnam Tires Slab', url: '/images/projects/project-jinyu.svg', size: '25 KB', dimensions: '1200 x 800', uploadedAt: 'Aug 18, 2024', category: 'projects' },
  { id: 'media-gallery-pour', name: 'Laser Screed Concrete Pour', url: '/images/projects/gallery/gallery-screed-pour.svg', size: '28 KB', dimensions: '1200 x 800', uploadedAt: 'Jul 22, 2024', category: 'projects' },
  { id: 'media-gallery-astm', name: 'ASTM C1609 Beam Test', url: '/images/projects/gallery/gallery-astm-test.svg', size: '31 KB', dimensions: '1200 x 800', uploadedAt: 'Jul 15, 2024', category: 'projects' },
  { id: 'media-gallery-joint', name: 'Armored Expansion Joint Detail', url: '/images/projects/gallery/gallery-armored-joint.svg', size: '20 KB', dimensions: '1200 x 800', uploadedAt: 'Jun 30, 2024', category: 'projects' }
];

const DEFAULT_BRANDING: SiteBranding = {
  headerLogoUrl: '',
  headerLogoHeight: 44,
  footerLogoUrl: '',
  footerLogoHeight: 56,
  faviconUrl: '/favicon.svg',
  hotlinePhone: '0916 576 156',
  hotlineLabel: 'CALL NOW',
  hotlineSubtitle: 'Direct Engineering Support',
  hotlineEnabled: true,
  socialLinks: {
    facebook: { url: 'https://www.facebook.com', enabled: true },
    zalo: { url: 'https://zalo.me/0916576156', enabled: true },
    linkedin: { url: 'https://www.linkedin.com', enabled: true },
    youtube: { url: 'https://www.youtube.com/@hokimetal', enabled: true },
    tiktok: { url: 'https://www.tiktok.com/@hokimetal', enabled: true }
  },
  heroImageUrl: '/images/hoki-industrial-floor-hero.svg',
  heroOverlayOpacity: 15,
  mainPageYoutubeUrl: 'https://www.youtube.com/@hokimetal',
  mainPageVideoTitle: 'HOKI Steel Fiber Concrete Systems - Official Video @hokimetal',
  mainPageVideoChannelUrl: 'https://www.youtube.com/@hokimetal',
  mainPageVideoChannelName: '@hokimetal',
  mainPageVideoAutoplay: true,
  mainPageVideoMuted: true,
  mainPageVideoDefaultOpen: true,
  aboutHeroImageUrl: '/images/hoki-greener-tomorrow-hero.svg',
  aboutFactoryImageUrl: '/images/factory-alpha-hub.svg',
  aboutLeadershipAvatars: {
    'Nguyen Van An': '/images/team/avatar-david.svg',
    'Pham Thi Mai': '/images/team/avatar-elena.svg',
    'Le Hoang Long': '/images/team/avatar-alan.svg'
  },
  aboutAdvisoryAvatars: {
    'Dr. Alan Turing': '/images/team/avatar-alan.svg',
    'Sarah Jenkins': '/images/team/avatar-elena.svg',
    'Prof. Kenji Sato': '/images/team/avatar-david.svg'
  }
};

type ContentKey =
  | 'projects'
  | 'articles'
  | 'media'
  | 'branding'
  | 'epc_partners'
  | 'epc_config'
  | 'about_info'
  | 'leadership'
  | 'advisory';

const LEGACY_STORAGE_KEYS: Record<ContentKey, string> = {
  projects: 'hoki_projects_v1',
  articles: 'hoki_articles_v1',
  media: 'hoki_media_v1',
  branding: 'hoki_branding_v1',
  epc_partners: 'hoki_epc_partners_v1',
  epc_config: 'hoki_epc_config_v1',
  about_info: 'hoki_about_info_v1',
  leadership: 'hoki_leadership_v1',
  advisory: 'hoki_advisory_v1'
};

interface DataContextType {
  projects: ProjectCaseStudy[];
  articles: JournalArticle[];
  mediaItems: MediaItem[];
  consultationRequests: ConsultationRequest[];
  branding: SiteBranding;
  isServerSyncing: boolean;
  serverError: string | null;
  lastServerSyncTime: string | null;
  refreshServerData: () => Promise<void>;
  updateBranding: (updated: Partial<SiteBranding>) => void;
  resetBranding: () => void;
  updateProject: (id: string, updated: Partial<ProjectCaseStudy>) => void;
  addProject: (newProject: ProjectCaseStudy) => void;
  deleteProject: (id: string) => void;
  updateArticle: (id: string, updated: Partial<JournalArticle>) => void;
  addArticle: (newArticle: JournalArticle) => void;
  deleteArticle: (id: string) => void;
  uploadImageFile: (file: File, category?: MediaItem['category']) => Promise<MediaItem>;
  addMediaItem: (item: MediaItem) => void;
  updateMediaItem: (id: string, updated: Partial<MediaItem>) => void;
  replaceMediaItem: (id: string, newUrl: string, newName?: string) => void;
  deleteMediaItem: (id: string) => void;
  addConsultationRequest: (request: Omit<ConsultationRequest, 'id' | 'submittedAt'>) => Promise<ConsultationRequest>;
  updateConsultationStatus: (id: string, status: ConsultationRequest['status']) => void;
  deleteConsultationRequest: (id: string) => void;
  resetToDefaults: () => void;
  toggleProjectHighlight: (id: string) => void;
  exportBackupData: (type?: 'all' | 'projects' | 'knowledge') => any;
  importBackupData: (payload: any, mode?: 'merge' | 'replace') => Promise<{ success: boolean; projectCount: number; articleCount: number; message: string }>;
  isAdminAuthenticated: boolean;
  loginAdmin: (id: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  epcPartners: StrategicPartner[];
  updateEpcPartner: (id: string, updated: Partial<StrategicPartner>) => void;
  addEpcPartner: (partner: Omit<StrategicPartner, 'id'>) => StrategicPartner;
  deleteEpcPartner: (id: string) => void;
  reorderEpcPartners: (partners: StrategicPartner[]) => void;
  resetEpcPartners: () => void;
  epcSectionConfig: EpcSectionConfig;
  updateEpcSectionConfig: (updated: Partial<EpcSectionConfig>) => void;
  aboutInfo: AboutPageInfo;
  updateAboutInfo: (updated: Partial<AboutPageInfo>) => void;
  resetAboutInfo: () => void;
  leadershipHeads: LeadershipHead[];
  updateLeadershipHead: (idOrName: string, updated: Partial<LeadershipHead>) => void;
  addLeadershipHead: (head: Omit<LeadershipHead, 'id'>) => LeadershipHead;
  deleteLeadershipHead: (idOrName: string) => void;
  resetLeadershipHeads: () => void;
  advisoryMembers: AdvisoryMember[];
  updateAdvisoryMember: (idOrName: string, updated: Partial<AdvisoryMember>) => void;
  addAdvisoryMember: (member: Omit<AdvisoryMember, 'id'>) => AdvisoryMember;
  deleteAdvisoryMember: (idOrName: string) => void;
  resetAdvisoryMembers: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const loadLegacy = <T,>(key: ContentKey, fallback: T): T => {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEYS[key]);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

// Keep event updates synchronous without side effects inside React state updaters.
function useContentState<T>(initial: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(initial);
  const latest = useRef(value);
  const update = useCallback((next: React.SetStateAction<T>) => {
    const result = typeof next === 'function' ? (next as (previous: T) => T)(latest.current) : next;
    latest.current = result;
    setValue(result);
  }, []);
  return [value, update];
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useContentState<ProjectCaseStudy[]>(() => {
    const legacy = PROJECT_CASES;
    return legacy.map((project) => ({
      ...project,
      slug: project.slug ? slugify(project.slug) : slugify(project.title || project.code || project.id)
    }));
  });
  const [articles, setArticles] = useContentState<JournalArticle[]>(() => JOURNAL_ARTICLES);
  const [mediaItems, setMediaItems] = useContentState<MediaItem[]>(() => INITIAL_MEDIA_ITEMS);
  const [consultationRequests, setConsultationRequests] = useContentState<ConsultationRequest[]>([]);
  const [branding, setBranding] = useContentState<SiteBranding>(() => ({ ...DEFAULT_BRANDING }));
  const [epcPartners, setEpcPartners] = useContentState<StrategicPartner[]>(() => INITIAL_STRATEGIC_PARTNERS);
  const [epcSectionConfig, setEpcSectionConfig] = useContentState<EpcSectionConfig>(() => ({ ...INITIAL_EPC_CONFIG }));
  const [aboutInfo, setAboutInfo] = useContentState<AboutPageInfo>(() => ({ ...INITIAL_ABOUT_INFO }));
  const [leadershipHeads, setLeadershipHeads] = useContentState<LeadershipHead[]>(() => LEADERSHIP_HEADS);
  const [advisoryMembers, setAdvisoryMembers] = useContentState<AdvisoryMember[]>(() => ADVISORY_BOARD);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isServerSyncing, setIsServerSyncing] = useState(false);
  const [lastServerSyncTime, setLastServerSyncTime] = useState<string | null>(null);

  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [pendingSaves, setPendingSaves] = useState(0);
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  const markSynced = () => setLastServerSyncTime(new Date().toISOString());

  const persistContent = (key: ContentKey, data: unknown) => {
    // Capture the snapshot now, then serialize writes so older edits cannot finish last.
    const body = JSON.stringify({ data });
    const operation = saveQueue.current.then(async () => {
      setPendingSaves((count) => count + 1);
      try {
        await apiJson(`/api/content/${key}`, { method: 'PUT', body });
        setSaveErrors((previous) => {
          const next = { ...previous };
          delete next[key];
          return next;
        });
        markSynced();
      } catch (error) {
        setIsNoticeDismissed(false);
        setSaveErrors((previous) => ({ ...previous, [key]: error instanceof Error ? error.message : 'Không lưu được nội dung.' }));
      } finally {
        setPendingSaves((count) => count - 1);
      }
    });
    saveQueue.current = operation;
    return operation;
  };

  const applyServerContent = (content: Partial<Record<ContentKey, any>>) => {
    if (Array.isArray(content.projects)) {
      setProjects(content.projects.map((project: ProjectCaseStudy) => ({
        ...project,
        slug: project.slug ? slugify(project.slug) : slugify(project.title || project.code || project.id)
      })));
    }
    if (Array.isArray(content.articles)) setArticles(content.articles);
    if (Array.isArray(content.media)) setMediaItems(content.media);
    if (content.branding) setBranding({ ...DEFAULT_BRANDING, ...content.branding });
    if (Array.isArray(content.epc_partners)) setEpcPartners(content.epc_partners);
    if (content.epc_config) setEpcSectionConfig({ ...INITIAL_EPC_CONFIG, ...content.epc_config });
    if (content.about_info) setAboutInfo({ ...INITIAL_ABOUT_INFO, ...content.about_info });
    if (Array.isArray(content.leadership)) setLeadershipHeads(content.leadership);
    if (Array.isArray(content.advisory)) setAdvisoryMembers(content.advisory);
  };

  const refreshServerData = async (includePrivate = isAdminAuthenticated) => {
    await saveQueue.current;
    setIsServerSyncing(true);
    try {
      const response = await apiJson<{ ok: boolean; content: Partial<Record<ContentKey, any>> }>('/api/content');
      applyServerContent(response.content || {});

      if (includePrivate) {
        try {
          const consultations = await apiJson<{ ok: boolean; data: ConsultationRequest[] }>('/api/consultations');
          setConsultationRequests(consultations.data || []);
        } catch (error) {
          throw error;
        }
      }
      setSaveErrors((previous) => { const next = { ...previous }; delete next.connection; return next; });
      markSynced();
    } catch (error) {
      setSaveErrors((previous) => ({ ...previous, connection: error instanceof Error ? error.message : 'Không tải được dữ liệu máy chủ.' }));
      throw error;
    } finally {
      setIsServerSyncing(false);
    }
  };

  const migrateLegacyDataIfNeeded = async () => {
    const response = await apiJson<{ ok: boolean; content: Partial<Record<ContentKey, any>> }>('/api/content');
    const server = response.content || {};
    const content: Partial<Record<ContentKey, unknown>> = {};

    const defaults: Record<ContentKey, unknown> = {
      projects,
      articles,
      media: mediaItems,
      branding,
      epc_partners: epcPartners,
      epc_config: epcSectionConfig,
      about_info: aboutInfo,
      leadership: leadershipHeads,
      advisory: advisoryMembers
    };

    (Object.keys(defaults) as ContentKey[]).forEach((key) => {
      if (server[key] === undefined || server[key] === null) {
        content[key] = loadLegacy(key, defaults[key]);
      }
    });

    if (Object.keys(content).length > 0) {
      await apiJson('/api/content/initialize', {
        method: 'POST',
        body: JSON.stringify({ content })
      });
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await refreshServerData();
      } catch (error) {
        console.warn('Server data unavailable; using embedded/legacy browser data as fallback:', error);
      }

      try {
        await apiJson('/api/auth/me');
        setIsAdminAuthenticated(true);
        await refreshServerData(true);
      } catch {
        setIsAdminAuthenticated(false);
      }
    };
    void initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const iconUrl = branding.faviconUrl || '/favicon.svg';
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconUrl;
  }, [branding.faviconUrl]);

  const updateBranding = (updated: Partial<SiteBranding>) => {
    setBranding((prev) => {
      const next = { ...prev, ...updated };
      void persistContent('branding', next);
      return next;
    });
  };

  const resetBranding = () => {
    setBranding(DEFAULT_BRANDING);
    void persistContent('branding', DEFAULT_BRANDING);
  };

  const updateEpcPartner = (id: string, updated: Partial<StrategicPartner>) => {
    setEpcPartners((prev) => {
      const next = prev.map((partner) => {
        if (partner.id !== id) return partner;
        const subtitle = updated.subtitle !== undefined ? updated.subtitle : updated.role !== undefined ? updated.role : partner.subtitle;
        return { ...partner, ...updated, subtitle, role: subtitle };
      });
      void persistContent('epc_partners', next);
      return next;
    });
  };

  const addEpcPartner = (partner: Omit<StrategicPartner, 'id'>): StrategicPartner => {
    const subtitle = partner.subtitle || partner.role || 'Strategic EPC Partner';
    const created: StrategicPartner = { ...partner, id: `epc-${Date.now()}`, subtitle, role: subtitle };
    setEpcPartners((prev) => {
      const next = [...prev, created];
      void persistContent('epc_partners', next);
      return next;
    });
    return created;
  };

  const deleteEpcPartner = (id: string) => {
    setEpcPartners((prev) => {
      const next = prev.filter((partner) => partner.id !== id);
      void persistContent('epc_partners', next);
      return next;
    });
  };

  const reorderEpcPartners = (reordered: StrategicPartner[]) => {
    setEpcPartners(reordered);
    void persistContent('epc_partners', reordered);
  };

  const resetEpcPartners = () => {
    setEpcPartners(INITIAL_STRATEGIC_PARTNERS);
    setEpcSectionConfig(INITIAL_EPC_CONFIG);
    void persistContent('epc_partners', INITIAL_STRATEGIC_PARTNERS);
    void persistContent('epc_config', INITIAL_EPC_CONFIG);
  };

  const updateEpcSectionConfig = (updated: Partial<EpcSectionConfig>) => {
    setEpcSectionConfig((prev) => {
      const next = { ...prev, ...updated };
      void persistContent('epc_config', next);
      return next;
    });
  };

  const updateAboutInfo = (updated: Partial<AboutPageInfo>) => {
    setAboutInfo((prev) => {
      const next = { ...prev, ...updated };
      void persistContent('about_info', next);
      return next;
    });
  };

  const resetAboutInfo = () => {
    setAboutInfo(INITIAL_ABOUT_INFO);
    setLeadershipHeads(LEADERSHIP_HEADS);
    setAdvisoryMembers(ADVISORY_BOARD);
    void persistContent('about_info', INITIAL_ABOUT_INFO);
    void persistContent('leadership', LEADERSHIP_HEADS);
    void persistContent('advisory', ADVISORY_BOARD);
  };

  const updateLeadershipHead = (idOrName: string, updated: Partial<LeadershipHead>) => {
    setLeadershipHeads((prev) => {
      const next = prev.map((head) => head.id === idOrName || head.name === idOrName ? { ...head, ...updated } : head);
      void persistContent('leadership', next);
      return next;
    });
  };

  const addLeadershipHead = (head: Omit<LeadershipHead, 'id'>): LeadershipHead => {
    const created: LeadershipHead = { ...head, id: `lead-${Date.now()}` };
    setLeadershipHeads((prev) => {
      const next = [...prev, created];
      void persistContent('leadership', next);
      return next;
    });
    return created;
  };

  const deleteLeadershipHead = (idOrName: string) => {
    setLeadershipHeads((prev) => {
      const next = prev.filter((head) => head.id !== idOrName && head.name !== idOrName);
      void persistContent('leadership', next);
      return next;
    });
  };

  const resetLeadershipHeads = () => {
    setLeadershipHeads(LEADERSHIP_HEADS);
    void persistContent('leadership', LEADERSHIP_HEADS);
  };

  const updateAdvisoryMember = (idOrName: string, updated: Partial<AdvisoryMember>) => {
    setAdvisoryMembers((prev) => {
      const next = prev.map((member) => member.id === idOrName || member.name === idOrName ? { ...member, ...updated } : member);
      void persistContent('advisory', next);
      return next;
    });
  };

  const addAdvisoryMember = (member: Omit<AdvisoryMember, 'id'>): AdvisoryMember => {
    const created: AdvisoryMember = { ...member, id: `adv-${Date.now()}` };
    setAdvisoryMembers((prev) => {
      const next = [...prev, created];
      void persistContent('advisory', next);
      return next;
    });
    return created;
  };

  const deleteAdvisoryMember = (idOrName: string) => {
    setAdvisoryMembers((prev) => {
      const next = prev.filter((member) => member.id !== idOrName && member.name !== idOrName);
      void persistContent('advisory', next);
      return next;
    });
  };

  const resetAdvisoryMembers = () => {
    setAdvisoryMembers(ADVISORY_BOARD);
    void persistContent('advisory', ADVISORY_BOARD);
  };

  const updateProject = (id: string, updated: Partial<ProjectCaseStudy>) => {
    setProjects((prev) => {
      const next = prev.map((project) => project.id === id ? { ...project, ...updated } : project);
      void persistContent('projects', next);
      return next;
    });
  };

  const addProject = (newProject: ProjectCaseStudy) => {
    setProjects((prev) => {
      const next = [newProject, ...prev];
      void persistContent('projects', next);
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((project) => project.id !== id);
      void persistContent('projects', next);
      return next;
    });
  };

  const toggleProjectHighlight = (id: string) => {
    setProjects((prev) => {
      const next = prev.map((project) => project.id === id ? { ...project, isHighlight: !project.isHighlight } : project);
      void persistContent('projects', next);
      return next;
    });
  };

  const updateArticle = (id: string, updated: Partial<JournalArticle>) => {
    setArticles((prev) => {
      const next = prev.map((article) => article.id === id ? { ...article, ...updated } : article);
      void persistContent('articles', next);
      return next;
    });
  };

  const addArticle = (newArticle: JournalArticle) => {
    setArticles((prev) => {
      const next = [newArticle, ...prev];
      void persistContent('articles', next);
      return next;
    });
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => {
      const next = prev.filter((article) => article.id !== id);
      void persistContent('articles', next);
      return next;
    });
  };

  const dataUrlToBlob = async (dataUrl: string) => {
    const response = await fetch(dataUrl);
    return response.blob();
  };

  const uploadImageFile = async (file: File, category: MediaItem['category'] = 'general'): Promise<MediaItem> => {
    const optimized = await compressAndOptimizeImage(file);
    const blob = await dataUrlToBlob(optimized.dataUrl);
    const formData = new FormData();
    formData.append('file', blob, file.name);
    formData.append('category', category || 'general');

    const response = await apiJson<{ ok: boolean; data: MediaItem }>('/api/media/upload', {
      method: 'POST',
      body: formData
    });
    const created = { ...response.data, dimensions: optimized.dimensions, size: optimized.size };
    setMediaItems((prev) => {
      const next = [created, ...prev];
      void persistContent('media', next);
      return next;
    });
    return created;
  };

  const addMediaItem = (item: MediaItem) => {
    setMediaItems((prev) => {
      const next = [item, ...prev];
      void persistContent('media', next);
      return next;
    });
  };

  const updateMediaItem = (id: string, updated: Partial<MediaItem>) => {
    setMediaItems((prev) => {
      const next = prev.map((item) => item.id === id ? { ...item, ...updated } : item);
      void persistContent('media', next);
      return next;
    });
  };

  const replaceMediaItem = (id: string, newUrl: string, newName?: string) => {
    const old = mediaItems.find((item) => item.id === id);
    const oldUrl = old?.url;
    const nextMedia = mediaItems.map((item) => item.id === id ? { ...item, url: newUrl, name: newName || item.name, uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : item);
    setMediaItems(nextMedia);
    void persistContent('media', nextMedia);

    if (!oldUrl) return;

    const nextProjects = projects.map((project) => ({
      ...project,
      image: project.image === oldUrl ? newUrl : project.image,
      gallery: project.gallery?.map((item) => item.url === oldUrl ? { ...item, url: newUrl } : item)
    }));
    const nextArticles = articles.map((article) => ({
      ...article,
      image: article.image === oldUrl ? newUrl : article.image,
      gallery: article.gallery?.map((item) => item.url === oldUrl ? { ...item, url: newUrl } : item)
    }));
    setProjects(nextProjects);
    setArticles(nextArticles);
    void persistContent('projects', nextProjects);
    void persistContent('articles', nextArticles);
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      void persistContent('media', next);
      return next;
    });
  };

  const addConsultationRequest = async (request: Omit<ConsultationRequest, 'id' | 'submittedAt'>): Promise<ConsultationRequest> => {
    const response = await apiJson<{ ok: boolean; data: ConsultationRequest }>('/api/consultations', {
      method: 'POST',
      body: JSON.stringify(request)
    });
    setConsultationRequests((prev) => [response.data, ...prev]);
    return response.data;
  };

  const updateConsultationStatus = (id: string, status: ConsultationRequest['status']) => {
    setConsultationRequests((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
    void apiJson(`/api/consultations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }).catch((error) => {
      console.error('Failed to update consultation status:', error);
      void refreshServerData();
    });
  };

  const deleteConsultationRequest = (id: string) => {
    setConsultationRequests((prev) => prev.filter((item) => item.id !== id));
    void apiJson(`/api/consultations/${id}`, { method: 'DELETE' }).catch((error) => {
      console.error('Failed to delete consultation request:', error);
      void refreshServerData();
    });
  };

  const loginAdmin = async (id: string, pass: string): Promise<boolean> => {
    try {
      await apiJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: id.trim(), password: pass })
      });
      setSaveErrors({});
      setIsAdminAuthenticated(true);
      await migrateLegacyDataIfNeeded();
      await refreshServerData(true);
      return true;
    } catch (error) {
      setIsAdminAuthenticated(false);
      throw error;
    }
  };

  const logoutAdmin = async () => {
    try {
      await apiJson('/api/auth/logout', { method: 'POST' });
    } finally {
      setIsAdminAuthenticated(false);
      setConsultationRequests([]);
    }
  };

  const resetToDefaults = () => {
    setProjects(PROJECT_CASES);
    setArticles(JOURNAL_ARTICLES);
    setMediaItems(INITIAL_MEDIA_ITEMS);
    setBranding(DEFAULT_BRANDING);
    setEpcPartners(INITIAL_STRATEGIC_PARTNERS);
    setEpcSectionConfig(INITIAL_EPC_CONFIG);
    setAboutInfo(INITIAL_ABOUT_INFO);
    setLeadershipHeads(LEADERSHIP_HEADS);
    setAdvisoryMembers(ADVISORY_BOARD);
    void apiJson('/api/content/batch', {
      method: 'POST',
      body: JSON.stringify({
        content: {
          projects: PROJECT_CASES,
          articles: JOURNAL_ARTICLES,
          media: INITIAL_MEDIA_ITEMS,
          branding: DEFAULT_BRANDING,
          epc_partners: INITIAL_STRATEGIC_PARTNERS,
          epc_config: INITIAL_EPC_CONFIG,
          about_info: INITIAL_ABOUT_INFO,
          leadership: LEADERSHIP_HEADS,
          advisory: ADVISORY_BOARD
        }
      })
    }).then(markSynced).catch((error) => setSaveErrors((previous) => ({ ...previous, reset: error.message })));
  };

  const exportBackupData = (type: 'all' | 'projects' | 'knowledge' = 'all') => {
    const exportedAt = new Date().toISOString();
    if (type === 'projects') return { backupType: 'projects', version: '4.0', exportedAt, count: projects.length, projects };
    if (type === 'knowledge') return { backupType: 'knowledge', version: '4.0', exportedAt, count: articles.length, articles };
    return {
      backupType: 'all', version: '4.0', exportedAt,
      projectsCount: projects.length,
      articlesCount: articles.length,
      consultationsCount: consultationRequests.length,
      projects, articles, consultations: consultationRequests, media: mediaItems,
      branding, epcPartners, epcSectionConfig, aboutInfo, leadershipHeads, advisoryMembers
    };
  };

  const importBackupData = async (payload: any, mode: 'merge' | 'replace' = 'merge') => {
    if (!payload || typeof payload !== 'object') {
      return { success: false, projectCount: 0, articleCount: 0, message: 'Invalid JSON backup structure' };
    }

    let importedProjects: ProjectCaseStudy[] = [];
    let importedArticles: JournalArticle[] = [];
    if (Array.isArray(payload)) {
      if (payload.length > 0 && ('code' in payload[0] || 'facilityType' in payload[0])) importedProjects = payload;
      else if (payload.length > 0 && ('categorySlug' in payload[0] || 'subtitle' in payload[0])) importedArticles = payload;
    } else {
      if (Array.isArray(payload.projects)) importedProjects = payload.projects;
      if (Array.isArray(payload.articles)) importedArticles = payload.articles;
    }

    if (!importedProjects.length && !importedArticles.length) {
      return { success: false, projectCount: 0, articleCount: 0, message: 'No valid projects or knowledge articles detected in uploaded backup JSON' };
    }

    const mergeById = <T extends { id: string }>(current: T[], incoming: T[]) => {
      const map = new Map(current.map((item) => [item.id, item]));
      incoming.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item } as T));
      return Array.from(map.values());
    };

    const nextProjects = importedProjects.length ? (mode === 'replace' ? importedProjects : mergeById(projects, importedProjects)) : projects;
    const nextArticles = importedArticles.length ? (mode === 'replace' ? importedArticles : mergeById(articles, importedArticles)) : articles;

    await apiJson('/api/content/batch', {
      method: 'POST',
      body: JSON.stringify({ content: { projects: nextProjects, articles: nextArticles } })
    });
    setProjects(nextProjects);
    setArticles(nextArticles);
    markSynced();

    return {
      success: true,
      projectCount: importedProjects.length,
      articleCount: importedArticles.length,
      message: `Successfully ${mode === 'replace' ? 'restored' : 'merged'} ${importedProjects.length} project dossiers and ${importedArticles.length} knowledge articles into the server database.`
    };
  };

  return (
    <DataContext.Provider value={{
      projects, articles, mediaItems, consultationRequests, branding,
      isServerSyncing: isServerSyncing || pendingSaves > 0, serverError: Object.values(saveErrors)[0] || null, lastServerSyncTime, refreshServerData,
      updateBranding, resetBranding,
      updateProject, addProject, deleteProject,
      updateArticle, addArticle, deleteArticle,
      uploadImageFile, addMediaItem, updateMediaItem, replaceMediaItem, deleteMediaItem,
      addConsultationRequest, updateConsultationStatus, deleteConsultationRequest,
      resetToDefaults, toggleProjectHighlight, exportBackupData, importBackupData,
      isAdminAuthenticated, loginAdmin, logoutAdmin,
      epcPartners, updateEpcPartner, addEpcPartner, deleteEpcPartner, reorderEpcPartners, resetEpcPartners,
      epcSectionConfig, updateEpcSectionConfig,
      aboutInfo, updateAboutInfo, resetAboutInfo,
      leadershipHeads, updateLeadershipHead, addLeadershipHead, deleteLeadershipHead, resetLeadershipHeads,
      advisoryMembers, updateAdvisoryMember, addAdvisoryMember, deleteAdvisoryMember, resetAdvisoryMembers
    }}>
      {isAdminAuthenticated && ((Object.keys(saveErrors).length > 0 && !isNoticeDismissed) || pendingSaves > 0) && (
        <div role={Object.keys(saveErrors).length ? 'alert' : 'status'} className="flex items-start justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="min-w-0 break-words">
            {Object.keys(saveErrors).length
              ? `Chưa lưu được: ${Object.values(saveErrors).join(' ')} Hãy thử lưu lại sau khi khắc phục lỗi.`
              : 'Đang lưu lên máy chủ… Vui lòng đợi trước khi tải lại trang.'}
          </p>
          {Object.keys(saveErrors).length > 0 && pendingSaves === 0 && (
            <button type="button" aria-label="Đóng thông báo" onClick={() => setIsNoticeDismissed(true)} className="shrink-0 rounded border border-amber-300 px-3 py-1 font-semibold hover:bg-amber-100">
              Đóng
            </button>
          )}
        </div>
      )}
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
