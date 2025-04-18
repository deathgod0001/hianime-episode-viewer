
/**
 * Video proxy service for handling m3u8 streams with CORS proxies
 */

// Website and creator information
export const WEBSITE_INFO = {
  name: "SkyAnime",
  creator: "Rishab"
};

// Use the provided proxy URLs or fallback to default
const M3U8_PROXY_URL = import.meta.env.VITE_M3U8_PROXY_URL || "https://newproxy-chi.vercel.app/m3u8-proxy?url=";
const FALLBACK_PROXY_URL = "https://m3u8-proxy.xdsystemspotify.workers.dev/?url=";

// Get available proxy urls
const getProxyUrls = (): string[] => {
  if (typeof M3U8_PROXY_URL === 'string') {
    if (M3U8_PROXY_URL.includes(',')) {
      return M3U8_PROXY_URL.split(',').filter(url => url.trim() !== '');
    }
    return [M3U8_PROXY_URL];
  }
  return [FALLBACK_PROXY_URL];
};

export const VideoProxyService = {
  /**
   * Get a proxied URL for m3u8 streaming
   * @param url The original streaming URL
   * @param referer Optional referer to include in headers
   * @returns The proxied URL
   */
  getProxiedStreamingUrl: (url: string, referer?: string): string => {
    const proxyUrls = getProxyUrls();
    const randomProxyUrl = proxyUrls[Math.floor(Math.random() * proxyUrls.length)];
    
    // Build headers object
    const headers: Record<string, string> = {};
    
    if (referer) {
      headers.Referer = referer;
    } else {
      headers.Referer = "https://megacloud.club/";
    }
    
    // Construct the final proxy URL with headers
    return `${randomProxyUrl}${encodeURIComponent(url)}&headers=${encodeURIComponent(JSON.stringify(headers))}`;
  },
  
  /**
   * Proxy for subtitle files
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
