import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavMobileMenu } from './NavMobileMenu';
import { vi } from 'vitest';

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => (
    <a href={href} onClick={onClick}>{children}</a>
  ),
}));

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
    
    const menuContainer = screen.getByRole('list').parentElement;
    expect(menuContainer).toHaveClass('hidden'); // Initially hidden
  });

  it('toggles the menu open and closed', () => {
    render(<NavMobileMenu links={mockLinks} />);
    const toggleButton = screen.getByLabelText('Toggle navigation');
    const menuContainer = screen.getByRole('list').parentElement;

    // Open menu
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(menuContainer).not.toHaveClass('hidden'); // Menu should be visible

    // Close menu
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuContainer).toHaveClass('hidden'); // Menu should be hidden
  });

  it('closes the menu when a link is clicked', () => {
    render(<NavMobileMenu links={mockLinks} />);
    const toggleButton = screen.getByLabelText('Toggle navigation');
    const menuContainer = screen.getByRole('list').parentElement;

    fireEvent.click(toggleButton); // Open the menu
    expect(menuContainer).not.toHaveClass('hidden');

    const firstLink = screen.getByRole('link', { name: 'Test Link 1' });
    fireEvent.click(firstLink); // Click a link

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuContainer).toHaveClass('hidden'); // Menu should be hidden after link click
  });
});
