import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { THEME_SCRIPT } from '@/lib/utils/theme-script';

describe('THEME_SCRIPT behavior', () => {
  let mockMatchMedia: (query: string) => { matches: boolean };
  let docElement: HTMLElement;

  beforeEach(() => {
    // Mock window.matchMedia
    mockMatchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? false : false, // Default to no dark preference
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // Mock document.documentElement
    docElement = document.documentElement;
    docElement.dataset.theme = '';
    docElement.classList.remove('dark');
    docElement.classList.remove('light'); // Ensure no stray classes

    // Clear localStorage
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  const runScript = () => {
    // Use new Function to execute the script in the current test context
    // where window and localStorage are mocked.
    new Function(THEME_SCRIPT)();
  };

  it('should default to light theme if no preference and no stored theme', () => {
    runScript();
    expect(docElement.dataset.theme).toBe('light');
    expect(docElement.classList.contains('dark')).toBe(false);
  });

  it('should set dark theme if prefers-color-scheme is dark and no stored theme', () => {
    mockMatchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? true : false,
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
    runScript();
    expect(docElement.dataset.theme).toBe('dark');
    expect(docElement.classList.contains('dark')).toBe(true);
  });

  it('should use stored theme from localStorage (dark)', () => {
    localStorage.setItem('theme', 'dark');
    runScript();
    expect(docElement.dataset.theme).toBe('dark');
    expect(docElement.classList.contains('dark')).toBe(true);
    expect(mockMatchMedia).not.toHaveBeenCalled(); // localStorage should take precedence
  });

  it('should use stored theme from localStorage (light)', () => {
    localStorage.setItem('theme', 'light');
    // Even if system prefers dark, localStorage should override
    mockMatchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? true : false,
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    runScript();
    expect(docElement.dataset.theme).toBe('light');
    expect(docElement.classList.contains('dark')).toBe(false);
    expect(mockMatchMedia).not.toHaveBeenCalled(); // localStorage should take precedence
  });

  it('should manipulate data-theme and dark class correctly', () => {
    localStorage.setItem('theme', 'dark');
    runScript();
    expect(docElement.dataset.theme).toBe('dark');
    expect(docElement.classList.contains('dark')).toBe(true);

    localStorage.setItem('theme', 'light');
    docElement.dataset.theme = ''; // Reset for next run
    docElement.classList.remove('dark');
    runScript();
    expect(docElement.dataset.theme).toBe('light');
    expect(docElement.classList.contains('dark')).toBe(false);
  });
});
