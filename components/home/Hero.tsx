import Link from 'next/link';
import React from 'react';

const ROLE_SUBTITLE = 'Senior Software Architect & Consultant';
const TWO_SENTENCE_BIO =
  'Driving digital transformation with expertise in cloud, AI, and scalable systems. Passionate about building robust, high-performance applications.';

export function Hero() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://cal.com/subhash-mahimaluri';

  return (
    <div className="text-center py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 motion-safe:animate-fade-in">
        Subhash Mahimaluri
      </h1>
      <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6 font-medium motion-safe:animate-fade-in-delay-1">
        {ROLE_SUBTITLE}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto motion-safe:animate-fade-in-delay-2">
        {TWO_SENTENCE_BIO}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 motion-safe:animate-fade-in-delay-3">
        <Link
          href="/resume"
          aria-label="View resume"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md
                     text-white bg-blue-900 hover:bg-blue-800 dark:bg-orange-500 dark:hover:bg-orange-600
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-900 dark:focus-visible:ring-orange-500 focus-visible:ring-opacity-75
                     motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-in-out"
        >
          View Resume
        </Link>
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Schedule a call"
          className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md
                     text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-900 dark:focus-visible:ring-orange-500 focus-visible:ring-opacity-75
                     motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-in-out"
        >
          Schedule a Call
        </a>
      </div>
    </div>
  );
}
