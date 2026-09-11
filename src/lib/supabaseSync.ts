import { getSupabase } from './supabase';
import {
  SiteBranding,
  MediaItem,
  ProjectCaseStudy,
  JournalArticle,
  ConsultationRequest,
  AboutPageInfo,
  StrategicPartner,
  EpcSectionConfig
} from '../types';

// =========================================================================
// 1. SITE BRANDING (Hotline, Social Links, Hero Image, Video, Logos)
// =========================================================================

export async function fetchBrandingFromSupabase(): Promise<SiteBranding | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('site_branding')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetchBranding error:', error.message);
      return null;
    }
    if (!data) return null;

    return mapRowToBranding(data);
  } catch (err) {
    console.warn('Supabase fetchBranding exception:', err);
    return null;
  }
}

export async function saveBrandingToSupabase(branding: Partial<SiteBranding>): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = mapBrandingToRow(branding);
    const { error } = await supabase
      .from('site_branding')
      .upsert({ id: 'default', ...row, updated_at: new Date().toISOString() });

    if (error) {
      console.error('Supabase saveBranding error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveBranding exception:', err);
    return false;
  }
}

export function subscribeToBrandingRealtime(onUpdate: (branding: SiteBranding) => void) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime:site_branding')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'site_branding' },
      (payload) => {
        if (payload.new && typeof payload.new === 'object') {
          onUpdate(mapRowToBranding(payload.new));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

function mapRowToBranding(row: any): SiteBranding {
  return {
    headerLogoUrl: row.header_logo_url,
    headerLogoHeight: row.header_logo_height,
    footerLogoUrl: row.footer_logo_url,
    footerLogoHeight: row.footer_logo_height,
    faviconUrl: row.favicon_url,
    hotlinePhone: row.hotline_phone,
    hotlineLabel: row.hotline_label,
    hotlineSubtitle: row.hotline_subtitle,
    hotlineEnabled: row.hotline_enabled,
    socialLinks: row.social_links || {},
    heroImageUrl: row.hero_image_url,
    heroOverlayOpacity: row.hero_overlay_opacity,
    mainPageYoutubeUrl: row.main_page_youtube_url,
    mainPageVideoTitle: row.main_page_video_title,
    mainPageVideoChannelUrl: row.main_page_video_channel_url,
    mainPageVideoChannelName: row.main_page_video_channel_name,
    mainPageVideoAutoplay: row.main_page_video_autoplay,
    mainPageVideoMuted: row.main_page_video_muted,
    mainPageVideoDefaultOpen: row.main_page_video_default_open,
    aboutHeroImageUrl: row.about_hero_image_url,
    aboutFactoryImageUrl: row.about_factory_image_url,
    aboutLeadershipAvatars: row.about_leadership_avatars || {},
    aboutAdvisoryAvatars: row.about_advisory_avatars || {}
  };
}

function mapBrandingToRow(branding: Partial<SiteBranding>): any {
  const row: any = {};
  if (branding.headerLogoUrl !== undefined) row.header_logo_url = branding.headerLogoUrl;
  if (branding.headerLogoHeight !== undefined) row.header_logo_height = branding.headerLogoHeight;
  if (branding.footerLogoUrl !== undefined) row.footer_logo_url = branding.footerLogoUrl;
  if (branding.footerLogoHeight !== undefined) row.footer_logo_height = branding.footerLogoHeight;
  if (branding.faviconUrl !== undefined) row.favicon_url = branding.faviconUrl;
  if (branding.hotlinePhone !== undefined) row.hotline_phone = branding.hotlinePhone;
  if (branding.hotlineLabel !== undefined) row.hotline_label = branding.hotlineLabel;
  if (branding.hotlineSubtitle !== undefined) row.hotline_subtitle = branding.hotlineSubtitle;
  if (branding.hotlineEnabled !== undefined) row.hotline_enabled = branding.hotlineEnabled;
  if (branding.socialLinks !== undefined) row.social_links = branding.socialLinks;
  if (branding.heroImageUrl !== undefined) row.hero_image_url = branding.heroImageUrl;
  if (branding.heroOverlayOpacity !== undefined) row.hero_overlay_opacity = branding.heroOverlayOpacity;
  if (branding.mainPageYoutubeUrl !== undefined) row.main_page_youtube_url = branding.mainPageYoutubeUrl;
  if (branding.mainPageVideoTitle !== undefined) row.main_page_video_title = branding.mainPageVideoTitle;
  if (branding.mainPageVideoChannelUrl !== undefined) row.main_page_video_channel_url = branding.mainPageVideoChannelUrl;
  if (branding.mainPageVideoChannelName !== undefined) row.main_page_video_channel_name = branding.mainPageVideoChannelName;
  if (branding.mainPageVideoAutoplay !== undefined) row.main_page_video_autoplay = branding.mainPageVideoAutoplay;
  if (branding.mainPageVideoMuted !== undefined) row.main_page_video_muted = branding.mainPageVideoMuted;
  if (branding.mainPageVideoDefaultOpen !== undefined) row.main_page_video_default_open = branding.mainPageVideoDefaultOpen;
  if (branding.aboutHeroImageUrl !== undefined) row.about_hero_image_url = branding.aboutHeroImageUrl;
  if (branding.aboutFactoryImageUrl !== undefined) row.about_factory_image_url = branding.aboutFactoryImageUrl;
  if (branding.aboutLeadershipAvatars !== undefined) row.about_leadership_avatars = branding.aboutLeadershipAvatars;
  if (branding.aboutAdvisoryAvatars !== undefined) row.about_advisory_avatars = branding.aboutAdvisoryAvatars;
  return row;
}

// =========================================================================
// 2. PROJECTS (Civil & Industrial Flooring Dossiers)
// =========================================================================

export async function fetchProjectsFromSupabase(): Promise<ProjectCaseStudy[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProjects error:', error.message);
      return null;
    }
    return (data || []).map(mapRowToProject);
  } catch (err) {
    console.warn('Supabase fetchProjects exception:', err);
    return null;
  }
}

