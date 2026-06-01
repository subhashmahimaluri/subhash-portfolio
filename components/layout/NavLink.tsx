'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

/**
 * Nav anchor that marks itself as the active page. The home link matches only
 * an exact `/`; section links also match their nested routes (e.g. `/resume`
 * stays active on `/resume/india`). This is the only client component in the
 * header — it needs `usePathname()` to compute `aria-current`.
 */
export const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className="rounded-[var(--r-sm)] text-[var(--text-soft)] transition-colors hover:text-[var(--text-faint)] aria-[current=page]:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      {children}
    </Link>
  );
};
