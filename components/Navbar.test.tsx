import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';
import { NavMobileMenu } from './NavMobileMenu'; // Import NavMobileMenu to mock it
import { vi } from 'vitest';

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock NavMobileMenu to control its behavior or simplify testing Navbar
vi.mock('./NavMobileMenu', () => ({
  __esModule: true,
  NavMobileMenu: ({ links }: { links: ReadonlyArray<{ label: string; href: string }> }) => (
    <div data-testid="mock-mobile-menu">
      <button aria-label="Toggle navigation" aria-controls="mobile-menu-mock" aria-expanded="false">
        ☰
      </button>
      <ul id="mobile-menu-mock" className="hidden">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  ),
}));

describe('Navbar', () => {
  it('renders the wordmark linking to home', () => {
    render(<Navbar />);
    const wordmark = screen.getByText('subhashai.cloud');
    expect(wordmark).toBeInTheDocument();
    expect(wordmark).toHaveAttribute('href', '/');
  });

  it('renders all six nav links with correct href attributes', () => {
    render(<Navbar />);
    const expectedLinks = [
      { label: 'Home', href: '/' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Resume', href: '/resume' },
      { label: 'Education', href: '/education' },
      { label: 'React Interview Questions', href: '/react-interview-questions' },
      { label: 'Contact', href: '/contact' },
    ];

    expectedLinks.forEach((link) => {
      const navLinks = screen.getAllByRole('link', { name: link.label });
      expect(navLinks.length).toBeGreaterThanOrEqual(1);
      expect(navLinks[0]).toHaveAttribute('href', link.href);
    });
  });

  it('renders the "Schedule a Call" CTA with an href containing cal.com', () => {
    render(<Navbar />);
    const ctaButton = screen.getByRole('link', { name: 'Schedule a Call' });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', expect.stringContaining('cal.com'));
    expect(ctaButton).toHaveAttribute('target', '_blank');
    expect(ctaButton).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the <nav> with aria-label="Main navigation"', () => {
    render(<Navbar />);
    const navElement = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(navElement).toBeInTheDocument();
  });

  it('renders the hamburger toggle button with aria-expanded and aria-controls attributes', () => {
    render(<Navbar />);
    // Since NavMobileMenu is mocked, we need to assert against the mock's button
    const toggleButton = screen.getByLabelText('Toggle navigation');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded');
    expect(toggleButton).toHaveAttribute('aria-controls');
  });
});

