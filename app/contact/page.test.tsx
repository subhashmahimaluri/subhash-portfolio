import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ContactPage, { generateMetadata } from './page';

describe('Contact generateMetadata', () => {
  it('returns the Contact title and a description', () => {
    const metadata = generateMetadata();
    expect(metadata.title).toBe('Contact');
    expect(metadata.description).toBeTruthy();
  });
});

describe('ContactPage', () => {
  it('renders the main heading "Get in Touch"', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: /get in touch/i, level: 1 })).toBeDefined();
  });

  it('renders the mailto link correctly', () => {
    render(<ContactPage />);
    const emailLink = screen.getByRole('link', { name: /send an email to subhash mahimaluri/i });
    expect(emailLink.getAttribute('href')).toBe('mailto:subhash.yexaa@gmail.com');
  });

  it('renders external links with noopener noreferrer', () => {
    render(<ContactPage />);
    const linkedin = screen.getByRole('link', { name: /linkedin/i });
    const github = screen.getByRole('link', { name: /github/i });
    const cal = screen.getByRole('link', { name: /schedule a call/i });

    [linkedin, github, cal].forEach(link => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    });
    
    expect(linkedin.getAttribute('href')).toContain('linkedin.com');
    expect(github.getAttribute('href')).toContain('github.com');
    expect(cal.getAttribute('href')).toContain('cal.com');
  });

  it('renders location and availability text', () => {
    render(<ContactPage />);
    expect(screen.getByText(/melbourne, australia/i)).toBeDefined();
    expect(screen.getByText(/within 24 hours/i)).toBeDefined();
  });
});
