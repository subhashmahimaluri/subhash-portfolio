import Link from 'next/link';
import { NavMobileMenu } from '@/components/NavMobileMenu';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: ReadonlyArray<NavLink> = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Resume', href: '/resume' },
  { label: 'Education', href: '/education' },
  { label: 'React Interview Questions', href: '/react-interview-questions' },
  { label: 'Contact', href: '/contact' },
];

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL ?? 'https://cal.com/subhash-mahimaluri';

export const Navbar = () => {
  return (
    <header role="banner" className="bg-white py-4 px-4 shadow-md no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-navy-700 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none">
          subhashai.cloud
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden sm:block">
          <ul className="flex space-x-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-navy-700 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 px-4 py-2 bg-orange-500 text-navy-900 rounded-md hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
              >
                Schedule a Call
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <NavMobileMenu links={NAV_LINKS} />
      </div>
    </header>
  );
};
