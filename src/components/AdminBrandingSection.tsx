import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { HokiLogo } from './HokiLogo';
import { MediaItem } from '../types';
import { LEADERSHIP_HEADS, ADVISORY_BOARD } from '../data/mockData';
import {
  Upload,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Sliders,
  ExternalLink,
  Globe,
  Layers,
  ArrowUpRight,
  Eye,
  Trash2,
  FolderOpen,
  Info,
  Check,
  User,
  Users,
  Factory,
  Camera,
  LayoutTemplate,
  Leaf,
  Video,
  Play,
  Phone
} from 'lucide-react';
import { AdminYouTubeSection } from './AdminYouTubeSection';
import { AdminHotlineSocialSection } from './AdminHotlineSocialSection';

interface AdminBrandingSectionProps {
  onShowToast: (msg: string) => void;
  onOpenMediaPicker?: (target: string) => void;
  initialSubTab?: 'hero' | 'video' | 'about' | 'logos' | 'hotline';
}

export const AdminBrandingSection: React.FC<AdminBrandingSectionProps> = ({
  onShowToast,
  initialSubTab = 'hero'
}) => {
  const { branding, updateBranding, resetBranding, uploadImageFile, mediaItems } = useData();

  // Active Sub-Tab: 'hero' | 'video' | 'about' | 'logos' | 'hotline'
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'video' | 'about' | 'logos' | 'hotline'>(initialSubTab);

  // Local URL input states
  const [headerInputUrl, setHeaderInputUrl] = useState(branding.headerLogoUrl || '');
  const [footerInputUrl, setFooterInputUrl] = useState(branding.footerLogoUrl || '');
  const [faviconInputUrl, setFaviconInputUrl] = useState(branding.faviconUrl || '/favicon.svg');
  const [heroInputUrl, setHeroInputUrl] = useState(branding.heroImageUrl || '/images/hoki-industrial-floor-hero.svg');
  const [aboutHeroInputUrl, setAboutHeroInputUrl] = useState(branding.aboutHeroImageUrl || '/images/hoki-greener-tomorrow-hero.svg');
  const [aboutFactoryInputUrl, setAboutFactoryInputUrl] = useState(branding.aboutFactoryImageUrl || '/images/factory-alpha-hub.svg');

  // Media picker modal state for local selection
  const [mediaPickerTarget, setMediaPickerTarget] = useState<string | null>(null);

  // Hidden file inputs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadTarget, setActiveUploadTarget] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // Favicon Preset SVGs
  const FAVICON_PRESETS = [
    {
      id: 'default-beetle',
      name: 'Default Beetle (Green/Navy)',
      url: '/favicon.svg',
      description: 'Official HOKI geometric structural beetle symbol on navy squircle.'
    },
    {
      id: 'green-monogram',
      name: 'Emerald Monogram',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="%23006e21"/><text x="64" y="90" font-family="Montserrat,sans-serif" font-size="76" font-weight="900" fill="white" text-anchor="middle">H</text></svg>',
      description: 'High-contrast sustainable tech emerald tile with bold white H.'
    },
    {
      id: 'navy-hexagon',
      name: 'Structural Navy Hexagon',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="%2300356a"/><polygon points="64,20 108,45 108,95 64,120 20,95 20,45" fill="none" stroke="%233eb542" stroke-width="12"/><circle cx="64" cy="70" r="18" fill="%233eb542"/></svg>',
      description: 'Precision engineering structural hexagon motif.'
    }
  ];

  // Hero Preset Images
  const HERO_PRESETS = [
    {
      id: 'preset-option-7',
      name: 'Option 7: Sustainable Industrial Floor & Green Wall (Uploaded Photo)',
      url: '/images/hoki-industrial-floor-hero.svg',
      badge: 'User Upload Selected',
      description: 'High-gloss polished concrete floor with laser screed finish, green architectural wall & HOKI branding.'
    },
    {
      id: 'preset-option-5',
      name: 'Option 5: Building a Greener Tomorrow',
      url: '/images/hoki-greener-tomorrow-hero.svg',
      badge: 'ESG Architecture',
      description: 'Modern logistics facility with sustainable concrete slab and emerald green environmental accent.'
    },
    {
      id: 'preset-construction',
      name: 'Industrial Laser Screed Pouring',
      url: '/images/hero-construction.svg',
      badge: 'Civil Placement',
      description: 'Active construction floor placement with steel trusses and automated laser screed machinery.'
    },
    {
      id: 'preset-alpha-hub',
      name: 'Alpha Hub Manufacturing Facility',
      url: '/images/factory-alpha-hub.svg',
      badge: 'Factory Metallurgy',
      description: 'Automated cold-drawing lines with optical quality control inspection sensors.'
    }
  ];

  // Trigger file selection for a specific target
  const triggerFileUpload = (target: string) => {
    setActiveUploadTarget(target);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle direct file uploads
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = activeUploadTarget;
    if (!file || !target) return;

    setIsUploading(target);
    try {
      const media = await uploadImageFile(file, 'general');
      applyImageToTarget(target, media.url);
      onShowToast(`Image uploaded & applied to ${target.replace(/_/g, ' ')}!`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to upload image file');
    } finally {
      setIsUploading(null);
      setActiveUploadTarget(null);
      if (e.target) e.target.value = '';
    }
  };

  // Apply image URL to the respective target in state
  const applyImageToTarget = (target: string, url: string) => {
    if (target === 'hero') {
      updateBranding({ heroImageUrl: url });
      setHeroInputUrl(url);
    } else if (target === 'aboutHero') {
      updateBranding({ aboutHeroImageUrl: url });
      setAboutHeroInputUrl(url);
    } else if (target === 'aboutFactory') {
      updateBranding({ aboutFactoryImageUrl: url });
      setAboutFactoryInputUrl(url);
    } else if (target === 'header') {
      updateBranding({ headerLogoUrl: url });
      setHeaderInputUrl(url);
    } else if (target === 'footer') {
      updateBranding({ footerLogoUrl: url });
      setFooterInputUrl(url);
    } else if (target === 'favicon') {
      updateBranding({ faviconUrl: url });
      setFaviconInputUrl(url);
    } else if (target.startsWith('leadership_')) {
      const name = target.replace('leadership_', '');
      const existing = branding.aboutLeadershipAvatars || {};
      updateBranding({
        aboutLeadershipAvatars: {
          ...existing,
          [name]: url
        }
      });
    } else if (target.startsWith('advisory_')) {
      const name = target.replace('advisory_', '');
      const existing = branding.aboutAdvisoryAvatars || {};
      updateBranding({
        aboutAdvisoryAvatars: {
          ...existing,
          [name]: url
        }
      });
    }
  };

  // Apply manual URL input
  const handleApplyUrl = (target: string) => {
    let url = '';
    if (target === 'hero') url = heroInputUrl.trim();
    else if (target === 'aboutHero') url = aboutHeroInputUrl.trim();
    else if (target === 'aboutFactory') url = aboutFactoryInputUrl.trim();
    else if (target === 'header') url = headerInputUrl.trim();
    else if (target === 'footer') url = footerInputUrl.trim();
    else if (target === 'favicon') url = faviconInputUrl.trim();

    if (!url) {
      onShowToast('Please enter an image URL');
      return;
    }
    applyImageToTarget(target, url);
    onShowToast(`Applied image to ${target}!`);
  };

  // Select from media library
  const handleSelectMediaItem = (item: MediaItem) => {
    if (!mediaPickerTarget) return;
    applyImageToTarget(mediaPickerTarget, item.url);
    onShowToast(`Selected "${item.name}" for ${mediaPickerTarget.replace(/_/g, ' ')}`);
    setMediaPickerTarget(null);
  };

  // Reset a specific picture to factory default
  const handleResetTarget = (target: string) => {
    if (target === 'hero') {
      const defaultUrl = '/images/hoki-industrial-floor-hero.svg';
      updateBranding({ heroImageUrl: defaultUrl, heroOverlayOpacity: 15 });
      setHeroInputUrl(defaultUrl);
      onShowToast('Hero picture reset to default!');
    } else if (target === 'aboutHero') {
      const defaultUrl = '/images/hoki-greener-tomorrow-hero.svg';
      updateBranding({ aboutHeroImageUrl: defaultUrl });
      setAboutHeroInputUrl(defaultUrl);
      onShowToast('About Us brand banner reset to default!');
    } else if (target === 'aboutFactory') {
      const defaultUrl = '/images/factory-alpha-hub.svg';
      updateBranding({ aboutFactoryImageUrl: defaultUrl });
      setAboutFactoryInputUrl(defaultUrl);
      onShowToast('Alpha Hub factory picture reset to default!');
    } else if (target === 'header') {
      updateBranding({ headerLogoUrl: '', headerLogoHeight: 44 });
      setHeaderInputUrl('');
      onShowToast('Header logo reset to default SVG lockup');
    } else if (target === 'footer') {
      updateBranding({ footerLogoUrl: '', footerLogoHeight: 56 });
      setFooterInputUrl('');
      onShowToast('Footer logo reset to default SVG lockup');
    } else if (target === 'favicon') {
      updateBranding({ faviconUrl: '/favicon.svg' });
      setFaviconInputUrl('/favicon.svg');
      onShowToast('Browser tab favicon reset to default');
    } else if (target.startsWith('leadership_')) {
      const name = target.replace('leadership_', '');
      const existing = { ...(branding.aboutLeadershipAvatars || {}) };
      delete existing[name];
      updateBranding({ aboutLeadershipAvatars: existing });
      onShowToast(`Reset avatar for ${name} to default!`);
    } else if (target.startsWith('advisory_')) {
      const name = target.replace('advisory_', '');
      const existing = { ...(branding.aboutAdvisoryAvatars || {}) };
      delete existing[name];
      updateBranding({ aboutAdvisoryAvatars: existing });
      onShowToast(`Reset avatar for ${name} to default!`);
    }
  };

  const currentHeroUrl = branding.heroImageUrl || '/images/hoki-industrial-floor-hero.svg';
  const currentHeroOpacity = branding.heroOverlayOpacity !== undefined ? branding.heroOverlayOpacity : 15;
  const currentAboutHeroUrl = branding.aboutHeroImageUrl || '/images/hoki-greener-tomorrow-hero.svg';
  const currentAboutFactoryUrl = branding.aboutFactoryImageUrl || '/images/factory-alpha-hub.svg';

  return (
    <div className="space-y-8 pb-12">
      {/* Hidden File Input for Image Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Section Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006e21]/10 text-[#006e21] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Site Imagery &amp; Visual Identity</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#00356a]">
            Hero Picture, About Us Pictures &amp; Brand Styling
          </h2>
          <p className="text-xs sm:text-sm text-[#00356a]/70 mt-1">
            Manage the main page hero picture (behind the box of text), all About Us facility and leadership photos, and vector corporate logos.
          </p>
        </div>

        <button
          onClick={() => {
            resetBranding();
            setHeaderInputUrl('');
            setFooterInputUrl('');
            setFaviconInputUrl('/favicon.svg');
            setHeroInputUrl('/images/hoki-industrial-floor-hero.svg');
            setAboutHeroInputUrl('/images/hoki-greener-tomorrow-hero.svg');
            setAboutFactoryInputUrl('/images/factory-alpha-hub.svg');
            onShowToast('All site branding and pictures reset to factory defaults!');
          }}
          className="px-4 py-2.5 rounded-full bg-white border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 shadow-bubble-sm flex items-center gap-2 cursor-pointer transition-all shrink-0 self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Defaults</span>
        </button>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="bg-[#f4f6f8] p-1.5 rounded-2xl border border-[#e2e6eb] flex flex-wrap items-center gap-2 shadow-bubble-sm">
        <button
          onClick={() => setActiveSubTab('hero')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'hero'
              ? 'bg-[#00356a] text-white shadow-bubble-sm'
              : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-white'
          }`}
        >
          <LayoutTemplate className="w-4 h-4 text-[#006e21]" />
          <span>Main Page Hero Picture</span>
          <span className="w-2 h-2 rounded-full bg-[#006e21]" />
        </button>

        <button
          onClick={() => setActiveSubTab('about')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'about'
              ? 'bg-[#00356a] text-white shadow-bubble-sm'
              : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-white'
          }`}
        >
          <Users className="w-4 h-4 text-[#006e21]" />
          <span>About Us Pictures (All)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">8 Photos</span>
        </button>

        <button
          onClick={() => setActiveSubTab('video')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'video'
              ? 'bg-[#00356a] text-white shadow-bubble-sm'
              : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-white'
          }`}
        >
          <Video className="w-4 h-4 text-red-500" />
          <span>Main Page YouTube Video</span>
          <span className="w-2 h-2 rounded-full bg-red-500" />
        </button>

        <button
          onClick={() => setActiveSubTab('logos')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'logos'
              ? 'bg-[#00356a] text-white shadow-bubble-sm'
              : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#006e21]" />
          <span>Logos &amp; Favicon</span>
        </button>

        <button
          id="admin-branding-subtab-hotline"
          onClick={() => setActiveSubTab('hotline')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'hotline'
              ? 'bg-[#00356a] text-white shadow-bubble-sm'
              : 'text-[#00356a]/70 hover:text-[#00356a] hover:bg-white'
          }`}
        >
          <Phone className="w-4 h-4 text-[#006e21]" />
          <span>Hotline &amp; Social Links</span>
          <span className="w-2 h-2 rounded-full bg-[#006e21]" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: MAIN PAGE HERO PICTURE (BEHIND THE BOX OF TEXT) */}
      {/* ========================================================================= */}
      {activeSubTab === 'hero' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Quick Jump: YouTube Video Player */}
          <div className="bg-gradient-to-r from-red-50/60 to-white rounded-3xl p-5 sm:p-6 shadow-bubble-sm border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-bubble-sm">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#00356a] flex items-center gap-2">
                  <span>Main Page YouTube Video</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-mono">
                    {branding.mainPageVideoChannelName || '@hokimetal'}
                  </span>
                </div>
                <p className="text-[11px] text-[#00356a]/70 mt-0.5 truncate max-w-xl font-mono">
                  {branding.mainPageYoutubeUrl || 'https://www.youtube.com/@hokimetal'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSubTab('video')}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Change Video Link</span>
            </button>
          </div>
          {/* Card: Hero Picture Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e2e6eb]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] block mb-1">
                  Homepage Visual Canvas
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#00356a] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#006e21]" />
                  <span>Main Page Hero Picture (Behind Box of Text)</span>
                </h3>
                <p className="text-xs text-[#00356a]/70 mt-1">
                  This high-impact image is rendered across the hero canvas directly behind the tactile frosted text box.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerFileUpload('hero')}
                  disabled={isUploading === 'hero'}
                  className="px-4 py-2 rounded-full bg-[#00356a] hover:bg-[#002244] text-white text-xs font-bold shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading === 'hero' ? 'Uploading...' : 'Upload Image File'}</span>
                </button>

                <button
                  onClick={() => setMediaPickerTarget('hero')}
                  className="px-4 py-2 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold border border-[#dce0e6] shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>From Media Library</span>
                </button>

                <button
                  onClick={() => handleResetTarget('hero')}
                  className="p-2 rounded-full bg-[#f4f6f8] hover:bg-rose-50 text-[#00356a] hover:text-rose-700 border border-[#dce0e6] shadow-bubble-sm cursor-pointer transition-all"
                  title="Reset Hero to Default"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LIVE SIMULATION PREVIEW: Behind Box of Text */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Live Hero Simulation (Picture Behind Frosted Box of Text)</span>
                </span>
                <span className="text-[11px] font-mono text-[#006e21] bg-[#006e21]/10 px-2.5 py-0.5 rounded-full font-bold">
                  Status: Live on Homepage
                </span>
              </div>

              <div className="rounded-3xl overflow-hidden border border-[#e2e6eb] shadow-bubble-lg relative min-h-[360px] sm:min-h-[420px] flex items-center justify-center p-4 sm:p-8">
                {/* Background Picture */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={currentHeroUrl}
                    alt="Current Hero Background"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Ambient Opacity Tint */}
                  <div
                    className="absolute inset-0 bg-[#00356a]"
                    style={{ opacity: currentHeroOpacity / 100 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-white/10 to-black/20 pointer-events-none" />
                </div>

                {/* Foreground Box of Text (Simulation) */}
                <div className="relative z-10 max-w-xl w-full bg-white/93 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/80 shadow-bubble text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e2e6eb] text-[#006e21] text-[10px] font-bold uppercase tracking-widest mb-3">
                    <Leaf className="w-3 h-3 text-[#006e21]" />
                    <span>HOKI — Innovative and Sustainable</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#00356a] leading-tight">
                    Engineered Systems for Stronger More Durable Concrete Floors
                  </h4>
                  <p className="mt-2 text-xs text-[#00356a]/80 font-medium">
                    Strength, Reliability, Solutions — Built to Perform.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="px-4 py-2 rounded-full bg-[#00356a] text-white text-[10px] font-bold uppercase tracking-wider">
                      Explore Products
                    </span>
                    <span className="px-4 py-2 rounded-full bg-[#006e21] text-white text-[10px] font-bold uppercase tracking-wider">
                      Talk to an Engineer
                    </span>
                  </div>
                </div>

                {/* Corner Status Pill */}
                <div className="absolute bottom-3 left-3 z-20 bg-black/70 text-white text-[10px] font-mono px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>BACKGROUND IMAGE BEHIND TEXT BOX</span>
                </div>
              </div>
            </div>

            {/* Overlay Contrast / Opacity Slider */}
            <div className="mb-8 p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#00356a] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Ambient Contrast Tint Opacity: {currentHeroOpacity}%</span>
                </label>
                <span className="text-[11px] text-[#00356a]/60">
                  Higher values increase text box contrast; lower values showcase picture clarity
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={currentHeroOpacity}
                onChange={(e) => updateBranding({ heroOverlayOpacity: Number(e.target.value) })}
                className="w-full accent-[#00356a] cursor-pointer"
              />
            </div>

            {/* Selectable Presets (Including the User's Uploaded Picture Option 7!) */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-[#00356a] mb-3 uppercase tracking-wider">
                Instant Hero Presets (Including Uploaded Options)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {HERO_PRESETS.map((preset) => {
                  const isSelected = currentHeroUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        applyImageToTarget('hero', preset.url);
                        onShowToast(`Activated preset: ${preset.name}`);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#006e21] bg-[#006e21]/5 shadow-bubble-sm ring-2 ring-[#006e21]/30'
                          : 'border-[#e2e6eb] bg-[#f4f6f8] hover:bg-white hover:border-[#00356a]'
                      }`}
                    >
                      <div>
                        <div className="h-28 rounded-xl overflow-hidden mb-2 relative border border-[#dce0e6] bg-slate-900">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 left-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00356a]/90 text-white backdrop-blur-sm">
                              {preset.badge}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-[#006e21] text-white p-1 rounded-full shadow">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-[#00356a] line-clamp-1">{preset.name}</h5>
                        <p className="text-[11px] text-[#00356a]/70 mt-1 leading-snug line-clamp-2">
                          {preset.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#e2e6eb] flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#006e21] uppercase">
                          {isSelected ? '✓ Active' : 'Select Preset'}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-[#00356a]/40" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input */}
            <div>
              <label className="block text-xs font-bold text-[#00356a] mb-2">
                Custom Hero Picture URL or Data URI
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={heroInputUrl}
                  onChange={(e) => setHeroInputUrl(e.target.value)}
                  placeholder="/images/hoki-industrial-floor-hero.svg or https://..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-[#f4f6f8] border border-[#e2e6eb] text-[#00356a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
                <button
                  onClick={() => handleApplyUrl('hero')}
                  className="px-5 py-2.5 rounded-xl bg-[#00356a] text-white text-xs font-bold shadow-bubble-sm hover:bg-[#002244] transition-all cursor-pointer whitespace-nowrap"
                >
                  Apply Hero URL
                </button>
              </div>
              <p className="text-[11px] text-[#00356a]/60">
                You can upload high-resolution photography directly, pick from your media gallery, or supply any hosted image URL.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ABOUT US PICTURES (ALL 8 PHOTOS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'about' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Section 1: Facility & Origin Banners */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb]">
            <div className="mb-6 pb-4 border-b border-[#e2e6eb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] block mb-1">
                Corporate &amp; Production Infrastructure
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#00356a] flex items-center gap-2">
                <Factory className="w-5 h-5 text-[#006e21]" />
                <span>Facility &amp; Brand Story Visuals</span>
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-1">
                Customize the Alpha Hub automated manufacturing facility photo and the About Us brand story hero banner.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Photo 1: Alpha Hub Factory */}
              <div className="p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#00356a] uppercase tracking-wider">
                      Alpha Hub Manufacturing Facility
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#006e21]/10 text-[#006e21] font-bold">
                      About Page Line 328
                    </span>
                  </div>

                  <div className="h-52 rounded-xl overflow-hidden mb-3 relative border border-[#dce0e6] shadow-bubble-sm">
                    <img
                      src={currentAboutFactoryUrl}
                      alt="Alpha Hub Production Line"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#00356a]/90 text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
                      HIGH-SPEED WIRE DRAWING LINE
                    </div>
                  </div>

                  <p className="text-xs text-[#00356a]/70 mb-3">
                    Shown in the Alpha Hub production section highlighting optical dimensional QA and automated packaging lines.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#e2e6eb]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerFileUpload('aboutFactory')}
                      disabled={isUploading === 'aboutFactory'}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#00356a] text-white text-xs font-bold hover:bg-[#002244] shadow-bubble-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading === 'aboutFactory' ? 'Uploading...' : 'Upload Photo'}</span>
                    </button>

                    <button
                      onClick={() => setMediaPickerTarget('aboutFactory')}
                      className="px-3 py-2 rounded-xl bg-white border border-[#dce0e6] text-[#00356a] text-xs font-bold hover:bg-[#f4f6f8] shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-[#006e21]" />
                      <span>Media</span>
                    </button>

                    <button
                      onClick={() => handleResetTarget('aboutFactory')}
                      className="p-2 rounded-xl bg-white border border-[#dce0e6] text-[#00356a] hover:text-rose-700 hover:bg-rose-50 shadow-bubble-sm cursor-pointer transition-all"
                      title="Reset to default"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={aboutFactoryInputUrl}
                      onChange={(e) => setAboutFactoryInputUrl(e.target.value)}
                      placeholder="/images/factory-alpha-hub.svg or URL"
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white border border-[#e2e6eb] text-[#00356a]"
                    />
                    <button
                      onClick={() => handleApplyUrl('aboutFactory')}
                      className="px-3 py-1.5 rounded-lg bg-[#00356a] text-white text-xs font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo 2: Brand Story Hero Banner */}
              <div className="p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#00356a] uppercase tracking-wider">
                      About Us Brand Story Hero Banner
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#006e21]/10 text-[#006e21] font-bold">
                      About Page Line 92
                    </span>
                  </div>

                  <div className="h-52 rounded-xl overflow-hidden mb-3 relative border border-[#dce0e6] shadow-bubble-sm">
                    <img
                      src={currentAboutHeroUrl}
                      alt="About Brand Banner"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#006e21]/90 text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
                      PIONEERING GREEN HORIZON
                    </div>
                  </div>

                  <p className="text-xs text-[#00356a]/70 mb-3">
                    Featured prominently under the origin thesis and sustainable concrete flooring mission quote in About Us.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#e2e6eb]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerFileUpload('aboutHero')}
                      disabled={isUploading === 'aboutHero'}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#00356a] text-white text-xs font-bold hover:bg-[#002244] shadow-bubble-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading === 'aboutHero' ? 'Uploading...' : 'Upload Banner'}</span>
                    </button>

                    <button
                      onClick={() => setMediaPickerTarget('aboutHero')}
                      className="px-3 py-2 rounded-xl bg-white border border-[#dce0e6] text-[#00356a] text-xs font-bold hover:bg-[#f4f6f8] shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-[#006e21]" />
                      <span>Media</span>
                    </button>

                    <button
                      onClick={() => handleResetTarget('aboutHero')}
                      className="p-2 rounded-xl bg-white border border-[#dce0e6] text-[#00356a] hover:text-rose-700 hover:bg-rose-50 shadow-bubble-sm cursor-pointer transition-all"
                      title="Reset to default"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={aboutHeroInputUrl}
                      onChange={(e) => setAboutHeroInputUrl(e.target.value)}
                      placeholder="/images/hoki-greener-tomorrow-hero.svg or URL"
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white border border-[#e2e6eb] text-[#00356a]"
                    />
                    <button
                      onClick={() => handleApplyUrl('aboutHero')}
                      className="px-3 py-1.5 rounded-lg bg-[#00356a] text-white text-xs font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Executive Leadership Avatars (All 3) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb]">
            <div className="mb-6 pb-4 border-b border-[#e2e6eb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] block mb-1">
                Executive Governance
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#00356a] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#006e21]" />
                <span>Leadership &amp; Department Heads Avatars (All 3)</span>
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-1">
                Update headshots and portrait photography for all department directors shown on the About Us page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LEADERSHIP_HEADS.map((head, idx) => {
                const targetKey = `leadership_${head.name}`;
                const avatarUrl = branding.aboutLeadershipAvatars?.[head.name] || head.avatar;
                const isCustom = !!branding.aboutLeadershipAvatars?.[head.name];

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#006e21]/40 shadow-bubble-sm relative shrink-0 bg-white">
                          <img
                            src={avatarUrl}
                            alt={head.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#006e21] block">
                            {head.department}
                          </span>
                          <h4 className="text-sm font-bold text-[#00356a]">{head.name}</h4>
                          <span className="text-[11px] text-[#00356a]/70 block">{head.title}</span>
                          {isCustom && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                              Custom Photo Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#e2e6eb] flex items-center gap-2">
                      <button
                        onClick={() => triggerFileUpload(targetKey)}
                        disabled={isUploading === targetKey}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#00356a] hover:bg-[#002244] text-white text-xs font-bold shadow-bubble-sm flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        <Camera className="w-3 h-3" />
                        <span>{isUploading === targetKey ? 'Uploading...' : 'Change Photo'}</span>
                      </button>

                      <button
                        onClick={() => setMediaPickerTarget(targetKey)}
                        className="px-2.5 py-2 rounded-xl bg-white border border-[#dce0e6] text-[#00356a] text-xs font-bold hover:bg-[#f4f6f8] shadow-bubble-sm cursor-pointer transition-all"
                        title="Pick from media library"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-[#006e21]" />
                      </button>

                      {isCustom && (
                        <button
                          onClick={() => handleResetTarget(targetKey)}
                          className="p-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 shadow-bubble-sm cursor-pointer transition-all"
                          title="Reset to default avatar"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Global Advisory Board Avatars (All 3) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb]">
            <div className="mb-6 pb-4 border-b border-[#e2e6eb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] block mb-1">
                Peer Review &amp; Academic Counsel
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#00356a] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#006e21]" />
                <span>Global Structural Advisory Board Avatars (All 3)</span>
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-1">
                Manage profile headshots for structural dynamics, life-cycle analysis, and materials science advisors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ADVISORY_BOARD.map((advisor, idx) => {
                const targetKey = `advisory_${advisor.name}`;
                const avatarUrl = branding.aboutAdvisoryAvatars?.[advisor.name] || advisor.avatar;
                const isCustom = !!branding.aboutAdvisoryAvatars?.[advisor.name];

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00356a]/30 shadow-bubble-sm relative shrink-0 bg-white">
                          <img
                            src={avatarUrl}
                            alt={advisor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#00356a]">{advisor.name}</h4>
                          <span className="text-[11px] font-semibold text-[#006e21] block">{advisor.role}</span>
                          <span className="text-[10px] text-[#00356a]/60 block">{advisor.specialization}</span>
                          {isCustom && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                              Custom Photo Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#e2e6eb] flex items-center gap-2">
                      <button
                        onClick={() => triggerFileUpload(targetKey)}
                        disabled={isUploading === targetKey}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#00356a] hover:bg-[#002244] text-white text-xs font-bold shadow-bubble-sm flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        <Camera className="w-3 h-3" />
                        <span>{isUploading === targetKey ? 'Uploading...' : 'Change Photo'}</span>
                      </button>

                      <button
                        onClick={() => setMediaPickerTarget(targetKey)}
                        className="px-2.5 py-2 rounded-xl bg-white border border-[#dce0e6] text-[#00356a] text-xs font-bold hover:bg-[#f4f6f8] shadow-bubble-sm cursor-pointer transition-all"
                        title="Pick from media library"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-[#006e21]" />
                      </button>

                      {isCustom && (
                        <button
                          onClick={() => handleResetTarget(targetKey)}
                          className="p-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 shadow-bubble-sm cursor-pointer transition-all"
                          title="Reset to default avatar"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: LOGOS & BROWSER FAVICON */}
      {/* ========================================================================= */}
      {activeSubTab === 'logos' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header & Footer Logo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Header Logo Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e2e6eb]">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] block">
                      Main Navigation Bar
                    </span>
                    <h3 className="text-lg font-bold text-[#00356a]">Header Brand Logo</h3>
                  </div>
                  {branding.headerLogoUrl ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Custom Image Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f4f6f8] text-[#00356a]/70 border border-[#e2e6eb]">
                      Default Vector SVG
                    </span>
                  )}
                </div>

                {/* Preview Box */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-[#00356a]/70 mb-2">
                    Live Header Preview:
                  </label>
                  <div className="h-28 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex items-center justify-center p-4 shadow-bubble-sm overflow-hidden">
                    <HokiLogo
                      variant="header"
                      customUrl={branding.headerLogoUrl}
                      height={branding.headerLogoHeight || 44}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#00356a] mb-1.5">
                      <span>Header Logo Height:</span>
                      <span className="font-mono text-[#006e21]">{branding.headerLogoHeight || 44}px</span>
                    </div>
                    <input
                      type="range"
                      min="24"
                      max="72"
                      value={branding.headerLogoHeight || 44}
                      onChange={(e) => updateBranding({ headerLogoHeight: Number(e.target.value) })}
                      className="w-full accent-[#00356a] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#00356a] mb-1.5">
                      Direct Image URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={headerInputUrl}
                        onChange={(e) => setHeaderInputUrl(e.target.value)}
                        placeholder="https://... or data:image/png..."
                        className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#e2e6eb] text-[#00356a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                      />
                      <button
                        onClick={() => handleApplyUrl('header')}
                        className="px-4 py-2 rounded-xl bg-[#00356a] text-white text-xs font-bold shadow-bubble-sm hover:bg-[#002244] transition-all cursor-pointer whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload & Reset Actions */}
              <div className="pt-6 mt-6 border-t border-[#e2e6eb] flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => triggerFileUpload('header')}
                  disabled={isUploading === 'header'}
                  className="flex-1 px-4 py-2.5 rounded-full bg-[#00356a] hover:bg-[#002244] text-white text-xs font-bold shadow-bubble-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading === 'header' ? 'Uploading...' : 'Upload Header Logo'}</span>
                </button>

                <button
                  onClick={() => setMediaPickerTarget('header')}
                  className="px-4 py-2.5 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold border border-[#dce0e6] shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Media</span>
                </button>

                {branding.headerLogoUrl && (
                  <button
                    onClick={() => handleResetTarget('header')}
                    className="p-2.5 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-bubble-sm cursor-pointer transition-all"
                    title="Reset to default vector logo"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Footer Logo Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e2e6eb]">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] block">
                      Corporate Footer Chrome
                    </span>
                    <h3 className="text-lg font-bold text-[#00356a]">Footer Brand Logo</h3>
                  </div>
                  {branding.footerLogoUrl ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Custom Image Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f4f6f8] text-[#00356a]/70 border border-[#e2e6eb]">
                      Default Vector SVG
                    </span>
                  )}
                </div>

                {/* Preview Box */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-[#00356a]/70 mb-2">
                    Live Footer Preview:
                  </label>
                  <div className="h-28 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex items-center justify-center p-4 shadow-bubble-sm overflow-hidden">
                    <HokiLogo
                      variant="footer"
                      customUrl={branding.footerLogoUrl}
                      height={branding.footerLogoHeight || 56}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#00356a] mb-1.5">
                      <span>Footer Logo Height:</span>
                      <span className="font-mono text-[#006e21]">{branding.footerLogoHeight || 56}px</span>
                    </div>
                    <input
                      type="range"
                      min="32"
                      max="96"
                      value={branding.footerLogoHeight || 56}
                      onChange={(e) => updateBranding({ footerLogoHeight: Number(e.target.value) })}
                      className="w-full accent-[#00356a] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#00356a] mb-1.5">
                      Direct Image URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={footerInputUrl}
                        onChange={(e) => setFooterInputUrl(e.target.value)}
                        placeholder="https://... or data:image/png..."
                        className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#e2e6eb] text-[#00356a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                      />
                      <button
                        onClick={() => handleApplyUrl('footer')}
                        className="px-4 py-2 rounded-xl bg-[#00356a] text-white text-xs font-bold shadow-bubble-sm hover:bg-[#002244] transition-all cursor-pointer whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload & Reset Actions */}
              <div className="pt-6 mt-6 border-t border-[#e2e6eb] flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => triggerFileUpload('footer')}
                  disabled={isUploading === 'footer'}
                  className="flex-1 px-4 py-2.5 rounded-full bg-[#00356a] hover:bg-[#002244] text-white text-xs font-bold shadow-bubble-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading === 'footer' ? 'Uploading...' : 'Upload Footer Logo'}</span>
                </button>

                <button
                  onClick={() => setMediaPickerTarget('footer')}
                  className="px-4 py-2.5 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold border border-[#dce0e6] shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Media</span>
                </button>

                {branding.footerLogoUrl && (
                  <button
                    onClick={() => handleResetTarget('footer')}
                    className="p-2.5 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-bubble-sm cursor-pointer transition-all"
                    title="Reset to default vector logo"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Browser Favicon Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e2e6eb]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] block mb-1">
                  Browser Tab Identity
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#00356a] flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#006e21]" />
                  <span>Browser Tab Favicon</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerFileUpload('favicon')}
                  disabled={isUploading === 'favicon'}
                  className="px-4 py-2 rounded-full bg-[#00356a] hover:bg-[#002244] text-white text-xs font-bold shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading === 'favicon' ? 'Uploading...' : 'Upload Favicon'}</span>
                </button>

                <button
                  onClick={() => handleResetTarget('favicon')}
                  className="p-2 rounded-full bg-[#f4f6f8] hover:bg-rose-50 text-[#00356a] hover:text-rose-700 border border-[#dce0e6] shadow-bubble-sm cursor-pointer transition-all"
                  title="Reset to default favicon"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Browser Tab Preview */}
            <div className="mb-6 p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
              <label className="block text-xs font-semibold text-[#00356a]/70 mb-2">
                Live Browser Tab Mockup:
              </label>
              <div className="max-w-md bg-[#e2e6eb] rounded-t-xl p-2 pb-0 flex items-center gap-2">
                <div className="bg-white rounded-t-lg px-3 py-1.5 flex items-center gap-2 shadow-xs border-t border-x border-[#dce0e6] max-w-xs">
                  <div className="w-4 h-4 rounded shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={branding.faviconUrl || '/favicon.svg'}
                      alt="Current Favicon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#00356a] truncate">
                    HOKI — Innovative &amp; Sustainable Steel Fiber
                  </span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {FAVICON_PRESETS.map((preset) => {
                const isSelected = branding.faviconUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      updateBranding({ faviconUrl: preset.url });
                      setFaviconInputUrl(preset.url);
                      onShowToast(`Applied ${preset.name} favicon!`);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-[#006e21] bg-[#006e21]/5 shadow-bubble-sm ring-2 ring-[#006e21]/20'
                        : 'border-[#e2e6eb] bg-[#f4f6f8] hover:bg-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#dce0e6] flex items-center justify-center shrink-0 p-1">
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-[#00356a] truncate">{preset.name}</h5>
                      <p className="text-[10px] text-[#00356a]/60 line-clamp-1">{preset.description}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#006e21] shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Direct Favicon URL */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={faviconInputUrl}
                onChange={(e) => setFaviconInputUrl(e.target.value)}
                placeholder="/favicon.svg or https://..."
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-[#f4f6f8] border border-[#e2e6eb] text-[#00356a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
              <button
                onClick={() => handleApplyUrl('favicon')}
                className="px-5 py-2.5 rounded-xl bg-[#00356a] text-white text-xs font-bold shadow-bubble-sm hover:bg-[#002244] transition-all cursor-pointer whitespace-nowrap"
              >
                Apply Favicon URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: MAIN PAGE YOUTUBE VIDEO */}
      {/* ========================================================================= */}
      {activeSubTab === 'video' && (
        <AdminYouTubeSection onShowToast={onShowToast} />
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: HOTLINE & SOCIAL MEDIA LINKS */}
      {/* ========================================================================= */}
      {activeSubTab === 'hotline' && (
        <AdminHotlineSocialSection onShowToast={onShowToast} />
      )}

      {/* ========================================================================= */}
      {/* MEDIA PICKER MODAL (Global for any target) */}
      {/* ========================================================================= */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-bubble border border-[#e2e6eb] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e6eb]">
              <div>
                <h3 className="text-lg font-bold text-[#00356a] flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-[#006e21]" />
                  <span>Select Asset from Media Library</span>
                </h3>
                <p className="text-xs text-[#00356a]/70 mt-0.5">
                  Target destination:{' '}
                  <span className="font-bold text-[#006e21] uppercase">
                    {mediaPickerTarget.replace(/_/g, ' ')}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setMediaPickerTarget(null)}
                className="p-2 rounded-full hover:bg-[#f4f6f8] text-[#00356a] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectMediaItem(item)}
                  className="p-2.5 rounded-2xl border border-[#e2e6eb] bg-[#f4f6f8] hover:bg-white hover:border-[#00356a] hover:shadow-bubble-sm transition-all cursor-pointer flex flex-col items-center gap-2 group"
                >
                  <div className="w-full h-24 rounded-xl bg-white border border-[#e2e6eb] flex items-center justify-center overflow-hidden p-1">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#00356a] text-center truncate w-full">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-bold text-[#006e21] uppercase tracking-wider">
                    Select
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#e2e6eb] flex justify-end">
              <button
                onClick={() => setMediaPickerTarget(null)}
                className="px-5 py-2 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
