import React from 'react';
import { Link } from 'react-router-dom';
import { AnimeItem } from '@/types/anime';

interface AnimeCardProps {
  anime: AnimeItem;
  showType?: boolean;
  showEpisodes?: boolean;
  className?: string;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ 
  anime, 
  showType = true, 
  showEpisodes = true,
  className
}) => {
  return (
    <Link 
      to={`/anime/${anime.id}`} 
      className={`group relative block rounded-lg overflow-hidden bg-gray-800 transition-transform hover:scale-105 hover:shadow-xl ${className}`}
    >
      <div className="aspect-[2/3] w-full h-full">
        <img 
          src={anime.poster} 
          alt={anime.name}
          className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
          loading="lazy"
        />
        
        {/* Overlay with info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <h3 className="font-semibold truncate">{anime.name}</h3>
          
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-300">
            {showType && anime.type && (
              <span className="bg-red-500/80 px-1.5 py-0.5 rounded">
                {anime.type}
              </span>
            )}
            
            {showEpisodes && anime.episodes && (
              <>
                {anime.episodes.sub > 0 && (
                  <span className="bg-blue-500/80 px-1.5 py-0.5 rounded">
                    SUB: {anime.episodes.sub}
                  </span>
                )}
                
                {anime.episodes.dub > 0 && (
                  <span className="bg-green-500/80 px-1.5 py-0.5 rounded">
                    DUB: {anime.episodes.dub}
                  </span>
                )}
              </>
            )}
            
            {anime.rating && (
              <span className="bg-purple-500/80 px-1.5 py-0.5 rounded">
                {anime.rating}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Card footer */}
      <div className="p-2">
        <h3 className="font-medium text-sm truncate" title={anime.name}>
          {anime.name}
        </h3>
        
        {anime.rank && (
          <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
            #{anime.rank}
          </div>
        )}
      </div>
    </Link>
  );
};

export default AnimeCard;
