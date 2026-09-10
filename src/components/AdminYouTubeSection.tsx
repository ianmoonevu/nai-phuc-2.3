import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { parseYouTubeInput, ParsedYouTubeInfo } from '../utils/youtube';
import {
  Play,
  Video,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Save,
  AlertCircle,
  Copy,
  Check,
  Globe,
  Sliders,
  Eye,
  Flame,
  Layers,
  HelpCircle
} from 'lucide-react';

interface AdminYouTubeSectionProps {
  onShowToast: (msg: string) => void;
  onNavigateToHome?: () => void;
}

export const AdminYouTubeSection: React.FC<AdminYouTubeSectionProps> = ({
  onShowToast,
  onNavigateToHome
}) => {
  const { branding, updateBranding } = useData();

  // Initial values from branding
  const initialUrl = branding.mainPageYoutubeUrl || 'https://www.youtube.com/@hokimetal';
  const initialTitle = branding.mainPageVideoTitle || 'HOKI Steel Fiber Concrete Systems - Official Video @hokimetal';
  const initialChannelName = branding.mainPageVideoChannelName || '@hokimetal';
  const initialChannelUrl = branding.mainPageVideoChannelUrl || 'https://www.youtube.com/@hokimetal';
  const initialAutoplay = branding.mainPageVideoAutoplay !== false;
  const initialMuted = branding.mainPageVideoMuted !== false;
  const initialDefaultOpen = branding.mainPageVideoDefaultOpen !== false;

  // Local Form State
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [titleInput, setTitleInput] = useState(initialTitle);
  const [channelNameInput, setChannelNameInput] = useState(initialChannelName);
  const [channelUrlInput, setChannelUrlInput] = useState(initialChannelUrl);
  const [autoplay, setAutoplay] = useState(initialAutoplay);
  const [muted, setMuted] = useState(initialMuted);
  const [defaultOpen, setDefaultOpen] = useState(initialDefaultOpen);

  const [hasCopied, setHasCopied] = useState(false);
  const [parsedInfo, setParsedInfo] = useState<ParsedYouTubeInfo>(() =>
    parseYouTubeInput(initialUrl, { autoplay: initialAutoplay, muted: initialMuted })
  );

  // Sync state if branding updates from Firestore in real-time
  useEffect(() => {
    if (branding.mainPageYoutubeUrl && branding.mainPageYoutubeUrl !== urlInput) {
      setUrlInput(branding.mainPageYoutubeUrl);
    }
    if (branding.mainPageVideoTitle && branding.mainPageVideoTitle !== titleInput) {
      setTitleInput(branding.mainPageVideoTitle);
    }
  }, [branding.mainPageYoutubeUrl, branding.mainPageVideoTitle]);

  // Update parsed info whenever inputs change
  useEffect(() => {
    const parsed = parseYouTubeInput(urlInput, { autoplay, muted });
    setParsedInfo(parsed);
  }, [urlInput, autoplay, muted]);

  // Quick Presets
  const YOUTUBE_PRESETS = [
    {
      id: 'preset-hokimetal',
      title: 'HOKI Official Channel Feed',
      url: 'https://www.youtube.com/@hokimetal',
      channelName: '@hokimetal',
      channelUrl: 'https://www.youtube.com/@hokimetal',
      badge: 'Official Channel',
      description: 'Dynamic user upload feed directly from the official HOKI YouTube channel.'
    },
    {
      id: 'preset-laser-screed',
      title: 'Laser Screed Industrial Flooring Placement',
      url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      channelName: '@hokimetal',
      channelUrl: 'https://www.youtube.com/@hokimetal',
      badge: 'Civil Placement',
      description: 'Continuous high-tolerance floor screeding with steel fiber reinforced concrete.'
    },
    {
      id: 'preset-toughness-test',
      title: 'ASTM C1609 Beam Flexural Toughness Test',
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      channelName: '@hokimetal',
      channelUrl: 'https://www.youtube.com/@hokimetal',
      badge: 'QA Lab Test',
      description: 'Third-party hydraulic test validating post-crack residual flexural strength.'
    }
  ];

  const handleApplyPreset = (preset: typeof YOUTUBE_PRESETS[0]) => {
    setUrlInput(preset.url);
    setTitleInput(preset.title);
    setChannelNameInput(preset.channelName);
    setChannelUrlInput(preset.channelUrl);
    onShowToast(`Applied preset: ${preset.title}`);
  };

  const handleSave = () => {
    if (!urlInput.trim()) {
      onShowToast('Please provide a valid YouTube URL or channel handle');
      return;
    }

    updateBranding({
      mainPageYoutubeUrl: urlInput.trim(),
      mainPageVideoTitle: titleInput.trim() || 'HOKI Steel Fiber Concrete Systems - Official Video',
      mainPageVideoChannelName: channelNameInput.trim() || '@hokimetal',
      mainPageVideoChannelUrl: channelUrlInput.trim() || 'https://www.youtube.com/@hokimetal',
      mainPageVideoAutoplay: autoplay,
      mainPageVideoMuted: muted,
      mainPageVideoDefaultOpen: defaultOpen
    });

    onShowToast('YouTube video successfully updated & published to Main Page!');
  };

  const handleResetToDefault = () => {
    const defaultUrl = 'https://www.youtube.com/@hokimetal';
    const defaultTitle = 'HOKI Steel Fiber Concrete Systems - Official Video @hokimetal';
    const defaultChanName = '@hokimetal';
    const defaultChanUrl = 'https://www.youtube.com/@hokimetal';

    setUrlInput(defaultUrl);
    setTitleInput(defaultTitle);
    setChannelNameInput(defaultChanName);
    setChannelUrlInput(defaultChanUrl);
    setAutoplay(true);
    setMuted(true);
    setDefaultOpen(true);

    updateBranding({
      mainPageYoutubeUrl: defaultUrl,
      mainPageVideoTitle: defaultTitle,
      mainPageVideoChannelName: defaultChanName,
      mainPageVideoChannelUrl: defaultChanUrl,
      mainPageVideoAutoplay: true,
      mainPageVideoMuted: true,
      mainPageVideoDefaultOpen: true
    });

    onShowToast('Reset YouTube video settings to default @hokimetal channel');
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        onShowToast('Pasted YouTube link from clipboard!');
      }
    } catch {
      onShowToast('Clipboard permission required or unsupported by browser');
    }
  };

  const handleCopyEmbedUrl = () => {
    navigator.clipboard.writeText(parsedInfo.embedUrl);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    onShowToast('Embed URL copied to clipboard');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>Main Page Video Manager</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#00356a]">
            YouTube Video on Homepage
          </h2>
          <p className="text-xs sm:text-sm text-[#00356a]/70 mt-1 max-w-3xl">
            Update the YouTube video embedded inside the hero showcase on the main page. Supports standard YouTube links (<code>youtube.com/watch?v=...</code>), short links (<code>youtu.be/...</code>), YouTube Shorts, direct embed URLs, or channel handles (<code>@hokimetal</code>).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleResetToDefault}
            className="px-4 py-2.5 rounded-full bg-white border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 shadow-bubble-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          {onNavigateToHome && (
            <button
              onClick={onNavigateToHome}
              className="px-4 py-2.5 rounded-full bg-[#f4f6f8] text-[#00356a] border border-[#e2e6eb] hover:bg-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Main Page</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Controls & Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: URL Input & Validation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e6eb]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#00356a]">
                <Play className="w-4 h-4 text-red-600 fill-red-600" />
                <span>YouTube Link / Source</span>
              </div>
              {parsedInfo.isValid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006e21] text-[11px] font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {parsedInfo.videoId ? `Video ID: ${parsedInfo.videoId}` : 'Channel Feed Active'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Invalid Format
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#00356a] mb-2">
                YouTube URL, Video Link or Channel Handle
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or @hokimetal"
                    className="w-full px-4 py-3 rounded-xl bg-[#f4f6f8] border border-[#e2e6eb] text-sm text-[#00356a] font-mono focus:bg-white focus:outline-none focus:border-[#00356a] transition-all"
                  />
                  {urlInput && (
                    <button
                      onClick={() => setUrlInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold px-1.5 py-0.5"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePasteClipboard}
                    className="px-4 py-3 rounded-xl bg-[#f4f6f8] hover:bg-white text-[#00356a] border border-[#e2e6eb] text-xs font-bold uppercase tracking-wider shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                    title="Paste link from clipboard"
                  >
                    <span>Paste</span>
                  </button>

                  <a
                    href={urlInput.startsWith('http') ? urlInput : `https://www.youtube.com/${urlInput}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#f4f6f8] hover:bg-white text-[#00356a] border border-[#e2e6eb] shadow-bubble-sm flex items-center justify-center transition-all cursor-pointer"
                    title="Open in new tab to test link"
                  >
                    <ExternalLink className="w-4 h-4 text-[#00356a]/70" />
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-[#00356a]/60 mt-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#006e21]" />
                <span>Supports: <code>watch?v=...</code>, <code>youtu.be/...</code>, <code>/shorts/...</code>, <code>@channel</code>, or direct embed URLs.</span>
              </p>
            </div>

            {/* Quick Presets */}
            <div className="pt-3 border-t border-[#f0f3f5]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#006e21] block mb-2.5">
                Quick 1-Click Presets:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {YOUTUBE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      urlInput === preset.url
                        ? 'bg-[#00356a]/5 border-[#00356a] shadow-bubble-sm'
                        : 'bg-[#f4f6f8] border-[#e2e6eb] hover:bg-white hover:border-[#00356a]/40'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#e2e6eb] text-[#006e21] inline-block mb-1">
                      {preset.badge}
                    </span>
                    <div className="text-xs font-bold text-[#00356a] truncate">{preset.title}</div>
                    <div className="text-[10px] text-[#00356a]/60 font-mono truncate mt-0.5">{preset.url}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Video Metadata & Channel Attribution */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e2e6eb] text-sm font-bold text-[#00356a]">
              <Sliders className="w-4 h-4 text-[#006e21]" />
              <span>Video Display Metadata</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#00356a] mb-1.5">
                Video Title / Accessible Caption
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="HOKI Steel Fiber Systems - Official Video"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f4f6f8] border border-[#e2e6eb] text-sm text-[#00356a] focus:bg-white focus:outline-none focus:border-[#00356a]"
              />
              <span className="text-[10px] text-[#00356a]/50 mt-1 block">
                Shown as the iframe title and accessibility descriptor.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#00356a] mb-1.5">
                  Channel Handle / Tag
                </label>
                <input
                  type="text"
                  value={channelNameInput}
                  onChange={(e) => setChannelNameInput(e.target.value)}
                  placeholder="@hokimetal"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f4f6f8] border border-[#e2e6eb] text-sm text-[#00356a] focus:bg-white focus:outline-none focus:border-[#00356a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#00356a] mb-1.5">
                  Channel External Link URL
                </label>
                <input
                  type="text"
                  value={channelUrlInput}
                  onChange={(e) => setChannelUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/@hokimetal"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f4f6f8] border border-[#e2e6eb] text-sm text-[#00356a] focus:bg-white focus:outline-none focus:border-[#00356a]"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Playback & Behavior Toggles */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bubble border border-[#e2e6eb] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e2e6eb] text-sm font-bold text-[#00356a]">
              <Sparkles className="w-4 h-4 text-[#006e21]" />
              <span>Playback Settings</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:bg-white cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#006e21] accent-[#006e21]"
                />
                <div>
                  <span className="text-xs font-bold text-[#00356a] block">
                    Auto-play Video on Open
                  </span>
                  <span className="text-[11px] text-[#00356a]/60 block leading-tight mt-0.5">
                    Starts streaming immediately when visitor clicks "Explore HOKI Video" or when drawer is expanded.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:bg-white cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={muted}
                  onChange={(e) => setMuted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#006e21] accent-[#006e21]"
                />
                <div>
                  <span className="text-xs font-bold text-[#00356a] block">
                    Mute Audio by Default (Recommended for Browser Autoplay Policy)
                  </span>
                  <span className="text-[11px] text-[#00356a]/60 block leading-tight mt-0.5">
                    Modern browsers (Chrome, Safari, Edge) block unmuted autoplay. Keeping this checked guarantees video begins smoothly.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] hover:bg-white cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={defaultOpen}
                  onChange={(e) => setDefaultOpen(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#006e21] accent-[#006e21]"
                />
                <div>
                  <span className="text-xs font-bold text-[#00356a] block">
                    Show Video Player Open by Default on Homepage
                  </span>
                  <span className="text-[11px] text-[#00356a]/60 block leading-tight mt-0.5">
                    When enabled, the video drawer is expanded automatically when visitors land on the homepage.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Primary Save Action */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full px-8 py-4 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-bubble hover:shadow-bubble-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish YouTube Video to Main Page</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-bubble border border-[#e2e6eb] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e6eb]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#00356a]">
                <Eye className="w-4 h-4 text-[#006e21]" />
                <span>Live Interactive Preview</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#006e21] bg-[#006e21]/10 px-2.5 py-0.5 rounded-full">
                Real-Time Test
              </span>
            </div>

            {/* Embedded Player Simulator */}
            <div className="w-full rounded-2xl overflow-hidden shadow-bubble border border-[#e2e6eb] relative bg-black aspect-16/9">
              <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-auto">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 text-white text-[10px] font-semibold backdrop-blur-md border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-bold">{channelNameInput || '@hokimetal'}</span>
                </div>
              </div>

              {parsedInfo.isValid ? (
                <iframe
                  key={`${parsedInfo.embedUrl}-${autoplay}-${muted}`}
                  src={parsedInfo.embedUrl}
                  title={titleInput || 'HOKI Video Preview'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/70">
                  <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                  <span className="text-xs font-bold text-white">Invalid YouTube Link</span>
                  <span className="text-[10px] text-white/60 mt-1">Please enter a valid YouTube URL on the left</span>
                </div>
              )}
            </div>

            {/* Video Details Summary */}
            <div className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] space-y-2">
              <div className="text-xs font-bold text-[#00356a] truncate">
                {titleInput || 'HOKI Steel Fiber Systems - Official Video'}
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#00356a]/70">
                <span>Channel Attribution:</span>
                <span className="font-bold text-[#006e21]">{channelNameInput || '@hokimetal'}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#00356a]/70">
                <span>Autoplay / Muted:</span>
                <span className="font-mono text-[10px] font-bold">
                  {autoplay ? 'Autoplay: ON' : 'Autoplay: OFF'} • {muted ? 'Muted: YES' : 'Muted: NO'}
                </span>
              </div>
            </div>

            {/* Generated Embed URL Box with Copy Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00356a]/60">
                  Compiled Privacy Embed URL:
                </span>
                <button
                  onClick={handleCopyEmbedUrl}
                  className="text-[10px] font-bold text-[#006e21] hover:text-[#005a1b] flex items-center gap-1 cursor-pointer"
                >
                  {hasCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{hasCopied ? 'Copied' : 'Copy Embed'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f4f6f8] border border-[#e2e6eb] text-[10px] font-mono text-[#00356a]/80 break-all select-all">
                {parsedInfo.embedUrl}
              </div>
            </div>

            {/* Verification Notice */}
            <div className="text-[11px] text-[#00356a]/70 leading-relaxed bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
              <span className="font-bold text-[#006e21] block mb-0.5">Cloud Synchronized Across All Devices</span>
              Saving this form saves immediately to Google Cloud Firestore, broadcasting the new video to all mobile and desktop visitors.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
