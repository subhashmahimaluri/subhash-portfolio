// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import React from 'react';

describe('ThemeToggle', () => {
  let docElement: HTMLElement;

  beforeEach(() => {
    docElement = document.documentElement;
    docElement.dataset.theme = '';
    window.localStorage.clear();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: query === '(prefers-color-scheme: light)' ? false : false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('initializes to dark mode by default if no localStorage and no prefers-light', async () => {
    render(<ThemeToggle />);
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(docElement.dataset.theme).toBe('dark');
    });
  });

  it('initializes to light mode if localStorage is "light"', async () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(docElement.dataset.theme).toBe('light');
    });
  });

  it('clicking flips the data attribute and aria-pressed, second click restores', async () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toHaveAttribute('aria-pressed', 'true');
      
      fireEvent.click(button);
      expect(localStorage.getItem('theme')).toBe('light');
      expect(docElement.dataset.theme).toBe('light');
      expect(button).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(button);
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(docElement.dataset.theme).toBe('dark');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
