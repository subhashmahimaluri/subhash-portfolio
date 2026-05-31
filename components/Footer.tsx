import React from 'react';

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL ?? 'https://cal.com/subhash-mahimaluri';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-6 px-4 border-t border-gray-200 no-print">
      <div className="max-w-7xl mx-auto text-center text-gray-700 text-sm">
        <p className="mb-4">
          © {currentYear} Subhash Mahimaluri. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="https://linkedin.com/in/subhashmahimaluri"
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-700 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/subhashmahimaluri"
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-700 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
            aria-label="GitHub profile"
          >
            GitHub
          </a>
          <a
            href="mailto:subhash.yexaa@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-700 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
            aria-label="Email Subhash Mahimaluri"
          >
            Email
          </a>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-700 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
            aria-label="Schedule a call"
          >
            Schedule a Call
          </a>
        </div>
      </div>
    </footer>
  );
};
