import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed transition-colors duration-500">
      {/* TopAppBar - Sticky with Backdrop Blur */}
      <header className="bg-surface/80 backdrop-blur-xl sticky top-0 full-width z-40 transition-all border-b border-outline-variant/5">
        <div className="flex justify-between items-center px-6 h-20 w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ rotate: 90 }}
              className="w-10 h-10 rounded-2xl bg-on-surface flex items-center justify-center text-surface shadow-lg"
            >
              <span className="material-symbols-outlined text-2xl">grid_view</span>
            </motion.div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-on-surface leading-none">LedgerSnap</h1>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mt-1 opacity-80">Financial Architect</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="md:flex hidden gap-8 mr-8">
              <a className="text-[11px] font-black uppercase tracking-widest text-on-surface hover:text-primary transition-colors" href="/">Archive</a>
              <a className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/insights">Analysis</a>
              <a className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/settings">Security</a>
            </div>
            
            <ThemeToggle />
            
            <div className="w-10 h-10 rounded-2xl bg-surface-container-high overflow-hidden border border-outline-variant/10 shadow-sm ml-2">
              <img 
                alt="User profile" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Framer Motion Transitions */}
      <main className="max-w-5xl mx-auto min-h-[calc(100vh-80px)] overflow-x-hidden pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.16, 1, 0.3, 1] // Apple-style Expo Out
            }}
            className="px-4 md:px-0"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation (Bottom Bar for Mobile) */}
      <Navigation />
    </div>
  );
};

export default Layout;
