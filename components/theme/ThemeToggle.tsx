'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/types/theme';

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    let initialTheme: Theme = 'dark';

    if (storedTheme === 'light' || storedTheme === 'dark') {
      initialTheme = storedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      initialTheme = 'light';
    }

    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.dataset.theme = newTheme;
      return newTheme;
    });
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-[var(--r-pill)] bg-[var(--bg-soft)] text-[var(--text)] shadow-[var(--shadow-md)] transition-[var(--ease)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};
