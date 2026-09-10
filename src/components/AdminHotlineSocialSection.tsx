import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ZaloIcon, TikTokIcon } from './FloatingCallButton';
import {
  Phone,
  PhoneCall,
  Share2,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Save,
  MessageCircle,
  Globe,
  Facebook,
  Youtube,
  Linkedin,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';

interface AdminHotlineSocialSectionProps {
  onShowToast: (msg: string) => void;
}

export const AdminHotlineSocialSection: React.FC<AdminHotlineSocialSectionProps> = ({ onShowToast }) => {
  const { branding, updateBranding } = useData();

  // Local state for Hotline
  const [hotlinePhone, setHotlinePhone] = useState(branding.hotlinePhone || '0916 576 156');
  const [hotlineLabel, setHotlineLabel] = useState(branding.hotlineLabel || 'CALL NOW');
  const [hotlineSubtitle, setHotlineSubtitle] = useState(branding.hotlineSubtitle || 'Direct Engineering Support');
  const [hotlineEnabled, setHotlineEnabled] = useState(branding.hotlineEnabled !== false);

  // Local state for Social Media Links
  const currentSocial = branding.socialLinks || {};
  const [facebookUrl, setFacebookUrl] = useState(currentSocial.facebook?.url || 'https://www.facebook.com');
  const [facebookEnabled, setFacebookEnabled] = useState(currentSocial.facebook?.enabled !== false);

  const [zaloUrl, setZaloUrl] = useState(currentSocial.zalo?.url || 'https://zalo.me/0916576156');
  const [zaloEnabled, setZaloEnabled] = useState(currentSocial.zalo?.enabled !== false);

  const [linkedinUrl, setLinkedinUrl] = useState(currentSocial.linkedin?.url || 'https://www.linkedin.com');
  const [linkedinEnabled, setLinkedinEnabled] = useState(currentSocial.linkedin?.enabled !== false);

  const [youtubeUrl, setYoutubeUrl] = useState(currentSocial.youtube?.url || 'https://www.youtube.com/@hokimetal');
  const [youtubeEnabled, setYoutubeEnabled] = useState(currentSocial.youtube?.enabled !== false);

  const [tiktokUrl, setTiktokUrl] = useState(currentSocial.tiktok?.url || 'https://www.tiktok.com/@hokimetal');
  const [tiktokEnabled, setTiktokEnabled] = useState(currentSocial.tiktok?.enabled !== false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const cleanPhone = hotlinePhone.replace(/[^0-9+]/g, '');

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    updateBranding({
      hotlinePhone: hotlinePhone.trim() || '0916 576 156',
      hotlineLabel: hotlineLabel.trim() || 'CALL NOW',
      hotlineSubtitle: hotlineSubtitle.trim() || 'Direct Engineering Support',
      hotlineEnabled: hotlineEnabled,
      socialLinks: {
        facebook: { url: facebookUrl.trim(), enabled: facebookEnabled },
        zalo: { url: zaloUrl.trim(), enabled: zaloEnabled },
        linkedin: { url: linkedinUrl.trim(), enabled: linkedinEnabled },
        youtube: { url: youtubeUrl.trim(), enabled: youtubeEnabled },
        tiktok: { url: tiktokUrl.trim(), enabled: tiktokEnabled }
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onShowToast('Hotline & Social Media channels updated successfully!');
  };

  const handleResetDefaults = () => {
    setHotlinePhone('0916 576 156');
    setHotlineLabel('CALL NOW');
    setHotlineSubtitle('Direct Engineering Support');
    setHotlineEnabled(true);

    setFacebookUrl('https://www.facebook.com');
    setFacebookEnabled(true);

    setZaloUrl('https://zalo.me/0916576156');
    setZaloEnabled(true);

    setLinkedinUrl('https://www.linkedin.com');
    setLinkedinEnabled(true);

    setYoutubeUrl('https://www.youtube.com/@hokimetal');
    setYoutubeEnabled(true);

    setTiktokUrl('https://www.tiktok.com/@hokimetal');
    setTiktokEnabled(true);

    updateBranding({
      hotlinePhone: '0916 576 156',
      hotlineLabel: 'CALL NOW',
      hotlineSubtitle: 'Direct Engineering Support',
      hotlineEnabled: true,
      socialLinks: {
        facebook: { url: 'https://www.facebook.com', enabled: true },
        zalo: { url: 'https://zalo.me/0916576156', enabled: true },
        linkedin: { url: 'https://www.linkedin.com', enabled: true },
        youtube: { url: 'https://www.youtube.com/@hokimetal', enabled: true },
        tiktok: { url: 'https://www.tiktok.com/@hokimetal', enabled: true }
      }
    });

    onShowToast('Hotline & Social Channels reset to official defaults');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" /> Instant Contact & Social Matrix
            </span>
            <span className="text-xs font-semibold text-[#00356a]/60">Sitewide Live Sync</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#00356a] mt-2">
            Hotline &amp; Social Media Channels
          </h2>
          <p className="text-xs sm:text-sm text-[#00356a]/70 mt-1 max-w-2xl leading-relaxed">
            Configure the prominent floating <strong>Call Now</strong> corner button, phone number, and toggle individual social media channels (Facebook, Zalo, LinkedIn, YouTube, TikTok) across the entire platform.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-3 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-xs font-bold shadow-bubble-sm flex items-center gap-2 cursor-pointer transition-all"
            title="Reset to default HOKI numbers and links"
          >
            <RotateCcw className="w-4 h-4 text-[#00356a]/60" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="flex-1 md:flex-none px-6 py-3 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold uppercase tracking-wider shadow-bubble flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved &amp; Published!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Hotline Management & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Hotline Phone Settings (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] space-y-6">
          <div className="flex items-center justify-between border-b border-[#e2e6eb] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#006e21]/10 text-[#006e21] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#00356a]">
                  Floating Hotline &amp; Call Now Button
                </h3>
                <p className="text-[11px] text-[#00356a]/60">
                  Controls the oversized corner button with acoustic pulse animation.
                </p>
              </div>
            </div>

            {/* Enable / Disable Master Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-bold text-[#00356a]">
                {hotlineEnabled ? 'Visible On Site' : 'Disabled'}
              </span>
              <div
                onClick={() => setHotlineEnabled(!hotlineEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  hotlineEnabled ? 'bg-[#006e21]' : 'bg-[#dce0e6]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                    hotlineEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="space-y-4">
            {/* Phone Number Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#00356a] mb-1.5 flex items-center justify-between">
                <span>Direct Hotline Phone Number *</span>
                <span className="text-[10px] text-[#006e21] font-semibold">One-Click Click-to-Call</span>
              </label>
              <div className="relative">
                <input
                  id="admin-hotline-phone-input"
                  type="text"
                  required
                  placeholder="e.g. 0916 576 156"
                  value={hotlinePhone}
                  onChange={(e) => setHotlinePhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl text-sm font-mono font-bold text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#006e21]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <a
                    href={`tel:${cleanPhone}`}
                    title="Test Dial Action"
                    className="px-2.5 py-1 rounded-full bg-[#006e21]/10 hover:bg-[#006e21] text-[#006e21] hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Test Dial</span>
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-[#00356a]/60 mt-1">
                Formats cleanly on mobile devices as <code className="text-[#006e21] font-bold">tel:{cleanPhone}</code>.
              </p>
            </div>

            {/* Button Label & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#00356a] mb-1.5">
                  Button Header Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. CALL NOW"
                  value={hotlineLabel}
                  onChange={(e) => setHotlineLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#006e21]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#00356a] mb-1.5">
                  Subtitle / Availability
                </label>
                <input
                  type="text"
                  placeholder="e.g. Direct Engineering Desk"
                  value={hotlineSubtitle}
                  onChange={(e) => setHotlineSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#006e21]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Widget Preview (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#f8fafc] to-[#eef2f6] rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#dce0e6] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#006e21]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00356a]">
                Live Corner Widget Preview
              </span>
            </div>
            <p className="text-xs text-[#00356a]/70 mb-6 leading-relaxed">
              This is the interactive representation rendered persistently at the corner of every visitor's screen.
            </p>

            {/* Widget Simulation Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#e2e6eb] shadow-bubble-sm flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
              <div className="absolute top-2 left-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#00356a]/40 font-mono">
                  Fixed Bottom Corner
                </span>
              </div>

              {hotlineEnabled ? (
                <div className="relative flex items-center gap-3 pl-3 pr-5 py-3 rounded-full bg-gradient-to-r from-[#006e21] via-[#007a25] to-[#005a1b] text-white shadow-[0_10px_28px_rgba(0,110,33,0.4)] border-2 border-white/90">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#006e21] shadow-md shrink-0">
                    <PhoneCall className="w-5 h-5 text-[#006e21]" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-lime-200">
                        {hotlineLabel || 'CALL NOW'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-300" />
                      <span className="text-[9px] font-bold text-white/80">
                        {hotlineSubtitle || 'Support'}
                      </span>
                    </div>
                    <span className="text-base font-black tracking-wide text-white font-mono">
                      {hotlinePhone || '0916 576 156'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="w-8 h-8 text-[#00356a]/30 mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-[#00356a]/60">
                    Hotline Widget is currently toggled OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#dce0e6] flex items-center justify-between text-[11px] text-[#00356a]/70">
            <span>Status: <strong>{hotlineEnabled ? 'Active' : 'Hidden'}</strong></span>
            <span>Target: <strong className="text-[#006e21] font-mono">{cleanPhone}</strong></span>
          </div>
        </div>
      </div>

      {/* Social Media Channels Management Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e5e9ee] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2e6eb] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#00356a]/10 text-[#00356a] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#00356a]">
                Social Media Channels Configuration
              </h3>
              <p className="text-[11px] text-[#00356a]/60">
                Update URLs and toggle visibility for Facebook, Zalo, LinkedIn, YouTube, and TikTok sitewide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFacebookEnabled(true);
                setZaloEnabled(true);
                setLinkedinEnabled(true);
                setYoutubeEnabled(true);
                setTiktokEnabled(true);
              }}
              className="px-3 py-1.5 rounded-full bg-[#f4f6f8] hover:bg-[#e2e6eb] text-[#00356a] text-[11px] font-bold shadow-bubble-sm cursor-pointer"
            >
              Enable All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. ZALO */}
          <div className={`p-5 rounded-2xl border transition-all ${
            zaloEnabled ? 'bg-white border-[#0068FF]/30 shadow-bubble-sm' : 'bg-[#f4f6f8]/70 border-[#dce0e6] opacity-75'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0068FF]/10 text-[#0068FF] flex items-center justify-center">
                  <ZaloIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#00356a]">Zalo Official Contact</h4>
                  <span className="text-[10px] text-[#00356a]/60">Instant Messenger</span>
                </div>
              </div>

              {/* Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] font-bold text-[#00356a]">
                  {zaloEnabled ? 'Enabled' : 'Off'}
                </span>
                <div
                  onClick={() => setZaloEnabled(!zaloEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    zaloEnabled ? 'bg-[#0068FF]' : 'bg-[#dce0e6]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                      zaloEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://zalo.me/0916576156"
                value={zaloUrl}
                onChange={(e) => setZaloUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#0068FF]"
              />
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Test Zalo URL"
                className="p-2.5 rounded-xl bg-[#f4f6f8] hover:bg-[#0068FF] text-[#00356a] hover:text-white shadow-bubble-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. FACEBOOK */}
          <div className={`p-5 rounded-2xl border transition-all ${
            facebookEnabled ? 'bg-white border-[#1877F2]/30 shadow-bubble-sm' : 'bg-[#f4f6f8]/70 border-[#dce0e6] opacity-75'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center">
                  <Facebook className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#00356a]">Facebook Page</h4>
                  <span className="text-[10px] text-[#00356a]/60">Official Company Profile</span>
                </div>
              </div>

              {/* Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] font-bold text-[#00356a]">
                  {facebookEnabled ? 'Enabled' : 'Off'}
                </span>
                <div
                  onClick={() => setFacebookEnabled(!facebookEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    facebookEnabled ? 'bg-[#1877F2]' : 'bg-[#dce0e6]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                      facebookEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://www.facebook.com/..."
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Test Facebook URL"
                className="p-2.5 rounded-xl bg-[#f4f6f8] hover:bg-[#1877F2] text-[#00356a] hover:text-white shadow-bubble-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 3. LINKEDIN */}
          <div className={`p-5 rounded-2xl border transition-all ${
            linkedinEnabled ? 'bg-white border-[#0A66C2]/30 shadow-bubble-sm' : 'bg-[#f4f6f8]/70 border-[#dce0e6] opacity-75'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#00356a]">LinkedIn Corporate</h4>
                  <span className="text-[10px] text-[#00356a]/60">Professional Network</span>
                </div>
              </div>

              {/* Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] font-bold text-[#00356a]">
                  {linkedinEnabled ? 'Enabled' : 'Off'}
                </span>
                <div
                  onClick={() => setLinkedinEnabled(!linkedinEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    linkedinEnabled ? 'bg-[#0A66C2]' : 'bg-[#dce0e6]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                      linkedinEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://www.linkedin.com/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              />
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Test LinkedIn URL"
                className="p-2.5 rounded-xl bg-[#f4f6f8] hover:bg-[#0A66C2] text-[#00356a] hover:text-white shadow-bubble-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 4. YOUTUBE */}
          <div className={`p-5 rounded-2xl border transition-all ${
            youtubeEnabled ? 'bg-white border-[#FF0000]/30 shadow-bubble-sm' : 'bg-[#f4f6f8]/70 border-[#dce0e6] opacity-75'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF0000]/10 text-[#FF0000] flex items-center justify-center">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#00356a]">YouTube Channel</h4>
                  <span className="text-[10px] text-[#00356a]/60">Videos &amp; Jobsite Trials</span>
                </div>
              </div>

              {/* Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] font-bold text-[#00356a]">
                  {youtubeEnabled ? 'Enabled' : 'Off'}
                </span>
                <div
                  onClick={() => setYoutubeEnabled(!youtubeEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    youtubeEnabled ? 'bg-[#FF0000]' : 'bg-[#dce0e6]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                      youtubeEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://www.youtube.com/@hokimetal"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
              />
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Test YouTube URL"
                className="p-2.5 rounded-xl bg-[#f4f6f8] hover:bg-[#FF0000] text-[#00356a] hover:text-white shadow-bubble-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 5. TIKTOK */}
          <div className={`p-5 rounded-2xl border transition-all md:col-span-2 ${
            tiktokEnabled ? 'bg-white border-black/30 shadow-bubble-sm' : 'bg-[#f4f6f8]/70 border-[#dce0e6] opacity-75'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-black/10 text-black flex items-center justify-center">
                  <TikTokIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#00356a]">TikTok Video Channel</h4>
                  <span className="text-[10px] text-[#00356a]/60">Short-Form Engineering Demos</span>
                </div>
              </div>

              {/* Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] font-bold text-[#00356a]">
                  {tiktokEnabled ? 'Enabled' : 'Off'}
                </span>
                <div
                  onClick={() => setTiktokEnabled(!tiktokEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    tiktokEnabled ? 'bg-black' : 'bg-[#dce0e6]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                      tiktokEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://www.tiktok.com/@hokimetal"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-black"
              />
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Test TikTok URL"
                className="p-2.5 rounded-xl bg-[#f4f6f8] hover:bg-black text-[#00356a] hover:text-white shadow-bubble-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e2e6eb] flex items-center justify-end">
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-6 py-3 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs font-bold uppercase tracking-wider shadow-bubble flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save All Hotline &amp; Social Links</span>
          </button>
        </div>
      </div>
    </div>
  );
};
