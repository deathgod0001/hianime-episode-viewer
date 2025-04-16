
// API Configuration
export const BASE_URL = "https://hianime-up.vercel.app";
export const CORS_PROXY = "https://api.allorigins.win/get?url=";

// Headers for API requests
export const DEFAULT_HEADERS = {
  'Referer': 'https://hianime-up.vercel.app/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Origin': 'https://hianime-up.vercel.app'
};

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
    `${BASE_URL}/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}&server=${server}&category=${category}`
};
