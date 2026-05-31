'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

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
        className="inline-flex items-center justify-center p-2 rounded-md text-navy-700 hover:text-white hover:bg-navy-600 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
        aria-controls={menuId}
        aria-expanded={isOpen}
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} absolute inset-x-0 top-16 bg-white shadow-lg`}>
        <ul id={menuId} className="px-2 pt-2 pb-3 space-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-navy-700 hover:bg-navy-50 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
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
