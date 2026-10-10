import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'bd_compass_theme';

export default function ThemeToggle({ lang = 'bn' }) {
  const [theme, setTheme] = useState(() => {
    // 1. Check local storage for explicit user preference
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // 2. Default is always light mode
    return 'light';
  });

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle between light and dark
  const handleToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`theme-toggle-btn ${isLight ? 'theme-toggle-light' : 'theme-toggle-dark'}`}
      role="switch"
      aria-checked={!isLight}
      aria-label={lang === 'en'
        ? `Switch to ${isLight ? 'dark' : 'light'} mode`
        : `${isLight ? 'ডার্ক' : 'লাইট'} মোড চালু করুন`}
      title={lang === 'en'
        ? `Switch to ${isLight ? 'dark' : 'light'} mode`
        : `${isLight ? 'ডার্ক' : 'লাইট'} মোড চালু করুন`}
    >
      {/* Sliding Knob with Icons */}
      <div className="theme-toggle-knob">
        {isLight ? (
          <Sun size={17} strokeWidth={2.4} />
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Moon size={16} strokeWidth={2.2} />
            <Sparkles size={8} style={{ position: 'absolute', top: -3, right: -4, color: '#FCD34D' }} />
          </div>
        )}
      </div>

    </button>
  );
}