export async function saveProjectToSupabase(project: ProjectCaseStudy): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = mapProjectToRow(project);
    const { error } = await supabase.from('projects').upsert(row);
    if (error) {
      console.error('Supabase saveProject error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveProject exception:', err);
    return false;
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteProject error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteProject exception:', err);
    return false;
  }
}

export function subscribeToProjectsRealtime(onUpdate: (projects: ProjectCaseStudy[]) => void) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime:projects')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      async () => {
        const fresh = await fetchProjectsFromSupabase();
        if (fresh) onUpdate(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

function mapRowToProject(row: any): ProjectCaseStudy {
  return {
    id: row.id,
    slug: row.slug,
    code: row.code || '',
    title: row.title,
    client: row.client || '',
    facilityType: row.facility_type || '',
    sector: row.sector || 'industrial',
    sectorLabel: row.sector_label || '',
    location: row.location || '',
    area: row.area || '',
    description: row.description || '',
    image: row.image || '',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    challenge: row.challenge || '',
    solution: row.solution || '',
    verification: row.verification || '',
    isHighlight: Boolean(row.is_highlight),
    metrics: Array.isArray(row.metrics) ? row.metrics : [],
    specifications: row.specifications || {
      fiberSeries: '',
      dosage: '',
      concreteGrade: '',
      jointSpacing: ''
    },
    clientQuote: row.client_quote,
    quoteAuthor: row.quote_author,
    drawingsAvailable: row.drawings_available !== undefined ? row.drawings_available : true,
    droneVideoAvailable: Boolean(row.drone_video_available)
  };
}

function mapProjectToRow(p: ProjectCaseStudy): any {
  return {
    id: p.id,
    slug: p.slug,
    code: p.code,
    title: p.title,
    client: p.client,
    facility_type: p.facilityType,
    sector: p.sector,
    sector_label: p.sectorLabel,
    location: p.location,
    area: p.area,
    description: p.description,
    image: p.image,
    gallery: p.gallery || [],
    challenge: p.challenge,
    solution: p.solution,
    verification: p.verification,
    is_highlight: p.isHighlight || false,
    metrics: p.metrics || [],
    specifications: p.specifications || {},
    client_quote: p.clientQuote,
    quote_author: p.quoteAuthor,
    drawings_available: p.drawingsAvailable !== false,
    drone_video_available: p.droneVideoAvailable || false,
    updated_at: new Date().toISOString()
  };
}

// =========================================================================
// 3. ARTICLES (Technical Monographs & Research Papers)
// =========================================================================

export async function fetchArticlesFromSupabase(): Promise<JournalArticle[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchArticles error:', error.message);
      return null;
    }
    return (data || []).map(mapRowToArticle);
  } catch (err) {
    console.warn('Supabase fetchArticles exception:', err);
    return null;
  }
}

export async function saveArticleToSupabase(article: JournalArticle): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = mapArticleToRow(article);
    const { error } = await supabase.from('articles').upsert(row);
    if (error) {
      console.error('Supabase saveArticle error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveArticle exception:', err);
    return false;
  }
}

export async function deleteArticleFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteArticle error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteArticle exception:', err);
    return false;
  }
}

