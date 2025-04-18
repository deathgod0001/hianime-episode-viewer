
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimeService } from '@/services/api.service';
import { AnimeItem } from '@/types/anime';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, ArrowRight, Zap } from 'lucide-react';

const RandomAnimePage = () => {
  const [anime, setAnime] = useState<AnimeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRandomAnime = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get popular animes and select a random one
      const { animes } = await AnimeService.searchAnime({
        query: '',
        page: Math.floor(Math.random() * 10) + 1
      });
      
      if (animes && animes.length > 0) {
        const randomIndex = Math.floor(Math.random() * animes.length);
        setAnime(animes[randomIndex]);
      } else {
        setError('Failed to find a random anime. The celestial alignment is unfavorable.');
      }
    } catch (err) {
      console.error('Failed to fetch random anime:', err);
      setError('The cosmic streams are disrupted. Try again when the alignment is right.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomAnime();
    
    // Create the mystical background effect
    const createMysticEffect = () => {
      const container = document.querySelector('.random-anime-container');
      if (!container) return;
      
      // Create floating runes
      for (let i = 0; i < 15; i++) {
        const rune = document.createElement('div');
        rune.className = 'absolute w-2 h-2 bg-red-600/20 rounded-full';
        rune.style.left = `${Math.random() * 100}%`;
        rune.style.top = `${Math.random() * 100}%`;
        rune.style.filter = `blur(${Math.random() * 2 + 1}px)`;
        rune.style.animation = `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s, pulse-slow ${3 + Math.random() * 5}s infinite ease-in-out`;
        
        container.appendChild(rune);
      }
    };
    
    createMysticEffect();
  }, []);

  const handleWatchAnime = () => {
    if (anime) {
      navigate(`/anime/${anime.id}`);
    }
  };

  return (
    <div className="py-12 px-4 min-h-[70vh] flex flex-col items-center justify-center relative random-anime-container">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center glowing-text">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-red-800">
          Summoning Random Anime
        </span>
      </h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 relative mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-red-600/30 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
            <Loader2 className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 animate-pulse" />
          </div>
          <p className="text-gray-400 text-center italic">
            Consulting the ancient scrolls for a prophecy...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-10 max-w-md">
          <p className="text-lg text-red-400 mb-6">{error}</p>
          <Button 
            onClick={fetchRandomAnime}
            className="bg-red-900 hover:bg-red-800 text-white mystical-button"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Attempt Another Summoning
          </Button>
        </div>
      ) : anime ? (
        <div className="w-full max-w-4xl bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl border border-red-900/30 relative mystical-card">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-30 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 relative z-10">
            {/* Anime image */}
            <div className="aspect-[3/4] overflow-hidden rounded-lg border border-red-900/30 relative">
              <img 
                src={anime.poster} 
                alt={anime.title} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-50"></div>
            </div>
            
            {/* Anime details */}
            <div className="md:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 glowing-text">
                {anime.title}
              </h2>
              
              {anime.description && (
                <p className="text-gray-300 mb-6 line-clamp-4">
                  {anime.description}
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {anime.type && (
                  <div>
                    <h3 className="text-red-500 text-sm">Type</h3>
                    <p className="text-white">{anime.type}</p>
                  </div>
                )}
                
                {anime.status && (
                  <div>
                    <h3 className="text-red-500 text-sm">Status</h3>
                    <p className="text-white">{anime.status}</p>
                  </div>
                )}
                
                {anime.totalEpisodes && (
                  <div>
                    <h3 className="text-red-500 text-sm">Episodes</h3>
                    <p className="text-white">{anime.totalEpisodes}</p>
                  </div>
                )}
                
                {anime.releaseDate && (
                  <div>
                    <h3 className="text-red-500 text-sm">Released</h3>
                    <p className="text-white">{anime.releaseDate}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleWatchAnime}
                  className="bg-red-700 hover:bg-red-600 text-white mystical-button"
                >
                  <Zap className="mr-2 h-4 w-4" /> View Details
                </Button>
                
                <Button 
                  onClick={fetchRandomAnime}
                  variant="outline"
                  className="border-red-700 text-red-400 hover:bg-red-900/30 mystical-button"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Summon Another
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mystical footer */}
          <div className="bg-gray-900/70 p-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm italic">
              "A tale chosen by the cosmic forces of fate"
            </p>
            <Button 
              onClick={handleWatchAnime}
              variant="ghost"
              className="text-red-500 hover:text-red-400 hover:bg-transparent p-0 mystical-button"
            >
              Begin Journey <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-400 mb-4">No prophecy was received from the void.</p>
          <Button 
            onClick={fetchRandomAnime}
            className="bg-red-900 hover:bg-red-800 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      )}
      
      <div className="mt-16 text-center">
        <p className="text-gray-500 text-sm italic">
          "A creation so blasphemously beautiful and epically divine, it bends time and melts mortal minds."
        </p>
        <p className="mt-2 text-red-700/70 text-xs">
          By the visionary—Rishab
        </p>
      </div>
    </div>
  );
};

export default RandomAnimePage;
