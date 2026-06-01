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
  { label: 'React Q&A', href: '/react-interview-questions' },
  { label: 'Contact', href: '/contact' },
];

const CAL_URL = 'https://cal.com/subhashmt';

/**
 * Sticky glass-blur site header (V2 mock). Server Component — only the inner
 * {@link NavLink}s are client components, so the bulk of the header ships zero
 * JS. Brand wordmark, primary nav, theme toggle, and the "Schedule a Call" CTA.
 */
export const SiteHeader = () => {
  return (
    <header className="site-header no-print">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-[var(--maxw)] flex-wrap items-center gap-x-[var(--s-6)] gap-y-[var(--s-3)] px-[var(--s-4)] py-[var(--s-3)]"
      >
        <Link href="/" className="brand mr-auto" aria-label="subhashai.cloud">
          subhashai<span>.cloud</span>
        </Link>

        <ul className="flex flex-wrap items-center gap-x-[var(--s-5)] gap-y-[var(--s-2)]">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>{link.label}</NavLink>
            </li>
          ))}
        </ul>

        <ThemeToggle />

        <a
          className="btn btn-navy btn-sm"
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Schedule a Call
        </a>
      </nav>
    </header>
  );
};
