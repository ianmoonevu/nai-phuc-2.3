import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Phone, PhoneCall, ChevronUp, ChevronDown, Facebook, Youtube, Linkedin, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';

// Custom SVG Icons for Zalo and TikTok
export const ZaloIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4C12.95 4 4 12.51 4 23.01c0 5.86 2.8 11.1 7.21 14.65l-1.89 6.88a1 1 0 0 0 1.25 1.22l7.73-2.61c1.8.56 3.71.86 5.7.86 11.05 0 20-8.51 20-19.01S35.05 4 24 4zm-7.6 25.2h-3.8v-1.8l4.4-6.2h-4.3v-2.4h6.7v1.8l-4.5 6.2h4.5v2.4zm8.6 0h-2.8V18.8h2.8v10.4zm7.6 0h-5.9V18.8h2.8v8h3.1v2.4zm7.8-1.7c-.8 1.1-2.1 1.7-3.7 1.7-1.6 0-2.9-.6-3.7-1.7-.8-1.1-1.2-2.7-1.2-4.7 0-2 .4-3.6 1.2-4.7.8-1.1 2.1-1.7 3.7-1.7 1.6 0 2.9.6 3.7 1.7.8 1.1 1.2 2.7 1.2 4.7 0 2-.4 3.6-1.2 4.7zm-2.2-6.5c-.3-.7-.9-1-1.5-1s-1.2.3-1.5 1c-.3.7-.5 1.7-.5 3s.2 2.3.5 3c.3.7.9 1 1.5 1s1.2-.3 1.5-1c.3-.7.5-1.7.5-3s-.2-2.3-.5-3z" />
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

export const FloatingCallButton: React.FC = () => {
  const { branding } = useData();
  const [showSocialDock, setShowSocialDock] = useState(false);

  const isEnabled = branding.hotlineEnabled !== false;
  if (!isEnabled) {
    return null;
  }

  const rawPhone = branding.hotlinePhone || '0916 576 156';
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
  const phoneLabel = branding.hotlineLabel || 'CALL NOW';
  const phoneSubtitle = branding.hotlineSubtitle || 'Direct Engineering Hotline';

  const social = branding.socialLinks || {};
  const activeSocialCount = [
    social.zalo?.enabled && social.zalo?.url,
    social.facebook?.enabled && social.facebook?.url,
    social.linkedin?.enabled && social.linkedin?.url,
    social.youtube?.enabled && social.youtube?.url,
    social.tiktok?.enabled && social.tiktok?.url,
  ].filter(Boolean).length;

  return (
    <div
      id="floating-call-widget-container"
      className="fixed bottom-5 left-4 sm:bottom-7 sm:left-6 z-40 flex flex-col items-start gap-2.5 font-sans select-none"
    >
      {/* Expandable Social Channels Mini-Dock */}
      {showSocialDock && (
        <div
          id="floating-social-mini-dock"
          className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border border-[#e2e6eb] flex flex-col gap-2 animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="px-2 py-1 flex items-center justify-between gap-3 border-b border-[#f0f3f5] pb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00356a]">
              Connect With Us
            </span>
            <span className="text-[9px] font-semibold text-[#006e21] bg-[#006e21]/10 px-1.5 py-0.5 rounded-full">
              Live Support
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap max-w-[240px]">
            {/* Zalo */}
            {social.zalo?.enabled !== false && social.zalo?.url && (
              <a
                id="floating-social-zalo"
                href={social.zalo.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat with HOKI Engineering on Zalo"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0068FF]/10 text-[#0068FF] hover:bg-[#0068FF] hover:text-white transition-all text-xs font-bold shadow-sm cursor-pointer group"
              >
                <ZaloIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Zalo</span>
              </a>
            )}

            {/* Facebook */}
            {social.facebook?.enabled !== false && social.facebook?.url && (
              <a
                id="floating-social-facebook"
                href={social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow HOKI on Facebook"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all text-xs font-bold shadow-sm cursor-pointer group"
              >
                <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Facebook</span>
              </a>
            )}

            {/* LinkedIn */}
            {social.linkedin?.enabled !== false && social.linkedin?.url && (
              <a
                id="floating-social-linkedin"
                href={social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Connect with HOKI on LinkedIn"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all text-xs font-bold shadow-sm cursor-pointer group"
              >
                <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>LinkedIn</span>
              </a>
            )}

            {/* YouTube */}
            {social.youtube?.enabled !== false && social.youtube?.url && (
              <a
                id="floating-social-youtube"
                href={social.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Watch HOKI Engineering Videos on YouTube"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all text-xs font-bold shadow-sm cursor-pointer group"
              >
                <Youtube className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>YouTube</span>
              </a>
            )}

            {/* TikTok */}
            {social.tiktok?.enabled !== false && social.tiktok?.url && (
              <a
                id="floating-social-tiktok"
                href={social.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow HOKI on TikTok"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/10 text-black hover:bg-black hover:text-white transition-all text-xs font-bold shadow-sm cursor-pointer group"
              >
                <TikTokIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>TikTok</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main Oversized Floating Call Now Button Bar */}
      <div className="relative group flex items-center">
        {/* Animated Multi-Tier Radar Pulse Waves */}
        <span className="absolute -inset-1 rounded-full bg-[#006e21]/40 animate-ping opacity-75 duration-1000 pointer-events-none" />
        <span className="absolute -inset-2.5 rounded-full bg-[#006e21]/20 animate-pulse pointer-events-none" />

        {/* Primary Click-to-Call Anchor Button */}
        <a
          id="floating-call-now-button"
          href={`tel:${cleanPhone}`}
          title={`Call HOKI Engineering: ${rawPhone}`}
          aria-label={`Call HOKI Engineering at ${rawPhone}`}
          className="relative z-10 flex items-center gap-3 pl-3 pr-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#006e21] via-[#007a25] to-[#005a1b] text-white shadow-[0_10px_30px_rgba(0,110,33,0.45)] hover:shadow-[0_14px_38px_rgba(0,110,33,0.6)] border-2 border-white/80 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
        >
          {/* Circular Phone Icon Badge with Acoustic Glow */}
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#006e21] shadow-md shrink-0 group-hover:rotate-12 transition-transform duration-300">
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-[#006e21] animate-bounce" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-lime-400 rounded-full border-2 border-white animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-lime-400 rounded-full border-2 border-white" />
          </div>

          {/* Typography: Prominent Label & Large Phone Number */}
          <div className="flex flex-col items-start leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-lime-200 drop-shadow-sm">
                {phoneLabel}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse" />
              <span className="text-[9px] font-bold text-white/80 hidden sm:inline">
                {phoneSubtitle}
              </span>
            </div>
            <span className="text-base sm:text-lg font-black tracking-wide text-white font-mono drop-shadow">
              {rawPhone}
            </span>
          </div>
        </a>

        {/* Quick Social Dock Toggle Trigger */}
        {activeSocialCount > 0 && (
          <button
            id="floating-call-social-toggle-btn"
            onClick={() => setShowSocialDock(!showSocialDock)}
            title={showSocialDock ? 'Hide Social Channels' : 'Show Social & Messaging Channels'}
            className="relative z-10 -ml-3 w-8 h-8 rounded-full bg-[#00356a] text-white border-2 border-white shadow-md flex items-center justify-center hover:bg-[#002244] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle Social Channels"
          >
            {showSocialDock ? (
              <ChevronDown className="w-4 h-4 text-lime-300" />
            ) : (
              <MessageCircle className="w-4 h-4 text-lime-300" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
