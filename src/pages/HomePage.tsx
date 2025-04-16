
import { useState, useEffect } from 'react';
import { AnimeService } from '@/services/api.service';
import { HomeData } from '@/types/anime';
import AnimeCard from '@/components/anime/AnimeCard';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

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
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
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
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {homeData.spotlightAnimes && homeData.spotlightAnimes.length > 0 && (
        <AnimeCarousel animes={homeData.spotlightAnimes} />
      )}

      {/* Top 10 Anime Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Top 10 Anime</h2>
        <Tabs defaultValue="today">
          <TabsList className="mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {homeData.top10Animes.today.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} showType={false} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="week">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {homeData.top10Animes.week.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} showType={false} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="month">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {homeData.top10Animes.month.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} showType={false} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Latest Episodes Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Episodes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {homeData.latestEpisodeAnimes.slice(0, 12).map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      <Separator />

      {/* Trending Anime Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {homeData.trendingAnimes.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.id} anime={anime} showType={false} />
          ))}
        </div>
      </section>

      <Separator />

      {/* Popular Anime Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Most Popular</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {homeData.mostPopularAnimes.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      <Separator />
      
      {/* Top Airing Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Airing</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {homeData.topAiringAnimes.slice(0, 12).map((anime) => (
            <AnimeCard key={anime.id} anime={anime} showType={false} showEpisodes={false} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
