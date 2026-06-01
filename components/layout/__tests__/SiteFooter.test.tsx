// @vitest-environment happy-dom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SiteFooter } from '../SiteFooter';

describe('SiteFooter', () => {
  it('renders the brand text', () => {
    const { container } = render(<SiteFooter />);
    // The brand wordmark is bolded via <strong>, so the text spans two nodes —
    // assert against the paragraph's combined textContent.
    const brand = container.querySelector('.footer-brand');
    expect(brand).not.toBeNull();
    expect(brand?.textContent).toBe('subhashai.cloud · © 2026 Subhash Mahimaluri');
  });

  it('renders 4 social links with correct hrefs and attributes', () => {
    render(<SiteFooter />);
    
    const links = [
      { name: /linkedin/i, href: 'https://www.linkedin.com/in/subhash-mahimaluri' },
      { name: /github/i, href: 'https://github.com/subhashmahimaluri' },
      { name: /email/i, href: 'mailto:subhashmahimaluri@gmail.com' },
      { name: /schedule a call/i, href: 'https://cal.com/subhashmt' },
    ];

    links.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
