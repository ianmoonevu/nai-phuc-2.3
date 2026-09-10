import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { StrategicPartner } from '../types';
import {
  Building2,
  Plus,
  Trash2,
  Upload,
  RotateCcw,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Check,
  Edit3,
  X
} from 'lucide-react';

interface AdminEpcSectionProps {
  onShowToast: (msg: string) => void;
}

export const AdminEpcSection: React.FC<AdminEpcSectionProps> = ({ onShowToast }) => {
  const {
    epcPartners,
    updateEpcPartner,
    addEpcPartner,
    deleteEpcPartner,
    reorderEpcPartners,
    resetEpcPartners,
    epcSectionConfig,
    updateEpcSectionConfig,
    uploadImageFile,
    mediaItems
  } = useData();

  // Section heading editing states
  const [sectionTitle, setSectionTitle] = useState(epcSectionConfig.title || '');
  const [sectionSubtitle, setSectionSubtitle] = useState(epcSectionConfig.subtitle || '');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // New Partner Modal / Drawer state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerSubtitle, setNewPartnerSubtitle] = useState('General Contractor');
  const [newPartnerLogoUrl, setNewPartnerLogoUrl] = useState('');
  const [newPartnerWebsite, setNewPartnerWebsite] = useState('');

  // Editing partner logo state
  const [logoUploadTargetId, setLogoUploadTargetId] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Media Library Picker state
  const [pickerTargetPartnerId, setPickerTargetPartnerId] = useState<string | null>(null);

  // Save section Title and Subtitle
  const handleSaveSectionConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    updateEpcSectionConfig({
      title: sectionTitle.trim() || 'Trusted by Leading EPC Contractors & Tier-1 Developers',
      subtitle: sectionSubtitle.trim()
    });
    setTimeout(() => {
      setIsSavingConfig(false);
      onShowToast('Main page EPC header & subtitle saved successfully');
    }, 300);
  };

  // Add Partner
  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim()) {
      alert('Please enter partner name');
      return;
    }

    addEpcPartner({
      name: newPartnerName.trim(),
      subtitle: newPartnerSubtitle.trim() || 'General Contractor',
      role: newPartnerSubtitle.trim() || 'General Contractor',
      logoUrl: newPartnerLogoUrl.trim() || undefined,
      websiteUrl: newPartnerWebsite.trim() || undefined
    });

    onShowToast(`EPC Partner "${newPartnerName}" added`);
    setNewPartnerName('');
    setNewPartnerSubtitle('General Contractor');
    setNewPartnerLogoUrl('');
    setNewPartnerWebsite('');
    setIsAddModalOpen(false);
  };

  // Delete Partner with confirmation
  const handleDeletePartner = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the EPC partners section?`)) {
      deleteEpcPartner(id);
      onShowToast(`Partner "${name}" removed`);
    }
  };

  // Move partner up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...epcPartners];
    const temp = items[index - 1];
    items[index - 1] = items[index];
    items[index] = temp;
    reorderEpcPartners(items);
    onShowToast('Partners reordered');
  };

  // Move partner down
  const handleMoveDown = (index: number) => {
    if (index === epcPartners.length - 1) return;
    const items = [...epcPartners];
    const temp = items[index + 1];
    items[index + 1] = items[index];
    items[index] = temp;
    reorderEpcPartners(items);
    onShowToast('Partners reordered');
  };

  // Trigger file input for a specific partner
  const handleTriggerLogoUpload = (partnerId: string) => {
    setLogoUploadTargetId(partnerId);
    fileInputRef.current?.click();
  };

  // Handle uploaded logo file
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !logoUploadTargetId) return;

    setIsUploadingLogo(true);
    try {
      const item = await uploadImageFile(file, 'general');
      if (logoUploadTargetId === 'new-partner') {
        setNewPartnerLogoUrl(item.url);
      } else {
        updateEpcPartner(logoUploadTargetId, { logoUrl: item.url });
      }
      onShowToast(`Logo "${item.name}" updated successfully`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to upload partner logo');
    } finally {
      setIsUploadingLogo(false);
      setLogoUploadTargetId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Select from media library
  const handleSelectMediaLogo = (url: string) => {
    if (!pickerTargetPartnerId) return;
    if (pickerTargetPartnerId === 'new-partner') {
      setNewPartnerLogoUrl(url);
    } else {
      updateEpcPartner(pickerTargetPartnerId, { logoUrl: url });
    }
    setPickerTargetPartnerId(null);
    onShowToast('Partner logo updated from library');
  };

  // Reset to default partners
  const handleResetDefaults = () => {
    if (window.confirm('Reset EPC partners and title back to original defaults?')) {
      resetEpcPartners();
      setSectionTitle('Trusted by Leading EPC Contractors & Tier-1 Developers');
      setSectionSubtitle('Delivering structural fiber reinforcement across Southeast Asia and global mega-projects');
      onShowToast('EPC Partners reset to defaults');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden File Input for Partner Logo Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLogoFileChange}
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
      />

      {/* 1. Header Card with Explanation & Reset */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006e21]/10 text-[#006e21] text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Main Page EPC &amp; Partner Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#00356a]">
              Trust &amp; Leading EPC Partners
            </h2>
            <p className="text-xs sm:text-sm text-[#00356a]/70 mt-1 max-w-2xl">
              Customize the strategic partner badges shown on the homepage. Change partner names, subtitles/roles, upload corporate logos, and modify the section title and subtitle.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2.5 rounded-full bg-[#f4f6f8] hover:bg-rose-50 hover:text-rose-700 text-[#00356a] border border-[#e2e6eb] text-xs font-bold shadow-bubble-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add EPC Partner</span>
            </button>
          </div>
        </div>

        {/* Section Heading & Subtitle Form */}
        <form onSubmit={handleSaveSectionConfig} className="mt-6 pt-6 border-t border-[#e2e6eb] grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6 space-y-1.5">
            <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider">
              Section Title (Main Page)
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="e.g. Trusted by Leading EPC Contractors & Tier-1 Developers"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
            />
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider">
              Section Subtitle (Optional)
            </label>
            <input
              type="text"
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              placeholder="e.g. Delivering structural fiber reinforcement across Southeast Asia"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSavingConfig}
              className="w-full py-2.5 rounded-xl bg-[#00356a] hover:bg-[#002850] text-white text-xs font-bold shadow-bubble-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSavingConfig ? 'Saving...' : 'Save Title'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Live Preview Strip of Main Page Section */}
      <div className="bg-[#f4f6f8] rounded-3xl p-6 shadow-bubble border border-[#e5e9ee]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Live Public Preview (Homepage Appearance)
          </span>
          <span className="text-[11px] text-[#00356a]/60">
            {epcPartners.length} Active Partners
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-bubble-sm border border-[#e2e6eb] text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00356a]/60 block">
            {sectionTitle || 'Trusted by Leading EPC Contractors & Tier-1 Developers'}
          </span>
          {sectionSubtitle && (
            <p className="text-xs text-[#00356a]/65 max-w-xl mx-auto mt-1 font-medium">
              {sectionSubtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-5">
            {epcPartners.map((partner, index) => {
              const partnerSub = partner.subtitle || partner.role || '';
              return (
                <div
                  key={partner.id || index}
                  className="px-4 py-2 rounded-full bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm flex items-center gap-2.5 hover:bg-white transition-all"
                >
                  {partner.logoUrl ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-white border border-[#dce0e6] shadow-sm flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="w-full h-full object-contain rounded-full"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#006e21] shrink-0" />
                  )}

                  <span className="text-xs font-extrabold tracking-wider text-[#00356a]">
                    {partner.name}
                  </span>
                  {partnerSub && (
                    <span className="text-[10px] text-[#00356a]/60 border-l border-[#dce0e6] pl-2 hidden sm:inline font-medium">
                      {partnerSub}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Partner Cards Management Table / Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#00356a]">Partner List &amp; Customization</h3>
            <p className="text-xs text-[#00356a]/70">
              Edit names, subtitles, upload custom logos, or reorder the appearance in real-time.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] border border-[#e2e6eb] text-xs font-bold shadow-bubble-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#006e21]" />
            <span>Add Partner</span>
          </button>
        </div>

        <div className="space-y-3">
          {epcPartners.map((partner, index) => {
            const partnerSub = partner.subtitle || partner.role || '';
            return (
              <div
                key={partner.id || index}
                className="bg-[#f4f6f8] rounded-2xl p-4 sm:p-5 border border-[#e2e6eb] shadow-bubble-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#006e21]/40 transition-all"
              >
                {/* Left: Reorder Controls + Logo */}
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Order Index & Steppers */}
                  <div className="flex flex-col items-center gap-0.5">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className={`p-1 rounded-md transition-colors ${
                        index === 0 ? 'text-[#00356a]/20 cursor-not-allowed' : 'text-[#00356a] hover:bg-white cursor-pointer'
                      }`}
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-[#00356a]/50">
                      {index + 1}
                    </span>
                    <button
                      disabled={index === epcPartners.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className={`p-1 rounded-md transition-colors ${
                        index === epcPartners.length - 1 ? 'text-[#00356a]/20 cursor-not-allowed' : 'text-[#00356a] hover:bg-white cursor-pointer'
                      }`}
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Logo Preview & Quick Actions */}
                  <div className="relative group shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#dce0e6] shadow-bubble-sm flex items-center justify-center overflow-hidden p-1">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/favicon.svg';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <Building2 className="w-5 h-5 text-[#00356a]/40" />
                          <span className="text-[8px] text-[#00356a]/40 font-bold uppercase">No Logo</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
                      <button
                        onClick={() => handleTriggerLogoUpload(partner.id)}
                        className="p-1 rounded-full bg-[#00356a] hover:bg-[#002850] text-white shadow cursor-pointer transition-transform hover:scale-110"
                        title="Upload New Logo"
                      >
                        <Upload className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Name & Subtitle Inline Inputs */}
                  <div className="space-y-1.5 flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={partner.name}
                        onChange={(e) => updateEpcPartner(partner.id, { name: e.target.value })}
                        className="text-xs sm:text-sm font-extrabold text-[#00356a] bg-transparent hover:bg-white focus:bg-white px-2 py-1 rounded-lg border border-transparent hover:border-[#dce0e6] focus:border-[#00356a] focus:outline-none transition-all w-full max-w-xs"
                        placeholder="Partner Name (e.g. Coteccons)"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={partnerSub}
                        onChange={(e) => updateEpcPartner(partner.id, { subtitle: e.target.value })}
                        className="text-[11px] font-medium text-[#00356a]/70 bg-transparent hover:bg-white focus:bg-white px-2 py-0.5 rounded-lg border border-transparent hover:border-[#dce0e6] focus:border-[#00356a] focus:outline-none transition-all w-full max-w-xs"
                        placeholder="Subtitle / Role (e.g. Tier-1 General Contractor)"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Logo URL & Management Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#e2e6eb]">
                  {/* Logo Actions */}
                  <button
                    onClick={() => handleTriggerLogoUpload(partner.id)}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] text-[11px] font-bold shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Upload image file directly from your computer"
                  >
                    <Upload className="w-3 h-3 text-[#006e21]" />
                    <span>Upload Logo</span>
                  </button>

                  <button
                    onClick={() => setPickerTargetPartnerId(partner.id)}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] text-[11px] font-bold shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Choose from existing media library"
                  >
                    <ImageIcon className="w-3 h-3 text-[#00356a]/70" />
                    <span>Media Library</span>
                  </button>

                  {partner.logoUrl && (
                    <button
                      onClick={() => updateEpcPartner(partner.id, { logoUrl: '' })}
                      className="px-2.5 py-1.5 rounded-full bg-white hover:bg-rose-50 text-[#00356a]/60 hover:text-rose-600 border border-[#dce0e6] text-[11px] font-bold shadow-bubble-sm cursor-pointer transition-all"
                      title="Remove Logo (Display Dot Node)"
                    >
                      Clear Logo
                    </button>
                  )}

                  <button
                    onClick={() => handleDeletePartner(partner.id, partner.name)}
                    className="p-2 rounded-full bg-white hover:bg-rose-50 text-[#00356a]/60 hover:text-rose-600 border border-[#dce0e6] shadow-bubble-sm cursor-pointer transition-all ml-1"
                    title="Delete Partner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: ADD NEW EPC PARTNER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#00356a]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#e2e6eb] relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#006e21] text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Create New Partner Badge</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#00356a]">
              Add Strategic EPC Partner
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-1 mb-6">
              Enter the partner's organization name, their structural role/subtitle, and attach their corporate logo.
            </p>

            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Partner Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  placeholder="e.g. Obayashi Corporation"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Role / Subtitle
                </label>
                <input
                  type="text"
                  value={newPartnerSubtitle}
                  onChange={(e) => setNewPartnerSubtitle(e.target.value)}
                  placeholder="e.g. General Contractor, Industrial Flooring Partner"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Logo Image (Direct Upload or URL)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#f4f6f8] border border-[#dce0e6] flex items-center justify-center overflow-hidden shrink-0">
                    {newPartnerLogoUrl ? (
                      <img src={newPartnerLogoUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Building2 className="w-5 h-5 text-[#00356a]/30" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={newPartnerLogoUrl}
                    onChange={(e) => setNewPartnerLogoUrl(e.target.value)}
                    placeholder="https://... or click Upload Logo"
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                  <button
                    type="button"
                    onClick={() => handleTriggerLogoUpload('new-partner')}
                    className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] text-xs font-bold shadow-bubble-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#006e21]" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={newPartnerWebsite}
                  onChange={(e) => setNewPartnerWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e2e6eb]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#f4f6f8] text-[#00356a] text-xs font-bold hover:bg-[#e2e6eb] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Main Page</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MEDIA LIBRARY PICKER FOR PARTNER LOGO */}
      {pickerTargetPartnerId && (
        <div className="fixed inset-0 z-50 bg-[#00356a]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#e2e6eb] relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setPickerTargetPartnerId(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#006e21] text-xs font-bold uppercase tracking-wider mb-2">
              <ImageIcon className="w-4 h-4" />
              <span>Media Library Picker</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#00356a]">
              Select Corporate Logo
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-1 mb-4">
              Choose an existing uploaded logo from your central media repository.
            </p>

            <div className="overflow-y-auto flex-1 pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-2">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectMediaLogo(item.url)}
                  className="group rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] p-2 hover:border-[#006e21] hover:bg-white cursor-pointer transition-all text-center flex flex-col items-center justify-between"
                >
                  <div className="w-full h-20 rounded-xl overflow-hidden bg-white border border-[#dce0e6] flex items-center justify-center p-1.5">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#00356a] truncate w-full mt-2 block">
                    {item.name}
                  </span>
                  <button
                    type="button"
                    className="mt-1.5 w-full py-1 rounded-lg bg-[#00356a] text-white text-[10px] font-bold group-hover:bg-[#006e21] transition-colors"
                  >
                    Select Logo
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-2 border-t border-[#e2e6eb] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const target = pickerTargetPartnerId;
                  setPickerTargetPartnerId(null);
                  handleTriggerLogoUpload(target);
                }}
                className="px-4 py-2 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#006e21]" />
                <span>Upload New Logo File Instead</span>
              </button>
              <button
                type="button"
                onClick={() => setPickerTargetPartnerId(null)}
                className="px-5 py-2 rounded-full bg-[#00356a] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
