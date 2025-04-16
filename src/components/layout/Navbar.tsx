
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

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
    <nav className="bg-black text-white shadow-md py-4">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-red-500 mr-1">Hi</span>
            <span className="text-2xl font-bold">Anime</span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-full pl-10 pr-4 py-2 focus:ring-red-500 focus:border-red-500"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={18} 
            />
          </form>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/category/most-popular" className="hover:text-red-500 transition">Popular</Link>
          <Link to="/category/top-airing" className="hover:text-red-500 transition">Airing</Link>
          <Link to="/category/movie" className="hover:text-red-500 transition">Movies</Link>
          <Link to="/category/tv" className="hover:text-red-500 transition">TV</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
