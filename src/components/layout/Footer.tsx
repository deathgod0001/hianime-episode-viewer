
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-red-500 mr-1">Hi</span>
              <span className="text-2xl font-bold text-white">Anime</span>
            </Link>
            <p className="text-sm">
              Watch your favorite anime online in HD quality with English 
              subtitles and dubs. Stream on multiple servers and enjoy the best experience.
            </p>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/most-popular" className="hover:text-red-500 transition">Popular</Link></li>
              <li><Link to="/category/top-airing" className="hover:text-red-500 transition">Airing</Link></li>
              <li><Link to="/category/movie" className="hover:text-red-500 transition">Movies</Link></li>
              <li><Link to="/category/tv" className="hover:text-red-500 transition">TV Series</Link></li>
              <li><Link to="/category/ova" className="hover:text-red-500 transition">OVA</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-red-500 transition">Home</Link></li>
              <li><Link to="/category/recently-updated" className="hover:text-red-500 transition">Latest Releases</Link></li>
              <li><Link to="/category/most-favorite" className="hover:text-red-500 transition">Most Favorites</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} HiAnime. This is a demo project.</p>
          <p className="mt-1">API provided by HiAnime.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
