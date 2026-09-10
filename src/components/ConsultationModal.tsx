import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00356a]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] p-6 md:p-8 shadow-bubble-lg border border-[#e5e9ee] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="consultation-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-colors cursor-pointer shadow-bubble-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-4 shadow-bubble-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-[#00356a]">
              Consultation Queued in Admin Panel
            </h3>
            <p className="text-sm text-[#00356a]/70 max-w-md mt-2 leading-relaxed">
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
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
                className="px-6 py-2.5 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold uppercase tracking-wider shadow-bubble-sm cursor-pointer transition-all"
              >
                Submit Another Inquiry
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-8 py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#002244] cursor-pointer transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10.5px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Technical Advisory Desk
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#00356a]">
              Talk to a HOKI Structural Engineer
            </h2>
            <p className="text-xs text-[#00356a]/70 mt-1">
              Connect with our structural laboratory team for custom TR34 dosage optimization, flexural toughness modeling, and full rebar mesh displacement calculations.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Alex Morgan, PE"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Engineering Firm / Contractor *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Vance Civil Engineering"
                    value={formData.firm}
                    onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+84 / +1 / +49..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Project Sector
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a] cursor-pointer"
                  >
                    <option value="Industrial Flooring">Industrial Flooring (Jointless)</option>
                    <option value="Tunneling & Mining">Tunneling & Mining Shotcrete</option>
                    <option value="Precast Elements">Precast Segments & Culverts</option>
                    <option value="Heavy Port Terminal">Port & Intermodal Terminal</option>
                    <option value="Commercial Slab">Commercial / Multi-Storey</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Estimated Floor Area (m²)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25,000 sqm"
                    value={formData.slabArea}
                    onChange={(e) => setFormData({ ...formData, slabArea: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Technical Requirements or Dynamic Loads
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify wheel point loads, joint spacing target, concrete grade, or question about TR34 compliance..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              {/* Mock Drawing Upload Pill */}
              <div className="p-3 bg-[#f4f6f8] rounded-2xl border border-dashed border-[#c2c8d2] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#00356a]/70">
                  <Upload className="w-4 h-4 text-[#006e21]" />
                  <span>Attach Structural Drawings / CAD (.dwg, .pdf up to 50MB)</span>
                </div>
                <span className="text-[10px] font-semibold bg-white px-2.5 py-1 rounded-full text-[#00356a] shadow-sm border border-[#e2e6eb]">
                  Optional
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#00356a]/70 hover:text-[#00356a] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#006e21] text-white shadow-bubble-sm hover:bg-[#005a1b] hover:shadow-bubble transition-all cursor-pointer"
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
