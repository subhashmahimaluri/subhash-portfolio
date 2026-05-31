import Link from 'next/link';
import React from 'react';

interface QuickAccessLink {
  label: string;
  href: string;
  description: string;
}

const QUICK_ACCESS_LINKS: ReadonlyArray<QuickAccessLink> = [
  { label: 'Resume', href: '/resume', description: 'Detailed professional experience and skills' },
  { label: 'Portfolio', href: '/portfolio', description: 'Showcase of projects and accomplishments' },
  { label: 'Education', href: '/education', description: 'Academic background and qualifications' },
  { label: 'Interview Prep', href: '/react-interview-questions', description: 'React interview questions and answers' },
  { label: 'Contact', href: '/contact', description: 'Get in touch for collaborations or inquiries' },
];

export function QuickAccess() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
      {QUICK_ACCESS_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-label={link.label}
          className="group relative flex flex-col justify-between p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow motion-safe:duration-300 motion-safe:ease-in-out
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-900 dark:focus-visible:ring-orange-500 focus-visible:ring-opacity-75"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-orange-500 motion-safe:transition-colors motion-safe:duration-300">
              {link.label}
            </h3>
            <span className="text-blue-900 dark:text-orange-500 group-hover:translate-x-1 motion-safe:transition-transform motion-safe:duration-300">
              →
            </span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{link.description}</p>
        </Link>
      ))}
    </div>
  );
}
