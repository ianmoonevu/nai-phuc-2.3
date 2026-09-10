import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Shield, Layers, Award } from 'lucide-react';
import { FiberProduct } from '../types';

interface DossierModalProps {
  product: FiberProduct | null;
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ product, onClose }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!product) return null;

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => {
      // Create a virtual download trigger
      const blob = new Blob([
        `HOKI TECHNICAL DOSSIER: ${product.name} (${product.series})\n` +
        `Standards: ${product.standards.join(', ')}\n` +
        `Tensile Strength: ${product.tensileStrength}\n` +
        `Aspect Ratio: ${product.aspectRatio}\n` +
        `Fiber Count/kg: ${product.fiberCountPerKg}\n` +
        `Primary Application: ${product.primaryApplication}\n` +
        `Manufactured at HOKI Alpha Hub under ISO 9001 and ISO 14040 EPD.`
      ], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HOKI-${product.id}-Technical-Dossier.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00356a]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] p-6 md:p-8 shadow-bubble-lg border border-[#e5e9ee] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-colors cursor-pointer shadow-bubble-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Technical Dossier • Level 3 QA
          </span>
          <span className="text-[10px] font-bold tracking-wider text-[#00356a]/60 uppercase">
            Document Ref: HK-TDS-{product.id.toUpperCase()}
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#00356a]">
          {product.name} — {product.series}
        </h2>
        <p className="text-xs text-[#00356a]/70 mt-1 max-w-xl">
          {product.subtitle}
        </p>

        {/* Spec Overview Bubble Card */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm">
            <span className="text-[10px] font-semibold text-[#00356a]/60 uppercase tracking-wider block">Tensile Strength</span>
            <span className="text-sm md:text-base font-bold text-[#00356a] mt-1 block">{product.tensileStrength}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm">
            <span className="text-[10px] font-semibold text-[#00356a]/60 uppercase tracking-wider block">Aspect Ratio (L/d)</span>
            <span className="text-sm md:text-base font-bold text-[#00356a] mt-1 block">{product.aspectRatio}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm">
            <span className="text-[10px] font-semibold text-[#00356a]/60 uppercase tracking-wider block">{product.keyMetric1.label}</span>
            <span className="text-sm md:text-base font-bold text-[#006e21] mt-1 block">{product.keyMetric1.value}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm">
            <span className="text-[10px] font-semibold text-[#00356a]/60 uppercase tracking-wider block">{product.keyMetric2.label}</span>
            <span className="text-sm md:text-base font-bold text-[#00356a] mt-1 block">{product.keyMetric2.value}</span>
          </div>
        </div>

        {/* Mechanical Properties & Micro-mechanical Anchorage */}
        <div className="mt-6 p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm">
          <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#006e21]" /> Mechanical Anchorage & Physical Attributes
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#00356a]">
            <div>
              <span className="font-bold text-[#00356a]/70 block">Fiber Geometry & Collation:</span>
              <p className="mt-0.5">{product.geometry}</p>
            </div>
            <div>
              <span className="font-bold text-[#00356a]/70 block">Nominal Dimensions:</span>
              <p className="mt-0.5">{product.diameter} (Diameter) × {product.length} (Length)</p>
            </div>
            <div>
              <span className="font-bold text-[#00356a]/70 block">Fiber Count Density:</span>
              <p className="mt-0.5">{product.fiberCountPerKg}</p>
            </div>
            <div>
              <span className="font-bold text-[#00356a]/70 block">Surface & ITZ Roughness:</span>
              <p className="mt-0.5">{product.coating}</p>
            </div>
          </div>
        </div>

        {/* Structural Design Standards */}
        <div className="mt-4 p-5 rounded-2xl bg-white border border-[#e2e6eb] shadow-bubble-sm">
          <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-[#00356a]" /> Harmonized Compliance Standards
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.standards.map((std, i) => (
              <span key={i} className="text-xs font-semibold px-3 py-1 bg-[#f4f6f8] text-[#00356a] rounded-full border border-[#dce0e6]">
                {std}
              </span>
            ))}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-[#e2e6eb] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-[#00356a]/70 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#006e21]" />
            <span>Format: Official Certified Technical Datasheet (.PDF, 2.4 MB)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#00356a]/70 hover:text-[#00356a] cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#006e21] text-white shadow-bubble-sm hover:bg-[#005a1b] hover:shadow-bubble transition-all cursor-pointer"
            >
              {isDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dossier Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Full TDS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
