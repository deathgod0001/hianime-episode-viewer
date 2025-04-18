
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white"
         style={{
           fontFamily: "'Poppins', sans-serif",
           backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23370617' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
         }}
    >
      <Navbar />
      <div className="fixed inset-0 bg-red-800/5 pointer-events-none"></div>
      <main className="flex-1 container mx-auto px-4 py-6 relative z-10">
        {/* Decorative mystical elements */}
        <div className="fixed left-0 top-1/4 w-1/6 h-1/2 bg-red-900/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="fixed right-0 top-1/3 w-1/6 h-1/2 bg-red-900/10 blur-3xl rounded-full pointer-events-none"></div>
        
        {/* Main content */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
