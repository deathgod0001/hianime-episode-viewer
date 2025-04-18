
import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { History, ChevronLeft, ChevronRight, Play, X } from "lucide-react";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface WatchItem {
  id: string;
  data_id: string;
  episodeId: string;
  episodeNum: string;
  adultContent?: boolean;
  poster: string;
  title: string;
  japanese_title?: string;
}

const ContinueWatching = () => {
  const [watchList, setWatchList] = useState<WatchItem[]>([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    // Load continue watching data from localStorage
    const data = JSON.parse(localStorage.getItem("continueWatching") || "[]");
    setWatchList(data);
  }, []);

  // Memoize watchList to avoid unnecessary re-renders
  const memoizedWatchList = useMemo(() => watchList, [watchList]);

  const removeFromWatchList = (episodeId: string) => {
    setWatchList((prevList) => {
      const updatedList = prevList.filter(
        (item) => item.episodeId !== episodeId
      );
      localStorage.setItem("continueWatching", JSON.stringify(updatedList));
      return updatedList;
    });
  };

  if (memoizedWatchList.length === 0) return null;

  return (
    <div className="mt-8 mb-12 relative">
      {/* Section header with magical effects */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-red-900/30 relative overflow-hidden">
        <div className="flex items-center gap-x-2 justify-center">
          <div className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center">
            <History className="text-red-600 h-5 w-5 animate-pulse-slow" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 glowing-text">
            Continue Watching
          </h2>
        </div>

        {/* Mystical navigation controls */}
        <div className="flex gap-x-2">
          <button className="btn-prev mystical-button w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center hover:bg-red-900/50 transition-all">
            <ChevronLeft className="text-red-500 h-4 w-4" />
          </button>
          <button className="btn-next mystical-button w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center hover:bg-red-900/50 transition-all">
            <ChevronRight className="text-red-500 h-4 w-4" />
          </button>
        </div>
        
        {/* Animated line effect */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse-slow"></div>
      </div>

      <div className="relative">
        {/* Swiper component for carousel */}
        <Swiper
          ref={swiperRef}
          className="w-full"
          slidesPerView={2}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 16 },
            1280: { slidesPerView: 6, spaceBetween: 20 },
          }}
          modules={[Navigation]}
          navigation={{
            nextEl: ".btn-next",
            prevEl: ".btn-prev",
          }}
        >
          {memoizedWatchList.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="mystical-card relative aspect-[2/3] overflow-hidden rounded-lg border border-gray-800 group">
                {/* Remove button */}
                <button
                  className="absolute top-2 right-2 bg-black/70 hover:bg-red-900/80 text-white p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromWatchList(item.episodeId)}
                  title="Remove from continue watching"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Card content */}
                <Link
                  to={`/anime/${item.id}/watch?ep=${item.episodeId}`}
                  className="block h-full w-full relative"
                >
                  {/* Poster image */}
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-50"
                  />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-red-600/80 backdrop-blur-sm flex items-center justify-center animate-pulse-slow">
                      <Play className="h-6 w-6 text-white" fill="white" />
                    </div>
                  </div>
                  
                  {/* Adult content badge */}
                  {item.adultContent && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">
                      18+
                    </div>
                  )}
                  
                  {/* Title and episode info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h3 className="text-white text-sm font-medium line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-red-400 text-xs font-semibold">
                      Episode {item.episodeNum}
                    </p>
                  </div>
                </Link>
                
                {/* Mystical animated border effect */}
                <div className="absolute inset-0 border border-red-500/0 group-hover:border-red-500/30 transition-all duration-300 pointer-events-none"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Mystical particle effects */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 italic">
          "Echo with the screams of fallen angels and sing with the voices of celestial beasts"
        </div>
      </div>
    </div>
  );
};

export default ContinueWatching;
