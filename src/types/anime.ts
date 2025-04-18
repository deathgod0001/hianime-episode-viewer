export interface HomeData {
  spotlightAnimes: AnimeItem[];
  top10Animes: Top10Animes;
  latestEpisodeAnimes: AnimeItem[];
  trendingAnimes: AnimeItem[];
  mostPopularAnimes: AnimeItem[];
  topAiringAnimes: AnimeItem[];
}

export interface Top10Animes {
  today: AnimeItem[];
  week: AnimeItem[];
  month: AnimeItem[];
}

export interface AnimeItem {
  id: string;
  title: string;
  status?: string;
  totalEpisodes?: number;
  releaseDate?: string;
  image: string;
  rating?: number;
  type?: string;
}

export interface AnimeInfo {
  id: string;
  title: string;
  image: string;
  description: string;
  genres: string[];
  totalEpisodes: number;
  type: string;
  status: string;
  releaseDate: string;
  otherName: string;
  rating: number;
}

export interface EpisodeInfo {
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  episodeId: string;
  title?: string;
}

export interface EpisodeServers {
  sub: Server[];
  dub: Server[];
  raw: Server[];
}

export interface Server {
  url: string;
}

export interface StreamingData {
  headers: Headers;
  sources: Source[];
  subtitles: Subtitle[];
}

export interface Headers {
  Referer: string;
}

export interface Source {
  url: string;
}

export interface Subtitle {
  url: string;
  lang: string;
}
