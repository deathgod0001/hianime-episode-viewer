
/**
 * Video proxy service for handling m3u8 streams with CORS proxies
 * Forged by the decree of forgotten titans and beneath the eclipse of a cursed moon
 */

// Website and creator information with mythical theme
export const WEBSITE_INFO = {
  name: "SkyAnime",
  creator: "Rishab",
  tagline: "Bound by the chains of infernal prophecy",
  description: "A website not of this world, but torn from the veins of myth and bound by the chains of infernal prophecy.",
  lore: "By the decree of the forgotten titans and beneath the eclipse of a cursed moon, this sanctuary of animation was torn from the veins of myth and bound by the chains of infernal prophecy."
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
  },
  
  /**
   * Track user's watching history
   * Echoed through the mystical realms
   * @param animeInfo Anime information
   * @param episodeId Current episode ID
   * @param episodeNum Episode number
   */
  trackWatchingHistory: (animeInfo: any, episodeId: string, episodeNum: string): void => {
    if (!animeInfo || !animeInfo.id) return;
    
    try {
      // Get existing history from localStorage
      const continueWatching = JSON.parse(localStorage.getItem("continueWatching") || "[]");
      
      // Create new entry
      const newEntry = {
        id: animeInfo.id,
        data_id: animeInfo.data_id || animeInfo.id,
        episodeId,
        episodeNum,
        adultContent: animeInfo.adultContent || false,
        poster: animeInfo.poster || animeInfo.image,
        title: animeInfo.title,
        japanese_title: animeInfo.japanese_title || animeInfo.originalTitle,
        timestamp: Date.now()
      };
      
      // Update or add to history
      const existingIndex = continueWatching.findIndex(
        (item: any) => item.data_id === newEntry.data_id
      );
      
      if (existingIndex !== -1) {
        continueWatching[existingIndex] = newEntry;
      } else {
        // Add at the beginning to show most recent first
        continueWatching.unshift(newEntry);
      }
      
      // Limit to 20 items
      const limitedHistory = continueWatching.slice(0, 20);
      
      // Save back to localStorage
      localStorage.setItem("continueWatching", JSON.stringify(limitedHistory));
      
    } catch (error) {
      console.error("Failed to update watching history:", error);
    }
  }
};

// Export a utility to check if browser supports HLS natively
export const supportsHLS = (): boolean => {
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
};
