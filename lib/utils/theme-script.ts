export const THEME_SCRIPT = `
  (function() {
    const themeKey = 'theme';
    const storedTheme = localStorage.getItem(themeKey);
    let initialTheme = 'light';

    if (storedTheme) {
      initialTheme = storedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
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
