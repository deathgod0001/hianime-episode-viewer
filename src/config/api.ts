
// API Configuration
export const BASE_URL = "https://hianime-up.vercel.app";
export const CORS_PROXY = "https://api.allorigins.win/get?url=";

// API Endpoints
export const API = {
  home: `${BASE_URL}/api/v2/hianime/home`,
  azList: (sortOption: string, page: number = 1) => 
    `${BASE_URL}/api/v2/hianime/azlist/${sortOption}?page=${page}`,
  qtip: (animeId: string) => 
    `${BASE_URL}/api/v2/hianime/qtip/${animeId}`,
  animeInfo: (animeId: string) => 
    `${BASE_URL}/api/v2/hianime/anime/${animeId}`,
  search: (query: string, page: number = 1) => 
    `${BASE_URL}/api/v2/hianime/search?q=${query}&page=${page}`,
  searchSuggestion: (query: string) => 
    `${BASE_URL}/api/v2/hianime/search/suggestion?q=${query}`,
  producer: (name: string, page: number = 1) => 
    `${BASE_URL}/api/v2/hianime/producer/${name}?page=${page}`,
  genre: (name: string, page: number = 1) => 
    `${BASE_URL}/api/v2/hianime/genre/${name}?page=${page}`,
  category: (name: string, page: number = 1) => 
    `${BASE_URL}/api/v2/hianime/category/${name}?page=${page}`,
  schedule: (date: string) => 
    `${BASE_URL}/api/v2/hianime/schedule?date=${date}`,
  episodes: (animeId: string) => 
    `${BASE_URL}/api/v2/hianime/anime/${animeId}/episodes`,
  nextEpisodeSchedule: (animeId: string) => 
    `${BASE_URL}/api/v2/hianime/anime/${animeId}/next-episode-schedule`,
  episodeServers: (episodeId: string) => 
    `${BASE_URL}/api/v2/hianime/episode/servers?animeEpisodeId=${episodeId}`,
  episodeSources: (episodeId: string, server: string = "hd-1", category: string = "sub") => 
    `${BASE_URL}/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}&server=${server}&category=${category}`,
  m3u8Proxy: (url: string) => {
    const proxyUrl = import.meta.env.VITE_M3U8_PROXY_URL || "https://m3u8-proxy.xdsystemspotify.workers.dev/?url=";
    return `${proxyUrl}${encodeURIComponent(url)}`;
  }
};

// Check for m3u8 proxy environment variables
if (typeof window !== 'undefined') {
  const hasProxy = import.meta.env.VITE_M3U8_PROXY_URL || import.meta.env.VITE_PROXY_URL;
  if (!hasProxy) {
    console.warn("No m3u8 proxy URL defined. Video streaming might encounter CORS issues.");
    console.warn("Consider setting VITE_M3U8_PROXY_URL or VITE_PROXY_URL in your environment.");
  }
}
