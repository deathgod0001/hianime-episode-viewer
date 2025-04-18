
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Flame, Moon, Skull, Sword } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { WEBSITE_INFO } from '@/services/video-proxy.service';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-black text-white shadow-md py-4 border-b border-red-900/30">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link to="/" className="flex items-center group">
            <Flame className="h-6 w-6 mr-2 text-red-600 group-hover:animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-red-800 bg-clip-text text-transparent">{WEBSITE_INFO.name}</span>
          </Link>
          <span className="hidden md:block text-xs text-gray-500 ml-3 italic">
            {WEBSITE_INFO.tagline}
          </span>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search the infinite realms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/80 border border-red-900/30 rounded-full pl-10 pr-4 py-2 focus:ring-red-600 focus:border-red-600 text-gray-300 placeholder:text-gray-500"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" 
              size={18} 
            />
          </form>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/category/most-popular" className="hover:text-red-500 transition flex items-center">
            <Flame className="mr-1 h-4 w-4" />
            <span>Popular</span>
          </Link>
          <Link to="/category/top-airing" className="hover:text-red-500 transition flex items-center">
            <Moon className="mr-1 h-4 w-4" />
            <span>Airing</span>
          </Link>
          <Link to="/category/movie" className="hover:text-red-500 transition flex items-center">
            <Skull className="mr-1 h-4 w-4" />
            <span>Movies</span>
          </Link>
          <Link to="/category/tv" className="hover:text-red-500 transition flex items-center">
            <Sword className="mr-1 h-4 w-4" />
            <span>TV</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
