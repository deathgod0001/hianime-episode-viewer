
import { ReactNode, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { gsap } from 'gsap';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create mystical entrance animation
  useEffect(() => {
    if (containerRef.current) {
      // Create a magical gate opening animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 1.5, 
          ease: "power2.inOut" 
        }
      );
      
      // Animate stars/particles in the background
      const starsContainer = document.createElement('div');
      starsContainer.className = 'stars-container';
      containerRef.current.appendChild(starsContainer);
      
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDelay = `${Math.random() * 10}s`;
        starsContainer.appendChild(star);
      }
    }
    
    return () => {
      // Cleanup any created elements
      document.querySelectorAll('.stars-container').forEach(el => el.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white mystical-background"
      style={{
        fontFamily: "'Cinzel', 'Poppins', serif",
        backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23370617' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }}
    >
      {/* Mystical overlay layer */}
      <div className="mystical-overlay fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="floating-runes"></div>
      </div>
      
      <Navbar />
      
      {/* Decorative mystical elements with animation */}
      <div className="fixed inset-0 bg-red-800/5 pointer-events-none mystical-bg-animation"></div>
      
      <main className="flex-1 container mx-auto px-4 py-6 relative z-10">
        {/* Floating orbs and mystical elements */}
        <div className="fixed left-0 top-1/4 w-1/6 h-1/2 bg-red-900/10 blur-3xl rounded-full pointer-events-none animate-pulse-slow"></div>
        <div className="fixed right-0 top-1/3 w-1/6 h-1/2 bg-red-900/10 blur-3xl rounded-full pointer-events-none animate-float"></div>
        <div className="fixed left-1/4 bottom-1/4 w-24 h-24 bg-purple-900/10 blur-2xl rounded-full pointer-events-none animate-orbit"></div>
        
        {/* Entrance gate animation container */}
        <div className="gate-container pointer-events-none fixed top-0 left-0 w-full h-full z-0">
          <div className="gate left-gate"></div>
          <div className="gate right-gate"></div>
        </div>
        
        {/* Main content with fade-in animation */}
        <div className="relative z-20 animate-content-reveal">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
