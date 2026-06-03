import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import React from 'react';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ThemeScript } from '@/components/theme/ThemeScript';
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  AUTHOR_NAME,
  SOCIAL_LINKS,
} from '@/lib/config/site';

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

const siteUrl = SITE_URL;
const siteName = SITE_NAME;
const titleDefault = SITE_TITLE;
const titleTemplate = '%s | Subhash Mahimaluri';
const description = SITE_DESCRIPTION;
const ogImage = '/og-image.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleDefault,
    template: titleTemplate,
  },
  description: description,
  applicationName: siteName,
  authors: [{ name: AUTHOR_NAME, url: siteUrl }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  keywords: [
    'Subhash Mahimaluri',
    'Solution Architect',
    'React Architect',
    'Frontend Lead',
    'Next.js',
    'React Native',
    'TypeScript',
    'AI Engineer',
    'LLM',
    'RAG',
    'Agentic Architecture',
    'Cloud Architecture',
    'AWS',
    'Azure',
  ],
  alternates: { canonical: siteUrl },
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: AUTHOR_NAME,
      url: siteUrl,
      jobTitle: 'Solution Architect, React Architect & AI Engineer',
      email: `mailto:${SOCIAL_LINKS.email}`,
      sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github],
      knowsAbout: [
        'React',
        'Next.js',
        'React Native',
        'TypeScript',
        'Node.js',
        'AI/LLM Systems',
        'Agentic Architecture',
        'Cloud Architecture',
        'AWS',
        'Azure',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: description,
      publisher: { '@id': `${siteUrl}/#person` },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AmbientBackground />
        <a className="skip-link" href="#main">Skip to main content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
