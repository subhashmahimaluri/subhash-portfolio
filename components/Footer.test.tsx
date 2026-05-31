import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { vi } from 'vitest';

describe('Footer', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2023, 0, 1)); // Set a fixed date for consistent year
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('renders the copyright text with the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Subhash Mahimaluri. All rights reserved.`)).toBeInTheDocument();
  });

  it('renders four external links with correct attributes', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);

    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders the LinkedIn link with the correct href', () => {
    render(<Footer />);
    const linkedInLink = screen.getByLabelText('LinkedIn profile');
    expect(linkedInLink).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
  });

  it('renders the GitHub link with the correct href', () => {
    render(<Footer />);
    const githubLink = screen.getByLabelText('GitHub profile');
    expect(githubLink).toHaveAttribute('href', expect.stringContaining('github.com'));
  });

  it('renders the Email link with the correct href', () => {
    render(<Footer />);
    const emailLink = screen.getByLabelText('Email Subhash Mahimaluri');
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:subhash.yexaa@gmail.com'));
  });

  it('renders the Schedule a Call link with the correct href', () => {
    render(<Footer />);
    const scheduleCallLink = screen.getByLabelText('Schedule a call');
    expect(scheduleCallLink).toHaveAttribute('href', expect.stringContaining('cal.com'));
  });
});