export function subscribeToArticlesRealtime(onUpdate: (articles: JournalArticle[]) => void) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime:articles')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'articles' },
      async () => {
        const fresh = await fetchArticlesFromSupabase();
        if (fresh) onUpdate(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

function mapRowToArticle(row: any): JournalArticle {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    category: row.category || '',
    categorySlug: row.category_slug || 'standards',
    date: row.date || '',
    readTime: row.read_time || '',
    author: row.author || '',
    standards: row.standards || '',
    image: row.image,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    isFlagship: Boolean(row.is_flagship),
    contentSnippet: row.content_snippet || '',
    fullContent: Array.isArray(row.full_content) ? row.full_content : []
  };
}

function mapArticleToRow(a: JournalArticle): any {
  return {
    id: a.id,
    title: a.title,
    subtitle: a.subtitle,
    category: a.category,
    category_slug: a.categorySlug,
    date: a.date,
    read_time: a.readTime,
    author: a.author,
    standards: a.standards,
    image: a.image,
    gallery: a.gallery || [],
    is_flagship: a.isFlagship || false,
    content_snippet: a.contentSnippet,
    full_content: a.fullContent || [],
    updated_at: new Date().toISOString()
  };
}

// =========================================================================
// 4. CONSULTATION REQUESTS (RFQs & 1-on-1 Engineer Bookings)
// =========================================================================

export async function fetchConsultationsFromSupabase(): Promise<ConsultationRequest[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('consultation_requests')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchConsultations error:', error.message);
      return null;
    }
    return (data || []).map(mapRowToConsultation);
  } catch (err) {
    console.warn('Supabase fetchConsultations exception:', err);
    return null;
  }
}

export async function saveConsultationToSupabase(req: ConsultationRequest): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = mapConsultationToRow(req);
    const { error } = await supabase.from('consultation_requests').upsert(row);
    if (error) {
      console.error('Supabase saveConsultation error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveConsultation exception:', err);
    return false;
  }
}

export async function deleteConsultationFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('consultation_requests').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteConsultation error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteConsultation exception:', err);
    return false;
  }
}

