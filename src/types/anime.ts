
// Anime Types
export interface Episode {
  number: number;
  title: string;
  episodeId: string;
  isFiller: boolean;
}

export interface EpisodeInfo {
  totalEpisodes: number;
  episodes: Episode[];
}

export interface EpisodeCount {
  sub: number;
  dub: number;
}

export interface AnimeItem {
  id: string;
  name: string;
  poster: string;
  type?: string;
  episodes?: EpisodeCount;
  duration?: string;
  rating?: string;
  jname?: string;
  description?: string;
  rank?: number;
  otherInfo?: string[];
  moreInfo?: {
    aired?: string;
    genres?: string[];
    status?: string;
    studios?: string;
    duration?: string;
  };
}

export interface SpotlightAnime {
  id: string;
  name: string;
  jname: string;
  poster: string;
  description: string;
  rank: number;
  otherInfo: string[];
  episodes: EpisodeCount;
}

export interface Top10Anime {
  episodes: EpisodeCount;
  id: string;
  name: string;
  poster: string;
  rank: number;
}

export interface HomeData {
  genres: string[];
  latestEpisodeAnimes: AnimeItem[];
  spotlightAnimes: SpotlightAnime[];
  top10Animes: {
    today: Top10Anime[];
    month: Top10Anime[];
    week: Top10Anime[];
  };
  topAiringAnimes: AnimeItem[];
  topUpcomingAnimes: AnimeItem[];
  trendingAnimes: AnimeItem[];
  mostPopularAnimes: AnimeItem[];
  mostFavoriteAnimes: AnimeItem[];
  latestCompletedAnimes: AnimeItem[];
}

export interface ServerInfo {
  serverId: number;
  serverName: string;
}

export interface EpisodeServers {
  episodeId: string;
  episodeNo: number;
  sub: ServerInfo[];
  dub: ServerInfo[];
  raw: ServerInfo[];
}

export interface StreamingSource {
  url: string;
  isM3U8: boolean;
  quality?: string;
}

export interface Subtitle {
  lang: string;
  url: string;
}

export interface StreamingData {
  headers: {
    Referer: string;
    "User-Agent": string;
    [key: string]: string;
  };
  sources: StreamingSource[];
  subtitles: Subtitle[];
  anilistID?: number | null;
  malID?: number | null;
}

export interface SearchParams {
  query: string;
  page?: number;
  type?: string;
  status?: string;
  rated?: string;
  score?: string;
  season?: string;
  language?: string;
  start_date?: string;
  end_date?: string;
  sort?: string;
  genres?: string;
}

export interface Season {
  id: string;
  name: string;
  title: string;
  poster: string;
  isCurrent: boolean;
}

export interface AnimeDetailData {
  anime: {
    info: {
      id: string;
      name: string;
      poster: string;
      description: string;
      stats: {
        rating: string;
        quality: string;
        episodes: EpisodeCount;
        type: string;
        duration: string;
      };
      promotionalVideos: {
        title: string | undefined;
        source: string | undefined;
        thumbnail: string | undefined;
      }[];
      characterVoiceActor: {
        character: {
          id: string;
          poster: string;
          name: string;
          cast: string;
        };
        voiceActor: {
          id: string;
          poster: string;
          name: string;
          cast: string;
        };
      }[];
    };
    moreInfo: {
      aired: string;
      genres: string[];
      status: string;
      studios: string;
      duration: string;
      [key: string]: any;
    };
  };
  mostPopularAnimes: AnimeItem[];
  recommendedAnimes: AnimeItem[];
  relatedAnimes: AnimeItem[];
  seasons: Season[];
}
