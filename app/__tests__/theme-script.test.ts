import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// The THEME_SCRIPT is copied here for testing purposes. In a real app, you might import it if it's exported.
// For this test, we're replicating the script content as per AC8.
const THEME_SCRIPT = `
  (function() {
    const themeKey = 'theme';
    const storedTheme = localStorage.getItem(themeKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let initialTheme = 'light';

    if (storedTheme) {
      initialTheme = storedTheme;
    } else if (prefersDark) {
      initialTheme = 'dark';
    }

    document.documentElement.dataset.theme = initialTheme;
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })();
`;

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
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  const runScript = () => {
    const script = document.createElement('script');
    script.innerHTML = THEME_SCRIPT;
    document.body.appendChild(script);
    document.body.removeChild(script); // Clean up
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