export function subscribeToConsultationsRealtime(onUpdate: (reqs: ConsultationRequest[]) => void) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime:consultation_requests')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'consultation_requests' },
      async () => {
        const fresh = await fetchConsultationsFromSupabase();
        if (fresh) onUpdate(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

function mapRowToConsultation(row: any): ConsultationRequest {
  return {
    id: row.id,
    name: row.name,
    firm: row.firm,
    email: row.email,
    phone: row.phone,
    projectType: row.project_type,
    slabArea: row.slab_area,
    targetDate: row.target_date,
    submittedAt: row.submitted_at,
    notes: row.notes,
    status: row.status || 'new'
  };
}

function mapConsultationToRow(req: ConsultationRequest): any {
  return {
    id: req.id,
    name: req.name,
    firm: req.firm,
    email: req.email,
    phone: req.phone,
    project_type: req.projectType,
    slab_area: req.slabArea,
    target_date: req.targetDate,
    submitted_at: req.submittedAt,
    notes: req.notes,
    status: req.status
  };
}

// =========================================================================
// 5. MEDIA ASSET ITEMS & SUPABASE STORAGE ('media' Bucket)
// =========================================================================

/**
 * Direct file upload to Supabase Storage 'media' bucket.
 * Returns publicUrl, storagePath, and formatted size.
 */
export async function uploadFileToSupabaseStorage(
  file: File,
  bucketName: string = 'media',
  category: string = 'general'
): Promise<{ publicUrl: string; filePath: string; size: string; name: string } | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const ext = file.name.split('.').pop() || 'png';
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 40);
    const datePrefix = new Date().toISOString().slice(0, 7); // YYYY-MM
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const filePath = `${category}/${datePrefix}/${uniqueId}-${cleanBaseName}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/jpeg'
      });

    if (error) {
      console.warn(`Supabase Storage upload to '${bucketName}' error:`, error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path || filePath);

    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    return {
      publicUrl: publicUrlData.publicUrl,
      filePath: data.path || filePath,
      size: sizeStr,
      name: file.name.replace(/\.[^/.]+$/, '')
    };
  } catch (err) {
    console.warn(`Supabase Storage upload exception in bucket '${bucketName}':`, err);
    return null;
  }
}

/**
 * List files directly from Supabase Storage 'media' bucket.
 */
export async function listStorageFiles(
  folder: string = '',
  bucketName: string = 'media'
): Promise<{ name: string; id: string; url: string; createdAt: string }[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.warn(`Supabase Storage list error in '${bucketName}':`, error.message);
      return null;
    }

    return (data || []).map((file) => {
      const fullPath = folder ? `${folder}/${file.name}` : file.name;
      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(fullPath);
      return {
        id: file.id || fullPath,
        name: file.name,
        url: publicData.publicUrl,
        createdAt: file.created_at || new Date().toISOString()
      };
    });
  } catch (err) {
    console.warn('Supabase listStorageFiles exception:', err);
    return null;
  }
}

/**
 * Delete a file directly from Supabase Storage bucket.
 */
export async function deleteFileFromSupabaseStorage(
  filePath: string,
  bucketName: string = 'media'
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);
    if (error) {
      console.warn('Supabase deleteFileFromStorage error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase deleteFileFromStorage exception:', err);
    return false;
  }
}

export async function fetchMediaItemsFromSupabase(): Promise<MediaItem[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('media_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchMediaItems error:', error.message);
      return null;
    }
    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      url: row.url,
      size: row.size,
      uploadedAt: row.uploaded_at,
      category: row.category || 'general',
      dimensions: row.dimensions
    }));
  } catch (err) {
    console.warn('Supabase fetchMediaItems exception:', err);
    return null;
  }
}

export async function saveMediaItemToSupabase(item: MediaItem): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('media_items').upsert({
      id: item.id,
      name: item.name,
      url: item.url,
      size: item.size,
      uploaded_at: item.uploadedAt,
      category: item.category || 'general',
      dimensions: item.dimensions
    });

    if (error) {
      console.error('Supabase saveMediaItem error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveMediaItem exception:', err);
    return false;
  }
}

export async function deleteMediaItemFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('media_items').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteMediaItem error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteMediaItem exception:', err);
    return false;
  }
}

export function subscribeToMediaRealtime(onUpdate: (items: MediaItem[]) => void) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime:media_items')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'media_items' },
      async () => {
        const fresh = await fetchMediaItemsFromSupabase();
        if (fresh) onUpdate(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// =========================================================================
// 6. EPC STRATEGIC PARTNERS (Main Page Ticker)
// =========================================================================

export async function fetchEpcPartnersFromSupabase(): Promise<StrategicPartner[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('epc_partners')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.warn('Supabase fetchEpcPartners error:', error.message);
      return null;
    }
    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      subtitle: row.subtitle || row.role || '',
      role: row.role || row.subtitle || '',
      origin: row.origin,
      logoUrl: row.logo_url,
      websiteUrl: row.website_url
    }));
  } catch (err) {
    console.warn('Supabase fetchEpcPartners exception:', err);
    return null;
  }
}

export async function saveEpcPartnersToSupabase(partners: StrategicPartner[]): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const rows = partners.map((p, idx) => ({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle || p.role || '',
      role: p.role || p.subtitle || '',
      origin: p.origin || '',
      logo_url: p.logoUrl || '',
      website_url: p.websiteUrl || '',
      order_index: idx
    }));

    const { error } = await supabase.from('epc_partners').upsert(rows);
    if (error) {
      console.error('Supabase saveEpcPartners error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveEpcPartners exception:', err);
    return false;
  }
}

export function subscribeToEpcPartnersRealtime(onUpdate: (partners: StrategicPartner[]) => void) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime:epc_partners')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'epc_partners' },
      async () => {
        const fresh = await fetchEpcPartnersFromSupabase();
        if (fresh) onUpdate(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// =========================================================================
// 7. ABOUT US PAGE INFO & EPC SECTION CONFIG
// =========================================================================

export async function fetchAboutInfoFromSupabase(): Promise<AboutPageInfo | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('about_page_info')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data) return null;

    return {
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      missionLabel: data.mission_label,
      missionQuote: data.mission_quote,
      missionAuthor: data.mission_author,
      leadershipHeading: data.leadership_heading,
      leadershipSubheading: data.leadership_subheading,
      advisoryHeading: data.advisory_heading,
      advisorySubheading: data.advisory_subheading
    };
  } catch (err) {
    console.warn('Supabase fetchAboutInfo exception:', err);
    return null;
  }
}

export async function saveAboutInfoToSupabase(info: AboutPageInfo): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('about_page_info').upsert({
      id: 'default',
      title: info.title,
      tagline: info.tagline,
      description: info.description,
      mission_label: info.missionLabel,
      mission_quote: info.missionQuote,
      mission_author: info.missionAuthor,
      leadership_heading: info.leadershipHeading,
      leadership_subheading: info.leadershipSubheading,
      advisory_heading: info.advisoryHeading,
      advisory_subheading: info.advisorySubheading,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error('Supabase saveAboutInfo error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveAboutInfo exception:', err);
    return false;
  }
}

export async function fetchEpcConfigFromSupabase(): Promise<EpcSectionConfig | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('epc_section_config')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data) return null;

    return {
      title: data.title,
      subtitle: data.subtitle
    };
  } catch (err) {
    console.warn('Supabase fetchEpcConfig exception:', err);
    return null;
  }
}

export async function saveEpcConfigToSupabase(config: EpcSectionConfig): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('epc_section_config').upsert({
      id: 'default',
      title: config.title,
      subtitle: config.subtitle,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error('Supabase saveEpcConfig error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveEpcConfig exception:', err);
    return false;
  }
}
