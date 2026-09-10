import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import {
  Download,
  Upload,
  Database,
  Building2,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface AdminBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  defaultSubTab?: 'download' | 'restore';
}

export const AdminBackupModal: React.FC<AdminBackupModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  defaultSubTab = 'download'
}) => {
  const {
    projects,
    articles,
    exportBackupData,
    importBackupData,
    resetToDefaults
  } = useData();

  const [activeTab, setActiveTab] = useState<'download' | 'restore'>(defaultSubTab);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<{
    raw: any;
    projectCount: number;
    articleCount: number;
    backupType?: string;
    exportedAt?: string;
    sampleProjects?: string[];
    sampleArticles?: string[];
  } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmReplace, setShowConfirmReplace] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle file selection and parsing
  const handleFile = (file: File) => {
    setSelectedFile(file);
    setParseError(null);
    setParsedData(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const json = JSON.parse(text);

        let pCount = 0;
        let aCount = 0;
        let sampleProj: string[] = [];
        let sampleArt: string[] = [];

        if (Array.isArray(json)) {
          if (json.length > 0 && ('code' in json[0] || 'facilityType' in json[0])) {
            pCount = json.length;
            sampleProj = json.slice(0, 3).map((p: any) => p.title || p.code || 'Project');
          } else if (json.length > 0 && ('categorySlug' in json[0] || 'subtitle' in json[0])) {
            aCount = json.length;
            sampleArt = json.slice(0, 3).map((a: any) => a.title || 'Article');
          }
        } else if (typeof json === 'object' && json !== null) {
          if (Array.isArray(json.projects)) {
            pCount = json.projects.length;
            sampleProj = json.projects.slice(0, 3).map((p: any) => p.title || p.code || 'Project');
          }
          if (Array.isArray(json.articles)) {
            aCount = json.articles.length;
            sampleArt = json.articles.slice(0, 3).map((a: any) => a.title || 'Article');
          }
        }

        if (pCount === 0 && aCount === 0) {
          setParseError('Uploaded JSON does not contain recognized HOKI projects or knowledge articles arrays.');
          return;
        }

        setParsedData({
          raw: json,
          projectCount: pCount,
          articleCount: aCount,
          backupType: json.backupType || (pCount > 0 && aCount > 0 ? 'Full System' : pCount > 0 ? 'Projects' : 'Knowledge'),
          exportedAt: json.exportedAt || null,
          sampleProjects: sampleProj,
          sampleArticles: sampleArt
        });
      } catch (err: any) {
        setParseError(`JSON Parsing Failed: ${err?.message || 'Malformed JSON file'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = (type: 'all' | 'projects' | 'knowledge') => {
    const data = exportBackupData(type);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date().toISOString().split('T')[0];
    a.download = `hoki-${type}-backup-${now}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded ${type.toUpperCase()} backup JSON.`);
  };

  const handleExecuteRestore = () => {
    if (!parsedData) return;
    setIsProcessing(true);

    setTimeout(() => {
      const result = importBackupData(parsedData.raw, restoreMode);
      setIsProcessing(false);
      setShowConfirmReplace(false);

      if (result.success) {
        onShowToast(result.message);
        onClose();
      } else {
        setParseError(result.message);
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#00356a]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full shadow-bubble-lg border border-[#e2e6eb] max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e2e6eb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00356a]/10 text-[#00356a] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider">
                Engineering Database Maintenance
              </span>
              <h2 className="text-xl font-extrabold text-[#00356a]">
                Backup & Re-upload Restore Center
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-all cursor-pointer shadow-bubble-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-[#f4f6f8] rounded-full border border-[#dce0e6] my-6 shadow-bubble-inset">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'download'
                ? 'bg-white text-[#00356a] shadow-bubble-sm'
                : 'text-[#00356a]/60 hover:text-[#00356a]'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Backup</span>
          </button>
          <button
            onClick={() => setActiveTab('restore')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'restore'
                ? 'bg-[#006e21] text-white shadow-bubble-sm'
                : 'text-[#00356a]/60 hover:text-[#00356a]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Re-upload & Restore Data</span>
          </button>
        </div>

        {/* TAB 1: DOWNLOAD BACKUP */}
        {activeTab === 'download' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] text-xs text-[#00356a]/80 leading-relaxed">
              Generate structured JSON backups of your current projects and knowledge monographs.
              These files can be archived, transferred across environments, or re-uploaded at any time to restore data.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Full Backup */}
              <div className="bg-white rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between hover:border-[#00356a] transition-all">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#00356a]/10 text-[#00356a] flex items-center justify-center mb-3">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#00356a]">Full System Backup</h4>
                  <p className="text-[11px] text-[#00356a]/70 mt-1">
                    Complete package containing both {projects.length} project dossiers and {articles.length} knowledge articles.
                  </p>
                </div>
                <button
                  onClick={() => handleDownload('all')}
                  className="mt-4 w-full py-2.5 px-3 rounded-full bg-[#00356a] text-white text-xs font-bold hover:bg-[#002244] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-bubble-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All JSON</span>
                </button>
              </div>

              {/* Projects Only */}
              <div className="bg-white rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between hover:border-[#00356a] transition-all">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-3">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#00356a]">Projects Dossiers Only</h4>
                  <p className="text-[11px] text-[#00356a]/70 mt-1">
                    Export all {projects.length} civil project dossiers, dosing specs, and photo galleries.
                  </p>
                </div>
                <button
                  onClick={() => handleDownload('projects')}
                  className="mt-4 w-full py-2.5 px-3 rounded-full bg-white border border-[#00356a] text-[#00356a] text-xs font-bold hover:bg-[#f4f6f8] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-bubble-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Projects JSON</span>
                </button>
              </div>

              {/* Knowledge Only */}
              <div className="bg-white rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between hover:border-[#00356a] transition-all">
                <div>
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#00356a]">Knowledge Articles Only</h4>
                  <p className="text-[11px] text-[#00356a]/70 mt-1">
                    Export all {articles.length} structural research papers, monographs, and ACI 544 guidelines.
                  </p>
                </div>
                <button
                  onClick={() => handleDownload('knowledge')}
                  className="mt-4 w-full py-2.5 px-3 rounded-full bg-white border border-[#006e21] text-[#006e21] text-xs font-bold hover:bg-[#006e21]/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-bubble-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Articles JSON</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RE-UPLOAD & RESTORE */}
        {activeTab === 'restore' && (
          <div className="space-y-6">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="p-8 rounded-3xl border-2 border-dashed border-[#006e21]/40 hover:border-[#006e21] bg-[#006e21]/5 hover:bg-[#006e21]/10 transition-all text-center cursor-pointer flex flex-col items-center justify-center"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,application/json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-white text-[#006e21] flex items-center justify-center mb-3 shadow-bubble-sm">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#00356a]">
                {selectedFile ? selectedFile.name : 'Choose or Drag & Drop Backup JSON'}
              </p>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Supports any official HOKI backup JSON (Projects, Knowledge, or Full System)
              </p>
            </div>

            {/* Error Display */}
            {parseError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Error reading backup file:</span> {parseError}
                </div>
              </div>
            )}

            {/* Parsed Inspection Preview */}
            {parsedData && (
              <div className="p-5 rounded-2xl bg-[#f4f6f8] border border-[#dce0e6] space-y-4">
                <div className="flex items-center justify-between border-b border-[#e2e6eb] pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006e21]" />
                    <span className="text-xs font-bold text-[#00356a]">Backup Validated Successfully</span>
                  </div>
                  {parsedData.exportedAt && (
                    <span className="text-[10px] text-[#00356a]/60">
                      Exported: {new Date(parsedData.exportedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-[#e2e6eb]">
                    <div className="text-[10px] uppercase font-bold text-[#00356a]/60">Projects Detected</div>
                    <div className="text-lg font-black text-[#00356a] mt-0.5">{parsedData.projectCount}</div>
                    {parsedData.sampleProjects && parsedData.sampleProjects.length > 0 && (
                      <div className="text-[10px] text-[#00356a]/70 mt-1 truncate">
                        e.g. {parsedData.sampleProjects.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#e2e6eb]">
                    <div className="text-[10px] uppercase font-bold text-[#00356a]/60">Articles Detected</div>
                    <div className="text-lg font-black text-[#006e21] mt-0.5">{parsedData.articleCount}</div>
                    {parsedData.sampleArticles && parsedData.sampleArticles.length > 0 && (
                      <div className="text-[10px] text-[#00356a]/70 mt-1 truncate">
                        e.g. {parsedData.sampleArticles.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="space-y-2 pt-2">
                  <label className="block text-[11px] font-bold uppercase text-[#00356a]">
                    Select Re-upload / Restore Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setRestoreMode('merge')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        restoreMode === 'merge'
                          ? 'border-[#006e21] bg-white shadow-bubble-sm ring-1 ring-[#006e21]'
                          : 'border-[#e2e6eb] bg-white hover:border-[#dce0e6]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="restoreMode"
                        checked={restoreMode === 'merge'}
                        onChange={() => setRestoreMode('merge')}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#00356a]">Merge & Update (Safe)</div>
                        <div className="text-[10px] text-[#00356a]/70 mt-0.5 leading-normal">
                          Appends new records and updates existing matching IDs. Retains any current projects or articles not in this file.
                        </div>
                      </div>
                    </label>

                    <label
                      onClick={() => setRestoreMode('replace')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        restoreMode === 'replace'
                          ? 'border-rose-500 bg-white shadow-bubble-sm ring-1 ring-rose-500'
                          : 'border-[#e2e6eb] bg-white hover:border-[#dce0e6]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="restoreMode"
                        checked={restoreMode === 'replace'}
                        onChange={() => setRestoreMode('replace')}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-xs font-bold text-rose-700">Full Replace (Clean Overwrite)</div>
                        <div className="text-[10px] text-[#00356a]/70 mt-0.5 leading-normal">
                          Overwrites all existing projects/articles strictly with the records present in this backup file.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Confirm Replace Warning */}
                {restoreMode === 'replace' && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>
                      Notice: Full Replace will wipe all existing projects and articles not present in this backup file.
                    </span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-3 border-t border-[#e2e6eb] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setParsedData(null);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[#00356a] hover:bg-white"
                  >
                    Clear File
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => {
                      if (restoreMode === 'replace') {
                        setShowConfirmReplace(true);
                      } else {
                        handleExecuteRestore();
                      }
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#005a1b] flex items-center gap-2 shadow-bubble-sm cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>
                      {restoreMode === 'replace' ? 'Proceed with Full Replace' : 'Confirm & Merge Data'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal footer */}
        <div className="mt-8 pt-4 border-t border-[#e2e6eb] flex items-center justify-between text-[11px] text-[#00356a]/60">
          <span>HOKI Local Storage Sync: Active</span>
          <span>Version 3.0 Engineering Engine</span>
        </div>

        {/* Confirmation Sub-Modal for Replace */}
        {showConfirmReplace && (
          <div className="absolute inset-0 z-60 bg-white/95 backdrop-blur-xs rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#00356a]">Confirm Clean Data Overwrite?</h3>
            <p className="text-xs text-[#00356a]/70 max-w-md">
              Are you sure you want to replace existing project dossiers and knowledge articles with this backup?
              Any current entries not included in the uploaded backup will be removed.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReplace(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-[#00356a] bg-[#f4f6f8] hover:bg-[#e2e6eb]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRestore}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-bubble-sm flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Yes, Overwrite & Restore</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
