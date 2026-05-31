'use client';

import React, { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme: Theme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.dataset.theme = newTheme;
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      aria-label={label}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-800 shadow-lg ring-offset-slate-50 transition-colors duration-200 hover:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:ring-offset-slate-900 dark:hover:bg-slate-600"
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m4.93 19.07 1.41-1.41" />
          <path d="m17.66 6.34 1.41-1.41" />
        </svg>
      )}
    </button>
  );
};
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import React from 'react';

describe('ThemeToggle', () => {
  let docElement: HTMLElement;

  beforeEach(() => {
    // Reset document.documentElement and localStorage before each test
    docElement = document.documentElement;
    docElement.dataset.theme = '';
    docElement.classList.remove('dark');
    docElement.classList.remove('light'); // Ensure no stray classes
    localStorage.clear();

    // Mock window.matchMedia to default to light
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders null before mount (hydration guard)', () => {
    const { container } = render(<ThemeToggle />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a button after mount', async () => {
    render(<ThemeToggle />);
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  it('initializes to light mode by default if no localStorage and no prefers-dark', async () => {
    render(<ThemeToggle />);
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(docElement.dataset.theme).toBe('light');
      expect(docElement.classList.contains('dark')).toBe(false);
    });
  });

  it('initializes to dark mode if localStorage is "dark"', async () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(docElement.dataset.theme).toBe('dark');
      expect(docElement.classList.contains('dark')).toBe(true);
    });
  });

  it('initializes to dark mode if prefers-color-scheme is dark and no localStorage', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
    render(<ThemeToggle />);
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(docElement.dataset.theme).toBe('dark');
      expect(docElement.classList.contains('dark')).toBe(true);
    });
  });

  it('clicking from light writes "dark" to localStorage and sets data-theme="dark"', async () => {
    render(<ThemeToggle />);
    await waitFor(() => {
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(docElement.dataset.theme).toBe('dark');
      expect(docElement.classList.contains('dark')).toBe(true);
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('clicking from dark restores light', async () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode'); // Initially dark
      fireEvent.click(button);
      expect(localStorage.getItem('theme')).toBe('light');
      expect(docElement.dataset.theme).toBe('light');
      expect(docElement.classList.contains('dark')).toBe(false);
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('SVG icons have aria-hidden="true"', async () => {
    render(<ThemeToggle />);
    await waitFor(() => {
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    // Toggle to dark and check again
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button'));
    });
    await waitFor(() => {
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
