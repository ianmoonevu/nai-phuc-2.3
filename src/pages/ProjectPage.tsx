import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ProjectCaseStudy, PageRoute } from '../types';
import { ProjectCarousel } from '../components/ProjectCarousel';
import {
  Building2,
  Filter,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck,
  Activity,
  UserCheck,
  Search,
  MapPin,
  Warehouse,
  Truck,
  Layers,
  Flame,
  FileCheck2,
  Maximize2
} from 'lucide-react';
import { slugify, getProjectDetailPath } from '../utils/router';

interface ProjectPageProps {
  onNavigate: (route: PageRoute, customUrlParams?: string) => void;
  onOpenConsultation: () => void;
}

export const ProjectPage: React.FC<ProjectPageProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const { projects } = useData();
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapPin, setSelectedMapPin] = useState<string>('geely');

  // 5 Application Sectors per Mindnote
  const sectors = [
    { id: 'all', label: 'All Projects' },
    { id: 'industrial', label: '01 Industrial Floors' },
    { id: 'logistics', label: '02 Warehouses & Logistics' },
    { id: 'parking-hardstands', label: '03 Parking & Hardstands' },
    { id: 'precast', label: '04 Precast Concrete' },
    { id: 'tunneling', label: '05 Tunnels & Underground' },
  ];

  // Map Locations
  const mapLocations = [
    { id: 'geely', name: 'Geely Automobile Plant', location: 'Chengdu, China', area: '250,000 m²', coords: '30.6586° N, 104.0648° E', status: 'Commissioned' },
    { id: 'sailun', name: 'Sailun Tire Mega Plant', location: 'Tay Ninh, Vietnam', area: '200,000 m²', coords: '11.3129° N, 106.0984° E', status: 'Commissioned' },
    { id: 'jinyu', name: 'Jinyu Tire Facility', location: 'Tay Ninh, Vietnam', area: '180,000 m²', coords: '11.2854° N, 106.1205° E', status: 'Commissioned' },
    { id: 'nikko', name: 'Nikko Material Auto Plant', location: 'Binh Duong, Vietnam', area: '150,000 m²', coords: '11.0531° N, 106.6661° E', status: 'Commissioned' },
    { id: 'hamaco', name: 'Hamaco Ready-Mix Yard', location: 'Can Tho, Vietnam', area: '120,000 m²', coords: '10.0452° N, 105.7469° E', status: 'Commissioned' },
    { id: 'polytech', name: 'Polytech High-Tech Facility', location: 'Dong Nai, Vietnam', area: '30,000 m²', coords: '10.9574° N, 106.8427° E', status: 'Commissioned' },
    { id: 'global-hantex', name: 'Global Hantex Textile Plant', location: 'Binh Phuoc, Vietnam', area: '5,000 m²', coords: '11.5333° N, 106.8833° E', status: 'Commissioned' },
  ];

  const filteredCases = projects.filter((c) => {
    const matchesSector =
      selectedSector === 'all' ||
      c.sector === selectedSector ||
      (selectedSector === 'industrial' && (c.sector === 'industrial' || c.sector === 'automotive')) ||
      (selectedSector === 'logistics' && (c.sector === 'logistics' || c.sector === 'infrastructure')) ||
      (selectedSector === 'parking-hardstands' && (c.sector === 'commercial' || c.sector === 'hardstands')) ||
      (selectedSector === 'precast' && c.sector === 'precast') ||
      (selectedSector === 'tunneling' && c.sector === 'tunneling');

    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.facilityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.client ? c.client.toLowerCase().includes(searchQuery.toLowerCase()) : false);

    return matchesSector && matchesSearch;
  });

  const defaultLocation = {
    id: 'geely',
    name: 'Geely Automobile Plant',
    location: 'Chengdu, China',
    area: '250,000 m²',
    coords: '30.6586° N, 104.0648° E',
    status: 'Commissioned'
  };

  const activePinData = mapLocations.find((p) => p.id === selectedMapPin) || mapLocations[0] || defaultLocation;

  const navigateToProject = (caseStudy: ProjectCaseStudy) => {
    const targetSlug = caseStudy.slug || slugify(caseStudy.title);
    window.history.pushState(null, '', getProjectDetailPath(targetSlug));
    onNavigate('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Project Overview & Header per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-14 pb-6 sm:pb-8">
        <div className="bg-[#f4f6f8] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] p-5 sm:p-8 md:p-14 shadow-bubble border border-[#e5e9ee] text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#006e21] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006e21]" />
            <span>SECTOR VALIDATION & GLOBAL CASE STUDIES</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#00356a] leading-tight tracking-tight">
            Proven Track Record Across Heavy-Duty Facilities
          </h1>

          <p className="mt-3 sm:mt-4 text-base sm:text-lg font-bold text-[#006e21]">
            Over 1,000,000 m² of High-Tolerance Industrial Slabs Placed
          </p>

          <p className="mt-3 text-xs sm:text-base text-[#00356a]/80 leading-relaxed max-w-3xl mx-auto font-normal">
            From automated automotive assembly complexes to high-frequency tire manufacturing plants and containerized ports, HOKI steel fibers eliminate traditional welded wire mesh to deliver crack-free, jointless concrete performance.
          </p>
        </div>
      </section>

      {/* 2. Interactive Project Location Map per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 shadow-bubble border border-[#e5e9ee]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 mb-6">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                Interactive Geospatial Telemetry
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-[#00356a] mt-2">
                Project Deployment Locations
              </h2>
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-[#00356a]/60">
              Select any project hub below to inspect engineering telemetry
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Map Visual Simulation */}
            <div className="lg:col-span-8 bg-[#00356a] rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white relative min-h-[320px] sm:min-h-[340px] flex flex-col justify-between overflow-hidden shadow-bubble border border-[#002244]">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 z-10">
                <span className="text-[10px] sm:text-xs font-mono tracking-wider text-emerald-400 font-bold break-all sm:break-normal">
                  GEOSPATIAL: {activePinData.coords}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold bg-[#006e21] text-white px-3 py-1 rounded-full uppercase tracking-wider">
                  {activePinData.status}
                </span>
              </div>

              {/* Graphical Map Representation Pins */}
              <div className="my-6 sm:my-8 relative min-h-36 sm:min-h-48 z-10 flex flex-wrap items-center justify-around gap-2 sm:gap-3">
                {mapLocations.map((pin) => (
                  <button
                    key={pin.id}
                    onClick={() => setSelectedMapPin(pin.id)}
                    className={`px-3 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedMapPin === pin.id
                        ? 'bg-[#006e21] text-white ring-4 ring-emerald-400/40 shadow-bubble scale-105'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{pin.name.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-75 font-mono">({pin.area})</span>
                  </button>
                ))}
              </div>

              <div className="z-10 flex justify-between items-end text-xs text-white/80 border-t border-white/10 pt-3">
                <span>APAC Central Dispatch: Alpha Hub</span>
                <span className="text-emerald-400 font-semibold">100% Quality Acceptance Rate</span>
              </div>
            </div>

            {/* Selected Location Card */}
            <div className="lg:col-span-4 bg-[#f4f6f8] rounded-3xl p-6 border border-[#e2e6eb] shadow-bubble-sm">
              <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider block mb-1">
                Facility Dossier
              </span>
              <h3 className="text-lg font-bold text-[#00356a]">
                {activePinData.name}
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-1">
                {activePinData.location}
              </p>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#e2e6eb]">
                  <span className="text-[#00356a]/70">Slab Footprint:</span>
                  <span className="font-extrabold text-[#00356a]">{activePinData.area}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#e2e6eb]">
                  <span className="text-[#00356a]/70">Reinforcement:</span>
                  <span className="font-bold text-[#006e21]">HOKI Hooked-End</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#e2e6eb]">
                  <span className="text-[#00356a]/70">Mesh Displacement:</span>
                  <span className="font-bold text-[#006e21]">100% Eliminated</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#e2e6eb]">
                  <span className="text-[#00356a]/70">Joint Spacing:</span>
                  <span className="font-bold text-[#00356a]">Up to 40m Bays</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const match = projects.find(c => c.id.toLowerCase().includes(activePinData.id));
                  if (match) {
                    navigateToProject(match);
                  }
                }}
                className="w-full mt-6 py-3 rounded-full bg-[#00356a] hover:bg-[#002244] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Read Dedicated Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5 Application Sectors & Dynamic Filter */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-[2rem] shadow-bubble border border-[#e5e9ee]">
          {/* 5 Sectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {sectors.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSector === sec.id
                    ? 'bg-[#00356a] text-white shadow-bubble-sm'
                    : 'bg-[#f4f6f8] text-[#00356a]/75 hover:bg-[#e2e6eb]'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search facility name, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00356a]/40" />
          </div>
        </div>
      </section>

      {/* 4. Project Directory & Detailed Case Study Framework per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCases.map((caseStudy) => (
            <div
              key={caseStudy.id}
              className="group bg-[#f4f6f8] rounded-[2.5rem] p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between hover:shadow-bubble-lg transition-all"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#006e21] bg-white px-3 py-1 rounded-full border border-[#e2e6eb]">
                    {caseStudy.facilityType.toUpperCase()}
                  </span>
                  <span className="text-xs font-extrabold text-[#00356a]">
                    {caseStudy.area}
                  </span>
                </div>

                {/* Interactive Project Carousel */}
                <div className="mb-5">
                  <ProjectCarousel
                    items={
                      caseStudy.gallery && caseStudy.gallery.length > 0
                        ? caseStudy.gallery
                        : [
                            {
                              url: caseStudy.image,
                              title: caseStudy.title,
                              caption: `${caseStudy.location}${caseStudy.client ? ` • Client: ${caseStudy.client}` : ''}`,
                              phaseTag: caseStudy.facilityType.toUpperCase(),
                            },
                          ]
                    }
                    projectTitle={caseStudy.title}
                    aspectRatio="h-56 sm:h-64"
                    showThumbnails={true}
                    showCaption={false}
                    autoplayDefault={false}
                    onImageClick={() => navigateToProject(caseStudy)}
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#00356a]/70 mt-2 px-1">
                    <span className="font-semibold text-[#00356a]">
                      {caseStudy.location}{caseStudy.client ? ` • Client: ${caseStudy.client}` : ''}
                    </span>
                    <button
                      onClick={() => navigateToProject(caseStudy)}
                      className="text-[#006e21] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Specs &amp; QA</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h3
                  onClick={() => navigateToProject(caseStudy)}
                  className="text-lg sm:text-xl font-extrabold text-[#00356a] hover:text-[#006e21] cursor-pointer transition-colors"
                >
                  {caseStudy.title}
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  {caseStudy.description}
                </p>

                {/* Framework Detail: Technical Challenge & Heavy Dynamic Loads */}
                <div className="mt-4 p-3 rounded-2xl bg-white border border-[#e2e6eb] text-xs">
                  <span className="font-bold text-[#00356a] block text-[11px] uppercase tracking-wider">
                    Technical Challenge & Heavy Dynamic Loads:
                  </span>
                  <p className="text-[#00356a]/75 mt-1 leading-relaxed">
                    {caseStudy.challenge}
                  </p>
                </div>

                {/* Framework Detail: Engineered HOKI Solution & Fiber Dosing */}
                <div className="mt-2.5 p-3 rounded-2xl bg-[#006e21]/5 border border-[#006e21]/20 text-xs">
                  <span className="font-bold text-[#006e21] block text-[11px] uppercase tracking-wider">
                    Engineered HOKI Solution & Dosage:
                  </span>
                  <p className="text-[#00356a]/80 mt-1 leading-relaxed">
                    {caseStudy.solution} ({caseStudy.specifications.fiberSeries} @ {caseStudy.specifications.dosage})
                  </p>
                </div>

                {/* Framework Detail: Verification */}
                <div className="mt-2.5 p-3 rounded-2xl bg-white border border-[#e2e6eb] text-xs">
                  <span className="font-bold text-[#00356a] block text-[11px] uppercase tracking-wider">
                    Verification & Acceptance:
                  </span>
                  <p className="text-[#00356a]/75 mt-1 leading-relaxed">
                    {caseStudy.verification}
                  </p>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {caseStudy.metrics.map((m, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-[#e2e6eb] text-center shadow-bubble-sm">
                      <span className="text-xs sm:text-sm font-black text-[#00356a] block">
                        {m.value}
                      </span>
                      <span className="text-[9px] text-[#00356a]/60 uppercase block font-semibold mt-0.5">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA trigger for dedicated page */}
              <div className="mt-6 pt-4 border-t border-[#e2e6eb] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={() => navigateToProject(caseStudy)}
                  className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-[#00356a] hover:text-[#006e21] transition-colors cursor-pointer min-h-[44px]"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Open Dedicated Detail Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onOpenConsultation}
                  className="px-4 py-2.5 rounded-full bg-[#006e21] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[#005a1b] shadow-sm transition-all cursor-pointer text-center min-h-[44px] flex items-center justify-center"
                >
                  Request Similar Design
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Consultation CTA Banner */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 mb-8 sm:mb-12">
        <div className="bg-[#00356a] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-bubble text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#006e21] bg-white px-3.5 py-1 rounded-full inline-block mb-2">
              STRUCTURAL DESIGN REVIEW
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold leading-tight">
              Have an upcoming industrial floor or precast project?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
              Submit your AutoCAD or Revit drawings to our engineering team for preliminary TR34 rebar displacement modeling and stamped calculation dossiers.
            </p>
          </div>

          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto shrink-0 px-8 py-3.5 sm:py-4 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:shadow-bubble transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
          >
            <UserCheck className="w-4 h-4" />
            <span>Schedule Engineering Review</span>
          </button>
        </div>
      </section>
    </div>
  );
};

