import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle'; // Import ThemeToggle

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3005';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Subhash Mahimaluri - Principal Software Engineer';
const titleDefault = 'Subhash Mahimaluri - Principal Software Engineer';
const titleTemplate = '%s | Subhash Mahimaluri';
const description = 'Principal Software Engineer with 15+ years of experience across React, Next.js, TypeScript, Node.js, AI/LLM, and cloud technologies. Explore my work and expertise.';
const ogImage = '/og-image.jpg'; // Path to a default Open Graph image

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleDefault,
    template: titleTemplate,
  },
  description: description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteName,
    title: titleDefault,
    description: description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: titleDefault,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: titleDefault,
    description: description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} data-theme="light">
      <body className={`${inter.className} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} suppressHydrationWarning />
        <Navbar />
        <main>{children}</main>
        <ThemeToggle /> {/* Place ThemeToggle here to be on all pages */}
        <Footer />
      </body>
    </html>
  );
}
