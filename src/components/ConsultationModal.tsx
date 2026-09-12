import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Upload, Send } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Slab Reinforcement Consultation',
}) => {
  const { addConsultationRequest } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    email: '',
    phone: '',
    projectType: 'Industrial Flooring',
    slabArea: '',
    targetDate: '',
    notes: '',
  });

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist directly into Admin Consultation store
    addConsultationRequest({
      name: formData.name || 'Anonymous Specifier',
      firm: formData.firm || 'Independent Engineering Firm',
      email: formData.email || 'engineer@consultant.com',
      phone: formData.phone,
      projectType: `Direct Consultation: ${formData.projectType}`,
      slabArea: formData.slabArea,
      targetDate: formData.targetDate,
      notes: formData.notes,
      status: 'new'
    });

    setSubmitted(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#00356a]/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[2rem] p-5 sm:p-7 md:p-8 shadow-bubble-lg border border-[#e5e9ee] max-h-[92vh] overflow-y-auto overscroll-contain"
      >
        {/* Close Button */}
        <button
          id="consultation-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] active:scale-95 transition-all cursor-pointer shadow-bubble-sm z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 sm:py-12 text-center flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-4 shadow-bubble-sm">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#00356a]">
              Consultation Queued in Admin Panel
            </h3>
            <p className="text-xs sm:text-sm text-[#00356a]/70 max-w-md mt-2 leading-relaxed">
              Thank you, <span className="font-semibold text-[#00356a]">{formData.name || 'Engineer'}</span>. Your technical inquiry has been recorded and submitted to the <span className="font-semibold text-[#006e21]">Recent Structural Consultation Inquiries</span> queue in the Admin Panel.
            </p>
            <div className="mt-4 p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] max-w-md w-full text-left text-xs text-[#00356a] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#00356a]/60">Firm / Project:</span>
                <span className="font-semibold">{formData.firm || 'Independent'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00356a]/60">Contact Email:</span>
                <span className="font-semibold">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00356a]/60">Application:</span>
                <span className="font-bold text-[#006e21]">{formData.projectType}</span>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 w-full">
              <a
                href={`mailto:engineering@hoki-fiber.com?subject=${encodeURIComponent(`[HOKI Technical Consultation] ${formData.projectType} - ${formData.firm || formData.name}`)}&body=${encodeURIComponent(
                  `Technical Inquiry Details:\nName: ${formData.name}\nFirm: ${formData.firm}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nProject Application: ${formData.projectType}\nEstimated Slab Area: ${formData.slabArea}\nTarget Pour Date: ${formData.targetDate}\n\nProject Notes / Loading Specs:\n${formData.notes}`
                )}`}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#005a1b] cursor-pointer transition-all min-h-[44px] flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Notify Engineering Desk via Email
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    firm: '',
                    email: '',
                    phone: '',
                    projectType: 'Industrial Flooring',
                    slabArea: '',
                    targetDate: '',
                    notes: '',
                  });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold uppercase tracking-wider shadow-bubble-sm cursor-pointer transition-all min-h-[44px]"
              >
                Submit Another Inquiry
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#002244] cursor-pointer transition-all min-h-[44px]"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2 pr-10">
              <span className="text-[10.5px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Technical Advisory Desk
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#00356a] pr-8">
              Talk to a HOKI Structural Engineer
            </h2>
            <p className="text-xs text-[#00356a]/70 mt-1 leading-relaxed">
              Connect with our structural laboratory team for custom TR34 dosage optimization, flexural toughness modeling, and full rebar mesh displacement calculations.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Alex Morgan, PE"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2.5 rounded-2xl sm:rounded-full text-sm sm:text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1">
                    Engineering Firm / Contractor *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Vance Civil Engineering"
                    value={formData.firm}
                    onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2.5 rounded-2xl sm:rounded-full text-sm sm:text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1">
                    Corporate Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2.5 rounded-2xl sm:rounded-full text-sm sm:text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+84 / +1 / +49..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2.5 rounded-2xl sm:rounded-full text-sm sm:text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1">
                    Project Sector
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2.5 rounded-2xl sm:rounded-full text-sm sm:text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a] cursor-pointer min-h-[44px]"
                  >
                    <option value="Industrial Flooring">Industrial Flooring (Jointless)</option>
                    <option value="Tunneling & Mining">Tunneling & Mining Shotcrete</option>
                    <option value="Precast Elements">Precast Segments & Culverts</option>
                    <option value="Heavy Port Terminal">Port & Intermodal Terminal</option>
                    <option value="Commercial Slab">Commercial / Multi-Storey</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1">
                    Estimated Floor Area (m²)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25,000 sqm"
                    value={formData.slabArea}
                    onChange={(e) => setFormData({ ...formData, slabArea: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2.5 rounded-2xl sm:rounded-full text-sm sm:text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1">
                  Technical Requirements or Dynamic Loads
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify wheel point loads, joint spacing target, concrete grade, or question about TR34 compliance..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl text-sm sm:text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              {/* Drawing Upload Pill */}
              <div className="p-3 bg-[#f4f6f8] rounded-2xl border border-dashed border-[#c2c8d2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-[#00356a]/70">
                  <Upload className="w-4 h-4 text-[#006e21] shrink-0" />
                  <span>Attach Structural Drawings / CAD (.dwg, .pdf up to 50MB)</span>
                </div>
                <span className="text-[10px] font-semibold bg-white px-2.5 py-1 rounded-full text-[#00356a] shadow-sm border border-[#e2e6eb] self-end sm:self-auto">
                  Optional
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#00356a]/70 hover:text-[#00356a] cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#006e21] text-white shadow-bubble-sm hover:bg-[#005a1b] hover:shadow-bubble transition-all cursor-pointer min-h-[44px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

