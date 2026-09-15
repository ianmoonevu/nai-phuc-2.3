import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProjectCaseStudy,
  JournalArticle,
  MediaItem,
  ConsultationRequest,
  SiteBranding,
  StrategicPartner,
  EpcSectionConfig,
  AboutPageInfo,
  LeadershipHead,
  AdvisoryMember
} from '../types';
import {
  PROJECT_CASES,
  JOURNAL_ARTICLES,
  INITIAL_STRATEGIC_PARTNERS,
  INITIAL_EPC_CONFIG,
  INITIAL_ABOUT_INFO,
  LEADERSHIP_HEADS,
  ADVISORY_BOARD
} from '../data/mockData';
import { slugify } from '../utils/router';
import { compressAndOptimizeImage } from '../utils/imageOptimizer';

const INITIAL_CONSULTATIONS: ConsultationRequest[] = [
  {
    id: 'req-2026-0908-01',
    name: 'Nguyen Van Ha',
    firm: 'Coteccons Engineering Corp',
    email: 'ha.nguyen@coteccons.vn',
    phone: '+84 908 123 456',
    projectType: 'Industrial Flooring',
    slabArea: '45,000 m²',
    targetDate: 'Oct 2026',
    submittedAt: '2026-09-08T14:20:00Z',
    status: 'new',
    notes: 'High-bay automated warehouse in Binh Duong requiring Fmin 75 tolerance and 110 kN point loads.'
  },
  {
    id: 'req-2026-0908-02',
    name: 'David Thorne',
    firm: 'Arup Structural & Geotech',
    email: 'd.thorne@arup.com',
    phone: '+65 6745 8890',
    projectType: 'Precast Tunnel Liners',
    slabArea: '12,500 segments',
    targetDate: 'Nov 2026',
    submittedAt: '2026-09-08T09:45:00Z',
    status: 'new',
    notes: 'Inquiry for HF-10020 high tensile fiber (2000 MPa) substitution for welded wire cages in metro tunnel rings.'
  },
  {
    id: 'req-2026-0907-01',
    name: 'Le Quang Minh',
    firm: 'Tan Phat Long EPC',
    email: 'minh.lq@tanphatlong.com.vn',
    phone: '+84 912 345 678',
    projectType: 'Industrial Flooring',
    slabArea: '28,000 m²',
    targetDate: 'Q4 2026',
    submittedAt: '2026-09-07T16:10:00Z',
    status: 'reviewed',
    notes: 'Cold storage facility at VSIP II. Sub-zero thermal cycling with jointless floor specifications.'
  },
  {
    id: 'req-2026-0907-02',
    name: 'Sarah Chen',
    firm: 'Sembcorp Infrastructure',
    email: 'sarah.chen@sembcorp.com',
    phone: '+65 9182 3411',
    projectType: 'Ports & Hardstands',
    slabArea: '60,000 m²',
    targetDate: 'Dec 2026',
    submittedAt: '2026-09-07T11:30:00Z',
    status: 'in-progress',
    notes: 'Heavy container terminal hardstand with 85-tonne reach stackers. Needs TR34 dual wheel verification.'
  },
  {
    id: 'req-2026-0906-01',
    name: 'Tran Hoang Nam',
    firm: 'Ban Thach Geotechnical Co.',
    email: 'nam.th@banthach.vn',
    phone: '+84 938 765 432',
    projectType: 'Industrial Flooring',
    slabArea: '35,000 m²',
    targetDate: 'Oct 2026',
    submittedAt: '2026-09-06T15:05:00Z',
    status: 'reviewed',
    notes: 'Requesting dosage calculation for 180mm slab with C30/37 concrete under 75 kN forklift loads.'
  },
  {
    id: 'req-2026-0905-01',
    name: 'Kenji Takahashi',
    firm: 'Toda Vietnam Corp',
    email: 'takahashi.k@toda.com.vn',
    phone: '+84 903 889 900',
    projectType: 'Automotive Plant',
    slabArea: '52,000 m²',
    targetDate: 'Jan 2027',
    submittedAt: '2026-09-05T13:40:00Z',
    status: 'completed',
    notes: 'Automotive stamping plant with vibrating machine foundations and heavy roll container routes.'
  },
  {
    id: 'req-2026-0905-02',
    name: 'Pham Thi Huong',
    firm: 'Newtecons Construction',
    email: 'huong.pt@newtecons.vn',
    phone: '+84 977 445 566',
    projectType: 'Logistics & Warehousing',
    slabArea: '22,000 m²',
    targetDate: 'Nov 2026',
    submittedAt: '2026-09-05T08:15:00Z',
    status: 'completed',
    notes: 'Laser screed pour scheduling acceleration inquiry. Aiming to cut 10 calendar days.'
  },
  {
    id: 'req-2026-0904-01',
    name: 'Marcus Weber',
    firm: 'Hochtief Logistics & Industrial',
    email: 'm.weber@hochtief-logistics.de',
    phone: '+49 69 9876 543',
    projectType: 'Industrial Flooring',
    slabArea: '40,000 m²',
    targetDate: 'Nov 2026',
    submittedAt: '2026-09-04T17:20:00Z',
    status: 'completed',
    notes: 'EPD verification and embodied carbon calculation for DGNB Platinum warehouse certification.'
  },
  {
    id: 'req-2026-0903-01',
    name: 'Vu Dinh Long',
    firm: 'Hop Luc Construction JSC',
    email: 'long.vd@hopluc.vn',
    phone: '+84 909 234 567',
    projectType: 'Commercial Slabs',
    slabArea: '18,500 m²',
    targetDate: 'Oct 2026',
    submittedAt: '2026-09-03T10:00:00Z',
    status: 'completed',
    notes: 'Multi-level parking deck with HF-6535 fiber for shrinkage and chloride penetration resistance.'
  },
  {
    id: 'req-2026-0902-01',
    name: 'Elena Rossi',
    firm: 'Mapei Structural Systems',
    email: 'e.rossi@mapei.it',
    phone: '+39 02 3767 112',
    projectType: 'Precast Elements',
    slabArea: '15,000 m²',
    targetDate: 'Q1 2027',
    submittedAt: '2026-09-02T14:30:00Z',
    status: 'completed',
    notes: 'Precast box culvert joint trial with collated fibers and superplasticizer compatibility testing.'
  }
];

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media-app-industrial',
    name: 'Industrial Flooring App Cover',
    url: '/images/applications/app-industrial-flooring.svg',
    size: '18 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Oct 28, 2024',
    category: 'knowledge'
  },
  {
    id: 'media-app-logistics',
    name: 'Logistics Jointless Bay',
    url: '/images/applications/app-logistics.svg',
    size: '22 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Oct 15, 2024',
    category: 'knowledge'
  },
  {
    id: 'media-app-port',
    name: 'Port Terminal Heavy Pavement',
    url: '/images/applications/app-port-terminal.svg',
    size: '19 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Sep 30, 2024',
    category: 'knowledge'
  },
  {
    id: 'media-app-tunnel',
    name: 'Precast Tunnel Segments',
    url: '/images/applications/app-tunnel-precast.svg',
    size: '21 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Sep 14, 2024',
    category: 'knowledge'
  },
  {
    id: 'media-prj-geely',
    name: 'Geely Automotive Plant Cover',
    url: '/images/projects/project-geely.svg',
    size: '24 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Oct 20, 2024',
    category: 'projects'
  },
  {
    id: 'media-prj-sailun',
    name: 'Sailun Tire Vietnam Complex',
    url: '/images/projects/project-sailun.svg',
    size: '26 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Sep 10, 2024',
    category: 'projects'
  },
  {
    id: 'media-prj-jinyu',
    name: 'Jinyu Vietnam Tires Slab',
    url: '/images/projects/project-jinyu.svg',
    size: '25 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Aug 18, 2024',
    category: 'projects'
  },
  {
    id: 'media-gallery-pour',
    name: 'Laser Screed Concrete Pour',
    url: '/images/projects/gallery/gallery-screed-pour.svg',
    size: '28 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Jul 22, 2024',
    category: 'projects'
  },
  {
    id: 'media-gallery-astm',
    name: 'ASTM C1609 Beam Test',
    url: '/images/projects/gallery/gallery-astm-test.svg',
    size: '31 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Jul 15, 2024',
    category: 'projects'
  },
  {
    id: 'media-gallery-joint',
    name: 'Armored Expansion Joint Detail',
    url: '/images/projects/gallery/gallery-armored-joint.svg',
    size: '20 KB',
    dimensions: '1200 x 800',
    uploadedAt: 'Jun 30, 2024',
    category: 'projects'
  }
];

