import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation = () => {
  const navItems = [
    { icon: 'home', label: 'Home', path: '/' },
    { icon: 'add_circle', label: 'Add', path: '/add' },
    { icon: 'inbox', label: 'Inbox', path: '/inbox' },
    { icon: 'insights', label: 'Analysis', path: '/insights' },
    { icon: 'settings', label: 'Security', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-container-lowest/80 backdrop-blur-2xl flex justify-around items-center pt-3 pb-8 px-6 md:hidden border-t border-outline-variant/10">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center p-2 transition-all rounded-2xl ${
              isActive 
                ? 'text-primary' 
                : 'text-on-surface-variant opacity-60'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute -top-1 w-8 h-1 bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary-color),0.5)]"
                />
              )}
              <span 
                className="material-symbols-outlined text-2xl" 
                style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
              >
                {item.icon}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-1.5">
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
