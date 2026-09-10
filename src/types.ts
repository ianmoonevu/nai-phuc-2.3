export type PageRoute = 'home' | 'about' | 'products' | 'projects' | 'project-detail' | 'knowledge' | 'contact' | 'blog' | 'esg' | 'admin';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size?: string;
  uploadedAt: string;
  category?: 'projects' | 'knowledge' | 'products' | 'general';
  dimensions?: string;
}

export interface ConsultationRequest {
  id: string;
  name: string;
  firm: string;
  email: string;
  phone?: string;
  projectType: string;
  slabArea?: string;
  targetDate?: string;
  submittedAt: string;
  notes?: string;
  status: 'new' | 'reviewed' | 'in-progress' | 'completed';
}

export interface ProjectGalleryItem {
  url: string;
  title: string;
  caption: string;
  phaseTag: string;
}

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  code: string;
  title: string;
  client?: string;
  facilityType: string;
  sector: 'industrial' | 'logistics' | 'parking' | 'precast' | 'tunnels' | 'tunneling' | 'automotive' | 'infrastructure' | 'commercial' | 'hardstands';
  sectorLabel: string;
  location: string;
  area: string;
  description: string;
  image: string;
  gallery?: ProjectGalleryItem[];
  challenge: string;
  solution: string;
  verification: string;
  isHighlight?: boolean;
  metrics: {
    label: string;
    value: string;
    isHighlight?: boolean;
  }[];
  specifications: {
    fiberSeries: string;
    dosage: string;
    concreteGrade: string;
    jointSpacing: string;
  };
  clientQuote?: string;
  quoteAuthor?: string;
  drawingsAvailable?: boolean;
  droneVideoAvailable?: boolean;
}

export interface JournalArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categorySlug: 'crack-control' | 'jointless' | 'field-dosing' | 'standards' | 'sustainability';
  date: string;
  readTime: string;
  author: string;
  standards: string;
  image?: string;
  gallery?: { url: string; title?: string; caption?: string }[];
  isFlagship?: boolean;
  contentSnippet: string;
  fullContent?: string[];
}

export interface FiberProduct {
  id: string;
  name: string;
  series: string;
  subtitle: string;
  tensileStrength: string;
  tensileClasses?: string[];
  codes?: string[];
  standardCodes?: string[];
  applications?: string[];
  aspectRatio: string;
  keyMetric1: { label: string; value: string };
  keyMetric2: { label: string; value: string };
  description: string;
  primaryApplication: string;
  fiberCountPerKg: string;
  geometry: string;
  diameter: string;
  length: string;
  coating: string;
  image?: string;
  standards: string[];
}

export interface StrategicPartner {
  id: string;
  name: string;
  subtitle: string; // role/subtitle
  role?: string; // backwards compatibility
  origin?: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface EpcSectionConfig {
  title: string;
  subtitle?: string;
}

export interface AboutPageInfo {
  title: string;
  tagline: string;
  description: string;
  missionLabel: string;
  missionQuote: string;
  missionAuthor?: string;
  leadershipHeading: string;
  leadershipSubheading: string;
  advisoryHeading: string;
  advisorySubheading: string;
}

export type AboutInfo = AboutPageInfo;

export interface LeadershipHead {
  id?: string;
  name: string;
  department: string;
  title: string;
  credentials: string;
  focus: string;
  avatar: string;
  bio?: string;
}

export interface AdvisoryMember {
  id?: string;
  name: string;
  role: string;
  specialization: string;
  bio: string;
  avatar: string;
  actionText: string;
}

export interface GlobalOffice {
  region: string;
  location: string;
  function: string;
  contact: string;
  flag?: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  isHighlight?: boolean;
}

export interface SocialChannelItem {
  url: string;
  enabled: boolean;
}

export interface SiteSocialLinks {
  facebook?: SocialChannelItem;
  zalo?: SocialChannelItem;
  linkedin?: SocialChannelItem;
  youtube?: SocialChannelItem;
  tiktok?: SocialChannelItem;
}

export interface SiteBranding {
  headerLogoUrl?: string;
  headerLogoHeight?: number;
  footerLogoUrl?: string;
  footerLogoHeight?: number;
  faviconUrl?: string;

  // Hotline / Call Now button configuration
  hotlinePhone?: string; // Default: '0916 576 156'
  hotlineLabel?: string; // Default: 'CALL NOW'
  hotlineSubtitle?: string; // Default: 'Direct Engineering Desk'
  hotlineEnabled?: boolean; // Default: true

  // Social Media Links
  socialLinks?: SiteSocialLinks;

  // Main page hero picture (behind the box of text)
  heroImageUrl?: string;
  heroOverlayOpacity?: number; // 0 to 100

  // Main page YouTube video
  mainPageYoutubeUrl?: string;
  mainPageVideoTitle?: string;
  mainPageVideoChannelUrl?: string;
  mainPageVideoChannelName?: string;
  mainPageVideoAutoplay?: boolean;
  mainPageVideoMuted?: boolean;
  mainPageVideoDefaultOpen?: boolean;

  // About Us page pictures (all)
  aboutHeroImageUrl?: string;
  aboutFactoryImageUrl?: string;
  aboutLeadershipAvatars?: {
    [key: string]: string;
  };
  aboutAdvisoryAvatars?: {
    [key: string]: string;
  };
}

