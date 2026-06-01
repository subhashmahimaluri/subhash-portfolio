import React from 'react';

export const ThemeScript = () => {
  const script = `
    (function() {
      try {
        var storedTheme = localStorage.getItem('theme');
        var theme = 'dark';
        if (storedTheme === 'light' || storedTheme === 'dark') {
          theme = storedTheme;
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          theme = 'light';
        }
        document.documentElement.dataset.theme = theme;
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
};
