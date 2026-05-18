import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'light' ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="button-ghost h-10 w-10 p-0"
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
