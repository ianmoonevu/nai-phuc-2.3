import React, { useState } from 'react';
import {
  Leaf,
  Recycle,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Download,
  FileCheck,
  BarChart3,
  Award,
  ArrowRight
} from 'lucide-react';

interface EsgPageProps {
  onOpenConsultation: () => void;
}

export const EsgPage: React.FC<EsgPageProps> = ({ onOpenConsultation }) => {
  const [projectArea, setProjectArea] = useState<number>(20000);

  // LCA Global Warming Potential (GWP) Calculations in tonnes CO2 equivalent
  // Scenario 1: Traditional Rebar Mesh + 220mm C30 concrete (~78 kg CO2e / m²)
  const conventionalCO2 = Math.round(projectArea * 0.078);
  // Scenario 2: HOKI HE-Series + 180mm C30 concrete (~46 kg CO2e / m²)
  const hokiBaselineCO2 = Math.round(projectArea * 0.046);
  // Scenario 3: HOKI Eco-Blend + LC3 Limestone Calcined Clay Cement (~28 kg CO2e / m²)
  const hokiEcoBlendCO2 = Math.round(projectArea * 0.028);

  const netSavingsTonnes = conventionalCO2 - hokiBaselineCO2;
  const netSavingsPercent = Math.round(((conventionalCO2 - hokiBaselineCO2) / conventionalCO2) * 100);

  const pillars = [
    {
      title: 'Lower Material Impact',
      metric: '-38% Steel Mass',
      desc: 'High tensile cold-drawn fibers provide isotropic reinforcement at 25-35 kg/m³, replacing up to 80 kg/m² of heavy double welded rebar mesh and cut-off waste.',
      icon: <TrendingDown className="w-6 h-6 text-[#006e21]" />
    },
    {
      title: 'Cleaner Construction',
      metric: 'Zero Tie-Wire Waste',
      desc: 'Eliminates thousands of plastic bar chairs, steel tie wire clippings, and crane hoist idling fuel on congested construction job sites.',
      icon: <Leaf className="w-6 h-6 text-[#006e21]" />
    },
    {
      title: 'Longer Structural Life',
      metric: '+30 Years Durability',
      desc: 'Isotropic crack arrest inhibits water and chloride ingress, preventing internal spalling and extending service life to over 50 years without remedial re-grouting.',
      icon: <ShieldCheck className="w-6 h-6 text-[#006e21]" />
    },
    {
      title: 'Circular Metallurgy',
      metric: '100% Recyclable Scrap',
      desc: 'Eco-Blend fibers utilize certified post-consumer scrap melted in 100% renewable electric-arc induction furnaces under ISO 14040/14044 protocols.',
      icon: <Recycle className="w-6 h-6 text-[#006e21]" />
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Header & Title Module */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-6">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee] text-center max-w-4xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            SUSTAINABILITY & ENVIRONMENTAL ACCOUNTABILITY
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00356a] leading-tight">
            Decarbonizing Civil Infrastructure with Isotropic Metallurgy
          </h1>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-[#00356a]/75 leading-relaxed font-normal max-w-2xl mx-auto">
            Rigorous Life Cycle Assessments (LCA) demonstrate that transitioning from conventional rebar grids to HOKI cold-drawn fibers achieves verified net carbon reductions exceeding 40% across structural slabs and tunnel segment linings.
          </p>
        </div>
      </section>

      {/* 2. 4 Sustainable Thinking Pillars */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="bg-white rounded-[2rem] p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#006e21]/10 flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-[#00356a]">
                  {pillar.title}
                </h3>
                <span className="text-sm font-black text-[#006e21] block mt-0.5">
                  {pillar.metric}
                </span>
                <p className="text-xs text-[#00356a]/70 mt-2.5 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Comparative LCA Calculator */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-3">
              COMPARATIVE LCA ENGINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00356a]">
              Embodied Carbon Benchmark (A1–A3 Life Cycle Stages)
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
              Simulate total cradle-to-gate Global Warming Potential (tCO2e) across traditional and next-generation SFRC slab systems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls & Result Summary */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[2rem] border border-[#e2e6eb] shadow-bubble-sm">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#00356a] uppercase tracking-wider">
                    Slab Surface Area
                  </label>
                  <span className="text-sm font-extrabold text-[#00356a]">{projectArea.toLocaleString()} m²</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={100000}
                  step={2000}
                  value={projectArea}
                  onChange={(e) => setProjectArea(Number(e.target.value))}
                  className="w-full accent-[#006e21] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#00356a]/50 mt-1">
                  <span>2,000 m²</span>
                  <span>50,000 m²</span>
                  <span>100,000 m²</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#006e21]/5 border border-[#006e21]/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006e21] block">
                  Net Embodied Carbon Abated
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#006e21]">
                    {netSavingsTonnes.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-[#006e21]">tCO2e ({netSavingsPercent}% reduction)</span>
                </div>
                <span className="text-[10.5px] text-[#00356a]/70 block mt-2">
                  Equivalent to removing {(netSavingsTonnes * 0.22).toFixed(0)} passenger vehicles from the road for an entire year.
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e2e6eb]">
                <button
                  onClick={() => {
                    const blob = new Blob([
                      `HOKI LCA & EPD COMPLIANCE SUMMARY\nProject Area: ${projectArea} m²\nConventional GWP: ${conventionalCO2} tCO2e\nHOKI Baseline GWP: ${hokiBaselineCO2} tCO2e\nNet Abatement: ${netSavingsTonnes} tCO2e (${netSavingsPercent}%)\nComplies with EN 15804+A2.`
                    ], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `HOKI-LCA-Report-${projectArea}sqm.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00356a] text-white shadow-bubble-sm hover:bg-[#002244] cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#006e21]" />
                  <span>Download Verified LCA Data</span>
                </button>
              </div>
            </div>

            {/* Right Comparison Visualizer */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[2rem] border border-[#e2e6eb] shadow-bubble-sm">
              <span className="text-xs font-bold text-[#00356a] uppercase tracking-wider block mb-6">
                Comparative Global Warming Potential (tCO2e)
              </span>

              <div className="space-y-6">
                {/* Bar 1: Conventional */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#00356a] mb-1.5">
                    <span>1. Conventional Dual Mesh + 220mm Slab</span>
                    <span className="text-[#00356a]">{conventionalCO2.toLocaleString()} tCO2e</span>
                  </div>
                  <div className="w-full h-6 bg-[#f4f6f8] rounded-full overflow-hidden border border-[#e2e6eb]">
                    <div className="h-full bg-[#94a3b8] rounded-full w-full flex items-center justify-end pr-3 text-[10px] text-white font-bold">
                      100% Baseline
                    </div>
                  </div>
                  <span className="text-[10px] text-[#00356a]/60 mt-1 block">
                    High steel weight (75 kg/m²) + thicker concrete section
                  </span>
                </div>

                {/* Bar 2: HOKI Baseline */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#00356a] mb-1.5">
                    <span>2. HOKI HE-Series + 180mm Slab</span>
                    <span className="text-[#006e21]">{hokiBaselineCO2.toLocaleString()} tCO2e</span>
                  </div>
                  <div className="w-full h-6 bg-[#f4f6f8] rounded-full overflow-hidden border border-[#e2e6eb]">
                    <div
                      className="h-full bg-[#006e21] rounded-full flex items-center justify-end pr-3 text-[10px] text-white font-bold transition-all duration-500"
                      style={{ width: `${(hokiBaselineCO2 / conventionalCO2) * 100}%` }}
                    >
                      -41% Abated
                    </div>
                  </div>
                  <span className="text-[10px] text-[#006e21] font-semibold mt-1 block">
                    18% concrete volume reduction + 30 kg/m³ cold-drawn fibers
                  </span>
                </div>

                {/* Bar 3: HOKI + LC3 Cement */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#00356a] mb-1.5">
                    <span>3. HOKI Eco-Blend (100% Recycled) + LC3 Cement</span>
                    <span className="text-[#15803d]">{hokiEcoBlendCO2.toLocaleString()} tCO2e</span>
                  </div>
                  <div className="w-full h-6 bg-[#f4f6f8] rounded-full overflow-hidden border border-[#e2e6eb]">
                    <div
                      className="h-full bg-[#15803d] rounded-full flex items-center justify-end pr-3 text-[10px] text-white font-bold transition-all duration-500"
                      style={{ width: `${(hokiEcoBlendCO2 / conventionalCO2) * 100}%` }}
                    >
                      -64% Ultra Net-Zero
                    </div>
                  </div>
                  <span className="text-[10px] text-[#15803d] font-semibold mt-1 block">
                    Low-carbon limestone calcined clay composite
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Standards & Certification Ledger */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mb-6">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full inline-block mb-2">
              AUDITED COMPLIANCE
            </span>
            <h3 className="text-2xl font-extrabold text-[#00356a]">
              International Environmental & Structural Standards Ledger
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                code: 'ISO 14040 / 14044',
                label: 'Environmental Product Declaration',
                desc: 'Audited cradle-to-gate Life Cycle Assessment verifying recycled metallurgical input.'
              },
              {
                code: 'EN 15804+A2',
                label: 'European Sustainability Standard',
                desc: 'Standardized core rules for the product category of construction products.'
              },
              {
                code: 'Concrete Society TR34',
                label: 'Ground-Supported Slabs 4th Ed.',
                desc: 'Yield line design equations for complete rebar elimination in industrial floors.'
              },
              {
                code: 'fib Model Code 2020',
                label: 'SFRC Constitutive Stress-Crack Law',
                desc: 'Constitutive stress-crack width relationship verified under EN 14651 protocol.'
              },
            ].map((std, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-[#006e21] block">
                    {std.code}
                  </span>
                  <h4 className="text-xs font-bold text-[#00356a] mt-1">
                    {std.label}
                  </h4>
                  <p className="text-[11px] text-[#00356a]/70 mt-2">
                    {std.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#e2e6eb] flex items-center gap-1 text-[10px] font-bold text-[#00356a]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Third-Party Audited</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
