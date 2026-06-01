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
 * stays active on `/resume/india`). Styling comes from the global `.nav-links a`
 * rules; this only computes `aria-current`. The only client component in the
 * header — it needs `usePathname()`.
 */
export const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  );
};
