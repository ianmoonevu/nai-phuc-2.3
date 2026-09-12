import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Calculator,
  ShieldCheck,
  Send,
  Package,
  FileCheck,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Search,
  Upload,
  Clock,
  UserCheck,
  Layers,
  Globe2,
  Building2,
  ArrowRight,
  Handshake
} from 'lucide-react';
import { GLOBAL_OFFICES } from '../data/mockData';

export const ContactPage: React.FC = () => {
  const { addConsultationRequest } = useData();

  // RFQ Calculator State
  const [rfqArea, setRfqArea] = useState<number>(15000);
  const [rfqType, setRfqType] = useState('Industrial Flooring');
  const [rfqGrade, setRfqGrade] = useState('C30/37');
  const [rfqSeries, setRfqSeries] = useState('HF-8060');
  const [rfqName, setRfqName] = useState('');
  const [rfqEmail, setRfqEmail] = useState('');
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  // Sample Kit Request State
  const [sampleSeries, setSampleSeries] = useState('HF-8060 Series (L=60mm)');
  const [sampleRecipient, setSampleRecipient] = useState('');
  const [sampleAddress, setSampleAddress] = useState('');
  const [sampleEmail, setSampleEmail] = useState('');
  const [samplePhone, setSamplePhone] = useState('');
  const [sampleRequested, setSampleRequested] = useState(false);

  // Drawing Review State
  const [drawingSubmitted, setDrawingSubmitted] = useState(false);
  const [drawingFileName, setDrawingFileName] = useState('');
  const [drawingName, setDrawingName] = useState('');
  const [drawingFirm, setDrawingFirm] = useState('');
  const [drawingEmail, setDrawingEmail] = useState('');
  const [drawingPhone, setDrawingPhone] = useState('');

  // Partner Verification State
  const [batchCode, setBatchCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'verified' | 'not_found';
    code?: string;
    plant?: string;
    date?: string;
    standard?: string;
  }>({ status: 'idle' });

  // Partner Application State
  const [partnerAppSubmitted, setPartnerAppSubmitted] = useState(false);
  const [partnerCompany, setPartnerCompany] = useState('');
  const [partnerCountry, setPartnerCountry] = useState('');
  const [partnerOfficer, setPartnerOfficer] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerNotes, setPartnerNotes] = useState('');

  // Engineering Contact Desk
  const CONTACT_EMAIL = 'engineering@hoki-fiber.com';

  // Calculations for RFQ
  const estimatedTonnage = Math.round((rfqArea * 0.18 * 28) / 1000); // 180mm slab @ 28 kg/m³
  const estimatedLeadDays = rfqArea > 30000 ? 10 : 5;

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist directly into Admin Consultation Store
    addConsultationRequest({
      name: rfqName || 'Commercial Specifier',
      firm: 'Commercial Contractor / EPC',
      email: rfqEmail || 'commercial@contractor.com',
      projectType: `RFQ Quotation: ${rfqType} (${rfqSeries})`,
      slabArea: `${rfqArea.toLocaleString()} m²`,
      status: 'new',
      notes: `RFQ Inquiry: Slab Area ${rfqArea.toLocaleString()} m², Concrete Grade ${rfqGrade}, Target Fiber ${rfqSeries}, Calculated Volume ${estimatedTonnage} MT, Estimated Lead Time ~${estimatedLeadDays} Days.`
    });

    setRfqSubmitted(true);
  };

  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist directly into Admin Consultation Store
    addConsultationRequest({
      name: sampleRecipient || 'Jobsite Materials Engineer',
      firm: 'Jobsite Sample Box Order',
      email: sampleEmail || 'dispatch-required@jobsite.com',
      phone: samplePhone || undefined,
      projectType: `Trial Sample Kit: ${sampleSeries}`,
      status: 'new',
      notes: `Free Jobsite Sample Kit Order: Recipient: ${sampleRecipient}, Delivery Address: ${sampleAddress}, Target Fiber Series: ${sampleSeries}, Email: ${sampleEmail || 'N/A'}, Phone: ${samplePhone || 'N/A'}.`
    });

    setSampleRequested(true);
  };

  const handleDrawingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = drawingFileName || 'Structural-Slab-Plan.dwg';
    setDrawingFileName(fileName);

    // Persist directly into Admin Consultation Store
    addConsultationRequest({
      name: drawingName || 'Structural Specifier',
      firm: drawingFirm || 'Engineering / Design Firm',
      email: drawingEmail || 'engineer@designfirm.com',
      phone: drawingPhone || undefined,
      projectType: 'CAD Drawing Review & TR34 Dosing',
      status: 'new',
      notes: `CAD/BIM Drawing Review Request: Stamped Drawing "${fileName}". Specifier: ${drawingName || 'Engineer'}, Firm: ${drawingFirm || 'N/A'}, Email: ${drawingEmail || 'N/A'}. Target Standard: TR34 4th Edition / ACI 544.4R / fib Model Code 2020 yield-line calculation.`
    });

    setDrawingSubmitted(true);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist directly into Admin Consultation Store
    addConsultationRequest({
      name: partnerOfficer || 'Regional Partner Applicant',
      firm: `${partnerCompany} (${partnerCountry})`,
      email: partnerEmail || 'partner@distributor.com',
      projectType: 'Authorized Dealer / Partner Application',
      status: 'new',
      notes: `Authorized Partner & Distribution Application: Company: ${partnerCompany}, Territory: ${partnerCountry}, Contact Officer: ${partnerOfficer}, Email: ${partnerEmail}, Distribution Footprint / Notes: ${partnerNotes}.`
    });

    setPartnerAppSubmitted(true);
  };

  const handleVerifyBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = batchCode.trim().toUpperCase();
    if (!query) return;

    if (
      query.includes('HK') ||
      query.includes('2024') ||
      query.includes('VN') ||
      query.includes('ALPHA') ||
      query.includes('HOKI-DE-882') ||
      query.includes('HOKI-US-411')
    ) {
      setVerificationResult({
        status: 'verified',
        code: query,
        plant: 'Alpha Hub Automated Production Line 02, Vietnam',
        date: 'Batch Tested: 2024-Q3 (100% Optical AOI Inspected)',
        standard: 'ASTM A820 Type I / EN 14889-1 System 1 CE Certified'
      });
    } else {
      setVerificationResult({
        status: 'not_found'
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Header & Title Module per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-8">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-12 md:p-16 shadow-bubble border border-[#e5e9ee] text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#006e21] text-xs font-bold uppercase tracking-widest mb-4">
            <Mail className="w-4 h-4 text-[#006e21]" />
            <span>COMMERCIAL INQUIRIES & TECHNICAL SUPPORT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#00356a] leading-tight tracking-tight">
            Contact HOKI Global Engineering
          </h1>

          <p className="mt-4 text-base sm:text-lg font-bold text-[#006e21]">
            Direct Access to Senior Structural Specialists & Fast Commercial Quotations
          </p>

          <p className="mt-3 text-xs sm:text-base text-[#00356a]/80 leading-relaxed max-w-3xl mx-auto font-normal">
            Request instant project scope calculations, schedule stamped drawing reviews, order free jobsite trial kits, or authenticate your delivered steel fiber batch certificates.
          </p>

          {/* Priority Hotline Strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs font-bold text-[#00356a]">
            <a
              href="tel:+842838225888"
              className="px-5 py-2.5 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center gap-2 hover:bg-[#f8fafc]"
            >
              <Phone className="w-4 h-4 text-[#006e21]" />
              <span>Hotline: +84 28 3822 5888</span>
            </a>
            <a
              href="mailto:engineering@hoki-fiber.com"
              className="px-5 py-2.5 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center gap-2 hover:bg-[#f8fafc]"
            >
              <Mail className="w-4 h-4 text-[#006e21]" />
              <span>Email: engineering@hoki-fiber.com</span>
            </a>
            <div className="px-5 py-2.5 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#006e21]" />
              <span>Response SLA: &lt; 4 Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Commercial Inquiry & Fast RFQ Form per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3.5 py-1 rounded-full inline-block mb-3">
                FAST COMMERCIAL QUOTE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00356a]">
                Project Scope & Volume Estimator
              </h2>
              <p className="text-xs text-[#00356a]/70 mt-1 mb-6">
                Specify floor slab dimensions to receive an instant material tonnage estimate and preliminary delivery schedule.
              </p>

              {rfqSubmitted ? (
                <div className="p-8 rounded-3xl bg-[#006e21]/10 border border-[#006e21]/30 text-center">
                  <CheckCircle2 className="w-12 h-12 text-[#006e21] mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-[#00356a]">RFQ Registered in Admin Panel Queue</h3>
                  <p className="text-xs text-[#00356a]/75 mt-2 max-w-lg mx-auto leading-relaxed">
                    Your request has been successfully recorded in the <span className="font-bold text-[#006e21]">Recent Structural Consultation Inquiries</span> desk. Our estimating engineers will review your project parameters and contact <span className="font-semibold text-[#00356a]">{rfqEmail || 'your email'}</span> within 4 business hours.
                  </p>
                  <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#e2e6eb] max-w-md mx-auto text-xs text-[#00356a] text-left space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#00356a]/60">Specifier:</span>
                      <span className="font-semibold">{rfqName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#00356a]/60">Slab Area Scope:</span>
                      <span className="font-semibold">{rfqArea.toLocaleString()} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#00356a]/60">Target Series:</span>
                      <span className="font-bold text-[#006e21]">{rfqSeries}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={`mailto:engineering@hoki-fiber.com?subject=${encodeURIComponent(`[HOKI RFQ] ${rfqType} (${rfqSeries}) - ${rfqArea}m² - ${rfqName}`)}&body=${encodeURIComponent(
                        `RFQ Parameters:\nSpecifier Name: ${rfqName}\nEmail: ${rfqEmail}\nApplication Sector: ${rfqType}\nTarget Series: ${rfqSeries}\nSlab Area Scope: ${rfqArea.toLocaleString()} m²\nConcrete Grade: ${rfqGrade}\nCalculated Fiber Volume: ${estimatedTonnage} Metric Tons\nEstimated Lead Time: ~${estimatedLeadDays} Working Days`
                      )}`}
                      className="px-6 py-2.5 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#005a1b] shadow-bubble-sm transition-all flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Email Scope to Engineering Desk</span>
                    </a>
                    <button
                      onClick={() => setRfqSubmitted(false)}
                      className="px-6 py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#002244] shadow-bubble-sm transition-all"
                    >
                      Calculate Another Scope
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleRfqSubmit}
                  className="space-y-4"
                >
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#00356a] mb-1.5">
                      <label className="uppercase tracking-wider">Total Slab Area (m²)</label>
                      <span className="text-[#006e21] font-extrabold">{rfqArea.toLocaleString()} m²</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={100000}
                      step={1000}
                      value={rfqArea}
                      onChange={(e) => setRfqArea(Number(e.target.value))}
                      className="w-full accent-[#006e21] cursor-pointer"
                    />
                    <div className="flex gap-2 mt-2">
                      {[5000, 15000, 30000, 60000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setRfqArea(preset)}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${
                            rfqArea === preset
                              ? 'bg-[#00356a] text-white border-[#00356a]'
                              : 'bg-[#f4f6f8] text-[#00356a] border-[#dce0e6] hover:bg-[#e2e6eb]'
                          }`}
                        >
                          {preset.toLocaleString()} m²
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                        Application Sector
                      </label>
                      <select
                        value={rfqType}
                        onChange={(e) => setRfqType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-full text-xs font-medium text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                      >
                        <option value="Industrial Flooring">Industrial Flooring (Jointless)</option>
                        <option value="Warehouse Logistics">Automated Warehouse / High-Bay</option>
                        <option value="Ports & Heavy Hardstand">Port / Container Hardstand</option>
                        <option value="Precast Concrete">Precast Infrastructure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                        Fiber Series
                      </label>
                      <select
                        value={rfqSeries}
                        onChange={(e) => setRfqSeries(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-full text-xs font-medium text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                      >
                        <option value="HF-8060">HF-8060 (Heavy Duty L=60mm)</option>
                        <option value="HF-6535">HF-6535 (Crack Control L=35mm)</option>
                        <option value="HF-10020">HF-10020 (Ultra-High Tensile L=20mm)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Lead Engineer / Project Director"
                        value={rfqName}
                        onChange={(e) => setRfqName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                        Official Project Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="engineer@contractor.com"
                        value={rfqEmail}
                        onChange={(e) => setRfqEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:shadow-bubble transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Request for Quotation (RFQ)</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Estimation Panel */}
            <div className="lg:col-span-5 bg-[#f4f6f8] rounded-3xl p-6 sm:p-8 border border-[#e2e6eb] shadow-bubble-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full">
                Preliminary Material Scope
              </span>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-white border border-[#e2e6eb]">
                  <span className="text-[#00356a]/70">Calculated Fiber Volume:</span>
                  <span className="font-extrabold text-[#00356a] text-sm">{estimatedTonnage} Metric Tons</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white border border-[#e2e6eb]">
                  <span className="text-[#00356a]/70">Packaging Standard:</span>
                  <span className="font-bold text-[#00356a]">20kg Sacks / 1,000kg Big-Bags</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white border border-[#e2e6eb]">
                  <span className="text-[#00356a]/70">Lead Time to Dispatch:</span>
                  <span className="font-bold text-[#006e21]">~{estimatedLeadDays} Working Days</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white border border-[#e2e6eb]">
                  <span className="text-[#00356a]/70">Testing Verification:</span>
                  <span className="font-bold text-[#00356a]">MTC + ASTM C1609 Protocol</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-white border border-[#e2e6eb]">
                <span className="text-[11px] font-bold text-[#00356a] block mb-1">
                  Global Freight Support:
                </span>
                <p className="text-[11px] text-[#00356a]/70 leading-relaxed">
                  Export terminals in Ho Chi Minh City, Haiphong, Shanghai, Rotterdam, and Houston. FOB, CIF, and DDP delivery terms supported.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Engineering Support: Trial Sample Kit & Drawing Review per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sample Kit Request Portal */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#006e21]/10 text-[#006e21] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#006e21]">
                    Jobsite Trial Kit
                  </span>
                  <h3 className="text-xl font-bold text-[#00356a]">
                    Order Free Fiber Sample Box
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#00356a]/70 mb-5 leading-relaxed">
                Receive an authentic HOKI trial sample box containing collated steel fiber bundles, aspect ratio gauges, and technical documentation for lab testing.
              </p>

              {sampleRequested ? (
                <div className="p-6 rounded-2xl bg-[#006e21]/10 border border-[#006e21]/20 text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#006e21] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#00356a]">Sample Request Queued in Admin Panel</p>
                  <p className="text-[11px] text-[#00356a]/75 mt-1 leading-relaxed">
                    Your trial kit order for <span className="font-semibold text-[#00356a]">{sampleRecipient || 'your project'}</span> has been recorded in the <span className="font-bold text-[#006e21]">Recent Structural Consultation Inquiries</span> queue. Our materials lab will dispatch the <span className="font-semibold text-[#00356a]">{sampleSeries}</span> kit to {sampleAddress}.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={`mailto:engineering@hoki-fiber.com?subject=${encodeURIComponent(`[HOKI Sample Kit Order] ${sampleSeries} - ${sampleRecipient}`)}&body=${encodeURIComponent(
                        `Trial Sample Box Order:\nRecipient: ${sampleRecipient}\nAddress: ${sampleAddress}\nTarget Series: ${sampleSeries}\nEmail: ${sampleEmail}\nPhone: ${samplePhone}`
                      )}`}
                      className="px-5 py-2 rounded-full bg-[#006e21] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#005a1b] cursor-pointer shadow-bubble-sm transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Notify Lab via Email</span>
                    </a>
                    <button
                      onClick={() => {
                        setSampleRequested(false);
                        setSampleRecipient('');
                        setSampleAddress('');
                        setSampleEmail('');
                        setSamplePhone('');
                      }}
                      className="px-5 py-2 rounded-full bg-[#00356a] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#002244] cursor-pointer shadow-bubble-sm transition-all"
                    >
                      Request Another Sample Kit
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSampleSubmit}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#00356a]/70 block mb-1">
                      Target Series
                    </label>
                    <select
                      value={sampleSeries}
                      onChange={(e) => setSampleSeries(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a] font-medium"
                    >
                      <option value="HF-8060 Series (L=60mm)">HF-8060 Series (L=60mm Heavy Duty)</option>
                      <option value="HF-6535 Series (L=35mm)">HF-6535 Series (L=35mm Crack Control)</option>
                      <option value="HF-10020 Series (L=20mm)">HF-10020 Series (L=20mm UHPC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#00356a]/70 block mb-1">
                      Recipient Name & Company *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe, Lead Materials Engineer"
                      value={sampleRecipient}
                      onChange={(e) => setSampleRecipient(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#00356a]/70 block mb-1">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="engineer@firm.com"
                        value={sampleEmail}
                        onChange={(e) => setSampleEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#00356a]/70 block mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+84 / +1 ..."
                        value={samplePhone}
                        onChange={(e) => setSamplePhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#00356a]/70 block mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Street, City, Postal Code, Country"
                      value={sampleAddress}
                      onChange={(e) => setSampleAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#002244] transition-all cursor-pointer shadow-bubble-sm"
                  >
                    Request Sample Box Delivery
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Project Drawing Review & Dosing Request */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00356a]/10 text-[#00356a] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00356a]">
                    Engineering Review
                  </span>
                  <h3 className="text-xl font-bold text-[#00356a]">
                    CAD Drawing Review & TR34 Dosing
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#00356a]/70 mb-5 leading-relaxed">
                Upload your AutoCAD (.dwg), Revit (.rvt), or structural PDF plans for a comprehensive TR34 yield-line calculation and stamped engineering recommendation.
              </p>

              {drawingSubmitted ? (
                <div className="p-6 rounded-2xl bg-[#006e21]/10 border border-[#006e21]/20 text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#006e21] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#00356a]">Drawing Review Queued in Admin Panel</p>
                  <p className="text-[11px] text-[#00356a]/75 mt-1 leading-relaxed">
                    Plan <span className="font-semibold text-[#00356a]">"{drawingFileName}"</span> from <span className="font-semibold text-[#00356a]">{drawingName || 'Engineer'}</span> has been registered in the <span className="font-bold text-[#006e21]">Recent Structural Consultation Inquiries</span> queue. A senior structural consultant will review the calculations.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={`mailto:engineering@hoki-fiber.com?subject=${encodeURIComponent(`[HOKI CAD Drawing Review] ${drawingName || 'Engineer'} - ${drawingFirm || 'Firm'}`)}&body=${encodeURIComponent(
                        `Drawing Review Submission:\nEngineer Name: ${drawingName}\nFirm: ${drawingFirm}\nEmail: ${drawingEmail}\nPhone: ${drawingPhone}\nDrawing Name: ${drawingFileName}`
                      )}`}
                      className="px-5 py-2 rounded-full bg-[#006e21] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#005a1b] cursor-pointer shadow-bubble-sm transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Notify Engineering Desk</span>
                    </a>
                    <button
                      onClick={() => {
                        setDrawingSubmitted(false);
                        setDrawingFileName('');
                        setDrawingName('');
                        setDrawingFirm('');
                        setDrawingEmail('');
                        setDrawingPhone('');
                      }}
                      className="px-5 py-2 rounded-full bg-[#00356a] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#002244] cursor-pointer shadow-bubble-sm transition-all"
                    >
                      Upload Another Drawing
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleDrawingSubmit}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#00356a]/70 block mb-1">
                        Engineer Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. David Lin, PE"
                        value={drawingName}
                        onChange={(e) => setDrawingName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#00356a]/70 block mb-1">
                        Engineering / Design Firm *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Consulting Firm / EPC"
                        value={drawingFirm}
                        onChange={(e) => setDrawingFirm(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#00356a]/70 block mb-1">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="d.lin@structural.com"
                        value={drawingEmail}
                        onChange={(e) => setDrawingEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#00356a]/70 block mb-1">
                        Direct Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 / +84 ..."
                        value={drawingPhone}
                        onChange={(e) => setDrawingPhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                      />
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-[#dce0e6] rounded-2xl p-5 text-center bg-[#f4f6f8] hover:border-[#006e21] transition-colors cursor-pointer relative">
                    <Upload className="w-7 h-7 text-[#00356a]/40 mx-auto mb-1.5" />
                    <span className="text-xs font-bold text-[#00356a] block">
                      {drawingFileName ? drawingFileName : 'Click to select or drag & drop DWG / PDF'}
                    </span>
                    <span className="text-[10px] text-[#00356a]/50 block mt-0.5">
                      Max file size: 50 MB (DWG, RVT, PDF, IFC)
                    </span>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDrawingFileName(e.target.files[0].name);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#005a1b] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-bubble-sm"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Submit for Structural Engineering Review</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Global Network & Authorized Partner Verification System per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Batch / License Verification Engine */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e6eb] shadow-bubble-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full inline-block mb-3">
                INTEGRITY & AUTHENTICITY
              </span>
              <h3 className="text-xl font-bold text-[#00356a]">
                Authorized Partner & Batch Verification System
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-1 mb-5">
                Verify authentic HOKI mill test certificates, CE mark declarations, or authorized regional dealer licenses.
              </p>

              <form onSubmit={handleVerifyBatch} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    placeholder="Enter Batch / License Code (e.g. HK-2024-VN, HOKI-DE-882)..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-mono text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00356a]/40" />
                </div>

                <div className="flex gap-2">
                  {['HK-2024-VN', 'HOKI-DE-882', 'HOKI-US-411'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setBatchCode(code)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a] cursor-pointer hover:bg-white"
                    >
                      {code}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#002244] transition-all cursor-pointer"
                >
                  Verify Authenticity Record
                </button>
              </form>

              {verificationResult.status === 'verified' && (
                <div className="mt-4 p-4 rounded-2xl bg-[#006e21]/10 border border-[#006e21]/30 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#006e21]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AUTHENTIC CERTIFICATE VERIFIED</span>
                  </div>
                  <div className="mt-2 space-y-1 text-[#00356a]/80">
                    <p><strong>Code:</strong> {verificationResult.code}</p>
                    <p><strong>Manufacturing Plant:</strong> {verificationResult.plant}</p>
                    <p><strong>Standard:</strong> {verificationResult.standard}</p>
                    <p><strong>Status:</strong> {verificationResult.date}</p>
                  </div>
                </div>
              )}

              {verificationResult.status === 'not_found' && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  Batch code not found in global mill database. Please contact QA at <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline text-[#00356a] hover:text-[#006e21]">{CONTACT_EMAIL}</a> for manual verification.
                </div>
              )}
            </div>

            {/* Become an Authorized Partner Application Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e6eb] shadow-bubble-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00356a] bg-[#00356a]/10 px-3 py-1 rounded-full inline-block mb-3">
                STRATEGIC EXPANSION
              </span>
              <h3 className="text-xl font-bold text-[#00356a]">
                Become an Authorized Partner
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-1 mb-5">
                Join our international distribution alliance for ready-mix concrete suppliers and civil engineering distributors.
              </p>

              {partnerAppSubmitted ? (
                <div className="p-6 rounded-2xl bg-[#006e21]/10 border border-[#006e21]/30 text-center">
                  <Handshake className="w-10 h-10 text-[#006e21] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#00356a]">Partner Application Registered in Admin Panel</p>
                  <p className="text-[11px] text-[#00356a]/75 mt-1 leading-relaxed">
                    Application for <span className="font-semibold text-[#00356a]">{partnerCompany}</span> ({partnerCountry}) has been recorded in the <span className="font-bold text-[#006e21]">Recent Structural Consultation Inquiries</span> queue. Our management desk will review distribution capabilities and follow up directly.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={`mailto:partner@hoki-fiber.com?subject=${encodeURIComponent(`[HOKI Partner Application] ${partnerCompany} (${partnerCountry})`)}&body=${encodeURIComponent(
                        `Authorized Partner Application:\nCompany: ${partnerCompany}\nCountry: ${partnerCountry}\nContact Officer: ${partnerOfficer}\nEmail: ${partnerEmail}\nNotes / Footprint: ${partnerNotes}`
                      )}`}
                      className="px-5 py-2 rounded-full bg-[#006e21] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#005a1b] cursor-pointer shadow-bubble-sm transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Email Partner Desk</span>
                    </a>
                    <button
                      onClick={() => {
                        setPartnerAppSubmitted(false);
                        setPartnerCompany('');
                        setPartnerCountry('');
                        setPartnerOfficer('');
                        setPartnerEmail('');
                        setPartnerNotes('');
                      }}
                      className="px-5 py-2 rounded-full bg-[#00356a] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#002244] cursor-pointer shadow-bubble-sm transition-all"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handlePartnerSubmit}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={partnerCompany}
                      onChange={(e) => setPartnerCompany(e.target.value)}
                      placeholder="Company Name"
                      className="px-3 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                    />
                    <input
                      type="text"
                      required
                      value={partnerCountry}
                      onChange={(e) => setPartnerCountry(e.target.value)}
                      placeholder="Country / Territory"
                      className="px-3 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={partnerOfficer}
                      onChange={(e) => setPartnerOfficer(e.target.value)}
                      placeholder="Contact Officer"
                      className="px-3 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                    />
                    <input
                      type="email"
                      required
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      placeholder="Corporate Email"
                      className="px-3 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={partnerNotes}
                    onChange={(e) => setPartnerNotes(e.target.value)}
                    placeholder="Brief description of ready-mix volume or regional distribution footprint..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#005a1b] transition-all cursor-pointer"
                  >
                    Submit Dealer Application
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOKI Locations: Vietnam HQ, Alpha Hub, and Global Directory per Mindnote */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mb-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-4 py-1.5 rounded-full inline-block mb-2">
            GLOBAL LOCATIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00356a]">
            HOKI Production & Engineering Desks
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#00356a]/70">
            Headquartered in Vietnam with automated manufacturing at Alpha Hub and regional desks across key global markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GLOBAL_OFFICES.map((office, idx) => {
            const isHQ = office.region.includes('HQ');
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border shadow-bubble-sm flex flex-col justify-between ${
                  isHQ
                    ? 'bg-white border-[#006e21]/40 shadow-bubble'
                    : 'bg-white border-[#e5e9ee]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-[#00356a] flex items-center gap-1.5">
                      <span>{office.flag}</span>
                      <span>{office.region}</span>
                    </span>
                    {isHQ && (
                      <span className="text-[10px] font-bold text-[#006e21] bg-[#006e21]/10 px-2 py-0.5 rounded-full">
                        GLOBAL HQ
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-[#006e21] mb-2">
                    {office.location}
                  </div>

                  <div className="space-y-1.5 text-xs text-[#00356a]/70 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#006e21] shrink-0 mt-0.5" />
                      <span>{office.function}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#006e21] shrink-0" />
                      <span>{office.contact}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-[11px] text-[#00356a]/60 font-medium">
                  <span>HOKI Direct Support Desk</span>
                  <div className="w-2 h-2 rounded-full bg-[#006e21]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
