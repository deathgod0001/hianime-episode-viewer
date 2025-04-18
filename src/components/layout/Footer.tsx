
import { Link } from 'react-router-dom';
import { WEBSITE_INFO } from '@/services/video-proxy.service';
import { Flame, Moon, Skull, Sword, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-8 border-t border-red-900/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4 group">
              <Flame className="h-5 w-5 mr-2 text-red-600 group-hover:animate-pulse" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-red-800 bg-clip-text text-transparent">{WEBSITE_INFO.name}</span>
            </Link>
            <p className="text-sm italic">
              "By the decree of the forgotten titans and beneath the eclipse of a cursed moon, this sanctuary of animation was torn from the veins of myth and bound by the chains of infernal prophecy."
            </p>
            <p className="mt-3 text-xs text-gray-500">
              Created by the immortal, the untamed, the visionary—{WEBSITE_INFO.creator}
            </p>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-medium mb-4 flex items-center">
              <span className="bg-red-600 w-2 h-6 rounded mr-2 inline-block"></span>
              Realms
            </h3>
            <ul className="space-y-2">
              <li><Link to="/category/most-popular" className="hover:text-red-500 transition flex items-center">
                <Flame className="mr-2 h-3 w-3" />Popular
              </Link></li>
              <li><Link to="/category/top-airing" className="hover:text-red-500 transition flex items-center">
                <Moon className="mr-2 h-3 w-3" />Airing
              </Link></li>
              <li><Link to="/category/movie" className="hover:text-red-500 transition flex items-center">
                <Skull className="mr-2 h-3 w-3" />Movies
              </Link></li>
              <li><Link to="/category/tv" className="hover:text-red-500 transition flex items-center">
                <Sword className="mr-2 h-3 w-3" />TV Series
              </Link></li>
              <li><Link to="/category/ova" className="hover:text-red-500 transition flex items-center">
                <Moon className="mr-2 h-3 w-3" />OVA
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-medium mb-4 flex items-center">
              <span className="bg-red-600 w-2 h-6 rounded mr-2 inline-block"></span>
              Portals
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-red-500 transition">Home</Link></li>
              <li><Link to="/category/recently-updated" className="hover:text-red-500 transition">Latest Releases</Link></li>
              <li><Link to="/category/most-favorite" className="hover:text-red-500 transition">Most Favorites</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          <p className="text-gray-500">"Echo with the screams of fallen angels and sing with the voices of celestial beasts"</p>
          <p className="mt-4">© {new Date().getFullYear()} {WEBSITE_INFO.name}. A creation so blasphemously beautiful.</p>
          <p className="mt-1 text-red-600/70">Architectural vision by {WEBSITE_INFO.creator}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
