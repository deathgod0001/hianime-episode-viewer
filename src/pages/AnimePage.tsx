
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimeService } from '@/services/api.service';
import { AnimeDetailData, EpisodeInfo } from '@/types/anime';
import AnimeCard from '@/components/anime/AnimeCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, CalendarDays, Star, Info } from 'lucide-react';

const AnimePage = () => {
  const { id } = useParams<{ id: string }>();
  const [animeData, setAnimeData] = useState<AnimeDetailData | null>(null);
  const [episodesData, setEpisodesData] = useState<EpisodeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const [animeDetails, episodesList] = await Promise.all([
          AnimeService.getAnimeById(id),
          AnimeService.getAnimeEpisodes(id)
        ]);
        
        setAnimeData(animeDetails);
        setEpisodesData(episodesList);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch anime data:', err);
        setError('Failed to load anime information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !animeData) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error || 'Failed to load anime details'}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const { anime } = animeData;

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="relative min-h-[50vh] rounded-xl overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: `url(${anime.info.poster})`,
            filter: 'blur(30px)',
            opacity: 0.3
          }}
        ></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-8 p-6">
          {/* Poster */}
          <div className="w-full lg:w-1/3 max-w-xs mx-auto lg:mx-0">
            <img 
              src={anime.info.poster} 
              alt={anime.info.name}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{anime.info.name}</h1>
            {anime.moreInfo.jname && (
              <h2 className="text-xl text-gray-300 mb-4">{anime.moreInfo.jname}</h2>
            )}
            
            <div className="flex flex-wrap gap-3 mb-6">
              {anime.moreInfo.genres?.map((genre, index) => (
                <Link 
                  key={index} 
                  to={`/genre/${genre.toLowerCase()}`}
                  className="bg-red-600/70 hover:bg-red-700 px-3 py-1 rounded-full text-sm transition"
                >
                  {genre}
                </Link>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {anime.moreInfo.status && (
                <div className="flex items-center gap-2">
                  <Info size={18} className="text-gray-400" />
                  <span className="text-gray-300">Status: </span>
                  <span>{anime.moreInfo.status}</span>
                </div>
              )}
              
              {anime.info.stats.episodes && (
                <div className="flex items-center gap-2">
                  <PlayCircle size={18} className="text-gray-400" />
                  <span className="text-gray-300">Episodes: </span>
                  <span>
                    {anime.info.stats.episodes.sub > 0 && `Sub: ${anime.info.stats.episodes.sub}`}
                    {anime.info.stats.episodes.sub > 0 && anime.info.stats.episodes.dub > 0 && ' | '}
                    {anime.info.stats.episodes.dub > 0 && `Dub: ${anime.info.stats.episodes.dub}`}
                  </span>
                </div>
              )}
              
              {anime.info.stats.duration && (
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" />
                  <span className="text-gray-300">Duration: </span>
                  <span>{anime.info.stats.duration}</span>
                </div>
              )}
              
              {anime.moreInfo.aired && (
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-gray-400" />
                  <span className="text-gray-300">Aired: </span>
                  <span>{anime.moreInfo.aired}</span>
                </div>
              )}
              
              {anime.info.stats.rating && (
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-gray-400" />
                  <span className="text-gray-300">Rating: </span>
                  <span>{anime.info.stats.rating}</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-200 mb-6 line-clamp-6">{anime.info.description}</p>
            
            {episodesData && episodesData.episodes.length > 0 && (
              <div className="flex gap-4">
                <Link to={`/anime/${id}/watch?ep=${episodesData.episodes[0].episodeId}`}>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <PlayCircle size={18} className="mr-1" /> Watch Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Episodes section */}
      {episodesData && episodesData.episodes.length > 0 && (
        <section className="bg-gray-800/50 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {episodesData.episodes.map((episode) => (
              <Link 
                key={episode.episodeId}
                to={`/anime/${id}/watch?ep=${episode.episodeId}`}
                className="bg-gray-700 hover:bg-gray-600 text-center p-3 rounded transition"
              >
                <span className="block text-lg font-semibold">{episode.number}</span>
                {episode.title && (
                  <span className="block text-sm text-gray-300 truncate" title={episode.title}>
                    {episode.title}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {/* Related/Similar anime section */}
      <Tabs defaultValue="related">
        <TabsList>
          <TabsTrigger value="related">Related Anime</TabsTrigger>
          <TabsTrigger value="recommended">Recommendations</TabsTrigger>
          <TabsTrigger value="seasons">Seasons/Movies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="related" className="mt-4">
          {animeData.relatedAnimes && animeData.relatedAnimes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animeData.relatedAnimes.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No related anime found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recommended" className="mt-4">
          {animeData.recommendedAnimes && animeData.recommendedAnimes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animeData.recommendedAnimes.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No recommendations found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="seasons" className="mt-4">
          {animeData.seasons && animeData.seasons.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animeData.seasons.map((season) => (
                <div 
                  key={season.id} 
                  className={`relative rounded-lg overflow-hidden ${season.isCurrent ? 'ring-2 ring-red-500' : ''}`}
                >
                  <Link to={`/anime/${season.id}`}>
                    <img 
                      src={season.poster} 
                      alt={season.name} 
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-3">
                        <h3 className="font-medium">{season.name}</h3>
                        {season.title && (
                          <p className="text-xs text-gray-300">{season.title}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                  {season.isCurrent && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Current
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No other seasons found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimePage;