const DEFAULT_BRANDING: SiteBranding = {
  headerLogoUrl: '',
  headerLogoHeight: 44,
  footerLogoUrl: '',
  footerLogoHeight: 56,
  faviconUrl: '/favicon.svg',

  // Hotline / Call Now Configuration
  hotlinePhone: '0916 576 156',
  hotlineLabel: 'CALL NOW',
  hotlineSubtitle: 'Direct Engineering Support',
  hotlineEnabled: true,

  // Social Media Channels
  socialLinks: {
    facebook: { url: 'https://www.facebook.com', enabled: true },
    zalo: { url: 'https://zalo.me/0916576156', enabled: true },
    linkedin: { url: 'https://www.linkedin.com', enabled: true },
    youtube: { url: 'https://www.youtube.com/@hokimetal', enabled: true },
    tiktok: { url: 'https://www.tiktok.com/@hokimetal', enabled: true }
  },

  // Main page hero picture (behind the box of text)
  heroImageUrl: '/images/hoki-industrial-floor-hero.svg',
  heroOverlayOpacity: 15,

  // Main page YouTube video
  mainPageYoutubeUrl: 'https://www.youtube.com/@hokimetal',
  mainPageVideoTitle: 'HOKI Steel Fiber Concrete Systems - Official Video @hokimetal',
  mainPageVideoChannelUrl: 'https://www.youtube.com/@hokimetal',
  mainPageVideoChannelName: '@hokimetal',
  mainPageVideoAutoplay: true,
  mainPageVideoMuted: true,
  mainPageVideoDefaultOpen: true,

  // About Us page pictures (all)
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

interface DataContextType {
  projects: ProjectCaseStudy[];
  articles: JournalArticle[];
  mediaItems: MediaItem[];
  consultationRequests: ConsultationRequest[];
  branding: SiteBranding;
  isServerSyncing: boolean;
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
  loginAdmin: (id: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // EPC Partners (Main Page)
  epcPartners: StrategicPartner[];
  updateEpcPartner: (id: string, updated: Partial<StrategicPartner>) => void;
  addEpcPartner: (partner: Omit<StrategicPartner, 'id'>) => StrategicPartner;
  deleteEpcPartner: (id: string) => void;
  reorderEpcPartners: (partners: StrategicPartner[]) => void;
  resetEpcPartners: () => void;
  epcSectionConfig: EpcSectionConfig;
  updateEpcSectionConfig: (updated: Partial<EpcSectionConfig>) => void;

  // About Us Page (Information, Leadership, Advisory Board)
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

const PROJECTS_STORAGE_KEY = 'hoki_projects_v1';
const ARTICLES_STORAGE_KEY = 'hoki_articles_v1';
const MEDIA_STORAGE_KEY = 'hoki_media_v1';
const CONSULTATIONS_STORAGE_KEY = 'hoki_consultations_v1';
const ADMIN_AUTH_KEY = 'hoki_admin_auth_session';
const BRANDING_STORAGE_KEY = 'hoki_branding_v1';
const EPC_PARTNERS_STORAGE_KEY = 'hoki_epc_partners_v1';
const EPC_CONFIG_STORAGE_KEY = 'hoki_epc_config_v1';
const ABOUT_INFO_STORAGE_KEY = 'hoki_about_info_v1';
const LEADERSHIP_STORAGE_KEY = 'hoki_leadership_v1';
const ADVISORY_STORAGE_KEY = 'hoki_advisory_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial local state with fallback directly to constant embedded data
  const [projects, setProjects] = useState<ProjectCaseStudy[]>(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => ({
            ...p,
            slug: p.slug ? slugify(p.slug) : slugify(p.title || p.code || p.id)
          }));
        }
      }
    } catch {
      // fallback
    }
    return PROJECT_CASES;
  });

  const [articles, setArticles] = useState<JournalArticle[]>(() => {
    try {
      const stored = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return JOURNAL_ARTICLES;
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const stored = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MEDIA_ITEMS;
  });

  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>(() => {
    try {
      const stored = localStorage.getItem(CONSULTATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_CONSULTATIONS;
  });

  const [branding, setBranding] = useState<SiteBranding>(() => {
    try {
      const stored = localStorage.getItem(BRANDING_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_BRANDING,
          ...parsed,
          hotlinePhone: parsed.hotlinePhone || DEFAULT_BRANDING.hotlinePhone,
          hotlineLabel: parsed.hotlineLabel || DEFAULT_BRANDING.hotlineLabel,
          hotlineSubtitle: parsed.hotlineSubtitle || DEFAULT_BRANDING.hotlineSubtitle,
          hotlineEnabled: parsed.hotlineEnabled !== undefined ? parsed.hotlineEnabled : DEFAULT_BRANDING.hotlineEnabled,
          socialLinks: {
            ...DEFAULT_BRANDING.socialLinks,
            ...(parsed.socialLinks || {})
          }
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_BRANDING;
  });

  const [epcPartners, setEpcPartners] = useState<StrategicPartner[]>(() => {
    try {
      const stored = localStorage.getItem(EPC_PARTNERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_STRATEGIC_PARTNERS;
  });

  const [epcSectionConfig, setEpcSectionConfig] = useState<EpcSectionConfig>(() => {
    try {
      const stored = localStorage.getItem(EPC_CONFIG_STORAGE_KEY);
      if (stored) return { ...INITIAL_EPC_CONFIG, ...JSON.parse(stored) };
    } catch {
      // fallback
    }
    return INITIAL_EPC_CONFIG;
  });

  const [aboutInfo, setAboutInfo] = useState<AboutPageInfo>(() => {
    try {
      const stored = localStorage.getItem(ABOUT_INFO_STORAGE_KEY);
      if (stored) return { ...INITIAL_ABOUT_INFO, ...JSON.parse(stored) };
    } catch {
      // fallback
    }
    return INITIAL_ABOUT_INFO;
  });

  const [leadershipHeads, setLeadershipHeads] = useState<LeadershipHead[]>(() => {
    try {
      const stored = localStorage.getItem(LEADERSHIP_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return LEADERSHIP_HEADS;
  });

  const [advisoryMembers, setAdvisoryMembers] = useState<AdvisoryMember[]>(() => {
    try {
      const stored = localStorage.getItem(ADVISORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return ADVISORY_BOARD;
  });

  // Zero-latency instant local status
  const isServerSyncing = false;
  const lastServerSyncTime = 'Local Instant Cache Ready';
  const refreshServerData = async () => {
    // Pure instant local refresh
    return Promise.resolve();
  };

  // Sync favicon with DOM
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

  // --- BRANDING ACTIONS ---
  const updateBranding = (updated: Partial<SiteBranding>) => {
    setBranding((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save branding to localStorage:', e);
      }
      return next;
    });
  };

  const resetBranding = () => {
    setBranding(DEFAULT_BRANDING);
    try {
      localStorage.removeItem(BRANDING_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not reset branding in localStorage:', e);
    }
  };

  // --- EPC PARTNERS ACTIONS ---
  const updateEpcPartner = (id: string, updated: Partial<StrategicPartner>) => {
    setEpcPartners((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const subtitle =
            updated.subtitle !== undefined
              ? updated.subtitle
              : updated.role !== undefined
              ? updated.role
              : p.subtitle;
          return { ...p, ...updated, subtitle, role: subtitle };
        }
        return p;
      });
      localStorage.setItem(EPC_PARTNERS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addEpcPartner = (partner: Omit<StrategicPartner, 'id'>): StrategicPartner => {
    const newPartner: StrategicPartner = {
      ...partner,
      id: `epc-${Date.now()}`,
      subtitle: partner.subtitle || partner.role || 'Strategic EPC Partner',
      role: partner.subtitle || partner.role || 'Strategic EPC Partner'
    };
    setEpcPartners((prev) => {
      const next = [...prev, newPartner];
      localStorage.setItem(EPC_PARTNERS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return newPartner;
  };

  const deleteEpcPartner = (id: string) => {
    setEpcPartners((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(EPC_PARTNERS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const reorderEpcPartners = (reordered: StrategicPartner[]) => {
    setEpcPartners(reordered);
    localStorage.setItem(EPC_PARTNERS_STORAGE_KEY, JSON.stringify(reordered));
  };

  const resetEpcPartners = () => {
    setEpcPartners(INITIAL_STRATEGIC_PARTNERS);
    setEpcSectionConfig(INITIAL_EPC_CONFIG);
    localStorage.setItem(EPC_PARTNERS_STORAGE_KEY, JSON.stringify(INITIAL_STRATEGIC_PARTNERS));
    localStorage.setItem(EPC_CONFIG_STORAGE_KEY, JSON.stringify(INITIAL_EPC_CONFIG));
  };

  const updateEpcSectionConfig = (updated: Partial<EpcSectionConfig>) => {
    setEpcSectionConfig((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem(EPC_CONFIG_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // --- ABOUT US, LEADERSHIP & ADVISORY ACTIONS ---
  const updateAboutInfo = (updated: Partial<AboutPageInfo>) => {
    setAboutInfo((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem(ABOUT_INFO_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetAboutInfo = () => {
    setAboutInfo(INITIAL_ABOUT_INFO);
    setLeadershipHeads(LEADERSHIP_HEADS);
    setAdvisoryMembers(ADVISORY_BOARD);
    localStorage.setItem(ABOUT_INFO_STORAGE_KEY, JSON.stringify(INITIAL_ABOUT_INFO));
    localStorage.setItem(LEADERSHIP_STORAGE_KEY, JSON.stringify(LEADERSHIP_HEADS));
    localStorage.setItem(ADVISORY_STORAGE_KEY, JSON.stringify(ADVISORY_BOARD));
  };

  const updateLeadershipHead = (idOrName: string, updated: Partial<LeadershipHead>) => {
    setLeadershipHeads((prev) => {
      const next = prev.map((h) =>
        h.id === idOrName || h.name === idOrName ? { ...h, ...updated } : h
      );
      localStorage.setItem(LEADERSHIP_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addLeadershipHead = (head: Omit<LeadershipHead, 'id'>): LeadershipHead => {
    const newHead: LeadershipHead = {
      ...head,
      id: `lead-${Date.now()}`
    };
    setLeadershipHeads((prev) => {
      const next = [...prev, newHead];
      localStorage.setItem(LEADERSHIP_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return newHead;
  };

  const deleteLeadershipHead = (idOrName: string) => {
    setLeadershipHeads((prev) => {
      const next = prev.filter((h) => h.id !== idOrName && h.name !== idOrName);
      localStorage.setItem(LEADERSHIP_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetLeadershipHeads = () => {
    setLeadershipHeads(LEADERSHIP_HEADS);
    localStorage.setItem(LEADERSHIP_STORAGE_KEY, JSON.stringify(LEADERSHIP_HEADS));
  };

  const updateAdvisoryMember = (idOrName: string, updated: Partial<AdvisoryMember>) => {
    setAdvisoryMembers((prev) => {
      const next = prev.map((m) =>
        m.id === idOrName || m.name === idOrName ? { ...m, ...updated } : m
      );
      localStorage.setItem(ADVISORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addAdvisoryMember = (member: Omit<AdvisoryMember, 'id'>): AdvisoryMember => {
    const newMember: AdvisoryMember = {
      ...member,
      id: `adv-${Date.now()}`
    };
    setAdvisoryMembers((prev) => {
      const next = [...prev, newMember];
      localStorage.setItem(ADVISORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return newMember;
  };

  const deleteAdvisoryMember = (idOrName: string) => {
    setAdvisoryMembers((prev) => {
      const next = prev.filter((m) => m.id !== idOrName && m.name !== idOrName);
      localStorage.setItem(ADVISORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetAdvisoryMembers = () => {
    setAdvisoryMembers(ADVISORY_BOARD);
    localStorage.setItem(ADVISORY_STORAGE_KEY, JSON.stringify(ADVISORY_BOARD));
  };

  // --- PROJECTS ACTIONS ---
  const updateProject = (id: string, updated: Partial<ProjectCaseStudy>) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updated } : p));
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addProject = (newProject: ProjectCaseStudy) => {
    setProjects((prev) => {
      const next = [newProject, ...prev];
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleProjectHighlight = (id: string) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, isHighlight: !p.isHighlight } : p));
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // --- ARTICLES ACTIONS ---
  const updateArticle = (id: string, updated: Partial<JournalArticle>) => {
    setArticles((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...updated } : a));
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addArticle = (newArticle: JournalArticle) => {
    setArticles((prev) => {
      const next = [newArticle, ...prev];
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => {
      const next = prev.filter((a) => a.id !== id);
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // --- MEDIA ACTIONS ---
  const uploadImageFile = async (
    file: File,
    category: MediaItem['category'] = 'general'
  ): Promise<MediaItem> => {
    try {
      const optimized = await compressAndOptimizeImage(file);
      const newMedia: MediaItem = {
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: optimized.name || file.name.replace(/\.[^/.]+$/, ''),
        url: optimized.dataUrl,
        size: optimized.size,
        dimensions: optimized.dimensions,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        category
      };

      setMediaItems((prev) => {
        const next = [newMedia, ...prev];
        try {
          localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore quota limit
        }
        return next;
      });

      return newMedia;
    } catch (err) {
      console.error('Failed to compress and upload image:', err);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const sizeInKb = Math.round(file.size / 1024);
          const newMedia: MediaItem = {
            id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: dataUrl,
            size: `${sizeInKb} KB`,
            dimensions: 'User Upload',
            uploadedAt: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            category
          };
          setMediaItems((prev) => {
            const next = [newMedia, ...prev];
            try {
              localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(next));
            } catch {
              // ignore quota
            }
            return next;
          });

          resolve(newMedia);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    }
  };

  const addMediaItem = (item: MediaItem) => {
    setMediaItems((prev) => {
      const next = [item, ...prev];
      try {
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const updateMediaItem = (id: string, updated: Partial<MediaItem>) => {
    setMediaItems((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...updated } : m));
      try {
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const replaceMediaItem = (id: string, newUrl: string, newName?: string) => {
    let oldUrl = '';
    setMediaItems((prev) => {
      const next = prev.map((m) => {
        if (m.id === id) {
          oldUrl = m.url;
          return {
            ...m,
            url: newUrl,
            name: newName || m.name,
            uploadedAt: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          };
        }
        return m;
      });
      try {
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    if (oldUrl) {
      // Automatically update projects referencing the old URL
      setProjects((prev) => {
        const next = prev.map((p) => {
          let updatedProj = { ...p };
          let changed = false;
          if (p.image === oldUrl) {
            updatedProj.image = newUrl;
            changed = true;
          }
          if (p.gallery && p.gallery.length > 0) {
            const updatedGallery = p.gallery.map((g) => {
              if (g.url === oldUrl) {
                changed = true;
                return { ...g, url: newUrl };
              }
              return g;
            });
            if (changed) {
              updatedProj.gallery = updatedGallery;
            }
          }
          return changed ? updatedProj : p;
        });
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      // Automatically update articles referencing the old URL
      setArticles((prev) => {
        const next = prev.map((a) => {
          let updatedArt = { ...a };
          let changed = false;
          if (a.image === oldUrl) {
            updatedArt.image = newUrl;
            changed = true;
          }
          if (a.gallery && a.gallery.length > 0) {
            const updatedGallery = a.gallery.map((g) => {
              if (g.url === oldUrl) {
                changed = true;
                return { ...g, url: newUrl };
              }
              return g;
            });
            if (changed) {
              updatedArt.gallery = updatedGallery;
            }
          }
          return changed ? updatedArt : a;
        });
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems((prev) => {
      const next = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // --- CONSULTATIONS & LEADS ACTIONS ---
  const addConsultationRequest = async (
    request: Omit<ConsultationRequest, 'id' | 'submittedAt'>
  ): Promise<ConsultationRequest> => {
    const newRecord: ConsultationRequest = {
      ...request,
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      submittedAt: new Date().toISOString()
    };

    setConsultationRequests((prev) => {
      const next = [newRecord, ...prev];
      try {
        localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save consultations to localStorage:', e);
      }
      return next;
    });

    // Optional webhook trigger if configured
    try {
      const webhookUrl = (window as any).__HOKI_WEBHOOK_URL__ || (import.meta as any).env?.VITE_WEBHOOK_URL;
      if (webhookUrl && typeof webhookUrl === 'string' && webhookUrl.startsWith('http')) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
          mode: 'no-cors'
        }).catch((err) => console.warn('External webhook notification attempt:', err));
      }
    } catch {
      // Ignore
    }

    return newRecord;
  };

  const updateConsultationStatus = (id: string, status: ConsultationRequest['status']) => {
    setConsultationRequests((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, status } : c));
      try {
        localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save consultation status:', e);
      }
      return next;
    });
  };

  const deleteConsultationRequest = (id: string) => {
    setConsultationRequests((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save consultation deletion:', e);
      }
      return next;
    });
  };

  // --- ADMIN AUTH ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const loginAdmin = (id: string, pass: string): boolean => {
    const trimmedId = id.trim();
    if (trimmedId === 'admin' && pass === '123qwe') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {
      // ignore
    }
  };

  // --- SYSTEM RESET & BACKUP ACTIONS ---
  const resetToDefaults = () => {
    setProjects(PROJECT_CASES);
    setArticles(JOURNAL_ARTICLES);
    setMediaItems(INITIAL_MEDIA_ITEMS);
    setConsultationRequests(INITIAL_CONSULTATIONS);
    setBranding(DEFAULT_BRANDING);
    setEpcPartners(INITIAL_STRATEGIC_PARTNERS);
    setEpcSectionConfig(INITIAL_EPC_CONFIG);
    setAboutInfo(INITIAL_ABOUT_INFO);
    setLeadershipHeads(LEADERSHIP_HEADS);
    setAdvisoryMembers(ADVISORY_BOARD);

    localStorage.removeItem(PROJECTS_STORAGE_KEY);
    localStorage.removeItem(ARTICLES_STORAGE_KEY);
    localStorage.removeItem(MEDIA_STORAGE_KEY);
    localStorage.removeItem(CONSULTATIONS_STORAGE_KEY);
    localStorage.removeItem(BRANDING_STORAGE_KEY);
    localStorage.removeItem(EPC_PARTNERS_STORAGE_KEY);
    localStorage.removeItem(EPC_CONFIG_STORAGE_KEY);
    localStorage.removeItem(ABOUT_INFO_STORAGE_KEY);
    localStorage.removeItem(LEADERSHIP_STORAGE_KEY);
    localStorage.removeItem(ADVISORY_STORAGE_KEY);
  };

  const exportBackupData = (type: 'all' | 'projects' | 'knowledge' = 'all') => {
    const timestamp = new Date().toISOString();
    if (type === 'projects') {
      return {
        backupType: 'projects',
        version: '3.0',
        exportedAt: timestamp,
        count: projects.length,
        projects
      };
    }
    if (type === 'knowledge') {
      return {
        backupType: 'knowledge',
        version: '3.0',
        exportedAt: timestamp,
        count: articles.length,
        articles
      };
    }
    return {
      backupType: 'all',
      version: '3.0',
      exportedAt: timestamp,
      projectsCount: projects.length,
      articlesCount: articles.length,
      consultationsCount: consultationRequests.length,
      projects,
      articles,
      consultations: consultationRequests,
      branding,
      epcPartners,
      aboutInfo
    };
  };

  const importBackupData = async (
    payload: any,
    mode: 'merge' | 'replace' = 'merge'
  ): Promise<{ success: boolean; projectCount: number; articleCount: number; message: string }> => {
    if (!payload || typeof payload !== 'object') {
      return {
        success: false,
        projectCount: 0,
        articleCount: 0,
        message: 'Invalid JSON backup structure'
      };
    }

    let importedProjects: ProjectCaseStudy[] = [];
    let importedArticles: JournalArticle[] = [];

    if (Array.isArray(payload)) {
      if (payload.length > 0 && ('code' in payload[0] || 'facilityType' in payload[0])) {
        importedProjects = payload;
      } else if (
        payload.length > 0 &&
        ('categorySlug' in payload[0] || 'subtitle' in payload[0])
      ) {
        importedArticles = payload;
      }
    } else {
      if (Array.isArray(payload.projects)) {
        importedProjects = payload.projects;
      }
      if (Array.isArray(payload.articles)) {
        importedArticles = payload.articles;
      }
    }

    if (importedProjects.length === 0 && importedArticles.length === 0) {
      return {
        success: false,
        projectCount: 0,
        articleCount: 0,
        message: 'No valid projects or knowledge articles detected in uploaded backup JSON'
      };
    }

    // Local optimistic update
    if (importedProjects.length > 0) {
      if (mode === 'replace') {
        setProjects(importedProjects);
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(importedProjects));
      } else {
        setProjects((prev) => {
          const map = new Map<string, ProjectCaseStudy>();
          prev.forEach((p) => map.set(p.id, p));
          importedProjects.forEach((p) => map.set(p.id, { ...map.get(p.id), ...p }));
          const merged = Array.from(map.values());
          localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        });
      }
    }

    if (importedArticles.length > 0) {
      if (mode === 'replace') {
        setArticles(importedArticles);
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(importedArticles));
      } else {
        setArticles((prev) => {
          const map = new Map<string, JournalArticle>();
          prev.forEach((a) => map.set(a.id, a));
          importedArticles.forEach((a) => map.set(a.id, { ...map.get(a.id), ...a }));
          const merged = Array.from(map.values());
          localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        });
      }
    }

    return {
      success: true,
      projectCount: importedProjects.length,
      articleCount: importedArticles.length,
      message: `Successfully ${
        mode === 'replace' ? 'restored' : 'merged'
      } ${importedProjects.length} project dossiers and ${importedArticles.length} knowledge articles into local storage.`
    };
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        articles,
        mediaItems,
        consultationRequests,
        branding,
        isServerSyncing,
        lastServerSyncTime,
        refreshServerData,
        updateBranding,
        resetBranding,
        updateProject,
        addProject,
        deleteProject,
        updateArticle,
        addArticle,
        deleteArticle,
        uploadImageFile,
        addMediaItem,
        updateMediaItem,
        replaceMediaItem,
        deleteMediaItem,
        addConsultationRequest,
        updateConsultationStatus,
        deleteConsultationRequest,
        resetToDefaults,
        toggleProjectHighlight,
        exportBackupData,
        importBackupData,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,

        // EPC Partners
        epcPartners,
        updateEpcPartner,
        addEpcPartner,
        deleteEpcPartner,
        reorderEpcPartners,
        resetEpcPartners,
        epcSectionConfig,
        updateEpcSectionConfig,

        // About Us Page Content & Teams
        aboutInfo,
        updateAboutInfo,
        resetAboutInfo,
        leadershipHeads,
        updateLeadershipHead,
        addLeadershipHead,
        deleteLeadershipHead,
        resetLeadershipHeads,
        advisoryMembers,
        updateAdvisoryMember,
        addAdvisoryMember,
        deleteAdvisoryMember,
        resetAdvisoryMembers
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
