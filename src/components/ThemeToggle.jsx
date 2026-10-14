import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ theme, onToggle, compact = false }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? 'theme-toggle-compact' : ''}`}
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
      <span className="theme-toggle-label">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default ThemeToggle;
