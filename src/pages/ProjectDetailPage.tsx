import React, { useState, useEffect, useMemo } from 'react';
import { ProjectCaseStudy, PageRoute } from '../types';
import { useData } from '../context/DataContext';
import {
  ArrowLeft,
  Share2,
  Download,
  CheckCircle2,
  Building2,
  MapPin,
  Maximize2,
  Calendar,
  Layers,
  Zap,
  TrendingUp,
  ShieldCheck,
  FileText,
  MessageSquare,
  ArrowRight,
  Eye,
  Check,
  ChevronRight,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { slugify, getProjectDetailPath } from '../utils/router';

interface ProjectDetailPageProps {
  projectSlug?: string;
  onNavigate: (route: PageRoute, customUrlParams?: string) => void;
  onOpenConsultation: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectSlug,
  onNavigate,
  onOpenConsultation
}) => {
  const { projects } = useData();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'specs'>('overview');

  // Find the project by slug, or fallback by id / code
  const currentProject = useMemo(() => {
    if (!projectSlug) return projects[0] || null;
    const cleanSlug = projectSlug.toLowerCase().trim();
    return (
      projects.find((p) => p.slug === cleanSlug) ||
      projects.find((p) => slugify(p.title) === cleanSlug) ||
      projects.find((p) => p.id.toLowerCase() === cleanSlug) ||
      projects.find((p) => p.code.toLowerCase() === cleanSlug) ||
      projects[0] ||
      null
    );
  }, [projects, projectSlug]);

  // Related projects (same sector or featured, excluding current)
  const relatedProjects = useMemo(() => {
    if (!currentProject) return [];
    const sameSector = projects.filter(
      (p) => p.id !== currentProject.id && p.sector === currentProject.sector
    );
    const otherProjects = projects.filter(
      (p) => p.id !== currentProject.id && p.sector !== currentProject.sector
    );
    return [...sameSector, ...otherProjects].slice(0, 3);
  }, [projects, currentProject]);

  // Gallery items combined (fallback to main image if gallery empty)
  const galleryItems = useMemo(() => {
    if (!currentProject) return [];
    if (currentProject.gallery && currentProject.gallery.length > 0) {
      return currentProject.gallery;
    }
    return [
      {
        url: currentProject.image,
        title: currentProject.title,
        caption: currentProject.description,
        phaseTag: '01 FACILITY OVERVIEW'
      }
    ];
  }, [currentProject]);

  // Reset active image when project changes
  useEffect(() => {
    setActiveMediaIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentProject?.id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentProject?.title} — HOKI Steel Fiber Case Study`,
          text: currentProject?.description,
          url
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!currentProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-bubble-lg border border-[#e2e6eb]">
          <div className="w-16 h-16 rounded-3xl bg-[#00356a]/10 text-[#00356a] flex items-center justify-center mx-auto mb-4 shadow-bubble-inset">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#00356a] mb-2">Project Dossier Not Found</h2>
          <p className="text-sm text-[#00356a]/70 mb-6">
            The requested project case study could not be located or has been archived.
          </p>
          <button
            onClick={() => onNavigate('projects')}
            className="px-6 py-3 rounded-full bg-[#00356a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#002850] transition-all shadow-bubble-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Projects</span>
          </button>
        </div>
      </div>
    );
  }

  const activeMedia = galleryItems[activeMediaIndex] || galleryItems[0];

  return (
    <div className="w-full bg-[#ffffff] min-h-screen">
      {/* 1. Top Breadcrumb & Quick Action Bar */}
      <div className="bg-[#f4f6f8] border-b border-[#e2e6eb]/80 sticky top-[72px] z-30 backdrop-blur-md bg-[#f4f6f8]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-[#00356a]/60 uppercase">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#00356a] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#00356a]/30" />
            <button
              onClick={() => onNavigate('projects')}
              className="hover:text-[#00356a] transition-colors cursor-pointer"
            >
              Projects
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#00356a]/30" />
            <span className="text-[#006e21] truncate max-w-[200px] sm:max-w-xs font-black">
              {currentProject.code}
            </span>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              id="share-case-study-btn"
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-full bg-white text-[#00356a] text-[11px] font-bold uppercase tracking-wider hover:bg-[#00356a] hover:text-white border border-[#e2e6eb] transition-all shadow-bubble-sm flex items-center gap-1.5 cursor-pointer"
              title="Copy shareable URL to clipboard"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#006e21]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Case'}</span>
            </button>

            <button
              onClick={() => onNavigate('projects')}
              className="px-4 py-1.5 rounded-full bg-white text-[#00356a] text-[11px] font-bold uppercase tracking-wider hover:bg-[#f4f6f8] border border-[#e2e6eb] transition-all shadow-bubble-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Projects</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="px-4 py-1.5 rounded-full bg-[#006e21] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#00551a] transition-all shadow-bubble-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consult Engineer</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e2e6eb] shadow-bubble relative overflow-hidden">
          {/* Background structural accent lines */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#00356a]/5 blur-3xl pointer-events-none" />
          <div className="absolute right-10 top-10 opacity-5 pointer-events-none text-9xl font-black text-[#00356a] select-none">
            {currentProject.code.split('-').pop()}
          </div>

          <div className="relative z-10">
            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-[#00356a] text-white text-[10px] font-black uppercase tracking-widest shadow-bubble-sm">
                {currentProject.code}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#006e21]/10 text-[#006e21] border border-[#006e21]/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentProject.sectorLabel}</span>
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#f4f6f8] text-[#00356a] text-[10px] font-bold tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00356a]/60" />
                <span>{currentProject.location}</span>
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#f4f6f8] text-[#00356a] text-[10px] font-bold tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#006e21]" />
                <span className="font-extrabold text-[#006e21]">{currentProject.area}</span>
              </span>
              {currentProject.isHighlight && (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest">
                  Flagship Case Study
                </span>
              )}
            </div>

            {/* Title & Facility Type */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#00356a] tracking-tight leading-tight mb-3">
              {currentProject.title}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-[#006e21] tracking-wide mb-4">
              {currentProject.facilityType}
            </p>
            <p className="text-sm sm:text-base text-[#00356a]/80 leading-relaxed max-w-4xl font-normal">
              {currentProject.description}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Structured Media Gallery (Lazy-Loaded with Phase Tags & Zoom) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-[#f4f6f8] rounded-3xl p-4 sm:p-6 border border-[#e2e6eb] shadow-bubble">
          {/* Main Visual Display */}
          <div className="relative rounded-2xl overflow-hidden bg-[#001f3f] aspect-video max-h-[560px] w-full shadow-bubble-inset group">
            <img
              src={activeMedia.url}
              alt={activeMedia.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay for Caption Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Phase Tag & Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
              <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-black tracking-widest uppercase border border-white/20">
                {activeMedia.phaseTag}
              </span>

              <button
                onClick={() => setLightboxOpen(true)}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-white hover:text-[#00356a] border border-white/20 flex items-center justify-center transition-all cursor-pointer"
                title="Expand image fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white z-10">
              <h3 className="text-base sm:text-xl font-bold tracking-tight mb-1 text-white flex items-center gap-2">
                <span>{activeMedia.title}</span>
                <span className="text-xs font-normal text-white/60">
                  ({activeMediaIndex + 1} of {galleryItems.length})
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-3xl">
                {activeMedia.caption}
              </p>
            </div>
          </div>

          {/* Gallery Thumbnails Carousel */}
          {galleryItems.length > 1 && (
            <div className="mt-4 pt-4 border-t border-[#e2e6eb] grid grid-cols-2 sm:grid-cols-4 gap-3">
              {galleryItems.map((item, idx) => {
                const isSelected = idx === activeMediaIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer text-left group ${
                      isSelected
                        ? 'border-[#006e21] shadow-bubble-sm scale-[1.02]'
                        : 'border-transparent opacity-75 hover:opacity-100 hover:border-[#00356a]/30'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex flex-col justify-end">
                      <span className="text-[9px] font-black text-[#006e21] bg-white/90 px-1.5 py-0.5 rounded uppercase tracking-wider w-max mb-0.5">
                        {item.phaseTag.split(' ')[0]}
                      </span>
                      <p className="text-[10px] font-bold text-white truncate">{item.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Telemetry Metrics Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentProject.metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 border transition-all ${
                metric.isHighlight
                  ? 'bg-gradient-to-br from-[#00356a] to-[#002244] text-white border-[#00356a] shadow-bubble-lg'
                  : 'bg-white text-[#00356a] border-[#e2e6eb] shadow-bubble'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    metric.isHighlight ? 'text-[#006e21] bg-white px-2.5 py-0.5 rounded-full' : 'text-[#006e21]'
                  }`}
                >
                  Verified Outcome 0{idx + 1}
                </span>
                <TrendingUp
                  className={`w-4 h-4 ${metric.isHighlight ? 'text-white/80' : 'text-[#00356a]/40'}`}
                />
              </div>
              <div
                className={`text-3xl sm:text-4xl font-black tracking-tight mb-1 ${
                  metric.isHighlight ? 'text-white' : 'text-[#00356a]'
                }`}
              >
                {metric.value}
              </div>
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  metric.isHighlight ? 'text-white/80' : 'text-[#00356a]/70'
                }`}
              >
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Scope of Work & Structural Engineering Deep-Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Case Study Columns (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* The Challenge */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e6eb] shadow-bubble">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-sm shadow-bubble-inset">
                  01
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                    Project Problem Statement
                  </span>
                  <h2 className="text-xl font-black text-[#00356a]">The Engineering Challenge</h2>
                </div>
              </div>
              <p className="text-sm sm:text-base text-[#00356a]/85 leading-relaxed">
                {currentProject.challenge}
              </p>
            </div>

            {/* The Solution */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#006e21]/30 shadow-bubble relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#006e21]/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-[#006e21]/10 text-[#006e21] flex items-center justify-center font-black text-sm shadow-bubble-inset">
                  02
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#006e21]">
                    HOKI Engineered Solution
                  </span>
                  <h2 className="text-xl font-black text-[#00356a]">Specification & Implementation</h2>
                </div>
              </div>
              <p className="text-sm sm:text-base text-[#00356a]/85 leading-relaxed relative z-10 mb-4">
                {currentProject.solution}
              </p>

              {/* Highlight Pill inside Solution */}
              <div className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#006e21] shrink-0 mt-0.5" />
                <div className="text-xs text-[#00356a]/90 leading-relaxed">
                  <span className="font-black text-[#00356a] block mb-0.5">
                    Continuous Jointless Placement Protocol:
                  </span>
                  Utilized automated fiber dosing directly into transit mixers, achieving complete 3D isotropic matrix reinforcement with zero clumping and ultra-dense flexural crack bridging.
                </div>
              </div>
            </div>

            {/* QA & Verification */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e6eb] shadow-bubble">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#00356a]/10 text-[#00356a] flex items-center justify-center font-black text-sm shadow-bubble-inset">
                  03
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#00356a]">
                    Standards & Quality Acceptance
                  </span>
                  <h2 className="text-xl font-black text-[#00356a]">QA Testing & Performance Verification</h2>
                </div>
              </div>
              <p className="text-sm sm:text-base text-[#00356a]/85 leading-relaxed mb-4">
                {currentProject.verification}
              </p>

              {/* Compliance Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#e2e6eb]">
                <span className="px-3 py-1 rounded-full bg-[#f4f6f8] text-[10px] font-bold text-[#00356a]">
                  ASTM C1609 Notched Beam
                </span>
                <span className="px-3 py-1 rounded-full bg-[#f4f6f8] text-[10px] font-bold text-[#00356a]">
                  EN 14651 Residual Flexural Toughness
                </span>
                <span className="px-3 py-1 rounded-full bg-[#f4f6f8] text-[10px] font-bold text-[#00356a]">
                  TR34 4th Edition Class 1
                </span>
                <span className="px-3 py-1 rounded-full bg-[#f4f6f8] text-[10px] font-bold text-[#00356a]">
                  fib Model Code 2020
                </span>
              </div>
            </div>

            {/* Client Testimonial (if available) */}
            {currentProject.clientQuote && (
              <div className="bg-gradient-to-br from-[#00356a] to-[#002244] text-white rounded-3xl p-6 sm:p-8 shadow-bubble-lg relative overflow-hidden">
                <MessageSquare className="w-12 h-12 text-white/10 absolute -bottom-2 right-4 pointer-events-none" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#006e21] bg-white px-3 py-1 rounded-full inline-block mb-3">
                  Client Endorsement
                </span>
                <blockquote className="text-base sm:text-lg font-medium italic text-white/95 leading-relaxed mb-4">
                  "{currentProject.clientQuote}"
                </blockquote>
                {currentProject.quoteAuthor && (
                  <div className="text-xs text-white/80 font-bold">
                    — {currentProject.quoteAuthor}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Specification Dossier & Direct Actions */}
          <div className="space-y-6">
            {/* Technical Specifications Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2e6eb] shadow-bubble">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full inline-block mb-3">
                Engineering Parameters
              </span>
              <h3 className="text-lg font-black text-[#00356a] mb-4">
                Technical Specifications
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
                  <span className="text-[10px] font-bold text-[#00356a]/60 uppercase block mb-1">
                    Fiber Reinforcement Series
                  </span>
                  <span className="font-black text-sm text-[#00356a]">
                    {currentProject.specifications.fiberSeries}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
                  <span className="text-[10px] font-bold text-[#00356a]/60 uppercase block mb-1">
                    Engineered Dosage Rate
                  </span>
                  <span className="font-black text-sm text-[#006e21]">
                    {currentProject.specifications.dosage}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
                  <span className="text-[10px] font-bold text-[#00356a]/60 uppercase block mb-1">
                    Specified Concrete Class
                  </span>
                  <span className="font-black text-sm text-[#00356a]">
                    {currentProject.specifications.concreteGrade}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
                  <span className="text-[10px] font-bold text-[#00356a]/60 uppercase block mb-1">
                    Joint Design & Spacing
                  </span>
                  <span className="font-black text-sm text-[#00356a]">
                    {currentProject.specifications.jointSpacing}
                  </span>
                </div>
              </div>
            </div>

            {/* Stamped Calculation Request Box */}
            <div className="bg-[#f4f6f8] rounded-3xl p-6 sm:p-7 border border-[#e2e6eb] shadow-bubble text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#00356a]/10 text-[#00356a] flex items-center justify-center mx-auto mb-3 shadow-bubble-inset">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#00356a] mb-1.5">
                Need a Stamped TR34 Calculation?
              </h3>
              <p className="text-xs text-[#00356a]/70 leading-relaxed mb-5">
                Our licensed civil engineering team provides site-specific yield-line calculations, point load analysis, and crack-width verifications for your next project.
              </p>

              <button
                id="request-stamped-calc-btn"
                onClick={onOpenConsultation}
                className="w-full py-3 px-4 rounded-full bg-[#00356a] text-white font-black text-xs uppercase tracking-wider hover:bg-[#002850] transition-all shadow-bubble-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Project Calculation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Related Project Suggestions Section */}
      {relatedProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#e2e6eb]/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full inline-block mb-2">
                Comparative Engineering
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#00356a] tracking-tight">
                Related Project Case Studies
              </h2>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-[#00356a] hover:text-[#006e21] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Explore All {projects.length} Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((relProj) => (
              <div
                key={relProj.id}
                onClick={() => {
                  const targetSlug = relProj.slug || slugify(relProj.title);
                  window.history.pushState(null, '', getProjectDetailPath(targetSlug));
                  onNavigate('project-detail');
                }}
                className="bg-white rounded-3xl overflow-hidden border border-[#e2e6eb] shadow-bubble hover:shadow-bubble-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-[#002244]">
                  <img
                    src={relProj.image}
                    alt={relProj.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                      {relProj.code}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#006e21] text-[10px] font-extrabold shadow-sm">
                      {relProj.area}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider block mb-1">
                      {relProj.sectorLabel}
                    </span>
                    <h3 className="text-base font-bold text-[#00356a] group-hover:text-[#006e21] transition-colors line-clamp-1 mb-1.5">
                      {relProj.title}
                    </h3>
                    <p className="text-xs text-[#00356a]/70 line-clamp-2 mb-3">
                      {relProj.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#e2e6eb] flex items-center justify-between text-xs font-bold text-[#00356a]">
                    <span className="text-[11px] text-[#00356a]/60 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{relProj.location.split(',')[0]}</span>
                    </span>
                    <span className="text-[#006e21] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-[11px]">
                      <span>Read Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
            <span className="text-xs font-bold text-white/80">
              {activeMediaIndex + 1} / {galleryItems.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="max-w-5xl max-h-[80vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeMedia.url}
              alt={activeMedia.title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="text-center text-white mt-4 max-w-2xl px-4">
              <span className="text-[10px] font-black text-[#006e21] bg-white px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                {activeMedia.phaseTag}
              </span>
              <h4 className="text-base font-bold mb-1">{activeMedia.title}</h4>
              <p className="text-xs text-white/70">{activeMedia.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
