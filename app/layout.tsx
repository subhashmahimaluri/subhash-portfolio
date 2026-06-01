import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import React from 'react';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ThemeScript } from '@/components/theme/ThemeScript';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['600', '700', '800'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3005';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Subhash Mahimaluri - Principal Software Engineer';
const titleDefault = 'Subhash Mahimaluri - Principal Software Engineer';
const titleTemplate = '%s | Subhash Mahimaluri';
const description = 'Principal Software Engineer with 15+ years of experience across React, Next.js, TypeScript, Node.js, AI/LLM, and cloud technologies. Explore my work and expertise.';
const ogImage = '/og-image.jpg';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} data-theme="dark">
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AmbientBackground />
        <a className="skip-link" href="#main">Skip to main content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
