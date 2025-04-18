
import { useState, useEffect } from 'react';
import { AnimeService } from '@/services/api.service';
import { HomeData } from '@/types/anime';
import AnimeCard from '@/components/anime/AnimeCard';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ContinueWatching from '@/components/anime/ContinueWatching';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const data = await AnimeService.getHomeData();
        setHomeData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
    
    // Create entrance animation effect
    const createEntranceEffect = () => {
      // Add title animation
      const title = document.querySelector('.home-title');
      if (title) {
        title.classList.add('animate-content-reveal');
        title.setAttribute('style', 'animation-delay: 0.5s');
      }
      
      // Add section animations
      const sections = document.querySelectorAll('.animate-section');
      sections.forEach((section, index) => {
        section.classList.add('animate-content-reveal');
        section.setAttribute('style', `animation-delay: ${0.7 + index * 0.2}s`);
      });
    };
    
    // Apply animations after a slight delay to allow page transition
    setTimeout(createEntranceEffect, 200);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] flex-col">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-red-900/30 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
          <Loader2 className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 animate-pulse" />
        </div>
        <p className="mt-4 text-red-500 italic">Conjuring content from the netherworld...</p>
      </div>
    );
  }

  if (error || !homeData) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error || 'Failed to load content'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition mystical-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {homeData.spotlightAnimes && homeData.spotlightAnimes.length > 0 && (
        <div className="relative">
          <AnimeCarousel animes={homeData.spotlightAnimes} />
        </div>
      )}

      {/* Continue Watching Section */}
      <ContinueWatching />
      
      {/* Top 10 Anime Section */}
      <section className="animate-section relative">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-red-600 rounded mr-2"></div>
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 glowing-text">Top 10 Anime</h2>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-red-900/20 p-6">
          <Tabs defaultValue="today" className="animate-fade-in">
            <TabsList className="mb-4 bg-black/50">
              <TabsTrigger value="today" className="data-[state=active]:bg-red-900/70 data-[state=active]:text-white">Today</TabsTrigger>
              <TabsTrigger value="week" className="data-[state=active]:bg-red-900/70 data-[state=active]:text-white">This Week</TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-red-900/70 data-[state=active]:text-white">This Month</TabsTrigger>
            </TabsList>
            <TabsContent value="today">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {homeData.top10Animes.today.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} showType={false} className="mystical-card" />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="week">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {homeData.top10Animes.week.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} showType={false} className="mystical-card" />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="month">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {homeData.top10Animes.month.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} showType={false} className="mystical-card" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Latest Episodes Section */}
      <section className="animate-section">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-red-600 rounded mr-2"></div>
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 glowing-text">Latest Episodes</h2>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-red-900/20 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {homeData.latestEpisodeAnimes.slice(0, 12).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} className="mystical-card" />
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-red-900/30 to-transparent h-px" />

      {/* Trending Anime Section */}
      <section className="animate-section">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-red-600 rounded mr-2"></div>
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 glowing-text">Trending Now</h2>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-red-900/20 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {homeData.trendingAnimes.slice(0, 6).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} showType={false} className="mystical-card" />
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-red-900/30 to-transparent h-px" />

      {/* Popular Anime Section */}
      <section className="animate-section">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-red-600 rounded mr-2"></div>
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 glowing-text">Most Popular</h2>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-red-900/20 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {homeData.mostPopularAnimes.slice(0, 6).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} className="mystical-card" />
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-red-900/30 to-transparent h-px" />
      
      {/* Top Airing Section */}
      <section className="animate-section mb-12">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-red-600 rounded mr-2"></div>
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 glowing-text">Top Airing</h2>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-red-900/20 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {homeData.topAiringAnimes.slice(0, 12).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} showType={false} showEpisodes={false} className="mystical-card" />
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer quote */}
      <div className="text-center py-6 opacity-70 animate-pulse">
        <p className="text-sm italic text-gray-400">
          "This isn't a website. It's an experience forged from stars, shadows, and legend."
        </p>
        <p className="text-xs text-red-600/70 mt-1">
          SkyAnime is where fantasy becomes code, and myth dances with the internet.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
