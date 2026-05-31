import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { QuickAccess } from '@/components/home/QuickAccess';
import { CoreExpertise } from '@/components/home/CoreExpertise';
import { TrustedBy } from '@/components/home/TrustedBy';
import React from 'react';

export const generateMetadata = (): Metadata => {
  const description =
    'Personal portfolio and resume for Subhash Mahimaluri, showcasing expertise in cloud-native platforms, AI, and modern web development.';

  return {
    title: 'Home',
    description: description,
    openGraph: {
      title: 'Subhash Mahimaluri - Home',
      description: description,
      type: 'website',
      url: 'https://www.subhashmahimaluri.com/', // Replace with actual site URL
    },
  };
};

export default function HomePage() {
  return (
    <main role="main" className="flex min-h-screen flex-col items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <section aria-label="Hero" className="w-full py-16">
        <Hero />
      </section>

      <section aria-label="Quick access" className="w-full py-16 bg-white dark:bg-gray-900 shadow-inner">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">Quick Access</h2>
          <QuickAccess />
        </div>
      </section>

      <section aria-label="Core expertise" className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">Core Expertise</h2>
          <CoreExpertise />
        </div>
      </section>

      <section aria-label="Trusted by" className="w-full py-16 bg-white dark:bg-gray-900 shadow-inner">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">Trusted By</h2>
          <TrustedBy />
        </div>
      </section>
    </main>
  );
}
