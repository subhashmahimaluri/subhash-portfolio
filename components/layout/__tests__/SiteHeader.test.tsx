// @vitest-environment happy-dom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SiteHeader } from '../SiteHeader';

// Mock usePathname for NavLink
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock ThemeToggle since it's a separate component
vi.mock('@/components/theme/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

describe('SiteHeader', () => {
  it('renders the brand correctly', () => {
    render(<SiteHeader />);
    const brand = screen.getByRole('link', { name: /subhashai\.cloud/i });
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveAttribute('href', '/');
    expect(brand).toHaveClass('brand');
  });

  it('renders all 5 nav links with correct hrefs', () => {
    render(<SiteHeader />);
    
    const links = [
      { name: /home/i, href: '/' },
      { name: /portfolio/i, href: '/portfolio' },
      { name: /resume/i, href: '/resume' },
      { name: /education/i, href: '/education' },
      { name: /contact/i, href: '/contact' },
    ];

    links.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('renders the "Schedule a Call" CTA with correct attributes', () => {
    render(<SiteHeader />);
    const cta = screen.getByRole('link', { name: /schedule a call/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', 'https://cal.com/subhashmt');
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
    expect(cta).toHaveClass('btn', 'btn-navy', 'btn-sm');
  });

  it('renders the theme toggle', () => {
    render(<SiteHeader />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });
});
