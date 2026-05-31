'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

interface NavMobileMenuProps {
  links: ReadonlyArray<NavLink>;
}

export const NavMobileMenu: React.FC<NavMobileMenuProps> = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = 'mobile-menu';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="inline-flex items-center justify-center p-2 rounded-md text-navy-700 hover:text-white hover:bg-navy-600 focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:outline-none"
        aria-controls={menuId}
        aria-expanded={isOpen}
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} absolute inset-x-0 top-16 bg-white shadow-lg`}>
        <ul id={menuId} className="px-2 pt-2 pb-3 space-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-navy-700 hover:bg-navy-50 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:outline-none"
                onClick={() => setIsOpen(false)} // Close menu on link click
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
