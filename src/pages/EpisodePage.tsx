
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { AnimeService } from '@/services/api.service';
import { EpisodeInfo, EpisodeServers, StreamingData } from '@/types/anime';
import VideoPlayer from '@/components/video/VideoPlayer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  MonitorPlay, 
  ChevronLeft, 
  ChevronRight,
  Subtitles,
  FileAudio,
  FileVideo,
  Flame,
  Shield,
  Skull
} from 'lucide-react';
import { WEBSITE_INFO } from '@/services/video-proxy.service';

const EpisodePage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const episodeIdParam = searchParams.get('ep');
  
  const [episodeList, setEpisodeList] = useState<EpisodeInfo | null>(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(-1);
  const [episodeServers, setEpisodeServers] = useState<EpisodeServers | null>(null);
  const [streamingData, setStreamingData] = useState<StreamingData | null>(null);
  
  // Only HD-2 server
  const [selectedServer] = useState<string>("hd-2");
  const [selectedCategory, setSelectedCategory] = useState<string>("sub");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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
        toast({
          title: "The scrolls are incomplete",
          description: "Failed to summon episodes from the void. Try again when the moon is right.",
          variant: "destructive"
        });
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
        console.log(`Summoning servers for episode: ${episodeIdParam}`);
        const data = await AnimeService.getEpisodeServers(episodeIdParam);
        console.log('Episode servers manifested:', data);
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
        setError('Failed to summon streaming servers. The ritual was interrupted.');
        toast({
          title: "Ritual Interrupted",
          description: "Failed to bind streaming servers to your will. The celestial connection is weak.",
          variant: "destructive"
        });
      }
    };

    fetchEpisodeServers();
  }, [episodeIdParam]);

  // Fetch streaming data when server or category changes
  useEffect(() => {
    const fetchStreamingData = async () => {
      if (!episodeIdParam || !selectedCategory) return;
      
      try {
        setIsLoading(true);
        console.log(`Conjuring stream for episode: ${episodeIdParam}, server: ${selectedServer}, category: ${selectedCategory}`);
        
        const data = await AnimeService.getEpisodeSources(
          episodeIdParam, 
          selectedServer, 
          selectedCategory
        );
        
        console.log('Streaming spell succeeded:', data);
        setStreamingData(data);
        setError(null);
        
      } catch (err) {
        console.error('Failed to fetch streaming data:', err);
        setError(`The cosmic stream was disrupted. The forbidden knowledge cannot be accessed.`);
        
        // If we've tried less than 3 times, retry
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1);
          console.log(`Attempting to rebind the spirits...`);
          toast({
            title: "Rekindling the ritual",
            description: `The stream falters. Attempting to rebuild the connection...`,
            variant: "default"
          });
        } else {
          toast({
            title: "The Connection is Lost",
            description: `The void rejects our summoning. Try a different ritual (category).`,
            variant: "destructive"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamingData();
  }, [episodeIdParam, selectedServer, selectedCategory, retryCount]);

  const navigateToEpisode = (index: number) => {
    if (!episodeList || !episodeList.episodes || index < 0 || index >= episodeList.episodes.length) {
      return;
    }
    
    // Reset retry count when changing episodes
    setRetryCount(0);
    
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
      <div className="flex justify-center items-center min-h-[60vh] flex-col">
        <div className="w-16 h-16 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-red-500 italic">Summoning from the abyss...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <Link to="/" className="hover:text-red-500">Home</Link>
        <span>/</span>
        <Link to={`/anime/${id}`} className="hover:text-red-500">Anime Details</Link>
        <span>/</span>
        <span className="text-red-500">Episode {currentEpisode?.number}</span>
      </div>
      
      {/* Video player */}
      <div className="bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl border border-red-900/20">
        {isLoading ? (
          <div className="aspect-video flex items-center justify-center flex-col">
            <div className="w-16 h-16 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-red-500 font-medium">Binding the spectral energy...</p>
          </div>
        ) : error ? (
          <div className="aspect-video flex items-center justify-center flex-col p-6">
            <Skull className="h-16 w-16 text-red-600 mb-4" />
            <p className="text-lg text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-900/20 space-x-2"
            >
              <Flame className="h-4 w-4" />
              <span>Reignite the Ritual</span>
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
        <div className="p-4 bg-black/90 backdrop-blur-sm border-t border-red-900/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl font-medium">
              {currentEpisode ? (
                <>
                  <span className="text-red-600 font-semibold">{WEBSITE_INFO.name}</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span>Episode {currentEpisode.number}</span>
                  {currentEpisode.title && (
                    <span className="text-gray-400 ml-2 italic">- {currentEpisode.title}</span>
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
                  className={!hasPrevious ? "opacity-50 cursor-not-allowed bg-gray-900 text-gray-300" : "bg-gray-900 text-gray-300 hover:bg-red-900/30 hover:text-red-400"}
                  size="sm"
                >
                  <ChevronLeft size={18} />
                  <span className="ml-1">Prev</span>
                </Button>
                
                <Button
                  onClick={handleNextEpisode}
                  disabled={!hasNext}
                  variant="secondary"
                  className={!hasNext ? "opacity-50 cursor-not-allowed bg-gray-900 text-gray-300" : "bg-gray-900 text-gray-300 hover:bg-red-900/30 hover:text-red-400"}
                  size="sm"
                >
                  <span className="mr-1">Next</span>
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Only show category selection, removed server selection */}
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            {/* Category selection */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2 flex items-center">
                <Shield className="mr-1 h-4 w-4 text-red-600" />
                <span>Invocation Type</span>
              </h3>
              <div className="flex gap-2">
                {episodeServers?.sub && episodeServers.sub.length > 0 && (
                  <Button
                    onClick={() => setSelectedCategory('sub')}
                    variant={selectedCategory === 'sub' ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCategory === 'sub' 
                      ? "bg-red-900/70 text-white hover:bg-red-900 border-red-700"
                      : "border-red-900/30 text-gray-300 hover:text-red-400 hover:border-red-700/50"}
                  >
                    <Subtitles size={14} className="mr-1" /> Sub
                  </Button>
                )}
                
                {episodeServers?.dub && episodeServers.dub.length > 0 && (
                  <Button
                    onClick={() => setSelectedCategory('dub')}
                    variant={selectedCategory === 'dub' ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCategory === 'dub' 
                      ? "bg-red-900/70 text-white hover:bg-red-900 border-red-700"
                      : "border-red-900/30 text-gray-300 hover:text-red-400 hover:border-red-700/50"}
                  >
                    <FileAudio size={14} className="mr-1" /> Dub
                  </Button>
                )}
                
                {episodeServers?.raw && episodeServers.raw.length > 0 && (
                  <Button
                    onClick={() => setSelectedCategory('raw')}
                    variant={selectedCategory === 'raw' ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCategory === 'raw' 
                      ? "bg-red-900/70 text-white hover:bg-red-900 border-red-700"
                      : "border-red-900/30 text-gray-300 hover:text-red-400 hover:border-red-700/50"}
                  >
                    <FileVideo size={14} className="mr-1" /> Raw
                  </Button>
                )}
              </div>
            </div>
            
            {/* Server information - only showing HD-2 now */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2 flex items-center">
                <MonitorPlay size={14} className="mr-1 text-red-600" />
                <span>Viewing on Celestial Server</span>
              </h3>
              <div className="flex gap-2">
                <div className="bg-red-900/30 text-white px-4 py-1 rounded-md border border-red-900/50 flex items-center text-sm">
                  <MonitorPlay size={14} className="mr-2 text-red-500" />
                  <span>HD Server 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Episode list */}
      <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-red-900/20">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="bg-gradient-to-r from-red-600 to-red-800 w-2 h-6 rounded mr-2 inline-block"></span>
          <span className="text-white">Chronicles</span>
          <span className="text-gray-500 ml-2 text-sm">(All Episodes)</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
          {episodeList.episodes.map((episode, index) => (
            <Button
              key={episode.episodeId}
              variant={currentEpisodeIndex === index ? 'default' : 'outline'}
              className={currentEpisodeIndex === index 
                ? "bg-red-900/80 hover:bg-red-900 border-red-700 text-white" 
                : "hover:border-red-700/50 hover:text-red-500 border-red-900/20 text-gray-300"}
              size="sm"
              onClick={() => navigateToEpisode(index)}
            >
              {episode.number}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Mythic footer quote */}
      <div className="text-center mt-8 italic text-xs text-gray-500">
        <p>"A creation so blasphemously beautiful and epically divine, it bends time and melts mortal minds."</p>
        <p className="mt-1 text-red-700/70">By the visionary—{WEBSITE_INFO.creator}</p>
      </div>
    </div>
  );
};

export default EpisodePage;
