import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useData } from '../context/DataContext';
import { parseYouTubeInput } from '../utils/youtube';
import { STRATEGIC_PARTNERS, FIBER_PRODUCTS } from '../data/mockData';
import { slugify, getProjectDetailPath } from '../utils/router';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  Layers,
  Building2,
  Warehouse,
  Truck,
  Flame,
  FileText,
  Zap,
  Leaf,
  Sparkles,
  ChevronRight,
  UserCheck,
  ChevronLeft,
  Sliders,
  ExternalLink,
  PackageCheck,
  Play,
  Video,
  X
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenConsultation: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenConsultation, onSelectProject }) => {
  const { projects, branding, epcPartners, epcSectionConfig } = useData();

  const heroImage = branding?.heroImageUrl || '/images/hoki-industrial-floor-hero.svg';
  const heroOverlayOpacity = branding?.heroOverlayOpacity !== undefined ? branding.heroOverlayOpacity : 20;

  // Active Project Slide
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // Dynamic YouTube configuration from Branding / Admin
  const youtubeUrl = branding?.mainPageYoutubeUrl || 'https://www.youtube.com/@hokimetal';
  const videoTitle = branding?.mainPageVideoTitle || 'HOKI Steel Fiber Concrete Systems - Official Video @hokimetal';
  const channelName = branding?.mainPageVideoChannelName || '@hokimetal';
  const channelUrl = branding?.mainPageVideoChannelUrl || 'https://www.youtube.com/@hokimetal';
  const videoAutoplay = branding?.mainPageVideoAutoplay !== false;
  const videoMuted = branding?.mainPageVideoMuted !== false;
  const videoDefaultOpen = branding?.mainPageVideoDefaultOpen !== false;

  const [isVideoPlaying, setIsVideoPlaying] = useState(videoDefaultOpen);

  const parsedVideo = parseYouTubeInput(youtubeUrl, {
    autoplay: videoAutoplay,
    muted: videoMuted
  });

  // Quick RFQ Scope in Final CTA
  const [rfqArea, setRfqArea] = useState<number>(15000);
  const [rfqType, setRfqType] = useState('Industrial Flooring');
  const [sampleSeries, setSampleSeries] = useState('HF-8060');
  const [sampleSuccess, setSampleSuccess] = useState(false);

  // Filter projects chosen as Highlight in the Admin Panel to feature in the Track Record carousel
  const highlightedProjects = projects.filter((p) => p.isHighlight);
  const featuredProjects = highlightedProjects.length > 0 ? highlightedProjects : projects.slice(0, 5);
  const safeIndex = Math.min(activeProjectIndex, Math.max(0, featuredProjects.length - 1));
  const activeCase = featuredProjects[safeIndex] || projects[0];

  const handleNextProject = () => {
    setActiveProjectIndex((prev) => (prev + 1) % featuredProjects.length);
  };

  const handlePrevProject = () => {
    setActiveProjectIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Module with Background Hero Picture behind Box of Text */}
      <section className="w-full max-w-6xl lg:max-w-5xl xl:max-w-6xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12">
        <div className={`rounded-3xl sm:rounded-[2.5rem] md:rounded-[3rem] p-4 sm:p-6 md:p-8 lg:p-10 shadow-bubble border border-[#e5e9ee] flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 ${
          isVideoPlaying 
            ? 'min-h-[520px]' 
            : 'min-h-[440px] sm:min-h-[490px] lg:min-h-[520px] lg:max-h-[620px]'
        }`}>
          
          {/* Hero Background Picture (Behind the Box of Text) with Desktop Limit */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={heroImage}
              alt="HOKI Sustainable Steel Fiber Flooring"
              className="w-full h-full object-cover object-center max-h-[640px] transition-transform duration-700"
            />
            {/* Ambient Contrast & Readability Tint Overlay */}
            <div
              className="absolute inset-0 bg-[#00356a]"
              style={{ opacity: heroOverlayOpacity / 100 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-white/10 to-black/20 pointer-events-none" />
          </div>

          {/* Frosted Tactile Box of Text in Foreground */}
          <div className="relative z-10 max-w-3xl lg:max-w-4xl w-full bg-white/94 backdrop-blur-md rounded-2xl sm:rounded-3xl md:rounded-[2.25rem] p-5 sm:p-7 md:p-8 lg:p-9 border border-white/80 shadow-bubble-lg flex flex-col items-center text-center my-auto transition-all">
            {/* Brand Positioning Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#006e21] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-5">
              <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006e21]" />
              <span>HOKI — Innovative and Sustainable</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold text-[#00356a] tracking-tight max-w-3xl leading-[1.2] sm:leading-[1.15]">
              Engineered Systems for Stronger More Durable Concrete Floors
            </h1>

            {/* Subtitle / Tagline */}
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#00356a]/90 max-w-2xl font-semibold">
              Strength, Reliability, Solutions — Built to Perform.
            </p>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#00356a]/70 max-w-2xl font-normal leading-relaxed">
              High-performance cold-drawn hooked steel fiber systems replacing welded wire mesh and rebar cages, accelerating pour schedules by 40%, and delivering auditable carbon abatement.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
              <button
                id="hero-explore-products-btn"
                onClick={() => {
                  onNavigate('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00356a] text-white shadow-bubble hover:bg-[#002244] hover:shadow-bubble-lg active:scale-[0.98] transition-all cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-[#006e21]" />
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-75" />
              </button>

              <button
                id="hero-talk-to-engineer-btn"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#006e21] text-white shadow-bubble-sm hover:bg-[#005a1b] hover:shadow-bubble active:scale-[0.98] transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Talk to an Engineer</span>
              </button>

              <button
                id="hero-explore-video-btn"
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 hover:bg-white text-[#00356a] border border-[#e2e6eb] shadow-bubble-sm hover:shadow-bubble active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                <span>{isVideoPlaying ? 'Hide Video' : 'Explore HOKI Video'}</span>
              </button>
            </div>

            {/* Video Player Overlay / Drawer */}
            {isVideoPlaying && (
              <div className="mt-6 sm:mt-7 w-full rounded-2xl overflow-hidden shadow-bubble border border-[#e2e6eb] relative bg-black aspect-16/9 animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
                  <a
                    href={channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg transition-all"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="font-bold">{channelName}</span>
                    <span className="text-white/70 hidden sm:inline">• Official Channel</span>
                    <ExternalLink className="w-3 h-3 text-white/80" />
                  </a>

                  <button
                    onClick={() => setIsVideoPlaying(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-red-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close</span>
                  </button>
                </div>

                <iframe
                  key={`${parsedVideo.embedUrl}-${videoAutoplay}-${videoMuted}`}
                  src={parsedVideo.embedUrl}
                  title={videoTitle}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            {/* Bottom Proof Metrics in Box */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#e2e6eb] w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left">
              <div className="p-3 rounded-2xl bg-[#f4f6f8]/70 border border-[#e2e6eb]/60">
                <div className="text-[10px] uppercase font-bold text-[#006e21] tracking-wider">Placement Rate</div>
                <div className="text-sm font-extrabold text-[#00356a] mt-0.5">3,000 m²/day</div>
                <div className="text-[10px] text-[#00356a]/60">Continuous jointless pour</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#f4f6f8]/70 border border-[#e2e6eb]/60">
                <div className="text-[10px] uppercase font-bold text-[#006e21] tracking-wider">Mesh Displacement</div>
                <div className="text-sm font-extrabold text-[#00356a] mt-0.5">100% Elimination</div>
                <div className="text-[10px] text-[#00356a]/60">Zero rebar fixers on slab</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#f4f6f8]/70 border border-[#e2e6eb]/60">
                <div className="text-[10px] uppercase font-bold text-[#006e21] tracking-wider">Design Standard</div>
                <div className="text-sm font-extrabold text-[#00356a] mt-0.5">TR34 4th Ed. / ACI</div>
                <div className="text-[10px] text-[#00356a]/60">ASTM A820 &amp; EN 14889-1</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOKI at a Glance (4 Telemetry Metric Bubbles) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
            Scale & Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00356a] mt-2">
            HOKI at a Glance
          </h2>
          <p className="text-xs sm:text-sm text-[#00356a]/70 max-w-xl mx-auto mt-1">
            Proven infrastructure capacity engineered for international mega-projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006e21]">
              Annual Production Capacity
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#00356a] mt-2">
              50,000 <span className="text-lg font-bold text-[#006e21]">MT/Year</span>
            </div>
            <p className="text-xs text-[#00356a]/70 mt-2">
              Automated cold-drawing and high-speed hooked-end forming at the Alpha Hub facility.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006e21]">
              Industrial Slabs Delivered
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#00356a] mt-2">
              &gt;1,000,000 <span className="text-lg font-bold text-[#006e21]">m²</span>
            </div>
            <p className="text-xs text-[#00356a]/70 mt-2">
              Jointless floors placed across tier-1 automotive, tire manufacturing, and high-bay logistics centers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006e21]">
              Global Supply Network
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#00356a] mt-2">
              18+ <span className="text-lg font-bold text-[#006e21]">Hubs</span>
            </div>
            <p className="text-xs text-[#00356a]/70 mt-2">
              Strategic distribution centers and export terminals across APAC, Europe, and the Americas.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006e21]">
              Quantified Carbon Reduction
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#00356a] mt-2">
              30–45% <span className="text-lg font-bold text-[#006e21]">CO₂e</span>
            </div>
            <p className="text-xs text-[#00356a]/70 mt-2">
              Embodied carbon savings through reduced steel mass, thinner concrete sections, and ISO 14040 EPD.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Why HOKI — 6 Core Benefits per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-[#f4f6f8] rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
              Engineering Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a] mt-3">
              Why HOKI — 6 Core Benefits
            </h2>
            <p className="text-xs sm:text-sm text-[#00356a]/70 mt-2">
              Every cubic meter reinforced with millions of isotropic micro-anchors delivering uncompromising structural and economic performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* 01 Crack Control */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                  01 CRACK CONTROL
                </span>
                <h3 className="text-lg font-bold text-[#00356a] mt-3">
                  Micro-Crack Interception
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  Millions of hooked fibers bridge early-age shrinkage micro-cracks before they coalesce into macroscopic fractures, keeping crack widths strictly below 0.10 mm.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#006e21]">
                ASTM C1579 Crack Reduction &gt; 90%
              </div>
            </div>

            {/* 02 Faster Construction */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                  02 FASTER CONSTRUCTION
                </span>
                <h3 className="text-lg font-bold text-[#00356a] mt-3">
                  40% Schedule Acceleration
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  Eliminates days of manual rebar fixing, chair placement, and crane hoisting. Direct mixer truck discharge allows continuous laser screed pours over 2,500 m²/shift.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#006e21]">
                Up to 28–35 Days Saved on Mega-Projects
              </div>
            </div>

            {/* 03 Higher Toughness */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                  03 HIGHER TOUGHNESS
                </span>
                <h3 className="text-lg font-bold text-[#00356a] mt-3">
                  Superior Post-Crack Ductility
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  High-tensile cold-drawn hooked fibers deliver robust residual flexural strength parameters (fR1, fR4 per EN 14651), ensuring high energy dissipation under heavy cyclic loads.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#006e21]">
                fib Model Code 2020 Class 4a Certified
              </div>
            </div>

            {/* 04 Optimised Floor Design */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                  04 OPTIMISED FLOOR DESIGN
                </span>
                <h3 className="text-lg font-bold text-[#00356a] mt-3">
                  15–25% Thinner Slabs
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  TR34 plastic moment redistribution allows structural engineers to decrease slab thickness from 220mm down to 180mm while maintaining identical point-load bearing capacity.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#006e21]">
                Substantial Concrete & Subgrade Cost Savings
              </div>
            </div>

            {/* 05 Impact Resistance */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                  05 IMPACT RESISTANCE
                </span>
                <h3 className="text-lg font-bold text-[#00356a] mt-3">
                  Forklift & Heavy Point Load Durability
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  Isotropic fiber spatial distribution absorbs shock and kinetic energy from dropped steel coils, container corner castings, and aggressive hard-wheel reach trucks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#006e21]">
                3x Impact Energy Dissipation vs Plain Concrete
              </div>
            </div>

            {/* 06 Long-Term Durability */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                  06 LONG-TERM DURABILITY
                </span>
                <h3 className="text-lg font-bold text-[#00356a] mt-3">
                  Zero Joint Spalling & Delamination
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  Eliminates vulnerable saw-cut joints that destroy AGV tires. The 3D hooked fibers restrain curling and edge spalling across a 30+ year facility service life.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#006e21]">
                Up to 75% Floor Lifecycle Maintenance Saved
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Range Showcase (HF-8060, HF-6535, HF-10020 per Mindnote) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
              Standard Portfolio
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a] mt-2">
              Product Range Showcase
            </h2>
            <p className="text-xs sm:text-sm text-[#00356a]/70 mt-1">
              Precision cold-drawn steel fibers manufactured to ASTM A820 Type I and EN 14889-1 System 1 standards.
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#00356a] border border-[#e2e6eb] shadow-bubble-sm hover:shadow-bubble cursor-pointer w-fit"
          >
            <span>View All Products & TDS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#006e21]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FIBER_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between group hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 relative bg-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#00356a]/90 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    {prod.aspectRatio} Aspect Ratio
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#006e21] tracking-wider uppercase">
                    {prod.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#00356a]/60">
                    {prod.fiberCountPerKg}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#00356a] mt-1">
                  {prod.series}
                </h3>
                <p className="text-xs text-[#00356a]/70 mt-2 line-clamp-3">
                  {prod.subtitle}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 bg-[#f4f6f8] p-3 rounded-xl border border-[#e2e6eb]">
                  <div>
                    <span className="text-[10px] font-medium text-[#00356a]/60 uppercase block">
                      Tensile Strength
                    </span>
                    <span className="text-xs font-bold text-[#00356a]">
                      {prod.tensileStrength}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-[#00356a]/60 uppercase block">
                      Length / Dia
                    </span>
                    <span className="text-xs font-bold text-[#00356a]">
                      {prod.length} / {prod.diameter}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f0f3f5] flex items-center justify-between">
                <button
                  onClick={() => {
                    onNavigate('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#00356a] hover:text-[#006e21] flex items-center gap-1 cursor-pointer"
                >
                  <span>Technical Specs & TDS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onOpenConsultation}
                  className="px-3.5 py-1.5 rounded-full bg-[#006e21]/10 text-[#006e21] hover:bg-[#006e21] hover:text-white text-[11px] font-bold tracking-wider transition-colors cursor-pointer"
                >
                  Request Sample
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Projects Carousel per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-[#f4f6f8] rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                Track Record
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a] mt-2">
                Featured Projects Carousel
              </h2>
              <p className="text-xs sm:text-sm text-[#00356a]/70 mt-1">
                {highlightedProjects.length > 0
                  ? `Curated showcase of ${highlightedProjects.length} highlighted project dossiers delivering verified jointless slabs and carbon abatement.`
                  : 'Delivered across Geely Automobile, Sailun Tire, Jinyu Tires, Nikko Material, and Hamaco Concrete.'}
              </p>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handlePrevProject}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center justify-center text-[#00356a] hover:bg-[#00356a] hover:text-white transition-colors cursor-pointer"
                aria-label="Previous Case Study"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-xs font-bold text-[#00356a] px-2">
                {safeIndex + 1} / {featuredProjects.length}
              </span>
              <button
                onClick={handleNextProject}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center justify-center text-[#00356a] hover:bg-[#00356a] hover:text-white transition-colors cursor-pointer"
                aria-label="Next Case Study"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Active Featured Case Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-bubble border border-[#e5e9ee] grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-16/10 bg-slate-900 relative shadow-sm">
              <img
                src={activeCase.image}
                alt={activeCase.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#006e21] text-white text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-sm">
                {activeCase.area} Delivered
              </div>
              <div className="absolute bottom-3 right-3 bg-[#00356a]/90 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-1 rounded-full">
                {activeCase.location}
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#006e21] tracking-wider uppercase">
                    {activeCase.facilityType}
                  </span>
                  {activeCase.isHighlight && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/90 border border-amber-400 px-2.5 py-0.5 rounded-full shadow-xs">
                      <Sparkles className="w-3 h-3 text-amber-700 fill-amber-700" />
                      Featured in Track Record
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#00356a] mt-1">
                  {activeCase.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#00356a]/75 mt-3 leading-relaxed">
                  {activeCase.description}
                </p>

                {/* Challenge & Solution Summary */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#f4f6f8] border border-[#e2e6eb]">
                    <span className="font-bold text-[#00356a] block">Technical Challenge:</span>
                    <span className="text-[#00356a]/70">{activeCase.challenge}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#006e21]/5 border border-[#006e21]/20">
                    <span className="font-bold text-[#006e21] block">Engineered HOKI Solution:</span>
                    <span className="text-[#00356a]/80">{activeCase.solution}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {activeCase.metrics.map((m, idx) => (
                    <div key={idx} className="bg-white border border-[#e2e6eb] rounded-xl p-2.5 text-center shadow-bubble-sm">
                      <span className="text-sm sm:text-base font-extrabold text-[#00356a] block">
                        {m.value}
                      </span>
                      <span className="text-[10px] text-[#00356a]/60 block mt-0.5 leading-tight">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f0f3f5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const targetSlug = activeCase.slug || slugify(activeCase.title);
                    window.history.pushState(null, '', getProjectDetailPath(targetSlug));
                    onNavigate('project-detail' as PageRoute);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#002244] cursor-pointer"
                >
                  <span>View Dedicated Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold text-[#00356a]/60 text-center sm:text-right">
                  {activeCase.specifications.fiberSeries} @ {activeCase.specifications.dosage}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Strategic Partners Carousel / Infinite Ticker per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00356a]/60">
            {epcSectionConfig?.title || 'Trusted by Leading EPC Contractors & Tier-1 Developers'}
          </span>
          {epcSectionConfig?.subtitle && (
            <p className="text-xs text-[#00356a]/65 max-w-xl mx-auto mt-1 font-medium">
              {epcSectionConfig.subtitle}
            </p>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
            {(epcPartners && epcPartners.length > 0 ? epcPartners : STRATEGIC_PARTNERS).map((partner, index) => {
              const partnerSubtitle = partner.subtitle || (partner as any).role || '';
              return (
                <div
                  key={(partner as any).id || index}
                  className="px-4 sm:px-5 py-2.5 rounded-full bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex items-center gap-2.5 hover:bg-white hover:border-[#006e21]/40 hover:shadow-bubble transition-all group"
                >
                  {/* Partner Logo or Vibrant Status Node */}
                  {(partner as any).logoUrl ? (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-white border border-[#dce0e6] shadow-sm flex items-center justify-center shrink-0 p-0.5 group-hover:scale-105 transition-transform">
                      <img
                        src={(partner as any).logoUrl}
                        alt={partner.name}
                        className="w-full h-full object-contain rounded-full"
                        onError={(e) => {
                          // Fallback to dot if image fails to load
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#006e21] shrink-0 group-hover:scale-125 transition-transform" />
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold tracking-wider text-[#00356a]">
                      {partner.name}
                    </span>
                    {partnerSubtitle && (
                      <span className="text-[10px] text-[#00356a]/60 border-l border-[#dce0e6] pl-2 hidden sm:inline font-medium">
                        {partnerSubtitle}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-6 sm:mb-10">
        <div className="bg-[#00356a] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-bubble text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#006e21]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl text-center lg:text-left z-10 w-full">
            <span className="text-xs font-bold uppercase tracking-widest bg-[#006e21] text-white px-3.5 py-1 rounded-full inline-block mb-3">
              Direct Engineering Engagement
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to engineer high-performance, crack-free slabs?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-3 leading-relaxed">
              Connect with our senior structural team for preliminary TR34 dosing calculations, CAD drawing reviews, and project-specific fiber sample delivery.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start w-full">
              {/* Request a Quote */}
              <button
                onClick={() => {
                  onNavigate('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold tracking-wider uppercase shadow-bubble-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Request a Quote</span>
              </button>

              {/* Request a Sample */}
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-[#00356a] hover:bg-[#f4f6f8] text-xs font-bold tracking-wider uppercase shadow-bubble-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <PackageCheck className="w-4 h-4 text-[#006e21]" />
                <span>Request a Sample</span>
              </button>

              {/* Schedule Engineering Consultation */}
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Schedule Consultation</span>
              </button>
            </div>
          </div>

          {/* Quick Fast Material Scope Box */}
          <div className="w-full lg:w-96 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-bubble border border-white/20 text-[#00356a] z-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#00356a] mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#006e21]" />
              <span>Fast Scope Estimator</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#00356a]/70 uppercase block mb-1">
                  Project Type
                </label>
                <select
                  value={rfqType}
                  onChange={(e) => setRfqType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f4f6f8] border border-[#dce0e6] font-semibold text-[#00356a]"
                >
                  <option value="Industrial Flooring">Industrial Flooring (Jointless)</option>
                  <option value="Warehouse Logistics">Automated Warehouse / Logistics</option>
                  <option value="Ports & Hardstand">Port / Container Hardstand</option>
                  <option value="Precast Concrete">Precast Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#00356a]/70 uppercase block mb-1">
                  Slab Surface Area: <span className="text-[#006e21] font-extrabold">{rfqArea.toLocaleString()} m²</span>
                </label>
                <input
                  type="range"
                  min="2000"
                  max="100000"
                  step="1000"
                  value={rfqArea}
                  onChange={(e) => setRfqArea(Number(e.target.value))}
                  className="w-full accent-[#006e21]"
                />
              </div>

              <div className="pt-2 border-t border-[#e2e6eb] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#00356a]/70">Estimated HOKI Fiber:</span>
                  <span className="font-bold text-[#00356a]">{Math.round((rfqArea * 0.18 * 28) / 1000)} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#00356a]/70">Rebar Replaced:</span>
                  <span className="font-bold text-[#006e21]">{Math.round(rfqArea * 0.016)} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#00356a]/70">Pour Schedule Saved:</span>
                  <span className="font-bold text-[#006e21]">~{Math.max(7, Math.round(rfqArea / 1200))} Days</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full mt-3 py-3 rounded-full bg-[#00356a] text-white font-bold uppercase tracking-wider text-[11px] hover:bg-[#002244] transition-all cursor-pointer text-center block shadow-sm"
              >
                Send Specifications
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
