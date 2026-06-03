import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuickAccess } from './QuickAccess';

describe('QuickAccess', () => {
  it('renders the five quick-access cards with correct hrefs and accessible names', () => {
    render(<QuickAccess />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);

    const expectedLinks = [
      { href: '/resume', label: 'Resume' },
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/education', label: 'Education' },
      { href: '/contact', label: 'Contact' },
      { href: '/portfolio', label: 'Featured Work' },
    ];

    expectedLinks.forEach((expected) => {
      const linkElement = screen.getByRole('link', { name: expected.label });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', expected.href);
    });
  });

  it('each card link has a non-empty accessible name', () => {
    render(<QuickAccess />);
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAccessibleName();
    });
  });
});
