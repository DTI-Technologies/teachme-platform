'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type AgeTheme = 'early' | 'late' | 'middle' | 'high' | 'default';

interface ThemeContextType {
  theme: Theme;
  ageTheme: AgeTheme;
  setTheme: (theme: Theme) => void;
  setAgeTheme: (ageTheme: AgeTheme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [ageTheme, setAgeThemeState] = useState<AgeTheme>('default');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedAgeTheme = localStorage.getItem('ageTheme') as AgeTheme;
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    }

    if (savedAgeTheme) {
      setAgeThemeState(savedAgeTheme);
    }
  }, []);

  useEffect(() => {
    // Update document classes and dark mode state
    const root = document.documentElement;
    const body = document.body;

    // Remove all theme classes
    root.classList.remove('dark', 'light');
    body.classList.remove('theme-early', 'theme-late', 'theme-middle', 'theme-high');

    // Determine if dark mode should be active
    let shouldBeDark = false;
    if (theme === 'dark') {
      shouldBeDark = true;
    } else if (theme === 'auto') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Apply theme classes
    root.classList.add(shouldBeDark ? 'dark' : 'light');
    setIsDark(shouldBeDark);

    // Apply age theme
    if (ageTheme !== 'default') {
      body.classList.add(`theme-${ageTheme}`);
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', shouldBeDark ? '#1f2937' : '#ffffff');
    }
  }, [theme, ageTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setAgeTheme = (newAgeTheme: AgeTheme) => {
    setAgeThemeState(newAgeTheme);
    localStorage.setItem('ageTheme', newAgeTheme);
  };

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setIsDark(mediaQuery.matches);
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    ageTheme,
    setTheme,
    setAgeTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
