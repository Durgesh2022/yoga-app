import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, Outlet } from 'react-router';
import { Menu, X, Star, Instagram, MessageCircle, ArrowRight } from 'lucide-react';
import logoImage from '../../assets/logo.png';

export const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-[#F5ECD7]/95 backdrop-blur-md border-b border-[#EDD9BC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <img src={logoImage} alt="Celestials Logo" className="h-8 w-auto object-contain" />
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#5C3D1E]">
              Celestials
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/how-it-works" className="text-[#5C3D1E]/80 hover:text-[#5C3D1E] font-medium transition-colors">How It Works</Link>
            <a href="/#astrologers" className="text-[#5C3D1E]/80 hover:text-[#5C3D1E] font-medium transition-colors">Our Astrologers</a>
            <Link to="/features" className="text-[#5C3D1E]/80 hover:text-[#5C3D1E] font-medium transition-colors">Features</Link>
            
             <a
          href="https://yoga-app-ozfi.vercel.app/"
  rel="noopener noreferrer"
            className="bg-[#5C3D1E] text-[#F5ECD7] px-6 py-2.5 rounded-full font-medium hover:bg-[#4A3016] transition-colors shadow-sm">
              Login to Web App
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#5C3D1E] p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#F5ECD7] border-b border-[#EDD9BC]">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-lg flex flex-col">
            <Link to="/how-it-works" onClick={() => setIsOpen(false)} className="block text-[#5C3D1E] font-medium text-lg">How It Works</Link>
            <a href="/#astrologers" onClick={() => setIsOpen(false)} className="block text-[#5C3D1E] font-medium text-lg">Our Astrologers</a>
            <Link to="/features" onClick={() => setIsOpen(false)} className="block text-[#5C3D1E] font-medium text-lg">Features</Link>
            <button className="w-full bg-[#5C3D1E] text-[#F5ECD7] px-6 py-3 rounded-full font-medium mt-4">
              Login to Web App
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-[#120E0A] text-[#F5ECD7] pt-16 pb-8 border-t border-[#5C3D1E]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-[#5C3D1E]/30 pb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 cursor-pointer inline-flex">
              <div className="w-10 h-10 bg-[#F5ECD7] rounded-full p-1 flex items-center justify-center">
                <img src={logoImage} alt="Celestials Logo" className="w-full h-full object-contain" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#F5ECD7]">
                Celestials
              </span>
            </Link>
            <p className="text-[#F5ECD7]/60 mb-6 max-w-sm">
              India ka pehla second opinion app. <br />
              Accountable, verified, and outcome-driven astrology.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#2A221C] flex items-center justify-center hover:bg-[#5C3D1E] transition-colors text-[#D4A843]">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#2A221C] flex items-center justify-center hover:bg-[#5C3D1E] transition-colors text-[#D4A843]">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-[#D4A843]">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/how-it-works" className="text-[#F5ECD7]/70 hover:text-[#F5ECD7] transition-colors">How It Works</Link></li>
              <li><Link to="/features" className="text-[#F5ECD7]/70 hover:text-[#F5ECD7] transition-colors">Features</Link></li>
              <li><a href="/#astrologers" className="text-[#F5ECD7]/70 hover:text-[#F5ECD7] transition-colors">Our Astrologers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-[#D4A843]">Support</h4>
            <ul className="space-y-3 mb-6">
              <li><a href="#" className="text-[#F5ECD7]/70 hover:text-[#F5ECD7] transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-[#F5ECD7]/70 hover:text-[#F5ECD7] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-[#F5ECD7]/70 hover:text-[#F5ECD7] transition-colors">Terms of Service</a></li>
            </ul>
            <div className="bg-[#2A221C] p-4 rounded-xl border border-[#5C3D1E]">
              <p className="text-xs text-[#D4A843] font-bold mb-2 uppercase tracking-wide">Play Store Coming Soon</p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email for waitlist" className="w-full bg-[#1A1511] text-sm px-3 py-2 rounded-l-lg border border-[#5C3D1E] focus:outline-none focus:border-[#D4A843] text-[#F5ECD7]" />
                <button type="submit" className="bg-[#5C3D1E] hover:bg-[#D4A843] hover:text-[#1A1511] transition-colors px-3 rounded-r-lg flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>
        
        <div className="text-center text-[#F5ECD7]/40 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Celestials. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with trust and accountability.</p>
        </div>
      </div>
    </footer>
  );
};

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5ECD7] text-[#1A1511] font-sans selection:bg-[#D4A843] selection:text-[#1A1511] scroll-smooth">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
