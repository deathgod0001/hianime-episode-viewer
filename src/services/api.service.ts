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
    console.log("Fetching data from:", url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("Direct fetch failed, trying with CORS proxy:", url);
    // If direct request fails, try with CORS proxy
    try {
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
      console.log("Using proxy URL:", proxyUrl);
      const proxyResponse = await axios.get(proxyUrl);
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
    try {
      console.log("Fetching episodes for anime:", animeId);
      const response = await fetchWithProxy(API.episodes(animeId));
      return response.data;
    } catch (error) {
      console.error("Failed to fetch anime episodes:", error);
      throw error;
    }
  },

  // Get episode servers
  getEpisodeServers: async (episodeId: string): Promise<EpisodeServers> => {
    try {
      console.log("Fetching servers for episode:", episodeId);
      const response = await fetchWithProxy(API.episodeServers(episodeId));
      return response.data;
    } catch (error) {
      console.error("Failed to fetch episode servers:", error);
      throw error;
    }
  },

  // Get episode streaming sources
  getEpisodeSources: async (
    episodeId: string, 
    server: string = "hd-1", 
    category: string = "sub"
  ): Promise<StreamingData> => {
    try {
      console.log("Fetching sources for episode:", episodeId, "server:", server, "category:", category);
      const response = await fetchWithProxy(API.episodeSources(episodeId, server, category));
      console.log("Episode sources response:", response);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch episode sources:", error);
      throw error;
    }
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
