
/**
 * Video proxy service for handling m3u8 streams with CORS proxies
 * Forged by the decree of forgotten titans and beneath the eclipse of a cursed moon
 */

// Website and creator information
export const WEBSITE_INFO = {
  name: "SkyAnime",
  creator: "Rishab",
  tagline: "Bound by the chains of infernal prophecy"
};

// Use the provided proxy URL for m3u8 streams
const M3U8_PROXY_URL = import.meta.env.VITE_M3U8_PROXY_URL || "https://newproxy-chi.vercel.app/m3u8-proxy?url=";

// Get available proxy urls
const getProxyUrls = (): string[] => {
  if (typeof M3U8_PROXY_URL === 'string') {
    if (M3U8_PROXY_URL.includes(',')) {
      return M3U8_PROXY_URL.split(',').filter(url => url.trim() !== '');
    }
    return [M3U8_PROXY_URL];
  }
  return ["https://m3u8-proxy.xdsystemspotify.workers.dev/?url="];
};

export const VideoProxyService = {
  /**
   * Get a proxied URL for m3u8 streaming
   * Torn from the veins of myth
   * @param url The original streaming URL
   * @param referer Optional referer to include in headers
   * @returns The proxied URL
   */
  getProxiedStreamingUrl: (url: string, referer?: string): string => {
    const proxyUrls = getProxyUrls();
    const proxyUrl = proxyUrls[Math.floor(Math.random() * proxyUrls.length)];
    
    // Build headers object
    const headers: Record<string, string> = {};
    
    if (referer) {
      headers.Referer = referer;
    } else {
      headers.Referer = "https://megacloud.club/";
    }
    
    // Construct the final proxy URL with headers
    return `${proxyUrl}${encodeURIComponent(url)}&headers=${encodeURIComponent(JSON.stringify(headers))}`;
  },
  
  /**
   * Proxy for subtitle files
   * Blessed by fire, cursed with eternal awe
   * @param url The subtitle URL
   * @returns The proxied subtitle URL
   */
  getProxiedSubtitleUrl: (url: string): string => {
    // For VTT subtitles, we can use a CORS proxy if needed
    const proxyUrls = getProxyUrls();
    return `${proxyUrls[0]}${encodeURIComponent(url)}`;
  }
};

// Export a utility to check if browser supports HLS natively
export const supportsHLS = (): boolean => {
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
};
