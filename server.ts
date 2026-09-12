import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  PROJECT_CASES,
  JOURNAL_ARTICLES,
  INITIAL_STRATEGIC_PARTNERS,
  INITIAL_EPC_CONFIG,
  INITIAL_ABOUT_INFO,
  LEADERSHIP_HEADS,
  ADVISORY_BOARD
} from './src/data/mockData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'server_data');

// Ensure data storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial defaults
const DEFAULT_BRANDING = {
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

const INITIAL_CONSULTATIONS = [
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
  }
];

const INITIAL_MEDIA = [
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

// Helper to safely read and write JSON files
function readDataFile<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return fallback;
  }
}

function writeDataFile<T>(filename: string, data: T): boolean {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Ensure all initial data files exist
function initDataFiles() {
  readDataFile('projects.json', PROJECT_CASES);
  readDataFile('articles.json', JOURNAL_ARTICLES);
  readDataFile('branding.json', DEFAULT_BRANDING);
  readDataFile('consultations.json', INITIAL_CONSULTATIONS);
  readDataFile('media.json', INITIAL_MEDIA);
  readDataFile('epc_partners.json', INITIAL_STRATEGIC_PARTNERS);
  readDataFile('epc_config.json', INITIAL_EPC_CONFIG);
  readDataFile('about_info.json', INITIAL_ABOUT_INFO);
  readDataFile('leadership.json', LEADERSHIP_HEADS);
  readDataFile('advisory.json', ADVISORY_BOARD);
}

initDataFiles();

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // CORS headers for multi-origin if needed
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      engine: 'HOKI Persistent File System Engine',
      serverTime: new Date().toISOString()
    });
  });

  // Aggregated data fetch (for fast initial load & periodic synchronization)
  app.get('/api/data', (req: Request, res: Response) => {
    const projects = readDataFile('projects.json', PROJECT_CASES);
    const articles = readDataFile('articles.json', JOURNAL_ARTICLES);
    const branding = readDataFile('branding.json', DEFAULT_BRANDING);
    const consultationRequests = readDataFile('consultations.json', INITIAL_CONSULTATIONS);
    const mediaItems = readDataFile('media.json', INITIAL_MEDIA);
    const epcPartners = readDataFile('epc_partners.json', INITIAL_STRATEGIC_PARTNERS);
    const epcSectionConfig = readDataFile('epc_config.json', INITIAL_EPC_CONFIG);
    const aboutInfo = readDataFile('about_info.json', INITIAL_ABOUT_INFO);
    const leadershipHeads = readDataFile('leadership.json', LEADERSHIP_HEADS);
    const advisoryMembers = readDataFile('advisory.json', ADVISORY_BOARD);

    res.json({
      projects,
      articles,
      branding,
      consultationRequests,
      mediaItems,
      epcPartners,
      epcSectionConfig,
      aboutInfo,
      leadershipHeads,
      advisoryMembers,
      serverTime: new Date().toISOString()
    });
  });

  // --- PROJECTS API ---
  app.get('/api/projects', (req: Request, res: Response) => {
    const projects = readDataFile('projects.json', PROJECT_CASES);
    res.json(projects);
  });

  app.post('/api/projects', (req: Request, res: Response) => {
    const newProject = req.body;
    if (!newProject || !newProject.id) {
      return res.status(400).json({ error: 'Project data with id required' });
    }
    const projects = readDataFile<any[]>('projects.json', PROJECT_CASES);
    const updated = [newProject, ...projects.filter((p) => p.id !== newProject.id)];
    writeDataFile('projects.json', updated);
    res.status(201).json(newProject);
  });

  app.put('/api/projects/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const projects = readDataFile<any[]>('projects.json', PROJECT_CASES);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      const created = { ...updates, id };
      projects.unshift(created);
      writeDataFile('projects.json', projects);
      return res.json(created);
    }
    projects[index] = { ...projects[index], ...updates };
    writeDataFile('projects.json', projects);
    res.json(projects[index]);
  });

  app.patch('/api/projects/:id/highlight', (req: Request, res: Response) => {
    const { id } = req.params;
    const projects = readDataFile<any[]>('projects.json', PROJECT_CASES);
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects[index].isHighlight = !projects[index].isHighlight;
      writeDataFile('projects.json', projects);
      return res.json(projects[index]);
    }
    res.status(404).json({ error: 'Project not found' });
  });

  app.delete('/api/projects/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const projects = readDataFile<any[]>('projects.json', PROJECT_CASES);
    const filtered = projects.filter((p) => p.id !== id);
    writeDataFile('projects.json', filtered);
    res.json({ success: true, id });
  });

  // --- ARTICLES API ---
  app.get('/api/articles', (req: Request, res: Response) => {
    const articles = readDataFile('articles.json', JOURNAL_ARTICLES);
    res.json(articles);
  });

  app.post('/api/articles', (req: Request, res: Response) => {
    const newArticle = req.body;
    if (!newArticle || !newArticle.id) {
      return res.status(400).json({ error: 'Article data with id required' });
    }
    const articles = readDataFile<any[]>('articles.json', JOURNAL_ARTICLES);
    const updated = [newArticle, ...articles.filter((a) => a.id !== newArticle.id)];
    writeDataFile('articles.json', updated);
    res.status(201).json(newArticle);
  });

  app.put('/api/articles/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const articles = readDataFile<any[]>('articles.json', JOURNAL_ARTICLES);
    const index = articles.findIndex((a) => a.id === id);
    if (index === -1) {
      const created = { ...updates, id };
      articles.unshift(created);
      writeDataFile('articles.json', articles);
      return res.json(created);
    }
    articles[index] = { ...articles[index], ...updates };
    writeDataFile('articles.json', articles);
    res.json(articles[index]);
  });

  app.delete('/api/articles/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const articles = readDataFile<any[]>('articles.json', JOURNAL_ARTICLES);
    const filtered = articles.filter((a) => a.id !== id);
    writeDataFile('articles.json', filtered);
    res.json({ success: true, id });
  });

  // --- BRANDING API ---
  app.get('/api/branding', (req: Request, res: Response) => {
    const branding = readDataFile('branding.json', DEFAULT_BRANDING);
    res.json(branding);
  });

  app.put('/api/branding', (req: Request, res: Response) => {
    const updates = req.body;
    const current = readDataFile('branding.json', DEFAULT_BRANDING);
    const updated = { ...current, ...updates };
    writeDataFile('branding.json', updated);
    res.json(updated);
  });

  app.post('/api/branding/reset', (req: Request, res: Response) => {
    writeDataFile('branding.json', DEFAULT_BRANDING);
    res.json(DEFAULT_BRANDING);
  });

  // --- CONSULTATIONS & LEADS API ---
  app.get('/api/consultations', (req: Request, res: Response) => {
    const consultations = readDataFile('consultations.json', INITIAL_CONSULTATIONS);
    res.json(consultations);
  });

  app.post('/api/consultations', (req: Request, res: Response) => {
    const submission = req.body;
    const newRecord = {
      ...submission,
      id: submission.id || `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      submittedAt: submission.submittedAt || new Date().toISOString(),
      status: submission.status || 'new'
    };
    const consultations = readDataFile<any[]>('consultations.json', INITIAL_CONSULTATIONS);
    const updated = [newRecord, ...consultations];
    writeDataFile('consultations.json', updated);
    res.status(201).json(newRecord);
  });

  app.patch('/api/consultations/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const consultations = readDataFile<any[]>('consultations.json', INITIAL_CONSULTATIONS);
    const index = consultations.findIndex((c) => c.id === id);
    if (index !== -1) {
      consultations[index].status = status;
      writeDataFile('consultations.json', consultations);
      return res.json(consultations[index]);
    }
    res.status(404).json({ error: 'Consultation record not found' });
  });

  app.delete('/api/consultations/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const consultations = readDataFile<any[]>('consultations.json', INITIAL_CONSULTATIONS);
    const filtered = consultations.filter((c) => c.id !== id);
    writeDataFile('consultations.json', filtered);
    res.json({ success: true, id });
  });

  app.get('/api/consultations/export-csv', (req: Request, res: Response) => {
    const consultations = readDataFile<any[]>('consultations.json', INITIAL_CONSULTATIONS);
    const headers = [
      'Submission ID',
      'Submitted At (UTC)',
      'Contact Name',
      'Firm / Organization',
      'Email',
      'Phone',
      'Inquiry Type',
      'Slab Area',
      'Target Date',
      'Status',
      'Detailed Notes'
    ];

    const escapeCsv = (str?: string | null) => {
      if (!str) return '""';
      return `"${String(str).replace(/"/g, '""')}"`;
    };

    const rows = consultations.map((req) => [
      escapeCsv(req.id),
      escapeCsv(req.submittedAt),
      escapeCsv(req.name),
      escapeCsv(req.firm),
      escapeCsv(req.email),
      escapeCsv(req.phone),
      escapeCsv(req.projectType),
      escapeCsv(req.slabArea),
      escapeCsv(req.targetDate),
      escapeCsv(req.status),
      escapeCsv(req.notes)
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const dateStr = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=HOKI_Leads_Consultations_${dateStr}.csv`);
    res.send(csvContent);
  });

  // --- MEDIA ASSETS API ---
  app.get('/api/media', (req: Request, res: Response) => {
    const media = readDataFile('media.json', INITIAL_MEDIA);
    res.json(media);
  });

  app.post('/api/media', (req: Request, res: Response) => {
    const item = req.body;
    const media = readDataFile<any[]>('media.json', INITIAL_MEDIA);
    const updated = [item, ...media.filter((m) => m.id !== item.id)];
    writeDataFile('media.json', updated);
    res.status(201).json(item);
  });

  app.put('/api/media/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const media = readDataFile<any[]>('media.json', INITIAL_MEDIA);
    const index = media.findIndex((m) => m.id === id);
    if (index !== -1) {
      media[index] = { ...media[index], ...updates };
      writeDataFile('media.json', media);
      return res.json(media[index]);
    }
    res.status(404).json({ error: 'Media item not found' });
  });

  app.delete('/api/media/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const media = readDataFile<any[]>('media.json', INITIAL_MEDIA);
    const filtered = media.filter((m) => m.id !== id);
    writeDataFile('media.json', filtered);
    res.json({ success: true, id });
  });

  // --- EPC PARTNERS & CONFIG API ---
  app.get('/api/epc', (req: Request, res: Response) => {
    const partners = readDataFile('epc_partners.json', INITIAL_STRATEGIC_PARTNERS);
    const config = readDataFile('epc_config.json', INITIAL_EPC_CONFIG);
    res.json({ partners, config });
  });

  app.put('/api/epc/config', (req: Request, res: Response) => {
    const updates = req.body;
    const current = readDataFile('epc_config.json', INITIAL_EPC_CONFIG);
    const updated = { ...current, ...updates };
    writeDataFile('epc_config.json', updated);
    res.json(updated);
  });

  app.post('/api/epc/partners', (req: Request, res: Response) => {
    const partner = req.body;
    const newPartner = {
      ...partner,
      id: partner.id || `epc-${Date.now()}`
    };
    const partners = readDataFile<any[]>('epc_partners.json', INITIAL_STRATEGIC_PARTNERS);
    const updated = [...partners, newPartner];
    writeDataFile('epc_partners.json', updated);
    res.status(201).json(newPartner);
  });

  app.put('/api/epc/partners/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const partners = readDataFile<any[]>('epc_partners.json', INITIAL_STRATEGIC_PARTNERS);
    const index = partners.findIndex((p) => p.id === id);
    if (index !== -1) {
      partners[index] = { ...partners[index], ...updates };
      writeDataFile('epc_partners.json', partners);
      return res.json(partners[index]);
    }
    res.status(404).json({ error: 'Partner not found' });
  });

  app.delete('/api/epc/partners/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const partners = readDataFile<any[]>('epc_partners.json', INITIAL_STRATEGIC_PARTNERS);
    const filtered = partners.filter((p) => p.id !== id);
    writeDataFile('epc_partners.json', filtered);
    res.json({ success: true, id });
  });

  app.post('/api/epc/reorder', (req: Request, res: Response) => {
    const { partners } = req.body;
    if (Array.isArray(partners)) {
      writeDataFile('epc_partners.json', partners);
      return res.json(partners);
    }
    res.status(400).json({ error: 'Array of partners required' });
  });

  app.post('/api/epc/reset', (req: Request, res: Response) => {
    writeDataFile('epc_partners.json', INITIAL_STRATEGIC_PARTNERS);
    writeDataFile('epc_config.json', INITIAL_EPC_CONFIG);
    res.json({ partners: INITIAL_STRATEGIC_PARTNERS, config: INITIAL_EPC_CONFIG });
  });

  // --- ABOUT US, LEADERSHIP & ADVISORY API ---
  app.get('/api/about', (req: Request, res: Response) => {
    const aboutInfo = readDataFile('about_info.json', INITIAL_ABOUT_INFO);
    const leadership = readDataFile('leadership.json', LEADERSHIP_HEADS);
    const advisory = readDataFile('advisory.json', ADVISORY_BOARD);
    res.json({ aboutInfo, leadership, advisory });
  });

  app.put('/api/about/info', (req: Request, res: Response) => {
    const updates = req.body;
    const current = readDataFile('about_info.json', INITIAL_ABOUT_INFO);
    const updated = { ...current, ...updates };
    writeDataFile('about_info.json', updated);
    res.json(updated);
  });

  app.post('/api/about/reset', (req: Request, res: Response) => {
    writeDataFile('about_info.json', INITIAL_ABOUT_INFO);
    writeDataFile('leadership.json', LEADERSHIP_HEADS);
    writeDataFile('advisory.json', ADVISORY_BOARD);
    res.json({
      aboutInfo: INITIAL_ABOUT_INFO,
      leadership: LEADERSHIP_HEADS,
      advisory: ADVISORY_BOARD
    });
  });

  app.put('/api/leadership/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const list = readDataFile<any[]>('leadership.json', LEADERSHIP_HEADS);
    const index = list.findIndex((h) => h.id === id || h.name === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      writeDataFile('leadership.json', list);
      return res.json(list[index]);
    }
    res.status(404).json({ error: 'Leader not found' });
  });

  app.post('/api/leadership', (req: Request, res: Response) => {
    const head = req.body;
    const newHead = { ...head, id: head.id || `lead-${Date.now()}` };
    const list = readDataFile<any[]>('leadership.json', LEADERSHIP_HEADS);
    list.push(newHead);
    writeDataFile('leadership.json', list);
    res.status(201).json(newHead);
  });

  app.delete('/api/leadership/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const list = readDataFile<any[]>('leadership.json', LEADERSHIP_HEADS);
    const filtered = list.filter((h) => h.id !== id && h.name !== id);
    writeDataFile('leadership.json', filtered);
    res.json({ success: true, id });
  });

  app.put('/api/advisory/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const list = readDataFile<any[]>('advisory.json', ADVISORY_BOARD);
    const index = list.findIndex((m) => m.id === id || m.name === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      writeDataFile('advisory.json', list);
      return res.json(list[index]);
    }
    res.status(404).json({ error: 'Advisory member not found' });
  });

  app.post('/api/advisory', (req: Request, res: Response) => {
    const member = req.body;
    const newMember = { ...member, id: member.id || `adv-${Date.now()}` };
    const list = readDataFile<any[]>('advisory.json', ADVISORY_BOARD);
    list.push(newMember);
    writeDataFile('advisory.json', list);
    res.status(201).json(newMember);
  });

  app.delete('/api/advisory/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const list = readDataFile<any[]>('advisory.json', ADVISORY_BOARD);
    const filtered = list.filter((m) => m.id !== id && m.name !== id);
    writeDataFile('advisory.json', filtered);
    res.json({ success: true, id });
  });

  // --- BACKUP & RESTORE API ---
  app.get('/api/backup/export', (req: Request, res: Response) => {
    const projects = readDataFile('projects.json', PROJECT_CASES);
    const articles = readDataFile('articles.json', JOURNAL_ARTICLES);
    const branding = readDataFile('branding.json', DEFAULT_BRANDING);
    const consultations = readDataFile('consultations.json', INITIAL_CONSULTATIONS);
    const media = readDataFile('media.json', INITIAL_MEDIA);
    const epcPartners = readDataFile('epc_partners.json', INITIAL_STRATEGIC_PARTNERS);
    const epcSectionConfig = readDataFile('epc_config.json', INITIAL_EPC_CONFIG);
    const aboutInfo = readDataFile('about_info.json', INITIAL_ABOUT_INFO);

    res.json({
      backupType: 'all',
      version: '3.0',
      exportedAt: new Date().toISOString(),
      projectsCount: projects.length,
      articlesCount: articles.length,
      consultationsCount: consultations.length,
      projects,
      articles,
      consultations,
      branding,
      media,
      epcPartners,
      epcSectionConfig,
      aboutInfo
    });
  });

  app.post('/api/backup/import', (req: Request, res: Response) => {
    const { payload, mode } = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    let importedProjects = payload.projects || [];
    let importedArticles = payload.articles || [];

    if (Array.isArray(payload)) {
      if (payload.length > 0 && ('code' in payload[0] || 'facilityType' in payload[0])) {
        importedProjects = payload;
      } else if (payload.length > 0 && ('categorySlug' in payload[0] || 'subtitle' in payload[0])) {
        importedArticles = payload;
      }
    }

    if (importedProjects.length > 0) {
      if (mode === 'replace') {
        writeDataFile('projects.json', importedProjects);
      } else {
        const current = readDataFile<any[]>('projects.json', PROJECT_CASES);
        const map = new Map();
        current.forEach((p) => map.set(p.id, p));
        importedProjects.forEach((p: any) => map.set(p.id, { ...map.get(p.id), ...p }));
        writeDataFile('projects.json', Array.from(map.values()));
      }
    }

    if (importedArticles.length > 0) {
      if (mode === 'replace') {
        writeDataFile('articles.json', importedArticles);
      } else {
        const current = readDataFile<any[]>('articles.json', JOURNAL_ARTICLES);
        const map = new Map();
        current.forEach((a) => map.set(a.id, a));
        importedArticles.forEach((a: any) => map.set(a.id, { ...map.get(a.id), ...a }));
        writeDataFile('articles.json', Array.from(map.values()));
      }
    }

    if (payload.branding) {
      writeDataFile('branding.json', payload.branding);
    }
    if (payload.epcPartners) {
      writeDataFile('epc_partners.json', payload.epcPartners);
    }
    if (payload.aboutInfo) {
      writeDataFile('about_info.json', payload.aboutInfo);
    }

    res.json({
      success: true,
      projectCount: importedProjects.length,
      articleCount: importedArticles.length,
      message: `Successfully synchronized ${importedProjects.length} projects and ${importedArticles.length} articles to server storage.`
    });
  });

  app.post('/api/system/reset', (req: Request, res: Response) => {
    writeDataFile('projects.json', PROJECT_CASES);
    writeDataFile('articles.json', JOURNAL_ARTICLES);
    writeDataFile('branding.json', DEFAULT_BRANDING);
    writeDataFile('consultations.json', INITIAL_CONSULTATIONS);
    writeDataFile('media.json', INITIAL_MEDIA);
    writeDataFile('epc_partners.json', INITIAL_STRATEGIC_PARTNERS);
    writeDataFile('epc_config.json', INITIAL_EPC_CONFIG);
    writeDataFile('about_info.json', INITIAL_ABOUT_INFO);
    writeDataFile('leadership.json', LEADERSHIP_HEADS);
    writeDataFile('advisory.json', ADVISORY_BOARD);

    res.json({ success: true, message: 'All datasets reset to factory defaults' });
  });

  // ==========================================
  // VITE DEV MIDDLEWARE OR PRODUCTION STATIC
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HOKI Server & API running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
