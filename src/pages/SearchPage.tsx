
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimeService } from '@/services/api.service';
import { AnimeItem } from '@/types/anime';
import AnimeCard from '@/components/anime/AnimeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [results, setResults] = useState<AnimeItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;
      
      try {
        setIsLoading(true);
        const { animes, totalPages: pages } = await AnimeService.searchAnime({
          query,
          page
        });
        
        setResults(animes);
        setTotalPages(pages);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch search results:', err);
        setError('Failed to load search results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim(), page: '1' });
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: newPage.toString() });
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800/50 p-6 rounded-lg">
        <h1 className="text-2xl font-semibold mb-6">Search Anime</h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-gray-700 border-gray-600"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Button 
              type="submit" 
              className="absolute right-0 top-0 bottom-0 rounded-l-none"
            >
              Search
            </Button>
          </div>
        </form>
        
        {query && (
          <p className="text-center mb-4 text-gray-300">
            Search results for: <span className="font-semibold text-white">{query}</span>
          </p>
        )}
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
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-gray-400">
            Try using different keywords or check the spelling
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((anime) => (
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
                  // Calculate which pages to show based on current page
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

export default SearchPage;
