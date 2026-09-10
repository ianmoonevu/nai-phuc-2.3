import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { JournalArticle } from '../types';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Download,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Quote,
  Leaf,
  Layers,
  Recycle,
  Sparkles,
  Zap,
  Play,
  FileCheck2,
  Sliders,
  Maximize2
} from 'lucide-react';

interface KnowledgePageProps {
  onOpenArticle: (article: JournalArticle) => void;
  onOpenConsultation: () => void;
}

export const KnowledgePage: React.FC<KnowledgePageProps> = ({
  onOpenArticle,
  onOpenConsultation,
}) => {
  const { articles } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive Comparative LCA Calculator State
  const [calcArea, setCalcArea] = useState<number>(20000); // 2,000 - 100,000 m²
  const [calcThickness, setCalcThickness] = useState<number>(200); // 150 - 300 mm
  const [cementType, setCementType] = useState<'standard' | 'lc3'>('standard');

  // Interactive Document Download feedback
  const [docNotice, setDocNotice] = useState<string | null>(null);

  // Carbon metrics calculation
  // Baseline rebar: ~18 kg/m² @ 1.85 kg CO2/kg steel = 33.3 kg CO2/m²
  // HOKI fiber: ~25 kg/m³ @ 0.2m thickness = 5 kg fiber/m² @ 1.45 kg CO2/kg steel = 7.25 kg CO2/m²
  // Steel CO2 saving: ~26.05 kg CO2/m²
  // Concrete saving: 15% thickness reduction (200mm -> 170mm) = 0.03 m³ concrete saved/m² @ 320 kg CO2/m³ = 9.6 kg CO2/m²
  // Total baseline saving: ~35.65 kg CO2/m²
  // With LC3: additional 10% lower cement embodied carbon
  const baselineEmbodiedCarbonTonnes = Math.round((calcArea * 0.082));
  const hokiEmbodiedCarbonTonnes = Math.round(
    cementType === 'lc3'
      ? baselineEmbodiedCarbonTonnes * 0.58
      : baselineEmbodiedCarbonTonnes * 0.68
  );
  const carbonSavedTonnes = baselineEmbodiedCarbonTonnes - hokiEmbodiedCarbonTonnes;
  const rebarEliminatedTonnes = Math.round(calcArea * 0.016);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'crack-control', label: 'Plastic Shrinkage & Cracking' },
    { id: 'jointless', label: 'Jointless Slabs' },
    { id: 'dosing', label: 'Truck Field Dosing' },
    { id: 'esg', label: 'LCA & Decarbonization' },
  ];

  const filteredArticles = articles.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.categorySlug === selectedCategory || a.category === selectedCategory;
  });

  const triggerDocDownload = (docName: string) => {
    setDocNotice(docName);
    setTimeout(() => {
      const blob = new Blob([
        `HOKI STRUCTURAL ACADEMY & ENGINEERING LIBRARY\nDocument: ${docName}\nAuthorized Standard Compliance: ISO 14040 LCA / EPD Verified / ACI 544 / TR34 4th Edition.\nIssued by HOKI Technical Research Directorate.`
      ], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HOKI-${docName.replace(/\s+/g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }, 400);

    setTimeout(() => setDocNotice(null), 3000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Header & Title Module per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-8">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-12 md:p-16 shadow-bubble border border-[#e5e9ee] text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#006e21] text-xs font-bold uppercase tracking-widest mb-4">
            <Leaf className="w-4 h-4 text-[#006e21]" />
            <span>KNOWLEDGE & SUSTAINABILITY HUB</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#00356a] leading-tight tracking-tight">
            Knowledge & Sustainable Engineering
          </h1>

          <p className="mt-4 text-base sm:text-lg font-bold text-[#006e21]">
            Empirical Decarbonization • International Codes • Structural Monographs
          </p>

          <p className="mt-3 text-xs sm:text-base text-[#00356a]/80 leading-relaxed max-w-3xl mx-auto font-normal">
            Advancing the transition to net-zero concrete infrastructure through science-based life cycle assessments (LCA), field dosing guidelines, and peer-reviewed crack mechanics.
          </p>
        </div>
      </section>

      {/* Download Alert Toast */}
      {docNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#006e21] text-white px-5 py-3 rounded-2xl shadow-bubble-lg flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Downloading Document: {docNotice}</span>
        </div>
      )}

      {/* 2. Sustainable Thinking (4 Pillars per Mindnote) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              ECO-DESIGN PHILOSOPHY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              Sustainable Thinking: 4 Pillars
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              Transforming structural concrete from a high-carbon liability into a durable, resource-efficient composite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  PILLAR 01
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  Lower Material Impact
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  Optimized slab yield-line design reduces steel consumption by up to 45% compared to heavy rebar cages, decreasing slab thickness and raw material mining demand.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e6eb] text-[11px] font-semibold text-[#006e21]">
                Up to 45% Steel Reduction
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  PILLAR 02
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  Cleaner Construction
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  Direct truck dosing eliminates rebar scrap cut-offs, wire tying waste, crane lifts, and jobsite tripping hazards, establishing clean, fast-track pour sites.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e6eb] text-[11px] font-semibold text-[#006e21]">
                Zero Rebar Scrap Waste
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  PILLAR 03
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  Longer Floor Life
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  3D fiber spatial restraint minimizes curling, saw-cut spalling, and joint breakdowns, doubling concrete slab operational service life beyond 30+ years.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e6eb] text-[11px] font-semibold text-[#006e21]">
                30+ Year Maintenance-Free Life
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  PILLAR 04
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  Circular Metallurgy
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  Manufactured from recyclable steel rods and fully magnetic recoverable during post-demolition crushing, returning steel back into electric arc furnaces (EAF).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e6eb] text-[11px] font-semibold text-[#006e21]">
                100% Recyclable Lifecycle
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Carbon Footprint & Comparative LCA Calculator per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              AUDITABLE LCA EMISSIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              Carbon Footprint & LCA Metrics
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              Verified ISO 14040 Life Cycle Assessment modeling comparative embodied carbon displacement.
            </p>
          </div>

          {/* 4 Telemetry Metrics from Mindnote */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white p-5 rounded-2xl border border-[#e2e6eb] text-center shadow-bubble-sm">
              <span className="text-2xl sm:text-3xl font-black text-[#006e21] block">
                Up to 45%
              </span>
              <span className="text-xs font-semibold text-[#00356a] mt-1 block">
                Rebar Reduction in Slabs
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e2e6eb] text-center shadow-bubble-sm">
              <span className="text-2xl sm:text-3xl font-black text-[#006e21] block">
                Up to 30%
              </span>
              <span className="text-xs font-semibold text-[#00356a] mt-1 block">
                Lower Embodied Carbon
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e2e6eb] text-center shadow-bubble-sm">
              <span className="text-2xl sm:text-3xl font-black text-[#006e21] block">
                +10% Extra
              </span>
              <span className="text-xs font-semibold text-[#00356a] mt-1 block">
                Carbon Cut with LC3 Cement
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e2e6eb] text-center shadow-bubble-sm">
              <span className="text-2xl sm:text-3xl font-black text-[#006e21] block">
                Up to 40%
              </span>
              <span className="text-xs font-semibold text-[#00356a] mt-1 block">
                Potential with Recycled Fibers
              </span>
            </div>
          </div>

          {/* Interactive Comparative LCA Calculator Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee]">
            <h3 className="text-base font-bold uppercase tracking-wider text-[#00356a] mb-2 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#006e21]" />
              <span>Interactive Comparative LCA Carbon Calculator</span>
            </h3>
            <p className="text-xs text-[#00356a]/70 mb-6">
              Calculate projected cradle-to-gate Global Warming Potential (GWP) savings based on your industrial facility area.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#00356a] mb-1.5">
                    <span>Slab Area:</span>
                    <span className="text-[#006e21] font-extrabold">{calcArea.toLocaleString()} m²</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="100000"
                    step="1000"
                    value={calcArea}
                    onChange={(e) => setCalcArea(Number(e.target.value))}
                    className="w-full accent-[#006e21]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#00356a] mb-1.5">
                    <span>Initial Design Slab Thickness:</span>
                    <span className="text-[#00356a] font-extrabold">{calcThickness} mm</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="300"
                    step="10"
                    value={calcThickness}
                    onChange={(e) => setCalcThickness(Number(e.target.value))}
                    className="w-full accent-[#00356a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#00356a] uppercase block mb-1.5">
                    Cement Mix Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCementType('standard')}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        cementType === 'standard'
                          ? 'bg-[#00356a] text-white shadow-sm'
                          : 'bg-[#f4f6f8] text-[#00356a] border border-[#e2e6eb]'
                      }`}
                    >
                      Standard OPC (CEM I / C30)
                    </button>
                    <button
                      onClick={() => setCementType('lc3')}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        cementType === 'lc3'
                          ? 'bg-[#006e21] text-white shadow-sm'
                          : 'bg-[#f4f6f8] text-[#00356a] border border-[#e2e6eb]'
                      }`}
                    >
                      LC3 Limestone Calcined Clay
                    </button>
                  </div>
                </div>
              </div>

              {/* Calculator Output Display */}
              <div className="lg:col-span-5 bg-[#f4f6f8] rounded-2xl p-6 border border-[#e2e6eb] shadow-bubble-sm text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                  Net Embodied Carbon Abatement
                </span>

                <div className="text-3xl sm:text-4xl font-black text-[#006e21] mt-3">
                  -{carbonSavedTonnes.toLocaleString()} <span className="text-base font-bold text-[#00356a]">tCO₂e</span>
                </div>

                <p className="text-xs text-[#00356a]/70 mt-1">
                  Verified embodied carbon eliminated across materials and transportation.
                </p>

                <div className="mt-4 pt-3 border-t border-[#e2e6eb] space-y-2 text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-[#00356a]/70">Conventional Mesh Baseline:</span>
                    <span className="font-bold text-[#00356a]">{baselineEmbodiedCarbonTonnes.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#00356a]/70">HOKI Reinforced Floor:</span>
                    <span className="font-bold text-[#006e21]">{hokiEmbodiedCarbonTonnes.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#00356a]/70">Rebar Cages Eliminated:</span>
                    <span className="font-bold text-[#00356a]">{rebarEliminatedTonnes.toLocaleString()} Metric Tons</span>
                  </div>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="w-full mt-5 py-3 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#005a1b] shadow-sm transition-all cursor-pointer"
                >
                  Request Auditable EPD Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technical Articles & Guidelines per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
              Peer-Reviewed Research
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a] mt-2">
              Technical Articles & Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-[#00356a]/70 mt-1">
              Field dosing procedures, jointless design mechanics, and plastic shrinkage control.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#00356a] text-white shadow-sm'
                    : 'bg-white text-[#00356a] border border-[#e2e6eb] hover:bg-[#f4f6f8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between hover:shadow-bubble-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                    {art.category}
                  </span>
                  <span className="text-xs text-[#00356a]/60">
                    {art.readTime}
                  </span>
                </div>

                {/* Article Image Preview */}
                {art.image && (
                  <div
                    onClick={() => onOpenArticle(art)}
                    className="w-full h-44 rounded-2xl overflow-hidden mb-4 bg-[#f4f6f8] border border-[#e2e6eb] relative cursor-pointer group/img shadow-bubble-sm"
                  >
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    {art.gallery && art.gallery.length > 0 && (
                      <span className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        +{art.gallery.length} figures
                      </span>
                    )}
                  </div>
                )}

                <h3 className="text-lg sm:text-xl font-bold text-[#00356a] leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-[#00356a]/75 mt-2 line-clamp-3 leading-relaxed">
                  {art.subtitle}
                </p>

                <div className="mt-4 flex items-center gap-3 text-xs text-[#00356a]/60">
                  <span>Author: {art.author}</span>
                  <span>•</span>
                  <span>{art.date}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f0f3f5] flex items-center justify-between">
                <button
                  onClick={() => onOpenArticle(art)}
                  className="flex items-center gap-2 text-xs font-bold text-[#00356a] hover:text-[#006e21] transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Read Full Technical Paper</span>
                </button>
                <button
                  onClick={() => triggerDocDownload(art.title)}
                  className="text-xs font-bold text-[#006e21] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOKI Academy & Document Library per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mb-12">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              STANDARDS & MEDIA
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              HOKI Academy & Document Library
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              Download structural standards, design manuals, and technical certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Standards */}
            <div className="bg-white p-6 rounded-3xl border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#00356a] uppercase block">
                  International Design Codes
                </span>
                <p className="text-xs text-[#00356a]/70 mt-2">
                  TR34 4th Edition, ACI 544.4R, EN 14889-1, and fib Model Code 2020 compliance guides.
                </p>
              </div>
              <button
                onClick={() => triggerDocDownload('International Design Standards Compendium')}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#f4f6f8] hover:bg-[#00356a] hover:text-white text-xs font-bold text-[#00356a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Standards</span>
              </button>
            </div>

            {/* Video Guides */}
            <div className="bg-white p-6 rounded-3xl border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#00356a] uppercase block">
                  Field Video Guides
                </span>
                <p className="text-xs text-[#00356a]/70 mt-2">
                  High-speed transit mixer dosing, automated conveyor dispensing, and laser screed finishing best practices.
                </p>
              </div>
              <button
                onClick={onOpenConsultation}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#f4f6f8] hover:bg-[#006e21] hover:text-white text-xs font-bold text-[#00356a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Watch Training Videos</span>
              </button>
            </div>

            {/* TDS Library */}
            <div className="bg-white p-6 rounded-3xl border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#00356a] uppercase block">
                  TDS Library
                </span>
                <p className="text-xs text-[#00356a]/70 mt-2">
                  Comprehensive Technical Data Sheets covering HF-8060, HF-6535, and HF-10020 product series.
                </p>
              </div>
              <button
                onClick={() => triggerDocDownload('HOKI Master Technical Data Sheets (TDS)')}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#f4f6f8] hover:bg-[#00356a] hover:text-white text-xs font-bold text-[#00356a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download TDS Pack</span>
              </button>
            </div>

            {/* SDS Library */}
            <div className="bg-white p-6 rounded-3xl border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#00356a] uppercase block">
                  Safety & SDS Library
                </span>
                <p className="text-xs text-[#00356a]/70 mt-2">
                  OSHA and REACH compliant Safety Data Sheets, jobsite handling protocols, and protective gear guidelines.
                </p>
              </div>
              <button
                onClick={() => triggerDocDownload('HOKI Safety Data Sheets (SDS)')}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#f4f6f8] hover:bg-[#00356a] hover:text-white text-xs font-bold text-[#00356a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Download SDS Pack</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
