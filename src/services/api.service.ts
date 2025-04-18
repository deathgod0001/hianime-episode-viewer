
import axios from 'axios';
import { API, CORS_PROXY } from '../config/api';
import { 
  HomeData, 
  AnimeItem, 
  AnimeDetailData,
  EpisodeInfo,
  EpisodeServers,
  StreamingData,
  SearchParams
} from '../types/anime';

// Helper function to handle CORS proxying when needed
const fetchWithProxy = async (url: string) => {
  try {
    console.log(`Direct request to: ${url}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(`Direct request failed, trying with CORS proxy: ${CORS_PROXY}${encodeURIComponent(url)}`);
    // If direct request fails, try with CORS proxy
    try {
      const proxyResponse = await axios.get(`${CORS_PROXY}${encodeURIComponent(url)}`);
      // The proxy response contains the data in the contents field
      if (proxyResponse.data && proxyResponse.data.contents) {
        return JSON.parse(proxyResponse.data.contents);
      }
      return proxyResponse.data;
    } catch (proxyError) {
      console.error("Error fetching data with proxy:", proxyError);
      throw proxyError;
    }
  }
};

export const AnimeService = {
  // Get home page data
  getHomeData: async (): Promise<HomeData> => {
    const response = await fetchWithProxy(API.home);
    return response.data;
  },

  // Get anime by ID
  getAnimeById: async (animeId: string): Promise<AnimeDetailData> => {
    const response = await fetchWithProxy(API.animeInfo(animeId));
    return response.data;
  },

  // Get anime episodes
  getAnimeEpisodes: async (animeId: string): Promise<EpisodeInfo> => {
    const response = await fetchWithProxy(API.episodes(animeId));
    return response.data;
  },

  // Get episode servers
  getEpisodeServers: async (episodeId: string): Promise<EpisodeServers> => {
    console.log(`Fetching servers for episode ID: ${episodeId}`);
    const response = await fetchWithProxy(API.episodeServers(episodeId));
    console.log('Server response:', response);
    return response.data;
  },

  // Get episode streaming sources
  getEpisodeSources: async (
    episodeId: string, 
    server: string = "hd-1", 
    category: string = "sub"
  ): Promise<StreamingData> => {
    console.log(`Fetching sources for episode ID: ${episodeId}, server: ${server}, category: ${category}`);
    const response = await fetchWithProxy(API.episodeSources(episodeId, server, category));
    
    // Ensure we have valid sources and headers
    if (!response.data.sources || response.data.sources.length === 0) {
      throw new Error("No streaming sources available");
    }
    
    console.log('Sources response:', response);
    return response.data;
  },

  // Search anime
  searchAnime: async (params: SearchParams): Promise<{ animes: AnimeItem[], totalPages: number }> => {
    const { query, page = 1 } = params;
    const response = await fetchWithProxy(API.search(query, page));
    return {
      animes: response.data.animes,
      totalPages: response.data.totalPages
    };
  },

  // Get category anime
  getCategoryAnime: async (category: string, page: number = 1): Promise<{ animes: AnimeItem[], totalPages: number }> => {
    const response = await fetchWithProxy(API.category(category, page));
    return {
      animes: response.data.animes,
      totalPages: response.data.totalPages
    };
  },

  // Get genre anime
  getGenreAnime: async (genre: string, page: number = 1): Promise<{ animes: AnimeItem[], totalPages: number }> => {
    const response = await fetchWithProxy(API.genre(genre, page));
    return {
      animes: response.data.animes,
      totalPages: response.data.totalPages
    };
  }
};
