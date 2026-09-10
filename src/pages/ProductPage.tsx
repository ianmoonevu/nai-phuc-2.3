import React, { useState } from 'react';
import { FIBER_PRODUCTS } from '../data/mockData';
import { FiberProduct } from '../types';
import {
  FileText,
  Download,
  CheckCircle2,
  Sliders,
  Award,
  Layers,
  Shield,
  Zap,
  Microscope,
  ArrowRight,
  PackageCheck,
  Building2,
  Warehouse,
  Truck,
  FileSpreadsheet,
  Check,
  HelpCircle,
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface ProductPageProps {
  onOpenDossier: (product: FiberProduct) => void;
  onOpenConsultation: () => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  onOpenDossier,
  onOpenConsultation,
}) => {
  // Active Series Tab
  const [activeTab, setActiveTab] = useState<string>('hf-8060');

  // Interactive Product Selector State
  const [selectedApplication, setSelectedApplication] = useState('heavy-duty');
  const [slabThickness, setSlabThickness] = useState<number>(200); // 120-350 mm
  const [dynamicWheelLoad, setDynamicWheelLoad] = useState<number>(80); // 20-200 kN

  // Download feedback
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Dynamic selector recommendation
  const recommendedSeries =
    dynamicWheelLoad >= 100 || selectedApplication === 'ports-tunnels'
      ? 'HF-8060 Series'
      : selectedApplication === 'precast'
      ? 'HF-10020 Series'
      : 'HF-6535 Series';

  const recommendedDosage = Math.min(
    42,
    Math.max(
      20,
      Math.round(
        (dynamicWheelLoad * 0.16 + (320 - slabThickness) * 0.05) * 10
      ) / 10
    )
  );

  const activeProduct = FIBER_PRODUCTS.find((p) => p.id === activeTab) || FIBER_PRODUCTS[0];

  const handleDownload = (docName: string, seriesName: string) => {
    setDownloadSuccess(`${seriesName} - ${docName}`);
    setTimeout(() => {
      const blob = new Blob([
        `HOKI STRUCTURAL FIBER OFFICIAL DOCUMENT\nProduct: ${seriesName}\nDocument Type: ${docName}\nStandard Compliance: ASTM A820 Type I / EN 14889-1 System 1 / CE Certified\nIssued by HOKI Quality Directorate.`
      ], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HOKI-${seriesName.replace(/\s+/g, '-')}-${docName.replace(/\s+/g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }, 400);

    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Header Hero Module per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-14 pb-6 sm:pb-8">
        <div className="bg-[#f4f6f8] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] p-5 sm:p-8 md:p-14 shadow-bubble border border-[#e5e9ee] text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#006e21] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006e21]" />
            <span>CERTIFIED STEEL FIBER PORTFOLIO</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#00356a] leading-tight tracking-tight">
            High-Performance Steel Fiber Products
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-lg font-bold text-[#006e21]">
            ASTM A820 Type I • EN 14889-1 System 1 • CE Compliant
          </p>

          <p className="mt-3 text-xs sm:text-base text-[#00356a]/80 leading-relaxed max-w-3xl mx-auto font-normal">
            Engineered cold-drawn hooked and high-tensile steel fibers tailored for jointless industrial floors, heavy logistics runways, precast elements, and high-ductility tunnel linings.
          </p>

          {/* Direct Series Switcher Pills */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {FIBER_PRODUCTS.map((prod) => (
              <button
                key={prod.id}
                onClick={() => setActiveTab(prod.id)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[44px] ${
                  activeTab === prod.id
                    ? 'bg-[#00356a] text-white shadow-bubble-md scale-102 sm:scale-105'
                    : 'bg-white text-[#00356a] border border-[#e2e6eb] shadow-bubble-sm hover:bg-[#f8fafc]'
                }`}
              >
                {prod.name} ({prod.aspectRatio})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#006e21] text-white px-5 py-3 rounded-2xl shadow-bubble-lg flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Generating & Downloading: {downloadSuccess}</span>
        </div>
      )}

      {/* 2. Detailed Product Series Showcase (HF-8060, HF-6535, HF-10020 per Mindnote) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Product Imagery & Key Badges */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-bubble border border-[#e2e6eb] aspect-4/3 bg-slate-100 relative group">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#006e21] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {activeProduct.aspectRatio} Aspect Ratio
                </div>
                <div className="absolute bottom-4 right-4 bg-[#00356a]/90 backdrop-blur-xs text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                  {activeProduct.fiberCountPerKg}
                </div>
              </div>

              {/* Quick Spec Matrix */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
                  <span className="text-[10px] uppercase font-bold text-[#00356a]/60 block">
                    Fiber Length
                  </span>
                  <span className="text-sm font-extrabold text-[#00356a]">
                    {activeProduct.length}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
                  <span className="text-[10px] uppercase font-bold text-[#00356a]/60 block">
                    Wire Diameter
                  </span>
                  <span className="text-sm font-extrabold text-[#00356a]">
                    {activeProduct.diameter}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
                  <span className="text-[10px] uppercase font-bold text-[#00356a]/60 block">
                    Tensile Range
                  </span>
                  <span className="text-sm font-extrabold text-[#006e21]">
                    {activeProduct.tensileStrength}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
                  <span className="text-[10px] uppercase font-bold text-[#00356a]/60 block">
                    Standard Code
                  </span>
                  <span className="text-sm font-extrabold text-[#00356a]">
                    {activeProduct.standardCodes?.[0] || activeProduct.codes?.[0] || activeProduct.standards?.[0] || 'ASTM A820'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Technical Specifications, Available Classes & Downloads */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-[#006e21] tracking-wider uppercase bg-[#006e21]/10 px-3 py-1 rounded-full">
                    {activeProduct.name}
                  </span>
                  <span className="text-xs font-semibold text-[#00356a]/70">
                    Hooked-End Cold-Drawn Steel Fiber
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00356a] mt-2">
                  {activeProduct.series}
                </h2>

                <p className="text-xs sm:text-sm text-[#00356a]/75 mt-3 leading-relaxed">
                  {activeProduct.description}
                </p>

                {/* Tensile Strength Classes per Mindnote */}
                <div className="mt-5 p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#00356a] mb-2">
                    Available Tensile Classes & Spec Codes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(activeProduct.tensileClasses || ['1200 MPa', '1400 MPa', '1500 MPa']).map((cls, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-white border border-[#dce0e6] text-[11px] font-bold text-[#00356a] shadow-bubble-sm"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#e2e6eb] flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold text-[#00356a]/60 uppercase mr-2 self-center">
                      Designation Codes:
                    </span>
                    {(activeProduct.standardCodes || activeProduct.codes || activeProduct.standards || []).map((code, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-white/80 text-[10px] font-mono font-bold text-[#006e21] border border-[#e2e6eb]"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Applications per Mindnote */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#00356a] mb-2">
                    Engineered Sector Applications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(activeProduct.applications || (activeProduct.primaryApplication ? activeProduct.primaryApplication.split(', ') : [])).map((app, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#e2e6eb] text-xs font-semibold text-[#00356a]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006e21] shrink-0" />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: TDS, SDS, Mill Test Certificate & Request Sample */}
              <div className="mt-8 pt-6 border-t border-[#f0f3f5] flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => handleDownload('Technical Data Sheet (TDS)', activeProduct.name)}
                  className="px-4 sm:px-5 py-2.5 rounded-full bg-[#00356a] text-white hover:bg-[#002244] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Download className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Download TDS</span>
                </button>

                <button
                  onClick={() => handleDownload('Safety Data Sheet (SDS)', activeProduct.name)}
                  className="px-4 sm:px-5 py-2.5 rounded-full bg-white text-[#00356a] border border-[#e2e6eb] shadow-bubble-sm hover:bg-[#f8fafc] text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Download SDS</span>
                </button>

                <button
                  onClick={() => handleDownload('Mill Test Certificate (MTC)', activeProduct.name)}
                  className="px-4 sm:px-5 py-2.5 rounded-full bg-white text-[#00356a] border border-[#e2e6eb] shadow-bubble-sm hover:bg-[#f8fafc] text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Award className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Mill Certificate</span>
                </button>

                <button
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto sm:ml-auto px-6 py-2.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-bubble-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Request Sample Box</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Comparison Matrix & Interactive Selector per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              SELECTION INTELLIGENCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              Product Comparison & Selector
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              Compare physical dimensions, aspect ratios, and dosing guidelines to configure the exact reinforcement solution for your structural specifications.
            </p>
          </div>

          {/* Multi-Criteria Matrix Table */}
          <div className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] overflow-x-auto mb-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#00356a] mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#006e21]" />
              <span>Multi-Criteria Specification Matrix</span>
            </h3>

            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-[#e2e6eb] bg-[#f4f6f8]">
                  <th className="py-3 px-4 font-bold text-[#00356a]">Parameter</th>
                  <th className="py-3 px-4 font-bold text-[#00356a]">HF-8060 Series</th>
                  <th className="py-3 px-4 font-bold text-[#00356a]">HF-6535 Series</th>
                  <th className="py-3 px-4 font-bold text-[#00356a]">HF-10020 Series</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3f5]">
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#00356a]">Fiber Length (L)</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-bold">60 mm</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-bold">35 mm</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-bold">20 mm</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#00356a]">Wire Diameter (d)</td>
                  <td className="py-3 px-4 text-[#00356a]/80">0.75 mm</td>
                  <td className="py-3 px-4 text-[#00356a]/80">0.55 mm</td>
                  <td className="py-3 px-4 text-[#00356a]/80">0.20 mm</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#00356a]">Aspect Ratio (L/d)</td>
                  <td className="py-3 px-4 font-bold text-[#006e21]">80</td>
                  <td className="py-3 px-4 font-bold text-[#006e21]">65</td>
                  <td className="py-3 px-4 font-bold text-[#006e21]">100</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#00356a]">Fibers per Kilogram</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-mono">4,220 pcs/kg</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-mono">10,970 pcs/kg</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-mono">90,110 pcs/kg</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#00356a]">Tensile Strength</td>
                  <td className="py-3 px-4 text-[#00356a]/80">1,200 – 1,500 MPa</td>
                  <td className="py-3 px-4 text-[#00356a]/80">1,100 – 1,500 MPa</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-bold text-[#006e21]">≥ 2,000 MPa (Ultra-High)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#00356a]">Primary Role</td>
                  <td className="py-3 px-4 text-[#00356a]/80">Heavy Load & Deep Slabs</td>
                  <td className="py-3 px-4 text-[#00356a]/80">Crack Control & Standard Floors</td>
                  <td className="py-3 px-4 text-[#00356a]/80">High-Ductility Precast & UHPC</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#00356a]">Typical Dosage</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-semibold">20 – 35 kg/m³</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-semibold">15 – 30 kg/m³</td>
                  <td className="py-3 px-4 text-[#00356a]/80 font-semibold">30 – 60 kg/m³</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interactive Selector by Load and Slab Type */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee]">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#00356a] mb-2 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#006e21]" />
              <span>Interactive Product & Dosage Selector</span>
            </h3>
            <p className="text-xs text-[#00356a]/70 mb-6">
              Adjust project parameters to receive instant TR34 calculation model recommendations.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#00356a] uppercase block mb-2">
                    Application Sector
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'heavy-duty', label: 'Industrial Slabs' },
                      { id: 'warehouse', label: 'Warehouse / Logistics' },
                      { id: 'ports-tunnels', label: 'Ports / Hardstands' },
                      { id: 'precast', label: 'Precast Infrastructure' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedApplication(item.id)}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                          selectedApplication === item.id
                            ? 'bg-[#00356a] text-white shadow-sm font-bold'
                            : 'bg-[#f4f6f8] text-[#00356a] border border-[#e2e6eb] hover:bg-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#00356a] mb-2">
                    <span>Design Slab Thickness:</span>
                    <span className="text-[#006e21] font-extrabold text-sm">{slabThickness} mm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="350"
                    step="10"
                    value={slabThickness}
                    onChange={(e) => setSlabThickness(Number(e.target.value))}
                    className="w-full accent-[#006e21]"
                  />
                  <div className="flex justify-between text-[10px] text-[#00356a]/50 mt-1 font-mono">
                    <span>120 mm (Light Duty)</span>
                    <span>200 mm (Standard)</span>
                    <span>350 mm (Heavy Port)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#00356a] mb-2">
                    <span>Dynamic Wheel / Point Load:</span>
                    <span className="text-[#006e21] font-extrabold text-sm">{dynamicWheelLoad} kN</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="5"
                    value={dynamicWheelLoad}
                    onChange={(e) => setDynamicWheelLoad(Number(e.target.value))}
                    className="w-full accent-[#006e21]"
                  />
                  <div className="flex justify-between text-[10px] text-[#00356a]/50 mt-1 font-mono">
                    <span>20 kN (Light AGV)</span>
                    <span>80 kN (Reach Truck)</span>
                    <span>200 kN (Container Mover)</span>
                  </div>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="lg:col-span-5 bg-[#f4f6f8] rounded-2xl p-6 border border-[#e2e6eb] shadow-bubble-sm text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                  TR34 Algorithmic Recommendation
                </span>

                <div className="text-2xl font-extrabold text-[#00356a] mt-3">
                  {recommendedSeries}
                </div>

                <div className="text-3xl sm:text-4xl font-black text-[#006e21] mt-2">
                  {recommendedDosage} <span className="text-sm font-bold text-[#00356a]">kg/m³</span>
                </div>

                <p className="text-xs text-[#00356a]/70 mt-2">
                  Recommended dosage based on TR34 4th Edition plastic yield moment capacity and subgrade reaction.
                </p>

                <div className="mt-4 pt-3 border-t border-[#e2e6eb] space-y-1.5 text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-[#00356a]/70">Mesh Displacement:</span>
                    <span className="font-bold text-[#006e21]">100% Rebar Replacement</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#00356a]/70">Crack Width Limit:</span>
                    <span className="font-bold text-[#00356a]">&le; 0.12 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#00356a]/70">Schedule Impact:</span>
                    <span className="font-bold text-[#006e21]">40% Faster Pour Rate</span>
                  </div>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="w-full mt-5 py-3 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#002244] transition-all cursor-pointer"
                >
                  Verify Calculations with an Engineer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technical Support (3 Pillars per Mindnote) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mb-10">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
              PROJECT PARTNERSHIP
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
              Technical Support from Design to Pour
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              Our structural engineers partner with you across every stage of your project lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  01
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  Fiber Selection & Dosage Recommendation
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  We analyze your geotechnical reports, slab wheel loads, and saw-cut joint configurations to recommend the optimum fiber series and minimum dosage requirement.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e6eb] text-xs font-bold text-[#00356a]">
                Custom TR34 Calculation Dossiers
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  02
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  Rebar Replacement & Code-Compliant Design
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  Our certified structural designers perform finite element slab modeling (FEM) to verify punching shear and perimeter moment resistance against national codes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e6eb] text-xs font-bold text-[#00356a]">
                Stamped Engineering Submittals
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full">
                  03
                </span>
                <h3 className="text-base font-bold text-[#00356a] mt-3">
                  On-Site Dosing & Concrete Pour Supervision
                </h3>
                <p className="text-xs text-[#00356a]/75 mt-2 leading-relaxed">
                  HOKI field engineers attend trial batch plant tests, supervise transit mixer dispensing, inspect fiber dispersion, and cast beam samples for ASTM C1609 testing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e6eb] text-xs font-bold text-[#00356a]">
                Jobsite Field Assurance
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-3.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:shadow-bubble transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Schedule Technical Consultation with an Engineer</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
