
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from '@/components/ui/input';

const MysticalSearchBox = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const runesRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Create the mystical effect for the search box
  useEffect(() => {
    if (!runesRef.current) return;
    
    // Create animated runes around the search box when focused
    if (isFocused) {
      const createRunes = () => {
        const runesContainer = runesRef.current;
        if (!runesContainer) return;
        
        runesContainer.innerHTML = '';
        
        // Add magical runes/glyphs around the search box
        for (let i = 0; i < 8; i++) {
          const rune = document.createElement('div');
          rune.className = 'absolute w-2 h-2 bg-red-500 rounded-full opacity-0';
          
          // Position runes in a circle around the search box
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 100 + 50;
          const y = Math.sin(angle) * 30 + 20;
          
          rune.style.left = `${x}%`;
          rune.style.top = `${y}%`;
          rune.style.transform = 'translate(-50%, -50%)';
          rune.style.animation = `runeGlow 2s infinite ${i * 0.2}s, runeOrbit 8s infinite linear ${i * 0.5}s`;
          
          runesContainer.appendChild(rune);
        }
      };
      
      createRunes();
      const interval = setInterval(createRunes, 10000);
      return () => clearInterval(interval);
    }
  }, [isFocused]);

  // Handle click outside to clear focus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={searchRef} 
      className={`relative magical-search transition-all duration-500 ${isFocused ? 'scale-105' : ''}`}
    >
      <form onSubmit={handleSearch} className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={isFocused ? "Search the infinite realms..." : "Seek knowledge across dimensions..."}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className={`w-full bg-gray-900/80 border ${
            isFocused ? 'border-red-600' : 'border-red-900/30'
          } rounded-full pl-10 pr-4 py-2 focus:ring-red-600 focus:border-red-600 text-gray-300 
          placeholder:text-gray-500 transition-all duration-300`}
        />
        <Search 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isFocused ? 'text-red-600' : 'text-gray-400'
          } transition-all duration-300`}
          size={18} 
        />
        
        {/* Magical effect container */}
        <div ref={runesRef} className="absolute inset-0 pointer-events-none overflow-hidden" />
        
        {/* Search suggestions would appear here */}
        {isFocused && searchValue && (
          <div className="absolute top-full left-0 w-full mt-2 bg-black/90 backdrop-blur-lg rounded-lg 
          border border-red-900/30 shadow-lg z-50 p-2 animate-content-reveal">
            <div className="p-2 text-gray-400 italic text-sm">
              Type to search across realms...
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MysticalSearchBox;
