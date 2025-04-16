
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { AnimeService } from '@/services/api.service';
import { EpisodeInfo, EpisodeServers, StreamingData } from '@/types/anime';
import VideoPlayer from '@/components/video/VideoPlayer';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const EpisodePage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const episodeIdParam = searchParams.get('ep');
  
  const [episodeList, setEpisodeList] = useState<EpisodeInfo | null>(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(-1);
  const [episodeServers, setEpisodeServers] = useState<EpisodeServers | null>(null);
  const [streamingData, setStreamingData] = useState<StreamingData | null>(null);
  
  const [selectedServer, setSelectedServer] = useState<string>("hd-1");
  const [selectedCategory, setSelectedCategory] = useState<string>("sub");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch episode list for the anime
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await AnimeService.getAnimeEpisodes(id);
        setEpisodeList(data);
        
        // Find the current episode in the list
        if (episodeIdParam && data.episodes) {
          const episodeIndex = data.episodes.findIndex(
            ep => ep.episodeId === episodeIdParam
          );
          
          if (episodeIndex !== -1) {
            setCurrentEpisodeIndex(episodeIndex);
          } else if (data.episodes.length > 0) {
            // If not found, use the first episode
            setCurrentEpisodeIndex(0);
            const firstEpId = data.episodes[0].episodeId;
            setSearchParams({ ep: firstEpId });
          }
        } else if (data.episodes && data.episodes.length > 0) {
          // If no episode specified, use the first one
          setCurrentEpisodeIndex(0);
          const firstEpId = data.episodes[0].episodeId;
          setSearchParams({ ep: firstEpId });
        }
      } catch (err) {
        console.error('Failed to fetch episodes:', err);
        setError('Failed to load episode list. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodes();
  }, [id, episodeIdParam, setSearchParams]);

  // Fetch servers for the current episode
  useEffect(() => {
    const fetchEpisodeServers = async () => {
      if (!episodeIdParam) return;
      
      try {
        const data = await AnimeService.getEpisodeServers(episodeIdParam);
        setEpisodeServers(data);
        
        // Set default category based on availability
        if (data) {
          if (data.sub && data.sub.length > 0) {
            setSelectedCategory('sub');
          } else if (data.dub && data.dub.length > 0) {
            setSelectedCategory('dub');
          } else if (data.raw && data.raw.length > 0) {
            setSelectedCategory('raw');
          }
        }
      } catch (err) {
        console.error('Failed to fetch episode servers:', err);
        setError('Failed to load streaming servers. Please try again later.');
      }
    };

    fetchEpisodeServers();
  }, [episodeIdParam]);

  // Fetch streaming data when server or category changes
  useEffect(() => {
    const fetchStreamingData = async () => {
      if (!episodeIdParam || !selectedServer || !selectedCategory) return;
      
      try {
        setIsLoading(true);
        const data = await AnimeService.getEpisodeSources(
          episodeIdParam, 
          selectedServer, 
          selectedCategory
        );
        setStreamingData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch streaming data:', err);
        setError('Failed to load video stream. Please try another server or category.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamingData();
  }, [episodeIdParam, selectedServer, selectedCategory]);

  const navigateToEpisode = (index: number) => {
    if (!episodeList || !episodeList.episodes || index < 0 || index >= episodeList.episodes.length) {
      return;
    }
    
    const episode = episodeList.episodes[index];
    setSearchParams({ ep: episode.episodeId });
  };

  const handlePreviousEpisode = () => {
    navigateToEpisode(currentEpisodeIndex - 1);
  };

  const handleNextEpisode = () => {
    navigateToEpisode(currentEpisodeIndex + 1);
  };

  // Get current episode details
  const currentEpisode = episodeList?.episodes && currentEpisodeIndex >= 0 
    ? episodeList.episodes[currentEpisodeIndex] 
    : null;

  // Determine if there are previous/next episodes
  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = episodeList?.episodes && currentEpisodeIndex < episodeList.episodes.length - 1;

  if (!id || !episodeList) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link to={`/anime/${id}`} className="hover:text-white">Anime Details</Link>
        <span>/</span>
        <span className="text-white">Episode {currentEpisode?.number}</span>
      </div>
      
      {/* Video player */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="aspect-video flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="aspect-video flex items-center justify-center flex-col p-6">
            <p className="text-lg text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Retry
            </Button>
          </div>
        ) : (
          <VideoPlayer 
            streamingData={streamingData}
            onPrevious={hasPrevious ? handlePreviousEpisode : undefined}
            onNext={hasNext ? handleNextEpisode : undefined}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
          />
        )}
        
        {/* Episode info and controls */}
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl font-semibold">
              {currentEpisode ? (
                <>
                  Episode {currentEpisode.number}
                  {currentEpisode.title && (
                    <span className="text-gray-300 ml-2">- {currentEpisode.title}</span>
                  )}
                </>
              ) : (
                'Episode'
              )}
            </h1>
            
            <div className="flex flex-wrap gap-2">
              {/* Episode navigation */}
              <div className="flex shadow rounded-md overflow-hidden">
                <Button
                  onClick={handlePreviousEpisode}
                  disabled={!hasPrevious}
                  variant="secondary"
                  className={!hasPrevious ? "opacity-50 cursor-not-allowed" : ""}
                  size="sm"
                >
                  <ChevronLeft size={18} />
                  <span className="ml-1">Prev</span>
                </Button>
                
                <Button
                  onClick={handleNextEpisode}
                  disabled={!hasNext}
                  variant="secondary"
                  className={!hasNext ? "opacity-50 cursor-not-allowed" : ""}
                  size="sm"
                >
                  <span className="mr-1">Next</span>
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Server and type selection */}
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            {/* Category selection */}
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Category</h3>
              <div className="flex gap-2">
                {episodeServers?.sub && episodeServers.sub.length > 0 && (
                  <Button
                    onClick={() => setSelectedCategory('sub')}
                    variant={selectedCategory === 'sub' ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCategory === 'sub' ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    Sub
                  </Button>
                )}
                
                {episodeServers?.dub && episodeServers.dub.length > 0 && (
                  <Button
                    onClick={() => setSelectedCategory('dub')}
                    variant={selectedCategory === 'dub' ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCategory === 'dub' ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    Dub
                  </Button>
                )}
                
                {episodeServers?.raw && episodeServers.raw.length > 0 && (
                  <Button
                    onClick={() => setSelectedCategory('raw')}
                    variant={selectedCategory === 'raw' ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCategory === 'raw' ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    Raw
                  </Button>
                )}
              </div>
            </div>
            
            {/* Server selection */}
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Server</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedServer('hd-1')}
                  variant={selectedServer === 'hd-1' ? 'default' : 'outline'}
                  size="sm"
                  className={selectedServer === 'hd-1' ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  <Monitor size={14} className="mr-1" /> HD Server 1
                </Button>
                
                <Button
                  onClick={() => setSelectedServer('hd-2')}
                  variant={selectedServer === 'hd-2' ? 'default' : 'outline'}
                  size="sm"
                  className={selectedServer === 'hd-2' ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  <Monitor size={14} className="mr-1" /> HD Server 2
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Episode list */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">All Episodes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
          {episodeList.episodes.map((episode, index) => (
            <Button
              key={episode.episodeId}
              variant={currentEpisodeIndex === index ? 'default' : 'outline'}
              className={currentEpisodeIndex === index ? "bg-red-600 hover:bg-red-700" : ""}
              size="sm"
              onClick={() => navigateToEpisode(index)}
            >
              {episode.number}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EpisodePage;
