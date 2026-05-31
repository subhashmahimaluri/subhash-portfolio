import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { ThemeToggle } from './ThemeToggle';
import React from 'react';

describe('ThemeToggle', () => {
  let docElement: HTMLElement;

  beforeEach(() => {
    // Reset document.documentElement and localStorage before each test
    docElement = document.documentElement;
    docElement.dataset.theme = '';
    docElement.classList.remove('dark');
    window.localStorage.clear();

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
    window.localStorage.clear();
  });

  it('renders null before mount (hydration guard)', () => {
    const html = renderToString(<ThemeToggle />);
    expect(html).toBe('');
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
