
import { Link } from 'react-router-dom';
import { WEBSITE_INFO } from '@/services/video-proxy.service';
import { Flame, Moon, Skull, Sword, Book, Sparkles, Heart, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-red-900/30 relative overflow-hidden">
      {/* Mystical background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ff0000%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
      
      {/* Animated rune circles */}
      <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-red-900/5 blur-2xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-red-900/5 blur-xl animate-float"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="animate-content-reveal" style={{ animationDelay: '0.1s' }}>
            <Link to="/" className="flex items-center mb-6 group">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                <Flame className="h-5 w-5 text-red-600 group-hover:animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-red-800 bg-clip-text text-transparent">{WEBSITE_INFO.name}</span>
            </Link>
            <p className="text-sm italic leading-relaxed mb-4">
              "By the decree of the forgotten titans and beneath the eclipse of a cursed moon, this sanctuary of animation was torn from the veins of myth and bound by the chains of infernal prophecy."
            </p>
            <p className="mt-3 text-xs text-gray-500 flex items-center">
              <Heart className="h-3 w-3 mr-1 text-red-600" />
              <span>Created by the immortal, the untamed, the visionary—{WEBSITE_INFO.creator}</span>
            </p>
          </div>
          
          <div className="animate-content-reveal" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-white text-lg font-medium mb-6 flex items-center">
              <span className="bg-red-600 w-2 h-6 rounded mr-2 inline-block"></span>
              <span className="glowing-text">Realms</span>
            </h3>
            <ul className="space-y-4">
              <NavItem to="/category/most-popular" icon={<Sparkles className="mr-2 h-3.5 w-3.5" />} text="Popular" />
              <NavItem to="/category/top-airing" icon={<Moon className="mr-2 h-3.5 w-3.5" />} text="Airing" />
              <NavItem to="/category/movie" icon={<Skull className="mr-2 h-3.5 w-3.5" />} text="Movies" />
              <NavItem to="/category/tv" icon={<Sword className="mr-2 h-3.5 w-3.5" />} text="TV Series" />
              <NavItem to="/category/ova" icon={<Moon className="mr-2 h-3.5 w-3.5" />} text="OVA" />
            </ul>
          </div>
          
          <div className="animate-content-reveal" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-white text-lg font-medium mb-6 flex items-center">
              <span className="bg-red-600 w-2 h-6 rounded mr-2 inline-block"></span>
              <span className="glowing-text">Portals</span>
            </h3>
            <ul className="space-y-4">
              <NavItem to="/" icon={<Flame className="mr-2 h-3.5 w-3.5" />} text="Home" />
              <NavItem to="/random" icon={<Book className="mr-2 h-3.5 w-3.5" />} text="Random" />
              <NavItem to="/category/recently-updated" icon={<Sparkles className="mr-2 h-3.5 w-3.5" />} text="Latest Releases" />
              <NavItem to="/category/most-favorite" icon={<Heart className="mr-2 h-3.5 w-3.5" />} text="Most Favorites" />
              <NavItem to="mailto:contact@skyanime.com" icon={<Mail className="mr-2 h-3.5 w-3.5" />} text="Contact" external />
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs relative overflow-hidden">
          {/* Animated border */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
          
          <p className="text-gray-500 mb-3">"Echo with the screams of fallen angels and sing with the voices of celestial beasts"</p>
          <p className="mt-4">© {new Date().getFullYear()} {WEBSITE_INFO.name}. A creation so blasphemously beautiful.</p>
          <p className="mt-1 text-red-600/70">Architectural vision by {WEBSITE_INFO.creator}</p>
        </div>
      </div>
    </footer>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  external?: boolean;
}

const NavItem = ({ to, icon, text, external }: NavItemProps) => {
  if (external) {
    return (
      <li>
        <a 
          href={to} 
          className="hover:text-red-500 transition flex items-center mystical-button"
          target="_blank" 
          rel="noopener noreferrer"
        >
          {icon}{text}
        </a>
      </li>
    );
  }
  
  return (
    <li>
      <Link to={to} className="hover:text-red-500 transition flex items-center mystical-button">
        {icon}{text}
      </Link>
    </li>
  );
};

export default Footer;
