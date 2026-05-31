import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuickAccess } from './QuickAccess';

describe('QuickAccess', () => {
  it('renders at least five Link cards with correct hrefs and accessible names', () => {
    render(<QuickAccess />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(5);

    const expectedLinks = [
      { href: '/resume', label: 'Resume' },
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/education', label: 'Education' },
      { href: '/react-interview-questions', label: 'Interview Prep' },
      { href: '/contact', label: 'Contact' },
    ];

    expectedLinks.forEach((expected) => {
      const linkElement = screen.getByRole('link', { name: expected.label });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', expected.href);
      expect(linkElement).toHaveAccessibleName(expected.label);
    });
  });

  it('each card has a non-empty accessible name', () => {
    render(<QuickAccess />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAccessibleName();
    });
  });
});
