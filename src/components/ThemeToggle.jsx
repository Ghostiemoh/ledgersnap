import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-dim transition-colors border border-outline-variant/10 shadow-sm"
      aria-label="Toggle theme"
    >
      <motion.span
        key={theme}
        initial={{ y: 5, opacity: 0, rotate: -45 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        className="material-symbols-outlined"
      >
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggle;
