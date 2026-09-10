/**
 * YouTube Utility Helpers for HOKI Platform
 * Robust parsing and embed generation supporting standard URLs, shortlinks,
 * embeds, shorts, playlists, and channel uploads.
 */

export interface ParsedYouTubeInfo {
  embedUrl: string;
  videoId: string | null;
  playlistId: string | null;
  channelName: string | null;
  thumbnailUrl: string | null;
  originalInput: string;
  isValid: boolean;
}

export function parseYouTubeInput(
  rawInput?: string,
  options: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
  } = {}
): ParsedYouTubeInfo {
  const { autoplay = true, muted = true, loop = false } = options;
  const input = (rawInput || '').trim();

  // Default fallback if empty
  const defaultFallback: ParsedYouTubeInfo = {
    embedUrl: `https://www.youtube-nocookie.com/embed?listType=user_uploads&list=hokimetal&autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&playsinline=1&enablejsapi=1&rel=0`,
    videoId: null,
    playlistId: 'hokimetal',
    channelName: '@hokimetal',
    thumbnailUrl: null,
    originalInput: input,
    isValid: true
  };

  if (!input) {
    return defaultFallback;
  }

  // 1. Direct embed URL or iframe src already provided
  if (input.includes('youtube.com/embed') || input.includes('youtube-nocookie.com/embed')) {
    let cleanUrl = input;
    // Extract src from iframe tag if whole iframe was pasted
    const iframeMatch = input.match(/src=["']([^"']+)["']/i);
    if (iframeMatch) {
      cleanUrl = iframeMatch[1];
    }

    // Ensure parameters
    try {
      const urlObj = new URL(cleanUrl);
      if (autoplay) urlObj.searchParams.set('autoplay', '1');
      if (muted) urlObj.searchParams.set('mute', '1');
      urlObj.searchParams.set('playsinline', '1');
      urlObj.searchParams.set('rel', '0');
      urlObj.searchParams.set('enablejsapi', '1');

      // Check if videoId is in pathname
      const parts = urlObj.pathname.split('/');
      const potentialId = parts[parts.length - 1];
      const videoId = potentialId && potentialId.length >= 10 && potentialId.length <= 12 ? potentialId : null;

      return {
        embedUrl: urlObj.toString(),
        videoId,
        playlistId: urlObj.searchParams.get('list'),
        channelName: null,
        thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
        originalInput: input,
        isValid: true
      };
    } catch {
      return {
        embedUrl: cleanUrl,
        videoId: null,
        playlistId: null,
        channelName: null,
        thumbnailUrl: null,
        originalInput: input,
        isValid: true
      };
    }
  }

  // 2. Channel handle e.g. "@hokimetal" or "https://youtube.com/@hokimetal"
  const channelMatch = input.match(/(?:youtube\.com\/)?@([a-zA-Z0-9_\-\.]+)/i);
  if (channelMatch && !input.includes('/watch') && !input.includes('youtu.be')) {
    const channel = channelMatch[1];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed?listType=user_uploads&list=${channel}&autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&playsinline=1&enablejsapi=1&rel=0`,
      videoId: null,
      playlistId: channel,
      channelName: `@${channel}`,
      thumbnailUrl: null,
      originalInput: input,
      isValid: true
    };
  }

  // 3. YouTube Watch URL or Shorts or youtu.be
  // Matches:
  // - youtube.com/watch?v=VIDEO_ID
  // - youtu.be/VIDEO_ID
  // - youtube.com/shorts/VIDEO_ID
  // - youtube.com/v/VIDEO_ID
  const videoIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = input.match(videoIdRegex);

  if (match && match[1]) {
    const videoId = match[1];
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      playsinline: '1',
      enablejsapi: '1',
      rel: '0'
    });

    if (loop) {
      params.set('loop', '1');
      params.set('playlist', videoId);
    }

    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`,
      videoId,
      playlistId: null,
      channelName: null,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      originalInput: input,
      isValid: true
    };
  }

  // 4. Playlist URL (e.g. youtube.com/playlist?list=...)
  const playlistMatch = input.match(/[?&]list=([^"&?\/\s]+)/i);
  if (playlistMatch && playlistMatch[1]) {
    const playlistId = playlistMatch[1];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&playsinline=1&rel=0`,
      videoId: null,
      playlistId,
      channelName: null,
      thumbnailUrl: null,
      originalInput: input,
      isValid: true
    };
  }

  // 5. Bare 11-char video ID (e.g., someone just pastes "dQw4w9WgXcQ")
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${input}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&playsinline=1&rel=0`,
      videoId: input,
      playlistId: null,
      channelName: null,
      thumbnailUrl: `https://img.youtube.com/vi/${input}/hqdefault.jpg`,
      originalInput: input,
      isValid: true
    };
  }

  // Fallback for invalid link
  return {
    embedUrl: defaultFallback.embedUrl,
    videoId: null,
    playlistId: null,
    channelName: null,
    thumbnailUrl: null,
    originalInput: input,
    isValid: false
  };
}
