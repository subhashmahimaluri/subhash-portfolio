import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f2f7',
          100: '#b3e1ed',
          200: '#80cadd',
          300: '#4db3cb',
          400: '#269ec0',
          500: '#0089b6',
          600: '#003366', // brand anchor
          700: '#002b55',
          800: '#002244',
          900: '#001a33',
          950: '#001326',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffeccc',
          200: '#ffc999',
          300: '#ffa566',
          400: '#ff8233',
          500: '#f97316', // brand anchor
          600: '#e06614',
          700: '#c75a12',
          800: '#ae4e10',
          900: '#96420e',
          950: '#7d350b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
