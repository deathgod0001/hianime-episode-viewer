
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AnimeService } from '@/services/api.service';
import { AnimeItem } from '@/types/anime';
import AnimeCard from '@/components/anime/AnimeCard';
import { Button } from '@/components/ui/button';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [animes, setAnimes] = useState<AnimeItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pretty category name map
  const categoryNameMap: Record<string, string> = {
    'most-favorite': 'Most Favorite',
    'most-popular': 'Most Popular',
    'subbed-anime': 'Subbed Anime',
    'dubbed-anime': 'Dubbed Anime',
    'recently-updated': 'Recently Updated',
    'recently-added': 'Recently Added',
    'top-upcoming': 'Top Upcoming',
    'top-airing': 'Top Airing',
    'movie': 'Movies',
    'special': 'Specials',
    'ova': 'OVA',
    'ona': 'ONA',
    'tv': 'TV Series',
    'completed': 'Completed Anime'
  };

  useEffect(() => {
    const fetchAnime = async () => {
      if (!category) return;
      
      try {
        setIsLoading(true);
        const { animes, totalPages } = await AnimeService.getCategoryAnime(category, page);
        setAnimes(animes);
        setTotalPages(totalPages);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch category anime:', err);
        setError('Failed to load anime list. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [category, page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo(0, 0);
  };

  // Get the pretty category name
  const prettyName = category ? categoryNameMap[category] || category : '';

  return (
    <div className="space-y-8">
      <div className="bg-gray-800/50 p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">
          {prettyName}
        </h1>
        <p className="text-gray-300">
          Browse {prettyName.toLowerCase()} from our collection
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="w-16 h-16 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-lg text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : animes.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No anime found</h2>
          <p className="text-gray-400">
            No anime available in this category at the moment
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageToShow;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (page <= 3) {
                    pageToShow = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = page - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={i}
                      variant={pageToShow === page ? "default" : "outline"}
                      className={pageToShow === page ? "bg-red-600 hover:bg-red-700" : ""}
                      onClick={() => handlePageChange(pageToShow)}
                    >
                      {pageToShow}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && page < totalPages - 2 && (
                  <>
                    <span className="mx-1">...</span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={page === totalPages ? "opacity-50 cursor-not-allowed" : ""}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
