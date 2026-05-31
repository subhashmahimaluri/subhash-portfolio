import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the single h1 with text "Subhash Mahimaluri"', () => {
    render(<Hero />);
    const h1Element = screen.getByRole('heading', { level: 1, name: 'Subhash Mahimaluri' });
    expect(h1Element).toBeInTheDocument();
  });

  it('renders the /resume link with accessible name "View resume" and correct href', () => {
    render(<Hero />);
    const resumeLink = screen.getByRole('link', { name: 'View resume' });
    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute('href', '/resume');
  });

  it('renders the secondary anchor with https://cal.com href and noopener rel', () => {
    render(<Hero />);
    const scheduleCallLink = screen.getByRole('link', { name: 'Schedule a call' });
    expect(scheduleCallLink).toBeInTheDocument();
    expect(scheduleCallLink).toHaveAttribute('href', expect.stringContaining('https://cal.com'));
    expect(scheduleCallLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(scheduleCallLink).toHaveAttribute('target', '_blank');
  });
});
