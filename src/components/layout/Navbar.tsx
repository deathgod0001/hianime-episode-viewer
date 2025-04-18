
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Flame, Moon, Skull, Sword, Book, Sparkles, Menu, X } from 'lucide-react';
import { WEBSITE_INFO } from '@/services/video-proxy.service';
import MysticalSearchBox from '../search/MysticalSearchBox';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle menu item hover effects
  useEffect(() => {
    const menuItems = document.querySelectorAll('.nav-item');
    
    menuItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        // Create magical particle effect
        const particles = document.createElement('div');
        particles.className = 'menu-particles';
        item.appendChild(particles);
        
        // Create individual particles
        for (let i = 0; i < 10; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.animationDuration = `${0.5 + Math.random()}s`;
          particles.appendChild(particle);
        }
        
        // Remove particles after animation completes
        setTimeout(() => {
          if (particles.parentNode === item) {
            item.removeChild(particles);
          }
        }, 1000);
      });
    });
  }, []);

  return (
    <nav 
      ref={navRef}
      className={`py-4 sticky top-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg shadow-red-900/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link to="/" className="flex items-center group">
            <div className="flame-icon-container mr-2">
              <Flame className="h-6 w-6 text-red-600 group-hover:animate-pulse flame-icon" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-red-800 bg-clip-text text-transparent 
            glowing-text hover:animate-pulse transition-all duration-500 logo-text">
              {WEBSITE_INFO.name}
            </span>
          </Link>
          <span className="hidden md:block text-xs text-gray-500 ml-3 italic rune-text">
            {WEBSITE_INFO.tagline}
          </span>
        </div>
        
        <div className="flex-1 max-w-md mx-4 z-50">
          <MysticalSearchBox />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="sm:hidden absolute top-4 right-4 text-white mystical-button p-2 rounded-full"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <div className={`items-center space-x-6 hidden sm:flex`}>
          <NavLink to="/" icon={<Flame className="mr-1 h-4 w-4" />} text="Home" isActive={location.pathname === '/'} />
          <NavLink to="/category/most-popular" icon={<Sparkles className="mr-1 h-4 w-4" />} text="Popular" isActive={location.pathname.includes('/category/most-popular')} />
          <NavLink to="/category/top-airing" icon={<Moon className="mr-1 h-4 w-4" />} text="Airing" isActive={location.pathname.includes('/category/top-airing')} />
          <NavLink to="/category/movie" icon={<Skull className="mr-1 h-4 w-4" />} text="Movies" isActive={location.pathname.includes('/category/movie')} />
          <NavLink to="/category/tv" icon={<Sword className="mr-1 h-4 w-4" />} text="TV" isActive={location.pathname.includes('/category/tv')} />
          <NavLink to="/random" icon={<Book className="mr-1 h-4 w-4" />} text="Random" isActive={location.pathname.includes('/random')} />
        </div>
        
        {/* Mobile Navigation */}
        <div className={`sm:hidden w-full transition-all duration-300 ${isMenuOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col space-y-3 bg-black/80 backdrop-blur-md p-4 rounded-lg">
            <NavLink to="/" icon={<Flame className="mr-2 h-4 w-4" />} text="Home" isActive={location.pathname === '/'} mobile />
            <NavLink to="/category/most-popular" icon={<Sparkles className="mr-2 h-4 w-4" />} text="Popular" isActive={location.pathname.includes('/category/most-popular')} mobile />
            <NavLink to="/category/top-airing" icon={<Moon className="mr-2 h-4 w-4" />} text="Airing" isActive={location.pathname.includes('/category/top-airing')} mobile />
            <NavLink to="/category/movie" icon={<Skull className="mr-2 h-4 w-4" />} text="Movies" isActive={location.pathname.includes('/category/movie')} mobile />
            <NavLink to="/category/tv" icon={<Sword className="mr-2 h-4 w-4" />} text="TV" isActive={location.pathname.includes('/category/tv')} mobile />
            <NavLink to="/random" icon={<Book className="mr-2 h-4 w-4" />} text="Random" isActive={location.pathname.includes('/random')} mobile />
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  mobile?: boolean;
}

const NavLink = ({ to, icon, text, isActive, mobile }: NavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={`nav-item transition-all duration-300 flex items-center ${
        mobile ? 'w-full py-2 px-3' : ''
      } ${
        isActive 
          ? 'text-red-500 font-bold' 
          : 'hover:text-red-500 text-gray-300'
      } relative overflow-hidden`}
    >
      {icon}
      <span className={`${isActive ? 'glowing-text' : ''}`}>{text}</span>
      
      {isActive && (
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-red-600 to-red-800"></div>
      )}
    </Link>
  );
};

export default Navbar;
