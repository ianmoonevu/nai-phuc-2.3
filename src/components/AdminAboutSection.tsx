import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { LeadershipHead, AdvisoryMember, AboutInfo } from '../types';
import {
  Users,
  User,
  Building2,
  FileText,
  Upload,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  CheckCircle2,
  Check,
  X,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Factory,
  ShieldCheck,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface AdminAboutSectionProps {
  onShowToast: (msg: string) => void;
}

export const AdminAboutSection: React.FC<AdminAboutSectionProps> = ({ onShowToast }) => {
  const {
    aboutInfo,
    updateAboutInfo,
    resetAboutInfo,
    leadershipHeads,
    updateLeadershipHead,
    addLeadershipHead,
    deleteLeadershipHead,
    resetLeadershipHeads,
    advisoryMembers,
    updateAdvisoryMember,
    addAdvisoryMember,
    deleteAdvisoryMember,
    resetAdvisoryMembers,
    uploadImageFile,
    mediaItems,
    branding,
    updateBranding
  } = useData();

  // Active Sub-Tab: 'story' | 'leadership' | 'advisory' | 'factory'
  const [activeSubTab, setActiveSubTab] = useState<'story' | 'leadership' | 'advisory' | 'factory'>('story');

  // Form State for Story & Brand Info
  const [storyForm, setStoryForm] = useState<AboutInfo>({
    heroBadge: aboutInfo.heroBadge || 'ORIGIN & COMPANY PROFILE',
    heroTitle: aboutInfo.heroTitle || 'Engineered Steel Fibers for Concrete Reinforcement',
    heroSubtitle:
      aboutInfo.heroSubtitle ||
      'Founded with a clear vision: to empower civil engineers, precasters, and industrial flooring specialists with reliable, high-tenacity reinforcement.',
    brandStoryP1:
      aboutInfo.brandStoryP1 ||
      'HOKI was established with a singular mission: to eliminate traditional welded wire mesh and rebar congestion through precision-drawn hooked-end steel fibers. Designed for extreme durability, crack limitation, and maximum structural toughness, HOKI steel fibers transform brittle concrete into a resilient, ductile composite.',
    brandStoryP2:
      aboutInfo.brandStoryP2 ||
      'Manufactured from premium low-carbon cold-drawn wire, our fibers meet rigorous international standards including EN 14889-1 System 1 CE Marking, ASTM A820 Type I, and ISO 9001:2015. Every production batch undergoes automated tensile testing, optical aspect ratio verification, and hooked-end geometric anchorage validation at our Alpha Hub research complex.',
    brandStoryP3:
      aboutInfo.brandStoryP3 ||
      'With over 1,000,000 m² of successful industrial floor slabs, precast tunnel segments, and logistics hardstands engineered across Southeast Asia, HOKI continues to lead the transition toward low-carbon, jointless, and fast-track concrete construction.',
    missionQuoteTitle: aboutInfo.missionQuoteTitle || 'Mission for Sustainable Concrete Flooring',
    missionQuote:
      aboutInfo.missionQuote ||
      '"Sustainability isn\'t a trend, it\'s how we build a better tomorrow."',
    heroBannerBadge: aboutInfo.heroBannerBadge || 'HOKI STEEL FIBER • ALPHA PRODUCTION SPECIFICATION',
    heroBannerCaption:
      aboutInfo.heroBannerCaption ||
      'Engineered for maximum structural integrity, zero mesh placement labor, and up to 40% pour acceleration.',
    factoryBadge: aboutInfo.factoryBadge || 'MANUFACTURING EXCELLENCE',
    factoryTitle: aboutInfo.factoryTitle || 'Manufacturing Capability',
    factorySubtitle:
      aboutInfo.factorySubtitle ||
      'State-of-the-art robotic cold-drawing and collating technology at the Alpha Hub facility.',
    factoryCaption:
      aboutInfo.factoryCaption ||
      'Real-time optical dimensional verification and continuous cold-drawing monitoring at Alpha Hub.',
    leadershipTitle: aboutInfo.leadershipTitle || 'Leadership & Department Heads',
    leadershipSubtitle:
      aboutInfo.leadershipSubtitle ||
      'Guided by veteran structural engineers, metallurgical innovators, and global supply chain directors.',
    advisoryTitle: aboutInfo.advisoryTitle || 'Global Structural Advisory Board',
    advisorySubtitle: aboutInfo.advisorySubtitle || 'Scientific Governance'
  });

  // Modal State for Leadership
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [leaderName, setLeaderName] = useState('');
  const [leaderTitle, setLeaderTitle] = useState('');
  const [leaderDepartment, setLeaderDepartment] = useState('');
  const [leaderCredentials, setLeaderCredentials] = useState('');
  const [leaderFocus, setLeaderFocus] = useState('');
  const [leaderAvatar, setLeaderAvatar] = useState('');

  // Modal State for Advisory
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [editingAdvisorId, setEditingAdvisorId] = useState<string | null>(null);
  const [advisorName, setAdvisorName] = useState('');
  const [advisorRole, setAdvisorRole] = useState('');
  const [advisorSpecialization, setAdvisorSpecialization] = useState('');
  const [advisorBio, setAdvisorBio] = useState('');
  const [advisorAvatar, setAdvisorAvatar] = useState('');
  const [advisorActionText, setAdvisorActionText] = useState('Consult Advisory Fellow');

  // Avatar Upload Target
  const [avatarUploadTarget, setAvatarUploadTarget] = useState<{
    type: 'leader' | 'advisor' | 'leader-modal' | 'advisor-modal';
    id?: string;
  } | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  // Media Library Picker for Avatars
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    type: 'leader' | 'advisor' | 'leader-modal' | 'advisor-modal';
    id?: string;
  } | null>(null);

  // Save Story & Factory Content
  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutInfo(storyForm);
    onShowToast('About Us story, mission quotes & factory content updated successfully!');
  };

  // Trigger file upload for avatar
  const handleTriggerAvatarUpload = (
    type: 'leader' | 'advisor' | 'leader-modal' | 'advisor-modal',
    id?: string
  ) => {
    setAvatarUploadTarget({ type, id });
    avatarFileInputRef.current?.click();
  };

  // Avatar file upload handler
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !avatarUploadTarget) return;

    setIsUploadingAvatar(true);
    try {
      const item = await uploadImageFile(file, 'general');
      const { type, id } = avatarUploadTarget;

      if (type === 'leader' && id) {
        updateLeadershipHead(id, { avatar: item.url });
      } else if (type === 'advisor' && id) {
        updateAdvisoryMember(id, { avatar: item.url });
      } else if (type === 'leader-modal') {
        setLeaderAvatar(item.url);
      } else if (type === 'advisor-modal') {
        setAdvisorAvatar(item.url);
      }

      onShowToast(`Photo "${item.name}" assigned successfully`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to upload team photo');
    } finally {
      setIsUploadingAvatar(false);
      setAvatarUploadTarget(null);
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = '';
    }
  };

  // Media library pick handler for avatars
  const handleSelectMediaForAvatar = (url: string) => {
    if (!mediaPickerTarget) return;
    const { type, id } = mediaPickerTarget;

    if (type === 'leader' && id) {
      updateLeadershipHead(id, { avatar: url });
    } else if (type === 'advisor' && id) {
      updateAdvisoryMember(id, { avatar: url });
    } else if (type === 'leader-modal') {
      setLeaderAvatar(url);
    } else if (type === 'advisor-modal') {
      setAdvisorAvatar(url);
    }

    setMediaPickerTarget(null);
    onShowToast('Photo assigned from media library');
  };

  // Open Leader Create/Edit
  const handleOpenLeaderModal = (leader?: LeadershipHead) => {
    if (leader) {
      setEditingLeaderId(leader.id);
      setLeaderName(leader.name);
      setLeaderTitle(leader.title);
      setLeaderDepartment(leader.department || 'Operations');
      setLeaderCredentials(leader.credentials || '');
      setLeaderFocus(leader.focus || leader.bio || '');
      setLeaderAvatar(leader.avatar || '');
    } else {
      setEditingLeaderId(null);
      setLeaderName('');
      setLeaderTitle('');
      setLeaderDepartment('Engineering & Operations');
      setLeaderCredentials('M.Sc. Structural Engineering');
      setLeaderFocus('');
      setLeaderAvatar('');
    }
    setIsLeaderModalOpen(true);
  };

  // Save Leader
  const handleSaveLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderName.trim()) {
      alert('Please enter leadership name');
      return;
    }

    if (editingLeaderId) {
      updateLeadershipHead(editingLeaderId, {
        name: leaderName.trim(),
        title: leaderTitle.trim(),
        department: leaderDepartment.trim(),
        credentials: leaderCredentials.trim(),
        focus: leaderFocus.trim(),
        bio: leaderFocus.trim(),
        avatar: leaderAvatar.trim() || undefined
      });
      onShowToast(`Leader "${leaderName}" updated`);
    } else {
      addLeadershipHead({
        name: leaderName.trim(),
        title: leaderTitle.trim(),
        department: leaderDepartment.trim(),
        credentials: leaderCredentials.trim(),
        focus: leaderFocus.trim(),
        bio: leaderFocus.trim(),
        avatar: leaderAvatar.trim() || undefined
      });
      onShowToast(`New leader "${leaderName}" added`);
    }
    setIsLeaderModalOpen(false);
  };

  // Open Advisor Create/Edit
  const handleOpenAdvisorModal = (advisor?: AdvisoryMember) => {
    if (advisor) {
      setEditingAdvisorId(advisor.id);
      setAdvisorName(advisor.name);
      setAdvisorRole(advisor.role || (advisor as any).title || '');
      setAdvisorSpecialization(advisor.specialization || '');
      setAdvisorBio(advisor.bio || '');
      setAdvisorAvatar(advisor.avatar || '');
      setAdvisorActionText(advisor.actionText || 'Consult Advisory Fellow');
    } else {
      setEditingAdvisorId(null);
      setAdvisorName('');
      setAdvisorRole('Honorary Fellow');
      setAdvisorSpecialization('Advanced Fiber Metallurgy');
      setAdvisorBio('');
      setAdvisorAvatar('');
      setAdvisorActionText('Consult Advisory Fellow');
    }
    setIsAdvisorModalOpen(true);
  };

  // Save Advisor
  const handleSaveAdvisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorName.trim()) {
      alert('Please enter advisor name');
      return;
    }

    if (editingAdvisorId) {
      updateAdvisoryMember(editingAdvisorId, {
        name: advisorName.trim(),
        role: advisorRole.trim(),
        specialization: advisorSpecialization.trim(),
        bio: advisorBio.trim(),
        avatar: advisorAvatar.trim() || undefined,
        actionText: advisorActionText.trim()
      });
      onShowToast(`Advisor "${advisorName}" updated`);
    } else {
      addAdvisoryMember({
        name: advisorName.trim(),
        role: advisorRole.trim(),
        specialization: advisorSpecialization.trim(),
        bio: advisorBio.trim(),
        avatar: advisorAvatar.trim() || undefined,
        actionText: advisorActionText.trim()
      });
      onShowToast(`New advisor "${advisorName}" added`);
    }
    setIsAdvisorModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Hidden File Input for Avatar Uploads */}
      <input
        type="file"
        ref={avatarFileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
      />

      {/* 1. Header Banner & Sub-Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006e21]/10 text-[#006e21] text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>About Us Content &amp; Personnel Manager</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#00356a]">
              About Us Page Administration
            </h2>
            <p className="text-xs sm:text-sm text-[#00356a]/70 mt-1 max-w-2xl">
              Modify all text, titles, stories, leadership executives, advisory fellows, and manufacturing capabilities displayed on the public <span className="font-semibold text-[#00356a]">/about-us</span> route.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all About Us story and leadership back to default data?')) {
                  resetAboutInfo();
                  resetLeadershipHeads();
                  resetAdvisoryMembers();
                  onShowToast('About Us content reset to defaults');
                }
              }}
              className="px-4 py-2.5 rounded-full bg-[#f4f6f8] hover:bg-rose-50 hover:text-rose-700 text-[#00356a] border border-[#e2e6eb] text-xs font-bold shadow-bubble-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All About Us</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-[#e2e6eb]">
          <button
            onClick={() => setActiveSubTab('story')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'story'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'bg-[#f4f6f8] text-[#00356a]/70 hover:text-[#00356a]'
            }`}
          >
            Brand Story &amp; Mission
          </button>
          <button
            onClick={() => setActiveSubTab('leadership')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'leadership'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'bg-[#f4f6f8] text-[#00356a]/70 hover:text-[#00356a]'
            }`}
          >
            Leadership Team ({leadershipHeads.length})
          </button>
          <button
            onClick={() => setActiveSubTab('advisory')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'advisory'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'bg-[#f4f6f8] text-[#00356a]/70 hover:text-[#00356a]'
            }`}
          >
            Advisory Board ({advisoryMembers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('factory')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'factory'
                ? 'bg-[#00356a] text-white shadow-bubble-sm'
                : 'bg-[#f4f6f8] text-[#00356a]/70 hover:text-[#00356a]'
            }`}
          >
            Manufacturing &amp; Alpha Hub Info
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: BRAND STORY & MISSION */}
      {activeSubTab === 'story' && (
        <form onSubmit={handleSaveStory} className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#00356a] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#006e21]" />
              Story, Title &amp; Mission Quotes
            </h3>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Hero Badge / Category Tag
              </label>
              <input
                type="text"
                value={storyForm.heroBadge}
                onChange={(e) => setStoryForm({ ...storyForm, heroBadge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Main Page Heading (H1)
              </label>
              <input
                type="text"
                value={storyForm.heroTitle}
                onChange={(e) => setStoryForm({ ...storyForm, heroTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
              Page Subtitle / Tagline
            </label>
            <textarea
              rows={2}
              value={storyForm.heroSubtitle}
              onChange={(e) => setStoryForm({ ...storyForm, heroSubtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-[#e2e6eb]">
            <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider">
              Company Narrative (3 Structural Paragraphs)
            </h4>

            <div>
              <label className="block text-[10px] font-bold text-[#00356a]/70 uppercase mb-1">
                Paragraph 1 (Inception &amp; Reinforcement Mission)
              </label>
              <textarea
                rows={3}
                value={storyForm.brandStoryP1}
                onChange={(e) => setStoryForm({ ...storyForm, brandStoryP1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#00356a]/70 uppercase mb-1">
                Paragraph 2 (Metallurgical Quality &amp; Standards Verification)
              </label>
              <textarea
                rows={3}
                value={storyForm.brandStoryP2}
                onChange={(e) => setStoryForm({ ...storyForm, brandStoryP2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#00356a]/70 uppercase mb-1">
                Paragraph 3 (Global Scale &amp; Net-Zero Transition)
              </label>
              <textarea
                rows={3}
                value={storyForm.brandStoryP3}
                onChange={(e) => setStoryForm({ ...storyForm, brandStoryP3: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[#e2e6eb]">
            <div>
              <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Mission Quote Heading
              </label>
              <input
                type="text"
                value={storyForm.missionQuoteTitle}
                onChange={(e) => setStoryForm({ ...storyForm, missionQuoteTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Mission Quote Body
              </label>
              <input
                type="text"
                value={storyForm.missionQuote}
                onChange={(e) => setStoryForm({ ...storyForm, missionQuote: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save All Brand Story Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: LEADERSHIP TEAM */}
      {activeSubTab === 'leadership' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#00356a]">
                Leadership &amp; Department Heads
              </h3>
              <p className="text-xs text-[#00356a]/70">
                Manage names, executive titles, credentials, bios, and headshots for the management team.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  if (window.confirm('Reset leadership list to initial team?')) {
                    resetLeadershipHeads();
                    onShowToast('Leadership team reset to defaults');
                  }
                }}
                className="px-3.5 py-2 rounded-full bg-[#f4f6f8] hover:bg-rose-50 text-[#00356a] hover:text-rose-700 text-xs font-bold border border-[#e2e6eb] shadow-bubble-sm flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => handleOpenLeaderModal()}
                className="px-5 py-2 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Leader</span>
              </button>
            </div>
          </div>

          {/* Section Heading Inputs */}
          <div className="p-4 bg-[#f4f6f8] rounded-2xl border border-[#e2e6eb] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={storyForm.leadershipTitle}
                onChange={(e) => {
                  setStoryForm({ ...storyForm, leadershipTitle: e.target.value });
                  updateAboutInfo({ leadershipTitle: e.target.value });
                }}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={storyForm.leadershipSubtitle}
                onChange={(e) => {
                  setStoryForm({ ...storyForm, leadershipSubtitle: e.target.value });
                  updateAboutInfo({ leadershipSubtitle: e.target.value });
                }}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>
          </div>

          {/* Leaders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {leadershipHeads.map((head, idx) => {
              const avatar = head.avatar || branding?.aboutLeadershipAvatars?.[head.name] || '/images/team/placeholder.svg';
              return (
                <div
                  key={head.id || idx}
                  className="bg-[#f4f6f8] rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between hover:border-[#006e21]/40 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="relative group shrink-0">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-[#dce0e6] shadow-bubble-sm">
                          <img
                            src={avatar}
                            alt={head.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/team/placeholder.svg';
                            }}
                          />
                        </div>
                        <button
                          onClick={() => handleTriggerAvatarUpload('leader', head.id)}
                          className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#00356a] hover:bg-[#002850] text-white shadow cursor-pointer"
                          title="Change Photo"
                        >
                          <Upload className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider block truncate">
                          {head.department}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#00356a] truncate">
                          {head.name}
                        </h4>
                        <span className="text-xs text-[#00356a]/70 font-medium block truncate">
                          {head.title}
                        </span>
                      </div>
                    </div>

                    {head.credentials && (
                      <div className="p-2 rounded-lg bg-white border border-[#e2e6eb] mb-2 text-[11px] text-[#00356a]/80">
                        <span className="font-bold block text-[10px] text-[#00356a]">Credentials:</span>
                        {head.credentials}
                      </div>
                    )}

                    <p className="text-xs text-[#00356a]/75 line-clamp-3 leading-relaxed">
                      {head.focus || head.bio}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#e2e6eb] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTriggerAvatarUpload('leader', head.id)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-2.5 h-2.5 text-[#006e21]" />
                        <span>Upload Photo</span>
                      </button>
                      <button
                        onClick={() => setMediaPickerTarget({ type: 'leader', id: head.id })}
                        className="p-1 rounded-full bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] cursor-pointer"
                        title="Pick from Media Library"
                      >
                        <ImageIcon className="w-3 h-3 text-[#00356a]/70" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenLeaderModal(head)}
                        className="p-1.5 rounded-full bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] cursor-pointer"
                        title="Edit Leader Information"
                      >
                        <Edit3 className="w-3 h-3 text-[#00356a]" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete leader "${head.name}"?`)) {
                            deleteLeadershipHead(head.id);
                            onShowToast(`Deleted "${head.name}"`);
                          }
                        }}
                        className="p-1.5 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-[#dce0e6] cursor-pointer"
                        title="Delete Leader"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ADVISORY BOARD */}
      {activeSubTab === 'advisory' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#00356a]">
                Global Structural Advisory Board
              </h3>
              <p className="text-xs text-[#00356a]/70">
                Manage names, scientific credentials, specialization fields, and portraits of the technical advisory council.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  if (window.confirm('Reset advisory board back to default members?')) {
                    resetAdvisoryMembers();
                    onShowToast('Advisory board reset to defaults');
                  }
                }}
                className="px-3.5 py-2 rounded-full bg-[#f4f6f8] hover:bg-rose-50 text-[#00356a] hover:text-rose-700 text-xs font-bold border border-[#e2e6eb] shadow-bubble-sm flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => handleOpenAdvisorModal()}
                className="px-5 py-2 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Advisor</span>
              </button>
            </div>
          </div>

          {/* Section Heading Inputs */}
          <div className="p-4 bg-[#f4f6f8] rounded-2xl border border-[#e2e6eb] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={storyForm.advisoryTitle}
                onChange={(e) => {
                  setStoryForm({ ...storyForm, advisoryTitle: e.target.value });
                  updateAboutInfo({ advisoryTitle: e.target.value });
                }}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Section Subtitle / Tag
              </label>
              <input
                type="text"
                value={storyForm.advisorySubtitle}
                onChange={(e) => {
                  setStoryForm({ ...storyForm, advisorySubtitle: e.target.value });
                  updateAboutInfo({ advisorySubtitle: e.target.value });
                }}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>
          </div>

          {/* Advisory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {advisoryMembers.map((advisor, idx) => {
              const avatar = advisor.avatar || branding?.aboutAdvisoryAvatars?.[advisor.name] || '/images/team/placeholder.svg';
              return (
                <div
                  key={advisor.id || idx}
                  className="bg-[#f4f6f8] rounded-2xl p-5 border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between hover:border-[#006e21]/40 transition-all text-center"
                >
                  <div>
                    <div className="relative group inline-block mb-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-[#006e21]/40 shadow-bubble-sm mx-auto">
                        <img
                          src={avatar}
                          alt={advisor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/team/placeholder.svg';
                          }}
                        />
                      </div>
                      <button
                        onClick={() => handleTriggerAvatarUpload('advisor', advisor.id)}
                        className="absolute bottom-0 right-0 p-1 rounded-full bg-[#00356a] hover:bg-[#002850] text-white shadow cursor-pointer"
                        title="Change Portrait"
                      >
                        <Upload className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#00356a]">
                      {advisor.name}
                    </h4>
                    <span className="text-xs text-[#006e21] font-semibold block mt-0.5">
                      {advisor.role || (advisor as any).title}
                    </span>
                    {advisor.specialization && (
                      <span className="text-[10px] text-[#00356a]/60 block mb-2">
                        {advisor.specialization}
                      </span>
                    )}

                    <p className="text-xs text-[#00356a]/75 line-clamp-3 leading-relaxed mt-2 text-left">
                      {advisor.bio}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#e2e6eb] flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTriggerAvatarUpload('advisor', advisor.id)}
                        className="px-2 py-1 rounded-full bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-2.5 h-2.5 text-[#006e21]" />
                        <span>Upload</span>
                      </button>
                      <button
                        onClick={() => setMediaPickerTarget({ type: 'advisor', id: advisor.id })}
                        className="p-1 rounded-full bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] cursor-pointer"
                        title="Pick from Media Library"
                      >
                        <ImageIcon className="w-3 h-3 text-[#00356a]/70" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenAdvisorModal(advisor)}
                        className="p-1.5 rounded-full bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] cursor-pointer"
                        title="Edit Advisor Details"
                      >
                        <Edit3 className="w-3 h-3 text-[#00356a]" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete advisor "${advisor.name}"?`)) {
                            deleteAdvisoryMember(advisor.id);
                            onShowToast(`Deleted "${advisor.name}"`);
                          }
                        }}
                        className="p-1.5 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-[#dce0e6] cursor-pointer"
                        title="Delete Advisor"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MANUFACTURING & ALPHA HUB INFO */}
      {activeSubTab === 'factory' && (
        <form onSubmit={handleSaveStory} className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#00356a] flex items-center gap-2">
              <Factory className="w-4 h-4 text-[#006e21]" />
              Manufacturing &amp; Alpha Hub Facility Info
            </h3>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Facility Section Badge
              </label>
              <input
                type="text"
                value={storyForm.factoryBadge}
                onChange={(e) => setStoryForm({ ...storyForm, factoryBadge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
                Facility Title
              </label>
              <input
                type="text"
                value={storyForm.factoryTitle}
                onChange={(e) => setStoryForm({ ...storyForm, factoryTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
              Facility Subtitle
            </label>
            <input
              type="text"
              value={storyForm.factorySubtitle}
              onChange={(e) => setStoryForm({ ...storyForm, factorySubtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#00356a] uppercase tracking-wider mb-1">
              Factory Photo Caption
            </label>
            <textarea
              rows={2}
              value={storyForm.factoryCaption}
              onChange={(e) => setStoryForm({ ...storyForm, factoryCaption: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Factory Info</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL 1: ADD / EDIT LEADER */}
      {isLeaderModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#00356a]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#e2e6eb] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsLeaderModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#006e21] text-xs font-bold uppercase tracking-wider mb-2">
              <User className="w-4 h-4" />
              <span>{editingLeaderId ? 'Edit Leader' : 'New Leader'}</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#00356a]">
              {editingLeaderId ? 'Update Department Head' : 'Add Department Head'}
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-1 mb-6">
              Enter name, role/title, credentials, and upload a portrait photograph.
            </p>

            <form onSubmit={handleSaveLeader} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder="e.g. Dr. Alan Turing"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Official Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderTitle}
                    onChange={(e) => setLeaderTitle(e.target.value)}
                    placeholder="e.g. Global Managing Director"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={leaderDepartment}
                    onChange={(e) => setLeaderDepartment(e.target.value)}
                    placeholder="e.g. Structural R&D Directorate"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Academic / Professional Credentials
                </label>
                <input
                  type="text"
                  value={leaderCredentials}
                  onChange={(e) => setLeaderCredentials(e.target.value)}
                  placeholder="e.g. Ph.D. Civil Eng (MIT), PE, F.ACI"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Focus / Bio Description
                </label>
                <textarea
                  rows={3}
                  value={leaderFocus}
                  onChange={(e) => setLeaderFocus(e.target.value)}
                  placeholder="Summarize their engineering background, track record, and operational scope..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Portrait Photo URL
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#f4f6f8] border border-[#dce0e6] overflow-hidden shrink-0 flex items-center justify-center">
                    {leaderAvatar ? (
                      <img src={leaderAvatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#00356a]/30" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={leaderAvatar}
                    onChange={(e) => setLeaderAvatar(e.target.value)}
                    placeholder="https://... or click Upload Photo"
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                  <button
                    type="button"
                    onClick={() => handleTriggerAvatarUpload('leader-modal')}
                    className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] text-xs font-bold shadow-bubble-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#006e21]" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e2e6eb]">
                <button
                  type="button"
                  onClick={() => setIsLeaderModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#f4f6f8] text-[#00356a] text-xs font-bold hover:bg-[#e2e6eb] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingLeaderId ? 'Update Leader' : 'Add Leader'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT ADVISOR */}
      {isAdvisorModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#00356a]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#e2e6eb] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAdvisorModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#006e21] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{editingAdvisorId ? 'Edit Advisor' : 'New Advisory Fellow'}</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#00356a]">
              {editingAdvisorId ? 'Update Advisory Fellow' : 'Add Advisory Fellow'}
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-1 mb-6">
              Enter name, governance role, specialization field, and portrait.
            </p>

            <form onSubmit={handleSaveAdvisor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={advisorName}
                  onChange={(e) => setAdvisorName(e.target.value)}
                  placeholder="e.g. Prof. Kenji Sato"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Advisory Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={advisorRole}
                    onChange={(e) => setAdvisorRole(e.target.value)}
                    placeholder="e.g. Fellow & Chair of Standards"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={advisorSpecialization}
                    onChange={(e) => setAdvisorSpecialization(e.target.value)}
                    placeholder="e.g. Fiber Anchorage Mechanics"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Bio / Scientific Summary
                </label>
                <textarea
                  rows={3}
                  value={advisorBio}
                  onChange={(e) => setAdvisorBio(e.target.value)}
                  placeholder="Lead scientific advisor on cyclic crack bridging models..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Action Link Text
                </label>
                <input
                  type="text"
                  value={advisorActionText}
                  onChange={(e) => setAdvisorActionText(e.target.value)}
                  placeholder="Consult Advisory Fellow"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1.5">
                  Portrait Photo URL
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#f4f6f8] border border-[#dce0e6] overflow-hidden shrink-0 flex items-center justify-center">
                    {advisorAvatar ? (
                      <img src={advisorAvatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#00356a]/30" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={advisorAvatar}
                    onChange={(e) => setAdvisorAvatar(e.target.value)}
                    placeholder="https://... or click Upload Photo"
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-[#f4f6f8] text-[#00356a] border border-[#dce0e6] shadow-bubble-inset focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                  <button
                    type="button"
                    onClick={() => handleTriggerAvatarUpload('advisor-modal')}
                    className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#e2e6eb] text-[#00356a] border border-[#dce0e6] text-xs font-bold shadow-bubble-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#006e21]" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e2e6eb]">
                <button
                  type="button"
                  onClick={() => setIsAdvisorModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#f4f6f8] text-[#00356a] text-xs font-bold hover:bg-[#e2e6eb] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold shadow-bubble flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingAdvisorId ? 'Update Advisor' : 'Add Advisor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MEDIA LIBRARY PICKER FOR AVATARS */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-50 bg-[#00356a]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#e2e6eb] relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setMediaPickerTarget(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#006e21] text-xs font-bold uppercase tracking-wider mb-2">
              <ImageIcon className="w-4 h-4" />
              <span>Media Library Picker</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#00356a]">
              Select Portrait Photograph
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-1 mb-4">
              Choose an existing image from your central media repository.
            </p>

            <div className="overflow-y-auto flex-1 pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-2">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectMediaForAvatar(item.url)}
                  className="group rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] p-2 hover:border-[#006e21] hover:bg-white cursor-pointer transition-all text-center flex flex-col items-center justify-between"
                >
                  <div className="w-full h-20 rounded-xl overflow-hidden bg-white border border-[#dce0e6] flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#00356a] truncate w-full mt-2 block">
                    {item.name}
                  </span>
                  <button
                    type="button"
                    className="mt-1.5 w-full py-1 rounded-lg bg-[#00356a] text-white text-[10px] font-bold group-hover:bg-[#006e21] transition-colors"
                  >
                    Select Photo
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-2 border-t border-[#e2e6eb] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const target = mediaPickerTarget;
                  setMediaPickerTarget(null);
                  handleTriggerAvatarUpload(target.type, target.id);
                }}
                className="px-4 py-2 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#006e21]" />
                <span>Upload New File Instead</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
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
