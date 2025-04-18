import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Flame, Moon, Skull, Sword, Book, Sparkles, Menu, X, Film, Star } from 'lucide-react';
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
        isScrolled ? 'bg-black/90 shadow-lg border-b border-red-900/20' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <span className="text-2xl font-bold text-red-600">
            {WEBSITE_INFO.name}
            <span className="text-xs ml-1 bg-red-600 text-white px-1 rounded">BETA</span>
          </span>
        </Link>
        
        <div className="flex-1 max-w-md mx-4">
          <MysticalSearchBox />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" icon={<Flame className="h-4 w-4" />} text="Home" />
          <NavLink to="/category/movie" icon={<Film className="h-4 w-4" />} text="Movie" />
          <NavLink to="/category/most-popular" icon={<Star className="h-4 w-4" />} text="Popular" />
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6 text-gray-300" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 border-b border-red-900/20 md:hidden">
          <div className="container mx-auto py-4">
            <nav className="flex flex-col space-y-4">
              <NavLink to="/" icon={<Flame className="h-4 w-4" />} text="Home" mobile />
              <NavLink to="/category/movie" icon={<Film className="h-4 w-4" />} text="Movie" mobile />
              <NavLink to="/category/most-popular" icon={<Star className="h-4 w-4" />} text="Popular" mobile />
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  mobile?: boolean;
}

const NavLink = ({ to, icon, text, mobile }: NavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={`nav-item transition-all duration-300 flex items-center ${
        mobile ? 'w-full py-2 px-3' : ''
      } hover:text-red-500 text-gray-300 relative overflow-hidden`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

export default Navbar;
