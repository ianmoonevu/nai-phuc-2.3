import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { PageRoute, ProjectCaseStudy, JournalArticle, MediaItem, ProjectGalleryItem } from '../types';
import { AdminDashboard } from '../components/AdminDashboard';
import { QuickPhotoManagerModal } from '../components/QuickPhotoManagerModal';
import { QuickArticlePhotoManagerModal } from '../components/QuickArticlePhotoManagerModal';
import { AdminBrandingSection } from '../components/AdminBrandingSection';
import { AdminEpcSection } from '../components/AdminEpcSection';
import { AdminAboutSection } from '../components/AdminAboutSection';
import { AdminBackupModal } from '../components/AdminBackupModal';
import { AdminYouTubeSection } from '../components/AdminYouTubeSection';
import { AdminHotlineSocialSection } from '../components/AdminHotlineSocialSection';
import { ImagePickerModal } from '../components/ImagePickerModal';
import {
  ShieldCheck,
  BookOpen,
  Building2,
  Building,
  Users,
  Image as ImageIcon,
  LayoutDashboard,
  BarChart3,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  RotateCcw,
  Search,
  ExternalLink,
  Eye,
  FileText,
  Layers,
  ArrowLeft,
  X,
  Save,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Database,
  Download,
  Calendar,
  Clock,
  User,
  MapPin,
  Tag,
  LogOut,
  Camera,
  Sparkles,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Video,
  Globe,
  Link as LinkIcon,
  PhoneCall
} from 'lucide-react';
import { slugify, getProjectDetailPath } from '../utils/router';

