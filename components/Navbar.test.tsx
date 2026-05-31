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
      const navLink = screen.getByRole('link', { name: link.label });
      expect(navLink).toBeInTheDocument();
      expect(navLink).toHaveAttribute('href', link.href);
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

// Test NavMobileMenu specifically
describe('NavMobileMenu', () => {
  const mockLinks = [
    { label: 'Test Link 1', href: '/test1' },
    { label: 'Test Link 2', href: '/test2' },
  ];

  it('renders the toggle button with correct aria attributes initially closed', () => {
    render(<NavMobileMenu links={mockLinks} />);
    const toggleButton = screen.getByLabelText('Toggle navigation');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(screen.getByRole('list')).toHaveClass('hidden'); // Initially hidden
  });

  it('toggles the menu open and closed', () => {
    render(<NavMobileMenu links={mockLinks} />);
    const toggleButton = screen.getByLabelText('Toggle navigation');
    const menuList = screen.getByRole('list');

    // Open menu
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(menuList).not.toHaveClass('hidden'); // Menu should be visible

    // Close menu
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuList).toHaveClass('hidden'); // Menu should be hidden
  });

  it('closes the menu when a link is clicked', () => {
    render(<NavMobileMenu links={mockLinks} />);
    const toggleButton = screen.getByLabelText('Toggle navigation');
    const menuList = screen.getByRole('list');

    fireEvent.click(toggleButton); // Open the menu
    expect(menuList).not.toHaveClass('hidden');

    const firstLink = screen.getByRole('link', { name: 'Test Link 1' });
    fireEvent.click(firstLink); // Click a link

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuList).toHaveClass('hidden'); // Menu should be hidden after link click
  });
});
