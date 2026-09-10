import React, { useState } from 'react';
import { LEADERSHIP_HEADS, ADVISORY_BOARD, GLOBAL_OFFICES, EVOLUTION_TIMELINE } from '../data/mockData';
import { useData } from '../context/DataContext';
import {
  Factory,
  Cpu,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Award,
  Globe2,
  Users,
  HeartHandshake,
  ArrowRight,
  PackageCheck,
  Building2,
  Sliders,
  Sparkles,
  Zap,
  PhoneCall,
  Mail,
  ChevronRight
} from 'lucide-react';

interface AboutPageProps {
  onOpenConsultation: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation }) => {
  const { branding, aboutInfo, leadershipHeads, advisoryMembers } = useData();
  const [activePartnerRegion, setActivePartnerRegion] = useState<'apac' | 'europe' | 'americas' | 'mena'>('apac');

  const aboutHeroImage = branding?.aboutHeroImageUrl || '/images/hoki-greener-tomorrow-hero.svg';
  const aboutFactoryImage = branding?.aboutFactoryImageUrl || '/images/factory-alpha-hub.svg';

  const partnerNetwork = {
    apac: {
      regionName: 'Asia-Pacific Distribution & Engineering Partners',
      hubs: ['Vietnam (HQ & Alpha Hub)', 'Singapore', 'Japan', 'South Korea', 'Australia', 'Indonesia'],
      summary: 'Central manufacturing base at Alpha Hub delivering continuous daily dispatch to major EPC jointless slab projects across SE Asia and Pacific rim ports.'
    },
    europe: {
      regionName: 'Europe Strategic Alliances & Supply Hubs',
      hubs: ['Frankfurt (Germany)', 'Rotterdam (Netherlands)', 'London (UK)', 'Milan (Italy)'],
      summary: 'Dedicated CE System 1 and DAfStb compliance desk supporting precast tunnel segmental linings, robotic logistics centers, and low-carbon infrastructure.'
    },
    americas: {
      regionName: 'Americas Channel Partners & ASTM Centers',
      hubs: ['Chicago, IL (USA)', 'Houston, TX (USA)', 'Monterrey (Mexico)', 'São Paulo (Brazil)'],
      summary: 'Regional inventory stocking centers providing rapid transit of ASTM A820 Type I cold-drawn fibers for industrial distribution facilities and intermodal ports.'
    },
    mena: {
      regionName: 'Middle East & Africa Infrastructure Desk',
      hubs: ['Dubai Logistics City (UAE)', 'Riyadh (Saudi Arabia)', 'Doha (Qatar)'],
      summary: 'Heavy infrastructure support specializing in extreme temperature curing, heavy port aprons, airport taxiways, and subterranean mining applications.'
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Brand Story per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-14 pb-6 sm:pb-8">
        <div className="bg-[#f4f6f8] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] p-5 sm:p-8 md:p-14 shadow-bubble border border-[#e5e9ee] text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#006e21] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">
            <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006e21]" />
            <span>{aboutInfo?.heroBadge || 'ORIGIN & COMPANY PROFILE'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#00356a] leading-tight tracking-tight">
            {aboutInfo?.title || 'About HOKI Structural Fiber'}
          </h1>

          <p className="mt-3 sm:mt-4 text-base sm:text-xl font-bold text-[#006e21]">
            {aboutInfo?.subtitle || 'Strength, Reliability, Solutions — Built to Perform.'}
          </p>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-[#00356a]/80 leading-relaxed max-w-3xl mx-auto font-normal whitespace-pre-line">
            {aboutInfo?.description || 'Founded with a singular civil engineering thesis, HOKI manufactures high-performance cold-drawn hooked and collated 3D steel fibers designed to displace traditional welded wire mesh and rebar cages. We enable structural engineers to accelerate construction schedules by 40%, eliminate slab curling and joint spalling, and achieve auditable carbon abatement.'}
          </p>

          {/* Mission Quote Banner */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-white border border-[#e2e6eb] shadow-bubble-sm max-w-2xl mx-auto">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#006e21] block mb-1">
              {aboutInfo?.missionTitle || 'Mission for Sustainable Concrete Flooring'}
            </span>
            <p className="text-xs sm:text-base font-semibold text-[#00356a] italic">
              {aboutInfo?.missionQuote || '"Sustainability isn\'t a trend, it\'s how we build a better tomorrow."'}
            </p>
          </div>

          {/* Dynamic About Brand Hero Banner */}
          {aboutHeroImage && (
            <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-bubble border border-[#e2e6eb] h-48 sm:h-72 md:h-80 relative group">
              <img
                src={aboutHeroImage}
                alt="HOKI Sustainable Engineering"
                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00356a]/90 via-[#00356a]/30 to-transparent flex items-end p-4 sm:p-7 text-left">
                <div>
                  <span className="text-[9px] sm:text-xs uppercase font-bold tracking-widest text-[#006e21] bg-white/95 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full inline-block mb-1 backdrop-blur-sm">
                    {aboutInfo?.heroImageBadge || 'Alpha Hub Continuous Global Operations'}
                  </span>
                  <p className="text-white text-xs sm:text-base font-bold line-clamp-2">
                    {aboutInfo?.heroImageCaption || 'Pioneering High-Tensile Steel Fiber Technology for Net-Zero Infrastructure'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Leadership & Department Heads per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
            ORGANIZATIONAL STRUCTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
            {aboutInfo?.leadershipTitle || 'Leadership & Department Heads'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
            {aboutInfo?.leadershipSubtitle || 'Guided by veteran structural engineers, metallurgical innovators, and global supply chain directors.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(leadershipHeads && leadershipHeads.length > 0 ? leadershipHeads : LEADERSHIP_HEADS).map((head, idx) => {
            const avatarUrl = head.avatar || branding?.aboutLeadershipAvatars?.[head.name] || '/images/team/placeholder.svg';
            return (
              <div
                key={head.id || idx}
                className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between hover:border-[#006e21]/30 transition-all"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-bubble-sm border border-[#e2e6eb] shrink-0 bg-[#f4f6f8]">
                      <img
                        src={avatarUrl}
                        alt={head.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // fallback image
                          (e.target as HTMLImageElement).src = '/images/team/placeholder.svg';
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider block">
                        {head.department}
                      </span>
                      <h3 className="text-base font-bold text-[#00356a]">
                        {head.name}
                      </h3>
                      <span className="text-xs text-[#00356a]/70 block font-medium">
                        {head.title}
                      </span>
                    </div>
                  </div>

                {head.credentials && (
                  <div className="p-3 rounded-xl bg-[#f4f6f8] border border-[#e2e6eb] mb-3 text-xs">
                    <span className="font-semibold text-[#00356a] block text-[11px] mb-0.5">
                      Credentials:
                    </span>
                    <span className="text-[#00356a]/70">{head.credentials}</span>
                  </div>
                )}

                <p className="text-xs text-[#00356a]/75 leading-relaxed">
                  {head.focus || head.bio}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-xs text-[#006e21] font-semibold">
                <span>Verified Direct Leadership</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          );
        })}
        </div>
      </section>

      {/* 3. HOKI Technology & Core Delivery (4 Pillars per Mindnote) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              FOUNDATIONAL CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              HOKI Technology & Core Delivery
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              Four integrated pillars that ensure precision from initial specification through jobsite laser-screed placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-bubble-sm border border-[#e2e6eb] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  01
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  High-Performance Product Range
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  HF-8060, HF-6535, and HF-10020 series engineered for cold-drawn tensile strengths up to 2,200 MPa with proprietary ITZ micro-roughness.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#00356a]/60">
                ASTM A820 & EN 14889-1
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-bubble-sm border border-[#e2e6eb] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  02
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  Technical Guidance & Dosage
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  TR34 4th Edition and ACI 544 plastic yield-line calculations, rebar displacement modeling, and point-load optimization.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#00356a]/60">
                Peer-Reviewed Dosing
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-bubble-sm border border-[#e2e6eb] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  03
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  Reliable Supply & Logistics
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  50,000 MT/year production capacity backed by automated warehouse inventory and fast containerized export shipping.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#00356a]/60">
                Global Network Ready
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-bubble-sm border border-[#e2e6eb] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  04
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  Project Support to Execution
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  Direct jobsite presence during trial batches, ready-mix truck dosing supervision, and ASTM C1609 beam test verification.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f3f5] text-[11px] font-semibold text-[#00356a]/60">
                End-to-End Assurance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Manufacturing Capability & Alpha Hub Infrastructure per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              {aboutInfo?.factoryBadge || 'MANUFACTURING EXCELLENCE'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              {aboutInfo?.factoryTitle || 'Manufacturing Capability'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              {aboutInfo?.factorySubtitle || 'State-of-the-art robotic cold-drawing and collating technology at the Alpha Hub facility.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="bg-[#f4f6f8] rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm">
                <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#006e21]" />
                  Advanced Fiber Forming & Hooked-End Anchorage
                </h4>
                <p className="text-xs text-[#00356a]/75 mt-1 leading-relaxed">
                  High-speed forming tools shape precision bi-directional mechanical hooks that engage concrete aggregate particles at the microscopic scale to prevent pull-out failure.
                </p>
              </div>

              <div className="bg-[#f4f6f8] rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm">
                <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#006e21]" />
                  Controlled Wire Material Selection
                </h4>
                <p className="text-xs text-[#00356a]/75 mt-1 leading-relaxed">
                  Only certified prime low-carbon and high-carbon wire rods with strictly controlled metallurgy are drawn, ensuring consistent tensile ductility and bending performance.
                </p>
              </div>

              <div className="bg-[#f4f6f8] rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm">
                <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-2">
                  <Factory className="w-4 h-4 text-[#006e21]" />
                  Stable Production Capacity & Constant Output
                </h4>
                <p className="text-xs text-[#00356a]/75 mt-1 leading-relaxed">
                  Multiple parallel high-speed lines ensure uninterrupted fulfillment for mega-projects exceeding 200,000 m² without supply delays.
                </p>
              </div>

              <div className="bg-[#f4f6f8] rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm">
                <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-[#006e21]" />
                  Export-Ready Packaging & Supply Coordination
                </h4>
                <p className="text-xs text-[#00356a]/75 mt-1 leading-relaxed">
                  Collated bundles packed in 20 kg moisture-resistant poly-lined paper sacks or 1,000 kg bulk big-bags with moisture desiccant, certified for containerized ocean transport.
                </p>
              </div>
            </div>

            {/* Photo Card */}
            <div className="bg-[#f4f6f8] rounded-3xl p-6 border border-[#e2e6eb] shadow-bubble-sm">
              <div className="h-72 sm:h-80 rounded-2xl overflow-hidden mb-4 relative shadow-bubble-sm border border-[#dce0e6]">
                <img
                  src={aboutFactoryImage}
                  alt="Alpha Hub manufacturing lines and automated inspection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#00356a]/90 text-white text-[10px] font-mono px-3 py-1 rounded-full backdrop-blur-md">
                  ALPHA HUB • HIGH-SPEED WIRE DRAWING LINE
                </div>
              </div>
              <p className="text-xs text-[#00356a]/75 italic text-center">
                {aboutInfo?.factoryCaption || 'Real-time optical dimensional verification and continuous cold-drawing monitoring at Alpha Hub.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Production Process & Quality Control (4-Stage Process & 3 Pillars per Mindnote) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              QUALITY ASSURANCE PROTOCOL
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              Production Process & Quality Control
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              Rigorous 4-stage manufacturing cycle governed by 3 core metallurgical quality pillars.
            </p>
          </div>

          {/* 4-Stage Production Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm">
              <span className="text-xs font-extrabold text-[#00356a] bg-[#f4f6f8] px-2.5 py-1 rounded-full">
                STAGE 1
              </span>
              <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider mt-2">
                Wire Preparation
              </h4>
              <p className="text-[11px] text-[#00356a]/70 mt-1">
                Chemical descaling, inline ultrasonic cleansing, and multi-pass cold drawing to target diameter (0.55mm – 0.75mm).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm">
              <span className="text-xs font-extrabold text-[#00356a] bg-[#f4f6f8] px-2.5 py-1 rounded-full">
                STAGE 2
              </span>
              <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider mt-2">
                Fiber Forming
              </h4>
              <p className="text-[11px] text-[#00356a]/70 mt-1">
                Automated rotary crimping and high-velocity hooked-end cutting with water-soluble collation strip application.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm">
              <span className="text-xs font-extrabold text-[#00356a] bg-[#f4f6f8] px-2.5 py-1 rounded-full">
                STAGE 3
              </span>
              <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider mt-2">
                Dimension Check
              </h4>
              <p className="text-[11px] text-[#00356a]/70 mt-1">
                Automated Optical Inspection (AOI) with 0.01mm tolerance verifying length, diameter, and hook angle for every batch.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm">
              <span className="text-xs font-extrabold text-[#00356a] bg-[#f4f6f8] px-2.5 py-1 rounded-full">
                STAGE 4
              </span>
              <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider mt-2">
                Packing & Dispatch
              </h4>
              <p className="text-[11px] text-[#00356a]/70 mt-1">
                Automated bagging, barcode batch tracking, robotic palletizing, and stretch-wrapping for global freight dispatch.
              </p>
            </div>
          </div>

          {/* 3 Core Quality Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#e2e6eb]">
            <div className="p-6 rounded-3xl bg-white border border-[#e5e9ee] shadow-bubble-sm">
              <span className="text-[11px] font-bold text-[#006e21] uppercase tracking-wider block mb-1">
                Core Pillar 1
              </span>
              <h3 className="text-base font-bold text-[#00356a]">
                Dimensional Consistency
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-2 leading-relaxed">
                Zero tolerance for tangled or oversized fibers. Every fiber conforms strictly to aspect ratio limits (±2%) to guarantee homogeneous ready-mix dispersion without balling.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e5e9ee] shadow-bubble-sm">
              <span className="text-[11px] font-bold text-[#006e21] uppercase tracking-wider block mb-1">
                Core Pillar 2
              </span>
              <h3 className="text-base font-bold text-[#00356a]">
                Material Performance
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-2 leading-relaxed">
                Continuous tensile testing in accordance with ASTM A820 and EN 14889-1 guarantees minimum yield strengths of 1,200 to 1,500 MPa and 90° bend ductility.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e5e9ee] shadow-bubble-sm">
              <span className="text-[11px] font-bold text-[#006e21] uppercase tracking-wider block mb-1">
                Core Pillar 3
              </span>
              <h3 className="text-base font-bold text-[#00356a]">
                Batch Reliability
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-2 leading-relaxed">
                Full heat-number and mill test certificate (MTC) traceability from raw steel rod through finished pallet, downloadable instantly via our authorized verification system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Global Presence & International Partner Network per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              WORLDWIDE REACH
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              Global Presence & International Partner Network
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              Delivering certified structural steel fibers to heavy infrastructure projects across four continents.
            </p>
          </div>

          {/* Region Switcher Pills */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {(['apac', 'europe', 'americas', 'mena'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => setActivePartnerRegion(reg)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activePartnerRegion === reg
                    ? 'bg-[#00356a] text-white shadow-bubble-sm'
                    : 'bg-[#f4f6f8] text-[#00356a] border border-[#e2e6eb] hover:bg-white'
                }`}
              >
                {reg === 'apac' ? 'Asia-Pacific' : reg === 'europe' ? 'Europe & UK' : reg === 'americas' ? 'Americas' : 'Middle East & Africa'}
              </button>
            ))}
          </div>

          {/* Active Partner Region Card */}
          <div className="bg-[#f4f6f8] rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#e2e6eb] shadow-bubble-sm mb-10">
            <h3 className="text-sm sm:text-lg font-bold text-[#00356a] mb-2">
              {partnerNetwork[activePartnerRegion].regionName}
            </h3>
            <p className="text-xs text-[#00356a]/75 mb-5 sm:mb-6 leading-relaxed">
              {partnerNetwork[activePartnerRegion].summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {partnerNetwork[activePartnerRegion].hubs.map((hub, i) => (
                <div key={i} className="bg-white p-2.5 sm:p-3 rounded-xl border border-[#e2e6eb] text-center shadow-bubble-sm flex items-center justify-center min-h-[44px]">
                  <span className="text-[11px] sm:text-xs font-bold text-[#00356a] block leading-tight">{hub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Global Structural Advisory Board */}
          <div className="pt-8 border-t border-[#e2e6eb]">
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-[#006e21] uppercase tracking-wider block">
                {aboutInfo?.advisorySubtitle || 'Scientific Governance'}
              </span>
              <h3 className="text-xl font-bold text-[#00356a]">
                {aboutInfo?.advisoryTitle || 'Global Structural Advisory Board'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(advisoryMembers && advisoryMembers.length > 0 ? advisoryMembers : ADVISORY_BOARD).map((advisor, i) => {
                const advisorAvatarUrl = advisor.avatar || branding?.aboutAdvisoryAvatars?.[advisor.name] || '/images/team/placeholder.svg';
                return (
                  <div
                    key={advisor.id || i}
                    className="bg-[#f4f6f8] rounded-2xl p-6 border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between hover:border-[#006e21]/30 transition-all"
                  >
                    <div>
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#006e21]/30 mx-auto shadow-bubble-sm bg-white">
                        <img
                          src={advisorAvatarUrl}
                          alt={advisor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/team/placeholder.svg';
                          }}
                        />
                      </div>
                    <div className="text-center mb-3">
                      <h4 className="text-sm font-bold text-[#00356a]">{advisor.name}</h4>
                      <span className="text-xs text-[#006e21] font-semibold block">{advisor.role || (advisor as any).title}</span>
                      {advisor.specialization && (
                        <span className="text-[10px] text-[#00356a]/60 block">{advisor.specialization}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#00356a]/75 leading-relaxed text-center">
                      {advisor.bio}
                    </p>
                  </div>
                  <button
                    onClick={onOpenConsultation}
                    className="mt-4 pt-3 border-t border-[#e2e6eb] w-full text-center text-xs font-bold text-[#00356a] hover:text-[#006e21] transition-colors cursor-pointer"
                  >
                    {advisor.actionText || 'Consult Advisory Fellow'} →
                  </button>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Corporate Timeline */}
      <section id="evolution-timeline" className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mb-12">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              OUR JOURNEY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              Corporate Evolution Timeline
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              From foundational composite modeling to delivering over 1,000,000 m² of jointless industrial flooring worldwide.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {EVOLUTION_TIMELINE.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  item.isHighlight
                    ? 'bg-white border-[#006e21]/40 shadow-bubble'
                    : 'bg-white/80 border-[#e2e6eb] shadow-bubble-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                    {item.year}
                  </span>
                  <h4 className="text-sm font-bold text-[#00356a]">{item.title}</h4>
                </div>
                <p className="text-xs text-[#00356a]/75 mt-2 pl-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:shadow-bubble transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Partner With Our Engineering Leadership</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