interface AdminPageProps {
  onNavigate: (route: PageRoute) => void;
  onPreviewArticle?: (article: JournalArticle) => void;
  onPreviewProject?: (project: ProjectCaseStudy) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onNavigate,
  onPreviewArticle,
  onPreviewProject
}) => {
  const {
    projects,
    articles,
    mediaItems,
    epcPartners,
    updateProject,
    addProject,
    deleteProject,
    updateArticle,
    addArticle,
    deleteArticle,
    uploadImageFile,
    updateMediaItem,
    replaceMediaItem,
    deleteMediaItem,
    resetToDefaults,
    toggleProjectHighlight,
    exportBackupData,
    importBackupData,
    logoutAdmin
  } = useData();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'knowledge' | 'projects' | 'epc' | 'about' | 'media' | 'branding' | 'video' | 'hotline' | 'system'>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Backup & Restore Modal State
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [backupModalTab, setBackupModalTab] = useState<'download' | 'restore'>('download');

  // Search & Filters
  const [articleSearch, setArticleSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<'all' | 'projects' | 'knowledge' | 'general'>('all');

  // Article Edit Modal / Drawer
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<JournalArticle | null>(null);
  const [articleSections, setArticleSections] = useState<string[]>([]);

  // Project Edit Modal / Drawer
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectCaseStudy | null>(null);

  // Quick Multi-Photo Modals
  const [quickPhotoProject, setQuickPhotoProject] = useState<ProjectCaseStudy | null>(null);
  const [quickPhotoArticle, setQuickPhotoArticle] = useState<JournalArticle | null>(null);

  // Media Upload & Select Modal
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<MediaItem['category']>('knowledge');
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);
  const [justUploadedMediaId, setJustUploadedMediaId] = useState<string | null>(null);
  const [selectedMediaForAssign, setSelectedMediaForAssign] = useState<MediaItem | null>(null);

  // Replacement target for Media library direct replace
  const [replaceMediaTargetId, setReplaceMediaTargetId] = useState<string | null>(null);
  const replaceMediaInputRef = useRef<HTMLInputElement | null>(null);

  // Flexible Media Picker Context for any target
  const [pickerContext, setPickerContext] = useState<{
    type:
      | 'project-cover'
      | 'project-gallery-item'
      | 'project-gallery-add'
      | 'article-cover'
      | 'article-gallery-item'
      | 'article-gallery-add'
      | 'quick-project-cover'
      | 'quick-project-gallery-item'
      | 'quick-article-cover'
      | 'quick-article-gallery-item';
    index?: number;
    projectId?: string;
    articleId?: string;
  } | null>(null);

  // Reset safeguard modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const projectCoverInputRef = useRef<HTMLInputElement | null>(null);
  const projectBatchInputRef = useRef<HTMLInputElement | null>(null);
  const articleCoverInputRef = useRef<HTMLInputElement | null>(null);
  const articleBatchInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- KNOWLEDGE HANDLERS ---
  const handleCreateArticle = () => {
    const newArticle: JournalArticle = {
      id: `art-${Date.now()}`,
      title: 'New Technical Monograph Title',
      subtitle: 'Comprehensive structural analysis and engineering guidelines.',
      category: 'CRACK CONTROL MECHANICS',
      categorySlug: 'crack-control',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '6 MIN READ',
      author: 'HOKI Structural Research Directorate',
      standards: 'ASTM C1579 / EN 14889-1',
      image: '/images/applications/app-industrial-flooring.svg',
      isFlagship: false,
      contentSnippet: 'Brief overview of structural mechanisms, laboratory verification, and field specifications.',
      fullContent: [
        '1. Engineering Framework: Detailed technical explanation of structural mechanisms.',
        '2. Matrix Interaction: Interfacial transition zone behavior under cyclic stress.',
        '3. Field Validation: Standards-compliant experimental data and recommendations.'
      ]
    };
    setCurrentArticle(newArticle);
    setArticleSections(newArticle.fullContent || []);
    setIsEditingArticle(true);
  };

  const handleEditArticle = (art: JournalArticle) => {
    setCurrentArticle({ ...art });
    setArticleSections(art.fullContent ? [...art.fullContent] : []);
    setIsEditingArticle(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentArticle) return;

    const updated: JournalArticle = {
      ...currentArticle,
      fullContent: articleSections.filter((s) => s.trim().length > 0)
    };

    const exists = articles.some((a) => a.id === updated.id);
    if (exists) {
      updateArticle(updated.id, updated);
      showToast(`Article "${updated.title}" successfully updated`);
    } else {
      addArticle(updated);
      showToast(`New article "${updated.title}" created`);
    }
    setIsEditingArticle(false);
    setCurrentArticle(null);
  };

  const handleDeleteArticle = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete article "${title}"?`)) {
      deleteArticle(id);
      showToast(`Article deleted`);
    }
  };

  // --- PROJECT HANDLERS ---
  const handleCreateProject = () => {
    const defaultTitle = 'New Industrial Project Facility';
    const newProject: ProjectCaseStudy = {
      id: `case-${Date.now()}`,
      code: `HK-PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: slugify(defaultTitle),
      title: defaultTitle,
      facilityType: 'Heavy Manufacturing & Logistics Facility',
      sector: 'industrial',
      sectorLabel: 'Industrial Floors',
      location: 'Regional Mega Logistics Hub',
      area: '100,000 m²',
      description: 'Engineered high-performance steel fiber concrete slab installation for demanding dynamic loads.',
      image: '/images/projects/project-geely.svg',
      challenge: 'High concentrated dynamic wheel loads and strict jointless floor flatness tolerances.',
      solution: 'HOKI cold-drawn hooked-end steel fibers dosed at 28 kg/m³ into C35/45 concrete.',
      verification: 'ASTM C1609 testing validated residual flexural strength ratio > 70% with zero spalling.',
      metrics: [
        { label: 'Rebar Steel Replaced', value: '750 MT', isHighlight: true },
        { label: 'Schedule Accelerated', value: '25 Days', isHighlight: true },
        { label: 'Carbon Abatement', value: '620 tCO₂e' }
      ],
      specifications: {
        fiberSeries: 'HF-8060 Series (L=60mm, D=0.75mm)',
        dosage: '28 kg/m³',
        concreteGrade: 'C35/45 (fck = 35 MPa)',
        jointSpacing: '40m x 40m Jointless Armored Bays'
      },
      clientQuote: 'HOKI steel fiber allowed rapid continuous laser-screed pours with zero joint spalling.',
      quoteAuthor: 'Project Lead Engineer',
      drawingsAvailable: true,
      droneVideoAvailable: false,
      gallery: [
        {
          url: '/images/projects/gallery/gallery-screed-pour.svg',
          title: 'Laser Screed & Continuous Pour',
          caption: 'High-precision laser screed pour achieving FM2 flatness.',
          phaseTag: '01 CONSTRUCTION'
        }
      ]
    };
    setCurrentProject(newProject);
    setIsEditingProject(true);
  };

  const handleEditProject = (proj: ProjectCaseStudy) => {
    setCurrentProject({
      ...proj,
      slug: proj.slug || slugify(proj.title),
      metrics: proj.metrics ? [...proj.metrics] : [],
      specifications: { ...proj.specifications },
      gallery: proj.gallery ? [...proj.gallery] : []
    });
    setIsEditingProject(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const validatedSlug = slugify(currentProject.slug || currentProject.title || `project-${Date.now()}`);
    const projectToSave: ProjectCaseStudy = {
      ...currentProject,
      slug: validatedSlug
    };

    const exists = projects.some((p) => p.id === projectToSave.id);
    if (exists) {
      updateProject(projectToSave.id, projectToSave);
      showToast(`Project "${projectToSave.title}" updated (Slug: /projects/${projectToSave.slug})`);
    } else {
      addProject(projectToSave);
      showToast(`New project "${projectToSave.title}" created (Slug: /projects/${projectToSave.slug})`);
    }
    setIsEditingProject(false);
    setCurrentProject(null);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      deleteProject(id);
      showToast(`Project deleted`);
    }
  };

  // --- TARGET SELECTION DISPATCHER ---
  const applyMediaItemToTarget = (
    item: MediaItem,
    target: {
      type:
        | 'project-cover'
        | 'project-gallery-item'
        | 'project-gallery-add'
        | 'article-cover'
        | 'article-gallery-item'
        | 'article-gallery-add'
        | 'quick-project-cover'
        | 'quick-project-gallery-item'
        | 'quick-article-cover'
        | 'quick-article-gallery-item';
      index?: number;
      projectId?: string;
      articleId?: string;
    }
  ) => {
    switch (target.type) {
      case 'project-cover':
        setCurrentProject((prev) => (prev ? { ...prev, image: item.url } : null));
        break;
      case 'project-gallery-item':
        if (typeof target.index === 'number') {
          setCurrentProject((prev) => {
            if (!prev) return null;
            const g = [...(prev.gallery || [])];
            if (g[target.index!]) {
              g[target.index!] = { ...g[target.index!], url: item.url };
            }
            return { ...prev, gallery: g };
          });
        }
        break;
      case 'project-gallery-add':
        setCurrentProject((prev) => {
          if (!prev) return null;
          const phaseNum = ((prev.gallery?.length || 0) + 1).toString().padStart(2, '0');
          return {
            ...prev,
            gallery: [
              ...(prev.gallery || []),
              {
                url: item.url,
                title: item.name.replace(/[-_]/g, ' '),
                caption: 'High-performance concrete placement and verification.',
                phaseTag: `${phaseNum} VERIFIED SITE PHASE`
              }
            ]
          };
        });
        break;
      case 'article-cover':
        setCurrentArticle((prev) => (prev ? { ...prev, image: item.url } : null));
        break;
      case 'article-gallery-item':
        if (typeof target.index === 'number') {
          setCurrentArticle((prev) => {
            if (!prev) return null;
            const g = [...(prev.gallery || [])];
            if (g[target.index!]) {
              g[target.index!] = { ...g[target.index!], url: item.url };
            }
            return { ...prev, gallery: g };
          });
        }
        break;
      case 'article-gallery-add':
        setCurrentArticle((prev) => {
          if (!prev) return null;
          const figNum = (prev.gallery?.length || 0) + 1;
          return {
            ...prev,
            gallery: [
              ...(prev.gallery || []),
              {
                url: item.url,
                title: `Figure ${figNum}: ${item.name.replace(/[-_]/g, ' ')}`,
                caption: 'Technical schematic or micrograph.'
              }
            ]
          };
        });
        break;
      case 'quick-project-cover':
        if (target.projectId) {
          updateProject(target.projectId, { image: item.url });
        }
        break;
      case 'quick-article-cover':
        if (target.articleId) {
          updateArticle(target.articleId, { image: item.url });
        }
        break;
    }
  };

  // --- MEDIA UPLOAD HANDLERS ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const item = await uploadImageFile(files[i], uploadCategory);
        setJustUploadedMediaId(item.id);
        showToast(`Image "${item.name}" uploaded successfully`);

        // If a picker was targeting this upload, automatically insert
        if (pickerContext) {
          applyMediaItemToTarget(item, pickerContext);
          setPickerContext(null);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const item = await uploadImageFile(files[i], uploadCategory);
        setJustUploadedMediaId(item.id);
        showToast(`Image "${item.name}" uploaded successfully`);
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger replacement of an existing media item
  const handleTriggerReplaceMedia = (mediaId: string) => {
    setReplaceMediaTargetId(mediaId);
    replaceMediaInputRef.current?.click();
  };

  // Handle uploading the replacement file
  const handleReplaceMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replaceMediaTargetId) return;

    setIsUploading(true);
    try {
      const item = await uploadImageFile(file, 'general');
      replaceMediaItem(replaceMediaTargetId, item.url, item.name);
      setJustUploadedMediaId(replaceMediaTargetId);
      showToast(`Picture replaced and updated across all projects and articles!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to replace picture');
    } finally {
      setIsUploading(false);
      setReplaceMediaTargetId(null);
      if (replaceMediaInputRef.current) replaceMediaInputRef.current.value = '';
    }
  };

  // Direct Project Cover Photo Upload
  const handleProjectCoverDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const item = await uploadImageFile(file, 'projects');
      setCurrentProject((prev) => (prev ? { ...prev, image: item.url } : null));
      showToast(`Cover photo updated with "${item.name}"`);
    } catch (err) {
      console.error(err);
      showToast('Failed to upload cover photo');
    } finally {
      setIsUploading(false);
      if (projectCoverInputRef.current) projectCoverInputRef.current.value = '';
    }
  };

  // Direct Project Batch Gallery Upload
  const handleProjectBatchDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !currentProject) return;

    setIsUploading(true);
    try {
      const newItems: ProjectGalleryItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = await uploadImageFile(files[i], 'projects');
        const phaseNum = ((currentProject.gallery?.length || 0) + newItems.length + 1).toString().padStart(2, '0');
        newItems.push({
          url: item.url,
          title: item.name.replace(/[-_]/g, ' '),
          caption: `${currentProject.facilityType} execution phase.`,
          phaseTag: `${phaseNum} VERIFIED SITE PHASE`
        });
      }
      setCurrentProject((prev) =>
        prev ? { ...prev, gallery: [...(prev.gallery || []), ...newItems] } : null
      );
      showToast(`${newItems.length} photos added to project gallery!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to upload gallery photos');
    } finally {
      setIsUploading(false);
      if (projectBatchInputRef.current) projectBatchInputRef.current.value = '';
    }
  };

  // Direct Article Cover Photo Upload
  const handleArticleCoverDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const item = await uploadImageFile(file, 'knowledge');
      setCurrentArticle((prev) => (prev ? { ...prev, image: item.url } : null));
      showToast(`Article cover updated with "${item.name}"`);
    } catch (err) {
      console.error(err);
      showToast('Failed to upload cover photo');
    } finally {
      setIsUploading(false);
      if (articleCoverInputRef.current) articleCoverInputRef.current.value = '';
    }
  };

  // Direct Article Batch Figures Upload
  const handleArticleBatchDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !currentArticle) return;

    setIsUploading(true);
    try {
      const newItems: { url: string; title?: string; caption?: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = await uploadImageFile(files[i], 'knowledge');
        const figNum = (currentArticle.gallery?.length || 0) + newItems.length + 1;
        newItems.push({
          url: item.url,
          title: `Figure ${figNum}: ${item.name.replace(/[-_]/g, ' ')}`,
          caption: 'Technical micrograph or load curve.'
        });
      }
      setCurrentArticle((prev) =>
        prev ? { ...prev, gallery: [...(prev.gallery || []), ...newItems] } : null
      );
      showToast(`${newItems.length} figures added to article!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to upload figures');
    } finally {
      setIsUploading(false);
      if (articleBatchInputRef.current) articleBatchInputRef.current.value = '';
    }
  };

  // Filtered lists
  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.author.toLowerCase().includes(articleSearch.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.sectorLabel.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredMedia = mediaItems.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(mediaSearch.toLowerCase());
    const matchesCategory = mediaCategoryFilter === 'all' || m.category === mediaCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-[#f4f6f8] min-h-screen pb-24">
      {/* Top Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#00356a] text-white px-5 py-3 rounded-full shadow-bubble flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#006e21]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="bg-white border-b border-[#e2e6eb] px-4 sm:px-6 lg:px-8 py-6 shadow-bubble-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2.5 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] transition-all cursor-pointer shadow-bubble-sm"
              title="Return to Public Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> HOKI Portal Console
                </span>
                <span className="text-[11px] font-bold text-[#00356a]/60">v3.0 Production</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#00356a] tracking-tight mt-0.5">
                Content & Engineering Control Administration
              </h1>
            </div>
          </div>

          {/* Quick Metrics & Live View Triggers */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('knowledge')}
              className="px-3.5 py-2 rounded-full bg-white border border-[#e2e6eb] text-xs font-semibold text-[#00356a] hover:text-[#006e21] hover:border-[#006e21]/40 shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#006e21]" />
              <span>Live Knowledge</span>
              <ExternalLink className="w-3 h-3 text-[#00356a]/40" />
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="px-3.5 py-2 rounded-full bg-white border border-[#e2e6eb] text-xs font-semibold text-[#00356a] hover:text-[#006e21] hover:border-[#006e21]/40 shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-[#00356a]" />
              <span>Live Projects</span>
              <ExternalLink className="w-3 h-3 text-[#00356a]/40" />
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3.5 py-2 rounded-full bg-white border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all ml-1"
              title="Reset state to initial mock data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              id="admin-sign-out-btn"
              onClick={() => {
                logoutAdmin();
                onNavigate('home');
              }}
              className="px-3.5 py-2 rounded-full bg-white border border-[#dce0e6] text-xs font-semibold text-[#00356a] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all ml-1"
              title="End Admin Session and Lock Console"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Console Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-1.5 shadow-bubble-sm border border-[#e2e6eb] flex flex-wrap items-center gap-1.5 mb-8">
          <button
            id="admin-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'knowledge'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Articles ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'projects'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Project Dossiers ({projects.length})</span>
          </button>

          <button
            id="admin-tab-epc"
            onClick={() => setActiveTab('epc')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'epc'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <Building className="w-4 h-4 text-[#006e21]" />
            <span>EPC Partners ({epcPartners.length})</span>
          </button>

          <button
            id="admin-tab-about"
            onClick={() => setActiveTab('about')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'about'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <Users className="w-4 h-4 text-[#006e21]" />
            <span>About Us Page</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'media'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image & Media Uploader ({mediaItems.length})</span>
          </button>

          <button
            id="admin-tab-branding"
            onClick={() => setActiveTab('branding')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'branding'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#006e21]" />
            <span>Branding &amp; Site Pictures</span>
          </button>

          <button
            id="admin-tab-video"
            onClick={() => setActiveTab('video')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'video'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <Video className="w-4 h-4 text-red-500" />
            <span>Main Page Video</span>
          </button>

          <button
            id="admin-tab-hotline"
            onClick={() => setActiveTab('hotline')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'hotline'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-[#006e21]" />
            <span>Hotline &amp; Social Links</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'system'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>System Status & Backups</span>
          </button>
        </div>

        {/* TAB 0: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
            onPreviewArticle={onPreviewArticle}
            onPreviewProject={onPreviewProject}
          />
        )}

        {/* TAB 1: KNOWLEDGE ARTICLES MANAGER */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            {/* Action Bar: Search & New Article */}
            <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00356a]/40" />
                <input
                  type="text"
                  placeholder="Search articles by title, author, category..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setBackupModalTab('download');
                    setIsBackupModalOpen(true);
                  }}
                  className="px-4 py-3 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-bubble-sm border border-[#dce0e6] transition-all"
                  title="Backup or re-upload monographs and projects"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Backup / Re-upload</span>
                </button>

                <button
                  onClick={handleCreateArticle}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#005a1b] hover:shadow-bubble flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Article</span>
                </button>
              </div>
            </div>

            {/* Articles List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-[#00356a]/20 transition-all"
                >
                  <div className="flex items-start gap-4 max-w-3xl">
                    <div
                      onClick={() => setQuickPhotoArticle(art)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#f4f6f8] overflow-hidden shrink-0 border border-[#e2e6eb] shadow-bubble-inset relative group/artthumb cursor-pointer"
                      title="Click to manage cover photo & technical figures"
                    >
                      <img
                        src={art.image || '/images/applications/app-industrial-flooring.svg'}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover/artthumb:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/artthumb:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold gap-0.5">
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span>Visuals</span>
                      </div>
                      {art.gallery && art.gallery.length > 0 && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                          +{art.gallery.length}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-2.5 py-0.5 rounded-full">
                          {art.category}
                        </span>
                        <span className="text-[10px] font-semibold text-[#00356a]/60 bg-[#f4f6f8] px-2 py-0.5 rounded-full border border-[#e2e6eb]">
                          {art.standards}
                        </span>
                        {art.isFlagship && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Flagship
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#00356a] line-clamp-1">
                        {art.title}
                      </h3>
                      <p className="text-xs text-[#00356a]/70 line-clamp-2 mt-1">
                        {art.contentSnippet}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-[#00356a]/60 mt-2 font-medium">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#006e21]" /> {art.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {art.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {art.readTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-[#e2e6eb]">
                    <button
                      onClick={() => setQuickPhotoArticle(art)}
                      className="px-3.5 py-2 rounded-full bg-[#006e21]/10 hover:bg-[#006e21]/20 text-[#006e21] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-bubble-sm"
                      title="Manage cover photo and technical figures"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Visuals ({art.gallery?.length || 0})</span>
                    </button>
                    {onPreviewArticle && (
                      <button
                        onClick={() => onPreviewArticle(art)}
                        className="px-3.5 py-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-bubble-sm"
                        title="Preview article as user sees it"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleEditArticle(art)}
                      className="px-4 py-2 rounded-full bg-[#00356a] text-white hover:bg-[#002244] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-bubble-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id, art.title)}
                      className="p-2.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all cursor-pointer border border-rose-200"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredArticles.length === 0 && (
                <div className="bg-white rounded-3xl p-12 text-center shadow-bubble border border-[#e5e9ee]">
                  <BookOpen className="w-12 h-12 text-[#00356a]/30 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#00356a]">No Knowledge Articles Found</h3>
                  <p className="text-xs text-[#00356a]/60 mt-1">Try adjusting your search query or create a new article.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROJECT DOSSIERS & CASE STUDIES */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Action Bar: Search & New Project */}
            <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00356a]/40" />
                <input
                  type="text"
                  placeholder="Search projects by title, code, location..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setBackupModalTab('download');
                    setIsBackupModalOpen(true);
                  }}
                  className="px-4 py-3 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-bubble-sm border border-[#dce0e6] transition-all"
                  title="Backup or re-upload project dossiers and knowledge data"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Backup / Re-upload</span>
                </button>

                <button
                  onClick={handleCreateProject}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#005a1b] hover:shadow-bubble flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>
            </div>

            {/* Projects Grid / List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-[#00356a]/20 transition-all"
                >
                  <div className="flex items-start gap-4 max-w-3xl">
                    <div
                      onClick={() => setQuickPhotoProject(proj)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#f4f6f8] overflow-hidden shrink-0 border border-[#e2e6eb] shadow-bubble-inset relative cursor-pointer group/projthumb"
                      title="Click to manage all project photos & gallery"
                    >
                      <img
                        src={proj.image || '/images/projects/project-geely.svg'}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover/projthumb:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/projthumb:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold gap-0.5">
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span>Photos</span>
                      </div>
                      {proj.gallery && proj.gallery.length > 0 && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                          {proj.gallery.length}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold tracking-widest text-[#00356a] uppercase bg-[#00356a]/10 px-2.5 py-0.5 rounded-full">
                          {proj.code}
                        </span>
                        <span className="text-[10px] font-bold text-[#006e21] bg-[#006e21]/10 px-2.5 py-0.5 rounded-full">
                          {proj.sectorLabel}
                        </span>
                        <span className="text-[10px] font-bold text-[#00356a]/60 bg-[#f4f6f8] px-2 py-0.5 rounded-full border border-[#e2e6eb]">
                          {proj.area}
                        </span>
                        {proj.isHighlight && (
                          <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200/90 border border-amber-400 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3 h-3 text-amber-700 fill-amber-700" />
                            Track Record
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#00356a] line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-[#00356a]/70 line-clamp-1 mt-0.5">
                        {proj.facilityType} — <span className="font-medium text-[#006e21]">{proj.location}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#00356a]/70 mt-2">
                        <span className="bg-[#f4f6f8] px-2 py-0.5 rounded text-[10px] font-semibold border border-[#e2e6eb]">
                          Series: {proj.specifications.fiberSeries}
                        </span>
                        <span className="bg-[#f4f6f8] px-2 py-0.5 rounded text-[10px] font-semibold border border-[#e2e6eb]">
                          Dosing: {proj.specifications.dosage}
                        </span>
                        <span className="bg-[#f4f6f8] px-2 py-0.5 rounded text-[10px] font-semibold border border-[#e2e6eb]">
                          {proj.specifications.concreteGrade}
                        </span>
                        <span className="bg-[#00356a]/5 text-[#00356a] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border border-[#00356a]/15">
                          <LinkIcon className="w-2.5 h-2.5 text-[#006e21]" />
                          /projects/{proj.slug || slugify(proj.title)}
                        </span>
                        {proj.gallery && proj.gallery.length > 0 && (
                          <span className="text-[10px] font-bold text-[#006e21] flex items-center gap-1">
                            <Layers className="w-3 h-3" /> {proj.gallery.length} Photos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-[#e2e6eb]">
                    {/* Direct Page Link */}
                    <button
                      onClick={() => {
                        const targetSlug = proj.slug || slugify(proj.title);
                        window.history.pushState(null, '', getProjectDetailPath(targetSlug));
                        onNavigate('project-detail' as PageRoute);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3.5 py-2 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-bubble-sm"
                      title="Open dedicated project detail page"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#006e21]" />
                      <span>Dedicated Page</span>
                      <ExternalLink className="w-3 h-3 text-[#00356a]/40" />
                    </button>
                    {/* 1 MORE HIGHLIGHT BUTTON: Toggles project to appear in track record at mainpage */}
                    <button
                      onClick={() => {
                        const nextHighlight = !proj.isHighlight;
                        updateProject(proj.id, { isHighlight: nextHighlight });
                        showToast(
                          nextHighlight
                            ? `★ "${proj.title}" highlighted! It now appears in Track Record at mainpage.`
                            : `Removed "${proj.title}" from Track Record carousel.`
                        );
                      }}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-bubble-sm ${
                        proj.isHighlight
                          ? 'bg-amber-400 hover:bg-amber-300 text-[#00356a] ring-2 ring-amber-400/60 font-black'
                          : 'bg-[#f4f6f8] text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#e2e6eb]'
                      }`}
                      title={
                        proj.isHighlight
                          ? 'Highlighted (Appears in Track Record at mainpage). Click to remove.'
                          : 'Click to highlight and feature in Track Record carousel at mainpage.'
                      }
                    >
                      <Sparkles
                        className={`w-3.5 h-3.5 ${
                          proj.isHighlight ? 'text-amber-900 fill-amber-900' : 'text-[#00356a]/50'
                        }`}
                      />
                      <span>{proj.isHighlight ? 'Highlighted' : 'Highlight'}</span>
                    </button>

                    <button
                      onClick={() => setQuickPhotoProject(proj)}
                      className="px-3.5 py-2 rounded-full bg-[#006e21]/10 hover:bg-[#006e21]/20 text-[#006e21] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-bubble-sm"
                      title="Manage cover and all gallery photos"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Photos ({proj.gallery?.length || 0})</span>
                    </button>
                    {onPreviewProject && (
                      <button
                        onClick={() => onPreviewProject(proj)}
                        className="px-3.5 py-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-bubble-sm"
                        title="Preview project modal"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleEditProject(proj)}
                      className="px-4 py-2 rounded-full bg-[#00356a] text-white hover:bg-[#002244] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-bubble-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Dossier</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id, proj.title)}
                      className="p-2.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all cursor-pointer border border-rose-200"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: IMAGE & MEDIA UPLOADER */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Hidden input for single-click image replacement across projects and articles */}
            <input
              type="file"
              ref={replaceMediaInputRef}
              onChange={handleReplaceMediaFile}
              accept="image/*"
              className="hidden"
            />

            {/* Drag and drop upload bubble */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="bg-white rounded-3xl p-8 shadow-bubble border-2 border-dashed border-[#00356a]/20 hover:border-[#006e21] transition-all text-center flex flex-col items-center justify-center relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />

              <div className="w-16 h-16 rounded-full bg-[#f4f6f8] text-[#006e21] flex items-center justify-center mb-4 shadow-bubble-sm group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>

              <h3 className="text-base font-bold text-[#00356a]">
                Upload High-Resolution Engineering Photos & Vectors
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-1 max-w-md">
                Drag and drop image files here, or click to browse files from your computer. Supports PNG, JPG, SVG, and WebP formats.
              </p>

              <div className="mt-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <span className="text-[11px] font-semibold text-[#00356a]/60">Default Category:</span>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset"
                >
                  <option value="knowledge">Knowledge / Technical Articles</option>
                  <option value="projects">Projects & Construction Gallery</option>
                  <option value="general">General Architecture Assets</option>
                </select>
              </div>

              {isUploading && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#006e21]">
                  <div className="w-4 h-4 border-2 border-[#006e21] border-t-transparent rounded-full animate-spin" />
                  <span>Processing and optimizing image data...</span>
                </div>
              )}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-bubble-sm border border-[#e2e6eb] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00356a]/40" />
                <input
                  type="text"
                  placeholder="Search media assets..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setMediaCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    mediaCategoryFilter === 'all'
                      ? 'bg-[#00356a] text-white'
                      : 'bg-[#f4f6f8] text-[#00356a]/70 hover:text-[#00356a]'
                  }`}
                >
                  All ({mediaItems.length})
                </button>
                <button
                  onClick={() => setMediaCategoryFilter('knowledge')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    mediaCategoryFilter === 'knowledge'
                      ? 'bg-[#00356a] text-white'
                      : 'bg-[#f4f6f8] text-[#00356a]/70 hover:text-[#00356a]'
                  }`}
                >
                  Knowledge
                </button>
                <button
                  onClick={() => setMediaCategoryFilter('projects')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    mediaCategoryFilter === 'projects'
                      ? 'bg-[#00356a] text-white'
                      : 'bg-[#f4f6f8] text-[#00356a]/70 hover:text-[#00356a]'
                  }`}
                >
                  Projects
                </button>
              </div>
            </div>

            {/* Media Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedia.map((item) => {
                const isRecentlyUpdated = item.id === justUploadedMediaId;
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl p-4 shadow-bubble border flex flex-col justify-between group transition-all ${
                      isRecentlyUpdated ? 'border-[#006e21] ring-2 ring-[#006e21]/20' : 'border-[#e5e9ee] hover:border-[#00356a]/30'
                    }`}
                  >
                    <div>
                      <div
                        onClick={() => setPreviewMediaUrl(item.url)}
                        className="w-full aspect-video rounded-2xl bg-[#f4f6f8] overflow-hidden border border-[#e2e6eb] shadow-bubble-inset relative cursor-pointer group-hover:opacity-95"
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/90 text-[#00356a] backdrop-blur-xs">
                          {item.category || 'asset'}
                        </span>
                        {isRecentlyUpdated && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#006e21] text-white shadow-sm animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <h4 className="text-xs font-bold text-[#00356a] truncate" title={item.name}>
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-[#00356a]/60 mt-1">
                          <span>{item.size || 'Vector SVG'}</span>
                          <span>{item.uploadedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#e2e6eb] flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="flex-1 py-1.5 px-2 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer shadow-bubble-sm transition-all"
                        title="Copy URL path"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#006e21]" />
                            <span className="text-[#006e21] font-bold text-[10px]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>

                      {/* Replace Picture Button */}
                      <button
                        onClick={() => handleTriggerReplaceMedia(item.id)}
                        className="p-1.5 rounded-full bg-[#006e21]/10 text-[#006e21] hover:bg-[#006e21]/20 transition-all cursor-pointer border border-[#006e21]/30"
                        title="Replace this picture with a new file across all projects and articles"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      {/* Assign to Project or Article */}
                      <button
                        onClick={() => setSelectedMediaForAssign(item)}
                        className="p-1.5 rounded-full bg-[#00356a]/10 text-[#00356a] hover:bg-[#00356a]/20 transition-all cursor-pointer border border-[#00356a]/20"
                        title="Assign this photo to a project or article"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete image "${item.name}" from media library?`)) {
                            deleteMediaItem(item.id);
                            showToast('Image deleted from library');
                          }
                        }}
                        className="p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer border border-rose-200"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM STATUS & BACKUP */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee]">
                <div className="w-10 h-10 rounded-full bg-[#00356a]/10 text-[#00356a] flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-[#00356a]">{projects.length}</div>
                <div className="text-xs font-semibold text-[#00356a]/60 uppercase tracking-wider mt-1">
                  Active Project Dossiers
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee]">
                <div className="w-10 h-10 rounded-full bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-[#00356a]">{articles.length}</div>
                <div className="text-xs font-semibold text-[#00356a]/60 uppercase tracking-wider mt-1">
                  Knowledge Monographs
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee]">
                <div className="w-10 h-10 rounded-full bg-[#00356a]/10 text-[#00356a] flex items-center justify-center mb-3">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-[#00356a]">{mediaItems.length}</div>
                <div className="text-xs font-semibold text-[#00356a]/60 uppercase tracking-wider mt-1">
                  Media & Vector Assets
                </div>
              </div>
            </div>

            {/* Backups & Restore Card */}
            <div className="bg-white rounded-3xl p-8 shadow-bubble border border-[#e5e9ee] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider">
                    Engineering Data Persistence
                  </span>
                  <h3 className="text-xl font-extrabold text-[#00356a]">
                    Backup & Re-upload Restore Management
                  </h3>
                  <p className="text-xs text-[#00356a]/70 mt-1 max-w-2xl">
                    Export projects and knowledge monographs to JSON files for off-site backup, or re-upload previous backup archives to restore or merge project data anytime.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setBackupModalTab('restore');
                      setIsBackupModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#005a1b] flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Re-upload Backup</span>
                  </button>
                  <button
                    onClick={() => {
                      setBackupModalTab('download');
                      setIsBackupModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#002244] flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Backups</span>
                  </button>
                </div>
              </div>

              {/* Quick Action Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e2e6eb]">
                {/* Full Backup */}
                <div className="p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00356a]">
                      <Database className="w-4 h-4 text-[#00356a]" />
                      <span>Full Backup (All Data)</span>
                    </div>
                    <p className="text-[11px] text-[#00356a]/65 mt-1">
                      Includes all {projects.length} project dossiers and {articles.length} knowledge articles.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const data = exportBackupData('all');
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `hoki-full-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('Full system backup downloaded');
                    }}
                    className="mt-4 py-2 px-3 rounded-full bg-white border border-[#00356a] text-[#00356a] hover:bg-[#00356a] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-bubble-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All JSON</span>
                  </button>
                </div>

                {/* Projects Only */}
                <div className="p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00356a]">
                      <Building2 className="w-4 h-4 text-[#006e21]" />
                      <span>Projects Only Backup</span>
                    </div>
                    <p className="text-[11px] text-[#00356a]/65 mt-1">
                      Exports all {projects.length} project case studies, dosing parameters, and photo galleries.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const data = exportBackupData('projects');
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `hoki-projects-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('Projects backup downloaded');
                    }}
                    className="mt-4 py-2 px-3 rounded-full bg-white border border-[#006e21] text-[#006e21] hover:bg-[#006e21] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-bubble-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Projects JSON</span>
                  </button>
                </div>

                {/* Knowledge Only */}
                <div className="p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00356a]">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <span>Knowledge Only Backup</span>
                    </div>
                    <p className="text-[11px] text-[#00356a]/65 mt-1">
                      Exports all {articles.length} research papers, crack control guides, and monographs.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const data = exportBackupData('knowledge');
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `hoki-knowledge-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('Knowledge monographs backup downloaded');
                    }}
                    className="mt-4 py-2 px-3 rounded-full bg-white border border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-bubble-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Knowledge JSON</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone: Factory Reset */}
              <div className="pt-4 border-t border-[#e2e6eb] flex items-center justify-between">
                <span className="text-xs text-[#00356a]/60">
                  Need to restore original default seed data?
                </span>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-5 py-2 rounded-full bg-white border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Defaults</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BRANDING - LOGO & FAVICON & HERO BACKGROUND */}
        {activeTab === 'branding' && (
          <AdminBrandingSection onShowToast={showToast} />
        )}

        {/* TAB 6: EPC PARTNERS (MAIN PAGE) */}
        {activeTab === 'epc' && (
          <AdminEpcSection onShowToast={showToast} />
        )}

        {/* TAB 7: ABOUT US PAGE CONTENT */}
        {activeTab === 'about' && (
          <AdminAboutSection onShowToast={showToast} />
        )}

        {/* TAB 8: MAIN PAGE YOUTUBE VIDEO */}
        {activeTab === 'video' && (
          <AdminYouTubeSection onShowToast={showToast} onNavigateToHome={() => onNavigate('home')} />
        )}

        {/* TAB 9: HOTLINE & SOCIAL MEDIA CHANNELS */}
        {activeTab === 'hotline' && (
          <AdminHotlineSocialSection onShowToast={showToast} />
        )}
      </div>

      {/* ARTICLE EDIT / CREATE MODAL */}
      {isEditingArticle && currentArticle && (
        <div className="fixed inset-0 z-50 bg-[#00356a]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-3xl w-full shadow-bubble-lg border border-[#e2e6eb] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e6eb] mb-6">
              <div>
                <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider">
                  Knowledge Article Editor
                </span>
                <h2 className="text-xl font-bold text-[#00356a]">
                  {articles.some((a) => a.id === currentArticle.id) ? 'Edit Monograph' : 'Create New Monograph'}
                </h2>
              </div>
              <button
                onClick={() => setIsEditingArticle(false)}
                className="p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-all cursor-pointer shadow-bubble-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    value={currentArticle.title}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Subtitle / Summary Header
                  </label>
                  <input
                    type="text"
                    required
                    value={currentArticle.subtitle}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={currentArticle.category}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                    placeholder="e.g. CRACK CONTROL MECHANICS"
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Category Filter
                  </label>
                  <select
                    value={currentArticle.categorySlug}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, categorySlug: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  >
                    <option value="crack-control">Crack Control</option>
                    <option value="jointless">Jointless Slabs</option>
                    <option value="field-dosing">Field Dosing</option>
                    <option value="sustainability">Sustainability & LCA</option>
                    <option value="standards">Design Standards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Author & Credentials
                  </label>
                  <input
                    type="text"
                    required
                    value={currentArticle.author}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Governing Standards Code
                  </label>
                  <input
                    type="text"
                    required
                    value={currentArticle.standards}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, standards: e.target.value })}
                    placeholder="e.g. ASTM C1579 / EN 14889-1"
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={currentArticle.date}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={currentArticle.readTime}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, readTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                {/* Article Cover Image & Visual Suite */}
                <div className="sm:col-span-2 p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] space-y-4">
                  {/* Hidden input for direct cover upload */}
                  <input
                    type="file"
                    ref={articleCoverInputRef}
                    onChange={handleArticleCoverDirectUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {/* Hidden input for batch figures upload */}
                  <input
                    type="file"
                    ref={articleBatchInputRef}
                    onChange={handleArticleBatchDirectUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-[#00356a]">
                        Article Primary Cover Photo
                      </label>
                      <p className="text-[11px] text-[#00356a]/60">Displayed on the Knowledge card and header.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => articleCoverInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-full bg-[#006e21] text-white text-[11px] font-bold shadow-bubble-sm hover:bg-[#005a1b] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload New Cover</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickerContext({ type: 'article-cover' })}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#dce0e6] text-[#00356a] text-[11px] font-semibold hover:border-[#00356a] shadow-bubble-sm flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Pick Library</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-white border border-[#dce0e6] shrink-0 shadow-bubble-inset">
                      <img
                        src={currentArticle.image || '/images/applications/app-industrial-flooring.svg'}
                        alt="Article Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      value={currentArticle.image || ''}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, image: e.target.value })}
                      placeholder="Image URL path (e.g. /images/... or data:...)"
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs text-[#00356a] bg-white border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                    />
                  </div>

                  {/* Technical Figures & Micrographs Suite */}
                  <div className="pt-3 border-t border-[#e2e6eb]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#006e21]" />
                          <span>Technical Figures & Micrographs ({currentArticle.gallery?.length || 0})</span>
                        </h4>
                        <p className="text-[10px] text-[#00356a]/60">Embed multiple scientific figures, micrographs, and load-deflection plots.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => articleBatchInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-full bg-[#006e21]/15 text-[#006e21] text-[11px] font-bold hover:bg-[#006e21]/25 flex items-center gap-1 cursor-pointer shadow-bubble-sm"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Batch Upload</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPickerContext({ type: 'article-gallery-add' })}
                          className="px-3 py-1.5 rounded-full bg-white border border-[#dce0e6] text-[#00356a] text-[11px] font-semibold hover:border-[#00356a] flex items-center gap-1 cursor-pointer shadow-bubble-sm"
                        >
                          <Plus className="w-3 h-3 text-[#006e21]" />
                          <span>Add from Library</span>
                        </button>
                      </div>
                    </div>

                    {(!currentArticle.gallery || currentArticle.gallery.length === 0) ? (
                      <div className="p-4 rounded-xl bg-white border border-dashed border-[#dce0e6] text-center">
                        <p className="text-xs text-[#00356a]/60">No technical figures attached to this monograph.</p>
                        <button
                          type="button"
                          onClick={() => articleBatchInputRef.current?.click()}
                          className="mt-2 text-xs font-bold text-[#006e21] hover:underline inline-flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" /> Upload technical diagrams or plots
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {currentArticle.gallery.map((fig, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-xl p-2.5 border border-[#e2e6eb] shadow-bubble-sm flex flex-col sm:flex-row items-start sm:items-center gap-3"
                          >
                            <div className="w-16 h-12 rounded-lg bg-[#f4f6f8] overflow-hidden shrink-0 border border-[#dce0e6]">
                              <img src={fig.url} alt={fig.title || 'Figure'} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                              <input
                                type="text"
                                placeholder={`Figure ${idx + 1} Title`}
                                value={fig.title || ''}
                                onChange={(e) => {
                                  const g = [...(currentArticle.gallery || [])];
                                  g[idx] = { ...g[idx], title: e.target.value };
                                  setCurrentArticle({ ...currentArticle, gallery: g });
                                }}
                                className="px-2.5 py-1 text-xs rounded-lg bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a] font-semibold"
                              />
                              <input
                                type="text"
                                placeholder="Caption / description"
                                value={fig.caption || ''}
                                onChange={(e) => {
                                  const g = [...(currentArticle.gallery || [])];
                                  g[idx] = { ...g[idx], caption: e.target.value };
                                  setCurrentArticle({ ...currentArticle, gallery: g });
                                }}
                                className="px-2.5 py-1 text-xs rounded-lg bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => setPickerContext({ type: 'article-gallery-item', index: idx })}
                                className="p-1 rounded bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-[10px] font-bold px-2 py-1"
                                title="Replace picture"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  // Set this figure as the main cover
                                  setCurrentArticle({ ...currentArticle, image: fig.url });
                                  showToast(`Set as primary article cover!`);
                                }}
                                className="p-1 rounded bg-[#006e21]/10 text-[#006e21] text-[10px] font-bold px-2 py-1"
                                title="Make this figure the article cover"
                              >
                                Set Cover
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const g = (currentArticle.gallery || []).filter((_, i) => i !== idx);
                                  setCurrentArticle({ ...currentArticle, gallery: g });
                                }}
                                className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                title="Delete figure"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Executive Summary / Content Snippet
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={currentArticle.contentSnippet}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, contentSnippet: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                {/* Section Paragraphs */}
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase text-[#00356a]">
                      Detailed Paragraphs & Sections ({articleSections.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => setArticleSections([...articleSections, `${articleSections.length + 1}. New Engineering Section Title: Detail your technical monograph explanation here.`])}
                      className="text-xs font-bold text-[#006e21] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  {articleSections.map((sec, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-[#00356a]/40 pt-2 shrink-0">#{idx + 1}</span>
                      <textarea
                        rows={2}
                        value={sec}
                        onChange={(e) => {
                          const updated = [...articleSections];
                          updated[idx] = e.target.value;
                          setArticleSections(updated);
                        }}
                        className="flex-1 px-4 py-2 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setArticleSections(articleSections.filter((_, i) => i !== idx))}
                        className="p-2 text-rose-500 hover:text-rose-700 cursor-pointer pt-2"
                        title="Remove section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#00356a]">
                    <input
                      type="checkbox"
                      checked={currentArticle.isFlagship || false}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, isFlagship: e.target.checked })}
                      className="rounded text-[#006e21] focus:ring-[#006e21]"
                    />
                    <span>Highlight as Flagship Monograph (Featured on Knowledge Page)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e2e6eb]">
                <button
                  type="button"
                  onClick={() => setIsEditingArticle(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#00356a] hover:bg-[#f4f6f8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#005a1b] hover:shadow-bubble flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT EDIT / CREATE MODAL */}
      {isEditingProject && currentProject && (
        <div className="fixed inset-0 z-50 bg-[#00356a]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-3xl w-full shadow-bubble-lg border border-[#e2e6eb] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e6eb] mb-6">
              <div>
                <span className="text-[10px] font-bold text-[#00356a] uppercase tracking-wider">
                  Project Dossier Editor
                </span>
                <h2 className="text-xl font-bold text-[#00356a]">
                  {projects.some((p) => p.id === currentProject.id) ? 'Edit Case Study' : 'Create New Project'}
                </h2>
              </div>
              <button
                onClick={() => setIsEditingProject(false)}
                className="p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-all cursor-pointer shadow-bubble-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Track Record Highlight Switch */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-200/90 text-amber-900 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 fill-amber-700 text-amber-700" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#00356a] flex items-center gap-1.5">
                        Feature in Mainpage Track Record Carousel
                      </span>
                      <p className="text-[11px] text-[#00356a]/70 mt-0.5">
                        When enabled, this project will appear in the prominent Track Record section on the main landing page.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={!!currentProject.isHighlight}
                      onChange={(e) => setCurrentProject({ ...currentProject, isHighlight: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#dce0e6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#dce0e6] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    <span className="ml-2.5 text-xs font-bold text-[#00356a]">
                      {currentProject.isHighlight ? 'Highlighted' : 'Standard'}
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Project Code
                  </label>
                  <input
                    type="text"
                    required
                    value={currentProject.code}
                    onChange={(e) => setCurrentProject({ ...currentProject, code: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Facility Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={currentProject.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      // If slug was empty or matched previous title, auto-sync or let user edit
                      setCurrentProject({
                        ...currentProject,
                        title: newTitle,
                        slug: currentProject.slug || slugify(newTitle)
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                {/* DYNAMIC URL SLUG CONTROL */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-white border border-[#dce0e6] shadow-bubble-sm space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#00356a] flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-[#006e21]" />
                        <span>Dedicated Project URL Slug</span>
                      </label>
                      <p className="text-[11px] text-[#00356a]/60">
                        Custom SEO-friendly URL path for this project's dedicated page.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const generated = slugify(currentProject.title);
                        setCurrentProject({ ...currentProject, slug: generated });
                        showToast(`Slug generated from title: ${generated}`);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-[11px] font-bold shadow-bubble-sm flex items-center gap-1 cursor-pointer transition-all self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3 h-3 text-[#006e21]" />
                      <span>Auto-Generate from Title</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#00356a]/50 bg-[#f4f6f8] px-3 py-2.5 rounded-xl border border-[#dce0e6] shrink-0 font-mono">
                      /projects/
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. geely-auto-mega-hub"
                      value={currentProject.slug || ''}
                      onChange={(e) => {
                        // Allow typing, strip invalid characters on blur or input
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
                        setCurrentProject({ ...currentProject, slug: val });
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#00356a]/60 pt-1">
                    <span>
                      Live URL: <strong className="text-[#006e21] font-mono">/projects/{currentProject.slug || slugify(currentProject.title)}</strong>
                    </span>
                    <span className="text-[10px] text-[#006e21] font-semibold">
                      ✓ Direct navigation enabled (no popup modals)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Facility Type Description
                  </label>
                  <input
                    type="text"
                    required
                    value={currentProject.facilityType}
                    onChange={(e) => setCurrentProject({ ...currentProject, facilityType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Sector Classification
                  </label>
                  <select
                    value={currentProject.sector}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      const labels: Record<string, string> = {
                        industrial: 'Industrial Floors',
                        logistics: 'Warehouses & Logistics',
                        hardstands: 'Parking & Hardstands',
                        parking: 'Parking & Hardstands',
                        precast: 'Precast Concrete',
                        tunnels: 'Tunnels & Underground',
                        tunneling: 'Tunnels & Underground'
                      };
                      setCurrentProject({
                        ...currentProject,
                        sector: val,
                        sectorLabel: labels[val] || 'Industrial Floors'
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  >
                    <option value="industrial">Industrial Floors</option>
                    <option value="logistics">Warehouses & Logistics</option>
                    <option value="hardstands">Parking & Hardstands</option>
                    <option value="precast">Precast Concrete</option>
                    <option value="tunneling">Tunnels & Underground</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Geographic Location
                  </label>
                  <input
                    type="text"
                    required
                    value={currentProject.location}
                    onChange={(e) => setCurrentProject({ ...currentProject, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Slab Area (e.g. 200,000 m²)
                  </label>
                  <input
                    type="text"
                    required
                    value={currentProject.area}
                    onChange={(e) => setCurrentProject({ ...currentProject, area: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                {/* Project Cover & Gallery Management Suite */}
                <div className="sm:col-span-2 p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] space-y-4">
                  {/* Hidden inputs for direct cover and batch uploads */}
                  <input
                    type="file"
                    ref={projectCoverInputRef}
                    onChange={handleProjectCoverDirectUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={projectBatchInputRef}
                    onChange={handleProjectBatchDirectUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-[#00356a]">
                        Primary Case Study Cover Photo
                      </label>
                      <p className="text-[11px] text-[#00356a]/60">Hero visual for the project card and dossier carousel.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => projectCoverInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-full bg-[#006e21] text-white text-[11px] font-bold shadow-bubble-sm hover:bg-[#005a1b] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload New Cover</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickerContext({ type: 'project-cover' })}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#dce0e6] text-[#00356a] text-[11px] font-semibold hover:border-[#00356a] shadow-bubble-sm flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Pick Library</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-white border border-[#dce0e6] shrink-0 shadow-bubble-inset">
                      <img
                        src={currentProject.image || '/images/projects/project-geely.svg'}
                        alt="Project Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      value={currentProject.image}
                      onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
                      placeholder="Image URL path"
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs text-[#00356a] bg-white border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                    />
                  </div>

                  {/* Construction Phases & Multi-Photo Carousel Gallery */}
                  <div className="pt-3 border-t border-[#e2e6eb]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#006e21]" />
                          <span>Construction Phases & Gallery Photos ({currentProject.gallery?.length || 0})</span>
                        </h4>
                        <p className="text-[10px] text-[#00356a]/60">Field photos rendered in the public Case Study interactive carousel.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => projectBatchInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-full bg-[#006e21]/15 text-[#006e21] text-[11px] font-bold hover:bg-[#006e21]/25 flex items-center gap-1 cursor-pointer shadow-bubble-sm"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Batch Upload</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPickerContext({ type: 'project-gallery-add' })}
                          className="px-3 py-1.5 rounded-full bg-white border border-[#dce0e6] text-[#00356a] text-[11px] font-semibold hover:border-[#00356a] flex items-center gap-1 cursor-pointer shadow-bubble-sm"
                        >
                          <Plus className="w-3 h-3 text-[#006e21]" />
                          <span>Add from Library</span>
                        </button>
                      </div>
                    </div>

                    {(!currentProject.gallery || currentProject.gallery.length === 0) ? (
                      <div className="p-4 rounded-xl bg-white border border-dashed border-[#dce0e6] text-center">
                        <p className="text-xs text-[#00356a]/60">No additional gallery photos attached to this project.</p>
                        <button
                          type="button"
                          onClick={() => projectBatchInputRef.current?.click()}
                          className="mt-2 text-xs font-bold text-[#006e21] hover:underline inline-flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" /> Upload site inspection photos
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {currentProject.gallery.map((photo, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-xl p-2.5 border border-[#e2e6eb] shadow-bubble-sm flex flex-col sm:flex-row items-start sm:items-center gap-3"
                          >
                            <div className="w-16 h-12 rounded-lg bg-[#f4f6f8] overflow-hidden shrink-0 border border-[#dce0e6]">
                              <img src={photo.url} alt={photo.title || 'Phase'} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                              <input
                                type="text"
                                placeholder="Phase Tag (e.g. 01 EXCAVATION)"
                                value={photo.phaseTag || ''}
                                onChange={(e) => {
                                  const g = [...(currentProject.gallery || [])];
                                  g[idx] = { ...g[idx], phaseTag: e.target.value };
                                  setCurrentProject({ ...currentProject, gallery: g });
                                }}
                                className="px-2.5 py-1 text-xs rounded-lg bg-[#f4f6f8] border border-[#dce0e6] text-[#006e21] font-bold"
                              />
                              <input
                                type="text"
                                placeholder="Phase Title"
                                value={photo.title || ''}
                                onChange={(e) => {
                                  const g = [...(currentProject.gallery || [])];
                                  g[idx] = { ...g[idx], title: e.target.value };
                                  setCurrentProject({ ...currentProject, gallery: g });
                                }}
                                className="px-2.5 py-1 text-xs rounded-lg bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a] font-semibold"
                              />
                              <input
                                type="text"
                                placeholder="Caption / description"
                                value={photo.caption || ''}
                                onChange={(e) => {
                                  const g = [...(currentProject.gallery || [])];
                                  g[idx] = { ...g[idx], caption: e.target.value };
                                  setCurrentProject({ ...currentProject, gallery: g });
                                }}
                                className="px-2.5 py-1 text-xs rounded-lg bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => setPickerContext({ type: 'project-gallery-item', index: idx })}
                                className="p-1 rounded bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-[10px] font-bold px-2 py-1"
                                title="Replace picture"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentProject({ ...currentProject, image: photo.url });
                                  showToast(`Set as primary project cover!`);
                                }}
                                className="p-1 rounded bg-[#006e21]/10 text-[#006e21] text-[10px] font-bold px-2 py-1"
                                title="Make this photo the project cover"
                              >
                                Set Cover
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const g = (currentProject.gallery || []).filter((_, i) => i !== idx);
                                  setCurrentProject({ ...currentProject, gallery: g });
                                }}
                                className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                title="Delete photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Project Overview Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={currentProject.description}
                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Structural Challenge
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={currentProject.challenge}
                    onChange={(e) => setCurrentProject({ ...currentProject, challenge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Engineered Solution
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={currentProject.solution}
                    onChange={(e) => setCurrentProject({ ...currentProject, solution: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Quality Verification & Standards
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={currentProject.verification}
                    onChange={(e) => setCurrentProject({ ...currentProject, verification: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>

                {/* Technical Specifications */}
                <div className="sm:col-span-2 pt-2 border-t border-[#e2e6eb]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#00356a] mb-3">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#00356a]/70 mb-1">Fiber Series</label>
                      <input
                        type="text"
                        value={currentProject.specifications.fiberSeries}
                        onChange={(e) =>
                          setCurrentProject({
                            ...currentProject,
                            specifications: { ...currentProject.specifications, fiberSeries: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#00356a]/70 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={currentProject.specifications.dosage}
                        onChange={(e) =>
                          setCurrentProject({
                            ...currentProject,
                            specifications: { ...currentProject.specifications, dosage: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#00356a]/70 mb-1">Concrete Grade</label>
                      <input
                        type="text"
                        value={currentProject.specifications.concreteGrade}
                        onChange={(e) =>
                          setCurrentProject({
                            ...currentProject,
                            specifications: { ...currentProject.specifications, concreteGrade: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#00356a]/70 mb-1">Joint Spacing</label>
                      <input
                        type="text"
                        value={currentProject.specifications.jointSpacing}
                        onChange={(e) =>
                          setCurrentProject({
                            ...currentProject,
                            specifications: { ...currentProject.specifications, jointSpacing: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="sm:col-span-2 pt-2 border-t border-[#e2e6eb]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#00356a]">
                      Key Project Telemetry & Metrics
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentProject({
                          ...currentProject,
                          metrics: [...(currentProject.metrics || []), { label: 'New Metric', value: '100 Unit', isHighlight: false }]
                        })
                      }
                      className="text-xs font-bold text-[#006e21] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Metric
                    </button>
                  </div>

                  <div className="space-y-2">
                    {currentProject.metrics?.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Label (e.g. Schedule Accelerated)"
                          value={m.label}
                          onChange={(e) => {
                            const updated = [...(currentProject.metrics || [])];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setCurrentProject({ ...currentProject, metrics: updated });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-[#f4f6f8] border border-[#dce0e6]"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 35 Days)"
                          value={m.value}
                          onChange={(e) => {
                            const updated = [...(currentProject.metrics || [])];
                            updated[idx] = { ...updated[idx], value: e.target.value };
                            setCurrentProject({ ...currentProject, metrics: updated });
                          }}
                          className="w-32 px-3 py-1.5 rounded-lg text-xs bg-[#f4f6f8] border border-[#dce0e6]"
                        />
                        <label className="flex items-center gap-1 text-[11px] font-semibold text-[#00356a]/80">
                          <input
                            type="checkbox"
                            checked={m.isHighlight || false}
                            onChange={(e) => {
                              const updated = [...(currentProject.metrics || [])];
                              updated[idx] = { ...updated[idx], isHighlight: e.target.checked };
                              setCurrentProject({ ...currentProject, metrics: updated });
                            }}
                          />
                          <span>Highlight</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (currentProject.metrics || []).filter((_, i) => i !== idx);
                            setCurrentProject({ ...currentProject, metrics: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Quote */}
                <div className="sm:col-span-2 pt-2 border-t border-[#e2e6eb]">
                  <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1">
                    Client Testimonial Quote
                  </label>
                  <textarea
                    rows={2}
                    value={currentProject.clientQuote || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, clientQuote: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                  <div className="mt-2">
                    <label className="block text-[10px] font-semibold text-[#00356a]/70 mb-1">Quote Author & Title</label>
                    <input
                      type="text"
                      value={currentProject.quoteAuthor || ''}
                      onChange={(e) => setCurrentProject({ ...currentProject, quoteAuthor: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e2e6eb]">
                <button
                  type="button"
                  onClick={() => setIsEditingProject(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#00356a] hover:bg-[#f4f6f8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#002244] hover:shadow-bubble flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project Dossier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLEXIBLE MEDIA SELECTOR & UPLOADER MODAL */}
      {pickerContext && (
        <ImagePickerModal
          isOpen={true}
          onClose={() => setPickerContext(null)}
          title={
            pickerContext.type.includes('cover')
              ? 'Select or Upload Cover Photo'
              : 'Select or Upload Gallery Photo'
          }
          defaultCategory={
            pickerContext.type.includes('project') || pickerContext.type.includes('cover') || pickerContext.type.includes('gallery')
              ? 'projects'
              : pickerContext.type.includes('article')
              ? 'knowledge'
              : 'all'
          }
          onSelectImage={(imageUrl, mediaItem) => {
            const item: MediaItem = mediaItem || {
              id: `picker-${Date.now()}`,
              name: 'Selected Image',
              url: imageUrl,
              size: 'Auto',
              uploadedAt: 'Recent',
              category: 'general'
            };
            applyMediaItemToTarget(item, pickerContext);
            setPickerContext(null);
            showToast(`Image applied successfully`);
          }}
        />
      )}

      {/* QUICK ASSIGN MEDIA MODAL */}
      {selectedMediaForAssign && (
        <div className="fixed inset-0 z-50 bg-[#00356a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-bubble-lg border border-[#e2e6eb] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e6eb] mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider">Fast Assignment</span>
                <h3 className="text-base font-bold text-[#00356a]">Assign Picture to Project or Article</h3>
              </div>
              <button
                onClick={() => setSelectedMediaForAssign(null)}
                className="p-1.5 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#f4f6f8] rounded-2xl mb-4">
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-[#dce0e6]">
                <img src={selectedMediaForAssign.url} alt="To assign" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#00356a] truncate">{selectedMediaForAssign.name}</h4>
                <p className="text-[10px] text-[#00356a]/60 mt-0.5">Select a destination below to set this as primary cover.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1.5">
                  Set as Cover of Project Case Study:
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto border border-[#e2e6eb] rounded-xl p-2 bg-[#f4f6f8]">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        updateProject(p.id, { image: selectedMediaForAssign.url });
                        setSelectedMediaForAssign(null);
                        showToast(`Set as cover photo for project "${p.title}"!`);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white hover:bg-[#006e21]/10 hover:text-[#006e21] text-xs font-semibold text-[#00356a] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="truncate">{p.code} — {p.title}</span>
                      <span className="text-[10px] text-[#006e21] shrink-0 font-bold">Set Cover</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#00356a] mb-1.5">
                  Set as Cover of Knowledge Article:
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto border border-[#e2e6eb] rounded-xl p-2 bg-[#f4f6f8]">
                  {articles.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        updateArticle(a.id, { image: selectedMediaForAssign.url });
                        setSelectedMediaForAssign(null);
                        showToast(`Set as cover photo for article "${a.title}"!`);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white hover:bg-[#006e21]/10 hover:text-[#006e21] text-xs font-semibold text-[#00356a] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="truncate">{a.title}</span>
                      <span className="text-[10px] text-[#006e21] shrink-0 font-bold">Set Cover</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#e2e6eb] flex justify-end">
              <button
                onClick={() => setSelectedMediaForAssign(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#00356a] hover:bg-[#f4f6f8] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PHOTO MANAGER MODAL (Projects) */}
      {quickPhotoProject && (
        <QuickPhotoManagerModal
          project={quickPhotoProject}
          onClose={() => setQuickPhotoProject(null)}
          onSave={(updated) => {
            updateProject(updated.id, updated);
            showToast(`Photo gallery updated for "${updated.title}"`);
          }}
        />
      )}

      {/* QUICK ARTICLE PHOTO MANAGER MODAL (Knowledge) */}
      {quickPhotoArticle && (
        <QuickArticlePhotoManagerModal
          article={quickPhotoArticle}
          onClose={() => setQuickPhotoArticle(null)}
          onSave={(updated) => {
            updateArticle(updated.id, updated);
            showToast(`Visual figures updated for "${updated.title}"`);
          }}
        />
      )}

      {/* FULL IMAGE PREVIEW MODAL */}
      {previewMediaUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewMediaUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] bg-white rounded-3xl p-3 shadow-bubble-lg border border-white/20" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewMediaUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={previewMediaUrl} alt="Preview" className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain mx-auto" />
          </div>
        </div>
      )}

      {/* BACKUP & RE-UPLOAD RESTORE MODAL */}
      <AdminBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onShowToast={showToast}
        defaultSubTab={backupModalTab}
      />

      {/* RESET CONFIRMATION SAFEGUARD MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-[#00356a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-bubble border border-[#e2e6eb]">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#00356a]">Reset to Factory Defaults?</h3>
            <p className="text-xs text-[#00356a]/70 leading-relaxed mt-2">
              This will restore all project case studies, knowledge monographs, and default media assets back to their initial factory definitions. Any unsaved custom items will be replaced.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#00356a] hover:bg-[#f4f6f8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaults();
                  setShowResetConfirm(false);
                  showToast('System restored to original factory defaults');
                }}
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-rose-700 cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
