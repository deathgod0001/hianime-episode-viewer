
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SpotlightAnime } from '@/types/anime';
import { Button } from '@/components/ui/button';

interface AnimeCarouselProps {
  animes: SpotlightAnime[];
}

const AnimeCarousel = ({ animes }: AnimeCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current: container } = carouselRef;
      const scrollAmount = direction === 'left' 
        ? container.scrollLeft - container.offsetWidth 
        : container.scrollLeft + container.offsetWidth;
      
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!animes || animes.length === 0) {
    return null;
  }

  return (
    <div className="relative group mb-8">
      <div 
        className="overflow-x-auto flex snap-x snap-mandatory gap-4 pb-6 scrollbar-hide"
        ref={carouselRef}
        style={{ scrollbarWidth: 'none' }}
      >
        {animes.map((anime) => (
          <div 
            key={anime.id}
            className="min-w-full sm:min-w-[85%] md:min-w-[80%] lg:min-w-[75%] xl:min-w-[70%] snap-start"
          >
            <div className="relative h-[50vh] rounded-lg overflow-hidden">
              <img 
                src={anime.poster} 
                alt={anime.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold mb-2">{anime.name}</h2>
                  {anime.jname && (
                    <h3 className="text-lg text-gray-300 mb-3">{anime.jname}</h3>
                  )}
                  <p className="text-gray-200 mb-4 line-clamp-3">{anime.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    {anime.otherInfo && anime.otherInfo.map((info, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700/80 px-3 py-1 rounded text-sm"
                      >
                        {info}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/anime/${anime.id}`}>
                      <Button variant="default" className="bg-red-600 hover:bg-red-700">
                        Details
                      </Button>
                    </Link>
                    
                    <Link to={`/anime/${anime.id}/watch`}>
                      <Button variant="outline" className="border-white hover:bg-white/10">
                        Watch Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous"
      >
        <ChevronLeft />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default AnimeCarousel;
