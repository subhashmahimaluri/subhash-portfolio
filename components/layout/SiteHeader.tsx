import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { NavLink } from './NavLink';

interface NavItem {
  label: string;
  href: string;
}

const NAV_LINKS: ReadonlyArray<NavItem> = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Resume', href: '/resume' },
  { label: 'Education', href: '/education' },
  { label: 'Contact', href: '/contact' },
];

const CAL_URL = 'https://cal.com/subhashmt';

/**
 * Sticky glass-blur site header (V2 mock). Server Component — only the inner
 * {@link NavLink}s and the {@link ThemeToggle} are client components, so the
 * bulk of the header ships zero JS. Brand wordmark, primary nav, theme toggle,
 * and the "Schedule a Call" CTA.
 */
export const SiteHeader = () => {
  return (
    <header className="site-header no-print">
      <div className="container">
        <nav className="nav" aria-label="Main navigation">
          <Link className="brand" href="/" aria-label="subhashai.cloud">
            subhashai<span>.cloud</span>
          </Link>

          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <ThemeToggle />
            <a
              className="btn btn-navy btn-sm"
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Schedule a Call
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};
