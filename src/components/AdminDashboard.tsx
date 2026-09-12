import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ProjectCaseStudy, JournalArticle, ConsultationRequest } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Building2,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Search,
  Filter,
  ArrowUpRight,
  Send,
  Trash2,
  Eye,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  Database,
  Video,
  PhoneCall,
  Check,
  Copy,
  Download,
  FileSpreadsheet
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: 'knowledge' | 'projects' | 'media' | 'system' | 'branding' | 'epc' | 'about' | 'video' | 'hotline') => void;
  onPreviewArticle?: (article: JournalArticle) => void;
  onPreviewProject?: (project: ProjectCaseStudy) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onPreviewArticle,
  onPreviewProject
}) => {
  const {
    projects,
    articles,
    consultationRequests,
    addConsultationRequest,
    updateConsultationStatus,
    deleteConsultationRequest,
    isServerSyncing,
    lastServerSyncTime,
    refreshServerData
  } = useData();

  // Consultation timeline view toggle: 'daily' | 'sector'
  const [consultationChartMode, setConsultationChartMode] = useState<'daily' | 'sector'>('daily');
  // Consultation list status filter
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'in-progress' | 'completed'>('all');
  // Selected consultation for detail modal
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  // Search query for inquiries
  const [inquirySearch, setInquirySearch] = useState('');
  const [exportedCsvNotice, setExportedCsvNotice] = useState(false);

  const handleExportCsv = (filteredOnly: boolean = false) => {
    const listToExport = filteredOnly ? filteredConsultations : consultationRequests;
    if (listToExport.length === 0) {
      alert('No consultation records available to export.');
      return;
    }

    const headers = [
      'Submission ID',
      'Submitted At (UTC)',
      'Contact Name',
      'Firm / Organization',
      'Email',
      'Phone',
      'Inquiry Type',
      'Slab Area',
      'Target Date',
      'Status',
      'Detailed Notes'
    ];

    const escapeCsvField = (field?: string | null) => {
      if (field === undefined || field === null) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = listToExport.map((req) => [
      escapeCsvField(req.id),
      escapeCsvField(req.submittedAt || new Date().toISOString()),
      escapeCsvField(req.name),
      escapeCsvField(req.firm),
      escapeCsvField(req.email),
      escapeCsvField(req.phone || 'N/A'),
      escapeCsvField(req.projectType),
      escapeCsvField(req.slabArea || 'N/A'),
      escapeCsvField(req.targetDate || 'N/A'),
      escapeCsvField(req.status),
      escapeCsvField(req.notes || '')
    ]);

    // Prepend UTF-8 BOM so Excel opens Vietnamese and special characters cleanly
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map((r) => r.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `HOKI_Leads_Consultations_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportedCsvNotice(true);
    setTimeout(() => setExportedCsvNotice(false), 3500);
  };

  // 1. KPI SUMMARY CALCULATIONS
  const totalProjectsCount = projects.length;
  const totalFloorAreaM2 = useMemo(() => {
    return projects.reduce((acc, p) => {
      const num = parseInt(p.area.replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? acc : acc + num;
    }, 0);
  }, [projects]);

  const distinctSectorsCount = useMemo(() => {
    return new Set(projects.map(p => p.sector)).size;
  }, [projects]);

  const totalArticlesCount = articles.length;
  const flagshipArticlesCount = useMemo(() => {
    return articles.filter(a => a.isFlagship).length;
  }, [articles]);

  const totalReadTimeMin = useMemo(() => {
    return articles.reduce((acc, a) => {
      const num = parseInt(a.readTime.replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? acc : acc + num;
    }, 0);
  }, [articles]);

  const totalConsultations = consultationRequests.length;
  const newConsultationsCount = useMemo(() => {
    return consultationRequests.filter(c => c.status === 'new').length;
  }, [consultationRequests]);

  const inProgressConsultationsCount = useMemo(() => {
    return consultationRequests.filter(c => c.status === 'in-progress' || c.status === 'reviewed').length;
  }, [consultationRequests]);

  const completedConsultationsCount = useMemo(() => {
    return consultationRequests.filter(c => c.status === 'completed').length;
  }, [consultationRequests]);

  // 2. CHART DATA: CONSULTATIONS OVER RECENT 7 DAYS
  const dailyConsultationData = useMemo(() => {
    // Generate dates for the recent 7 days (Sep 2 to Sep 8, 2026)
    const days = [
      { key: '2026-09-02', label: 'Sep 2' },
      { key: '2026-09-03', label: 'Sep 3' },
      { key: '2026-09-04', label: 'Sep 4' },
      { key: '2026-09-05', label: 'Sep 5' },
      { key: '2026-09-06', label: 'Sep 6' },
      { key: '2026-09-07', label: 'Sep 7' },
      { key: '2026-09-08', label: 'Sep 8 (Today)' }
    ];

    return days.map(day => {
      const dayReqs = consultationRequests.filter(req => {
        if (!req.submittedAt) return false;
        return req.submittedAt.startsWith(day.key);
      });

      const newReqs = dayReqs.filter(r => r.status === 'new').length;
      const activeOrDone = dayReqs.filter(r => r.status !== 'new').length;

      return {
        date: day.label,
        newRequests: newReqs,
        processed: activeOrDone,
        total: dayReqs.length
      };
    });
  }, [consultationRequests]);

  // 3. CHART DATA: CONSULTATIONS BY SECTOR
  const sectorConsultationData = useMemo(() => {
    const counts: Record<string, number> = {};
    consultationRequests.forEach(req => {
      const sector = req.projectType || 'Industrial Flooring';
      counts[sector] = (counts[sector] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([sector, count]) => ({
        sector: sector.length > 16 ? sector.substring(0, 16) + '...' : sector,
        fullSector: sector,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [consultationRequests]);

  // 4. CHART DATA: PROJECTS BY SECTOR
  const projectSectorData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      const label = p.sectorLabel || p.sector;
      counts[label] = (counts[label] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '..' : name,
        fullName: name,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [projects]);

  // 5. CHART DATA: ARTICLES BY CATEGORY
  const articleCategoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach(a => {
      // Shorten category names for clean display
      let cat = a.category;
      if (cat.includes('CRACK')) cat = 'Crack Control';
      else if (cat.includes('JOINTLESS')) cat = 'Jointless Slabs';
      else if (cat.includes('DOSING') || cat.includes('BATCH')) cat = 'Field Dosing';
      else if (cat.includes('LCA') || cat.includes('CARBON')) cat = 'LCA & Carbon';
      else if (cat.includes('CODES') || cat.includes('STANDARDS')) cat = 'Design Codes';

      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([category, count]) => ({
        category,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  // 6. FILTERED CONSULTATION INQUIRIES LIST
  const filteredConsultations = useMemo(() => {
    return consultationRequests.filter(req => {
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      const matchesSearch =
        inquirySearch.trim() === '' ||
        req.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        req.firm.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        req.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        req.projectType.toLowerCase().includes(inquirySearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [consultationRequests, statusFilter, inquirySearch]);

  const getStatusBadge = (status: ConsultationRequest['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            New Inquiry
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#00356a] border border-blue-200">
            <Clock className="w-3 h-3 text-[#00356a]" />
            Under Review
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Zap className="w-3 h-3 text-emerald-600" />
            Dosage In-Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#006e21]/10 text-[#006e21] border border-[#006e21]/30">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Server JSON Engine & Real-Time Sync Banner */}
      <div className="p-5 rounded-3xl bg-white border border-[#e5e9ee] shadow-bubble flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-bubble-inset bg-[#006e21]/10 text-[#006e21]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-[#00356a]">
                HOKI Server-Side JSON Storage Engine
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#006e21]/15 text-[#006e21] border border-[#006e21]/30">
                <span className={`w-2 h-2 rounded-full ${isServerSyncing ? 'bg-amber-500 animate-ping' : 'bg-[#006e21]'}`} />
                {isServerSyncing ? 'Synchronizing with Server...' : 'Live Multi-Device Sync Active'}
              </span>
              {lastServerSyncTime && (
                <span className="text-[10px] text-[#00356a]/60 font-mono">
                  Synced: {lastServerSyncTime}
                </span>
              )}
            </div>
            <p className="text-xs text-[#00356a]/70 mt-0.5">
              All project dossiers, knowledge monographs, EPC partners, and client consultation leads are saved directly to server JSON files and instantly synchronized across all devices and visitors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => refreshServerData()}
            disabled={isServerSyncing}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#f4f6f8] text-[#00356a] border border-[#e5e9ee] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-bubble-sm disabled:opacity-50"
            title="Force refresh data from server"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isServerSyncing ? 'animate-spin text-amber-600' : 'text-[#006e21]'}`} />
            <span>{isServerSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            onClick={() => handleExportCsv(false)}
            className="px-4 py-2.5 rounded-xl bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-bubble-sm"
            title="Download all inquiries and RFQ quote submissions as CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export Leads to CSV</span>
          </button>

          <button
            onClick={() => onNavigateTab('system')}
            className="px-4 py-2.5 rounded-xl bg-[#00356a] hover:bg-[#002a54] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-bubble-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>System Status</span>
          </button>
        </div>
      </div>

      {/* 1. TOP SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Projects */}
        <div
          id="stat-total-projects"
          className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] relative overflow-hidden group hover:border-[#00356a]/30 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00356a]/10 flex items-center justify-center text-[#00356a] shadow-bubble-inset">
              <Building2 className="w-6 h-6" />
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-[11px] font-bold uppercase tracking-wider text-[#00356a] hover:text-[#006e21] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#00356a] tracking-tight">
            {totalProjectsCount}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#00356a]/70 mt-1">
            Total Project Dossiers
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-[11px] text-[#00356a]/70 font-medium">
            <span>Reinforced Area:</span>
            <span className="font-bold text-[#006e21]">{totalFloorAreaM2.toLocaleString()} m²</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-[#00356a]/70 font-medium">
            <span>Sectors Covered:</span>
            <span className="font-bold text-[#00356a]">{distinctSectorsCount} Civil Sectors</span>
          </div>
        </div>

        {/* Card 2: Articles Published */}
        <div
          id="stat-articles-published"
          className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] relative overflow-hidden group hover:border-[#006e21]/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#006e21]/10 flex items-center justify-center text-[#006e21] shadow-bubble-inset">
              <BookOpen className="w-6 h-6" />
            </div>
            <button
              onClick={() => onNavigateTab('knowledge')}
              className="text-[11px] font-bold uppercase tracking-wider text-[#006e21] hover:text-[#00356a] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#006e21] tracking-tight">
            {totalArticlesCount}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#00356a]/70 mt-1">
            Articles & Monographs
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-[11px] text-[#00356a]/70 font-medium">
            <span>Flagship Studies:</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
              {flagshipArticlesCount} Peer-Reviewed
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-[#00356a]/70 font-medium">
            <span>Total Reading Depth:</span>
            <span className="font-bold text-[#00356a]">{totalReadTimeMin} min technical</span>
          </div>
        </div>

        {/* Card 3: Consultation Request Volume */}
        <div
          id="stat-consultation-volume"
          className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] relative overflow-hidden group hover:border-[#00356a]/30 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00356a]/10 flex items-center justify-center text-[#00356a] shadow-bubble-inset">
              <MessageSquare className="w-6 h-6" />
            </div>
            {newConsultationsCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-rose-100 text-rose-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                {newConsultationsCount} Action Req.
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-50">
                Queue Clear
              </span>
            )}
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#00356a] tracking-tight">
            {totalConsultations}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#00356a]/70 mt-1">
            Consultation Requests
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-[11px] text-[#00356a]/70 font-medium">
            <span>Active Reviews:</span>
            <span className="font-bold text-[#00356a]">{inProgressConsultationsCount} In-Progress</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-[#00356a]/70 font-medium">
            <span>Dossiers Dispatched:</span>
            <span className="font-bold text-[#006e21]">{completedConsultationsCount} Transmitted</span>
          </div>
        </div>

        {/* Card 4: Verified Decarbonization & Engineering SLA */}
        <div
          id="stat-engineering-sla"
          className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] relative overflow-hidden group hover:border-[#006e21]/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#006e21]/10 flex items-center justify-center text-[#006e21] shadow-bubble-inset">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-[#006e21] bg-[#006e21]/10">
              TR34 / ISO 14040
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#006e21] tracking-tight">
            &lt; 4.0h
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#00356a]/70 mt-1">
            Avg. Engineering Response
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-[11px] text-[#00356a]/70 font-medium">
            <span>Target Spec SLA:</span>
            <span className="font-bold text-[#00356a]">Same Business Day</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-[#00356a]/70 font-medium">
            <span>Verified Mesh Offset:</span>
            <span className="font-bold text-[#006e21]">&gt; 5,400 tCO₂e</span>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY BAR CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1 (Spans 2 cols): Recent Consultation Request Volume Bar Chart */}
        <div
          id="consultation-volume-chart-card"
          className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-2.5 py-0.5 rounded-full">
                  Volume Telemetry
                </span>
                <span className="text-[11px] text-[#00356a]/50 font-medium">
                  Updated Live
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-[#00356a]">
                Recent Consultation Request Volume
              </h3>
              <p className="text-xs text-[#00356a]/70 mt-0.5">
                Daily incoming structural dosing requests from contractors, consulting engineers, and EPCs.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#f4f6f8] p-1 rounded-2xl border border-[#e2e6eb] shadow-bubble-inset shrink-0">
              <button
                id="btn-consultation-chart-daily"
                onClick={() => setConsultationChartMode('daily')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  consultationChartMode === 'daily'
                    ? 'bg-white text-[#00356a] shadow-bubble-sm'
                    : 'text-[#00356a]/60 hover:text-[#00356a]'
                }`}
              >
                7-Day Timeline
              </button>
              <button
                id="btn-consultation-chart-sector"
                onClick={() => setConsultationChartMode('sector')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  consultationChartMode === 'sector'
                    ? 'bg-white text-[#00356a] shadow-bubble-sm'
                    : 'text-[#00356a]/60 hover:text-[#00356a]'
                }`}
              >
                By Project Sector
              </button>
            </div>
          </div>

          {/* Render Recharts Bar Chart */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {consultationChartMode === 'daily' ? (
                <BarChart
                  data={dailyConsultationData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f4" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#00356a', fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={{ stroke: '#dce0e6' }}
                  />
                  <YAxis
                    tick={{ fill: '#00356a', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #dce0e6',
                      boxShadow: '0 8px 24px rgba(0, 53, 106, 0.12)',
                      fontSize: '12px',
                      padding: '10px 14px'
                    }}
                    itemStyle={{ color: '#00356a', fontWeight: 600 }}
                    labelStyle={{ color: '#00356a', fontWeight: 800, marginBottom: '4px' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="newRequests"
                    name="New Inquiries"
                    fill="#00356a"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                  <Bar
                    dataKey="processed"
                    name="Reviewed & In-Progress"
                    fill="#006e21"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              ) : (
                <BarChart
                  data={sectorConsultationData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f4" />
                  <XAxis
                    dataKey="sector"
                    tick={{ fill: '#00356a', fontSize: 10, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={{ stroke: '#dce0e6' }}
                  />
                  <YAxis
                    tick={{ fill: '#00356a', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #dce0e6',
                      boxShadow: '0 8px 24px rgba(0, 53, 106, 0.12)',
                      fontSize: '12px',
                      padding: '10px 14px'
                    }}
                    formatter={(value: any) => [`${value} Inquiries`, 'Volume']}
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullSector || _label}
                  />
                  <Bar
                    dataKey="count"
                    name="Consultation Inquiries"
                    fill="#00356a"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  >
                    {sectorConsultationData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#00356a' : index === 1 ? '#004c8f' : index === 2 ? '#006e21' : '#008527'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-xs text-[#00356a]/70">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-[#006e21]" />
              Inquiry volume up <span className="font-bold text-[#006e21]">+28%</span> over prior 14-day cycle.
            </span>
            <span className="text-[11px] font-semibold text-[#00356a]/60">
              {consultationRequests.length} Total Registered
            </span>
          </div>
        </div>

        {/* CHART 2: Project Dossiers by Sector Bar Chart */}
        <div
          id="projects-sector-chart-card"
          className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-widest text-[#00356a] uppercase bg-[#00356a]/10 px-2.5 py-0.5 rounded-full">
                Portfolio Mix
              </span>
              <span className="text-xs font-bold text-[#00356a]">
                {totalProjectsCount} Total
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-[#00356a]">
              Projects by Sector
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-0.5">
              Distribution of verified case studies across application domains.
            </p>
          </div>

          <div className="h-60 sm:h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectSectorData}
                margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f4" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#00356a', fontSize: 10, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#dce0e6' }}
                />
                <YAxis
                  tick={{ fill: '#00356a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #dce0e6',
                    boxShadow: '0 8px 24px rgba(0, 53, 106, 0.12)',
                    fontSize: '12px',
                    padding: '10px 14px'
                  }}
                  formatter={(val: any) => [`${val} Case Studies`, 'Projects']}
                  labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullName || _label}
                />
                <Bar
                  dataKey="count"
                  fill="#006e21"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                >
                  {projectSectorData.map((_entry, index) => (
                    <Cell
                      key={`proj-cell-${index}`}
                      fill={index % 2 === 0 ? '#00356a' : '#006e21'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-xs text-[#00356a]/70">
            <span>Primary Focus:</span>
            <span className="font-bold text-[#00356a]">
              {projectSectorData[0]?.fullName || 'Industrial Flooring'} ({projectSectorData[0]?.count || 0})
            </span>
          </div>
        </div>
      </div>

      {/* 3. SECONDARY ROW: KNOWLEDGE CATEGORIES BREAKDOWN & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 3: Articles by Category */}
        <div
          id="articles-category-chart-card"
          className="bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-2.5 py-0.5 rounded-full">
                Technical Papers
              </span>
              <span className="text-xs font-bold text-[#006e21]">
                {totalArticlesCount} Published
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-[#00356a]">
              Articles by Discipline
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-0.5">
              Structural knowledge monographs mapped to engineering disciplines.
            </p>
          </div>

          <div className="h-56 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={articleCategoryData}
                margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f4" />
                <XAxis
                  dataKey="category"
                  tick={{ fill: '#00356a', fontSize: 10, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#dce0e6' }}
                />
                <YAxis
                  tick={{ fill: '#00356a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #dce0e6',
                    boxShadow: '0 8px 24px rgba(0, 53, 106, 0.12)',
                    fontSize: '12px',
                    padding: '10px 14px'
                  }}
                  formatter={(val: any) => [`${val} Articles`, 'Published']}
                />
                <Bar
                  dataKey="count"
                  fill="#006e21"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-xs text-[#00356a]/70">
            <span>Primary Focus:</span>
            <span className="font-bold text-[#006e21]">
              {articleCategoryData[0]?.category || 'Crack Control'}
            </span>
          </div>
        </div>

        {/* Fast Action Shortcuts Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-[#00356a] uppercase bg-[#00356a]/10 px-2.5 py-0.5 rounded-full">
                Engineering Operations
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-[#00356a]">
              Direct Console Shortcuts
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-0.5">
              Jump directly into content authoring, case dossier compilation, or media asset staging.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            <button
              onClick={() => onNavigateTab('epc')}
              className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:border-[#006e21] hover:bg-white text-left transition-all cursor-pointer group shadow-bubble-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#00356a] group-hover:text-[#006e21] transition-colors">
                EPC Partners (Main Page)
              </div>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Customize partner logos, names, subtitles, and header.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('about')}
              className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:border-[#00356a] hover:bg-white text-left transition-all cursor-pointer group shadow-bubble-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00356a]/10 text-[#00356a] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#00356a] transition-colors">
                About Us Page Editor
              </div>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Edit leadership names &amp; titles, brand story, and advisory.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('branding')}
              className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:border-[#006e21] hover:bg-white text-left transition-all cursor-pointer group shadow-bubble-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#00356a] group-hover:text-[#006e21] transition-colors">
                Hero &amp; Site Pictures
              </div>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Change hero background photo, opacity, and site graphics.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('video')}
              className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:border-red-500 hover:bg-white text-left transition-all cursor-pointer group shadow-bubble-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#00356a] group-hover:text-red-600 transition-colors">
                Main Page YouTube Video
              </div>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Change YouTube video link, autoplay, title, and channel tag.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('knowledge')}
              className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:border-[#006e21] hover:bg-white text-left transition-all cursor-pointer group shadow-bubble-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#00356a] group-hover:text-[#006e21] transition-colors">
                Publish Monograph
              </div>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Add research paper, ACI 544 guideline, or LCA study.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('projects')}
              className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:border-[#00356a] hover:bg-white text-left transition-all cursor-pointer group shadow-bubble-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00356a]/10 text-[#00356a] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#00356a] transition-colors">
                Add Project Dossier
              </div>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Upload new civil site data, fiber dosage, and slab specs.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('hotline')}
              className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:border-[#006e21] hover:bg-white text-left transition-all cursor-pointer group shadow-bubble-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#00356a] group-hover:text-[#006e21] transition-colors">
                Hotline &amp; Social Links
              </div>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Configure Call Now number, toggles, Zalo, Facebook, TikTok.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('system')}
              className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:border-[#006e21] hover:bg-white text-left transition-all cursor-pointer group shadow-bubble-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#00356a] group-hover:text-[#006e21] transition-colors">
                Backup &amp; Re-upload
              </div>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Export and restore project dossiers &amp; knowledge data.
              </p>
            </button>
          </div>

          <div className="pt-3 border-t border-[#f0f3f5] flex items-center justify-between text-xs text-[#00356a]/70">
            <span>Engineering Standard:</span>
            <span className="font-semibold text-[#00356a]">
              ACI 544.4R • TR34 4th Edition • fib Model Code 2020 • EN 14889-1
            </span>
          </div>
        </div>
      </div>

      {/* 4. RECENT CONSULTATION REQUESTS MANAGEMENT TABLE */}
      <div id="recent-consultations-section" className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-2.5 py-0.5 rounded-full">
                Client Queue
              </span>
              <span className="text-xs font-bold text-[#00356a]">
                {consultationRequests.length} Total Registered
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-[#00356a]">
              Recent Structural Consultation Inquiries
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-0.5">
              Live inquiries received from the structural consultation portal, direct contact desk, and RFQ calculators.
            </p>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#00356a]/40" />
              <input
                type="text"
                placeholder="Search firm, specifier, sector..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[#f4f6f8] p-1 rounded-full border border-[#e2e6eb] shadow-bubble-inset text-xs">
              {(['all', 'new', 'in-progress', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#00356a] shadow-bubble-sm'
                      : 'text-[#00356a]/60 hover:text-[#00356a]'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>

            {/* Export CSV Button */}
            <button
              onClick={() => handleExportCsv(filteredConsultations.length !== consultationRequests.length && filteredConsultations.length > 0)}
              className="px-4 py-2 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-bubble-sm shrink-0"
              title="Export consultation inquiries to CSV file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <div className="px-3.5 py-1.5 rounded-full bg-[#f4f6f8] text-[#00356a] text-xs font-bold border border-[#e2e6eb] shadow-bubble-inset shrink-0">
              <span>{filteredConsultations.length} {filteredConsultations.length === 1 ? 'Inquiry' : 'Inquiries'} Listed</span>
            </div>
          </div>
        </div>

        {exportedCsvNotice && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#006e21] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-[#006e21] shrink-0" />
            <span>CSV file generated and downloaded successfully! Ready for Excel or CRM lead management.</span>
          </div>
        )}

        {/* Inquiries Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#e2e6eb]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f6f8] border-b border-[#e2e6eb] text-[11px] font-bold text-[#00356a] uppercase tracking-wider">
                <th className="py-3.5 px-4">Specifier & Organization</th>
                <th className="py-3.5 px-4">Sector & Scope</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0f4] text-xs text-[#00356a]">
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#00356a]/60">
                    <MessageSquare className="w-8 h-8 text-[#00356a]/30 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No consultation requests match the active filter.</p>
                    <p className="text-xs text-[#00356a]/50 mt-1">Try changing search terms or switch status filters.</p>
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-[#f9fafb] transition-colors group cursor-pointer"
                    onClick={() => setSelectedConsultation(req)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#00356a] group-hover:text-[#006e21] transition-colors flex items-center gap-1.5">
                        <span>{req.name}</span>
                        {req.status === 'new' && (
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <div className="text-[11px] text-[#00356a]/70 font-medium">
                        {req.firm}
                      </div>
                      <div className="text-[10px] text-[#00356a]/50">
                        {req.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#00356a]">
                        {req.projectType}
                      </div>
                      {req.slabArea && (
                        <div className="text-[11px] font-medium text-[#006e21]">
                          Area: {req.slabArea}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#00356a]/70 text-[11px]">
                      {req.submittedAt ? (
                        <span>
                          {new Date(req.submittedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      ) : (
                        <span>Recent</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(req.status)}
                        <select
                          value={req.status}
                          onChange={(e) => updateConsultationStatus(req.id, e.target.value as ConsultationRequest['status'])}
                          className="text-[11px] py-1 px-2 rounded-lg bg-[#f4f6f8] border border-[#dce0e6] text-[#00356a] font-medium focus:outline-none focus:ring-1 focus:ring-[#00356a] cursor-pointer"
                        >
                          <option value="new">Mark New</option>
                          <option value="reviewed">Under Review</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedConsultation(req)}
                          className="p-1.5 rounded-lg bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] transition-colors cursor-pointer"
                          title="View Inquiry Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`mailto:${req.email}?subject=${encodeURIComponent(`[HOKI Engineering Desk] Re: Structural Consultation for ${req.firm}`)}&body=${encodeURIComponent(`Dear ${req.name},\n\nThank you for reaching out to HOKI regarding your ${req.projectType} project.\n\n`)}`}
                          className="p-1.5 rounded-lg bg-[#006e21]/10 hover:bg-[#006e21] hover:text-white text-[#006e21] transition-colors cursor-pointer"
                          title="Reply via Email"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete consultation record for ${req.name} (${req.firm})?`)) {
                              deleteConsultationRequest(req.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. CONSULTATION DETAIL MODAL */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00356a]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-bubble-lg border border-[#e5e9ee]">
            <button
              onClick={() => setSelectedConsultation(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10.5px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-3 py-1 rounded-full">
                Engineering Consultation Dossier
              </span>
              {getStatusBadge(selectedConsultation.status)}
            </div>

            <h3 className="text-xl font-extrabold text-[#00356a]">
              {selectedConsultation.name}
            </h3>
            <div className="text-xs font-bold text-[#00356a]/70">
              {selectedConsultation.firm}
            </div>

            <div className="mt-6 space-y-3 bg-[#f4f6f8] rounded-2xl p-4 border border-[#e2e6eb] text-xs text-[#00356a]">
              <div className="flex justify-between py-1 border-b border-[#e2e6eb]/60">
                <span className="text-[#00356a]/60">Corporate Email:</span>
                <span className="font-semibold select-all">{selectedConsultation.email}</span>
              </div>
              {selectedConsultation.phone && (
                <div className="flex justify-between py-1 border-b border-[#e2e6eb]/60">
                  <span className="text-[#00356a]/60">Phone / WhatsApp:</span>
                  <span className="font-semibold">{selectedConsultation.phone}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#e2e6eb]/60">
                <span className="text-[#00356a]/60">Project Sector:</span>
                <span className="font-bold text-[#006e21]">{selectedConsultation.projectType}</span>
              </div>
              {selectedConsultation.slabArea && (
                <div className="flex justify-between py-1 border-b border-[#e2e6eb]/60">
                  <span className="text-[#00356a]/60">Floor Area Scope:</span>
                  <span className="font-bold">{selectedConsultation.slabArea}</span>
                </div>
              )}
              {selectedConsultation.targetDate && (
                <div className="flex justify-between py-1 border-b border-[#e2e6eb]/60">
                  <span className="text-[#00356a]/60">Target Construction Date:</span>
                  <span className="font-semibold">{selectedConsultation.targetDate}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-[#00356a]/60">Received:</span>
                <span>{selectedConsultation.submittedAt ? new Date(selectedConsultation.submittedAt).toLocaleString() : 'Recent'}</span>
              </div>
            </div>

            {selectedConsultation.notes && (
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#00356a] mb-1.5">
                  Technical Specifications & Notes:
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#dce0e6] shadow-bubble-inset text-xs text-[#00356a]/80 leading-relaxed max-h-36 overflow-y-auto">
                  {selectedConsultation.notes}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#e2e6eb] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#00356a]/70">Status:</span>
                <select
                  value={selectedConsultation.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as ConsultationRequest['status'];
                    updateConsultationStatus(selectedConsultation.id, newStatus);
                    setSelectedConsultation({ ...selectedConsultation, status: newStatus });
                  }}
                  className="text-xs py-1 px-3 rounded-lg bg-[#f4f6f8] border border-[#dce0e6] font-bold text-[#00356a] cursor-pointer"
                >
                  <option value="new">New Inquiry</option>
                  <option value="reviewed">Under Review</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedConsultation.email}?subject=${encodeURIComponent(`[HOKI Engineering Desk] Re: Consultation for ${selectedConsultation.firm}`)}`}
                  className="px-4 py-2 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#005a1b] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </a>
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="px-4 py-2 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#002244]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
