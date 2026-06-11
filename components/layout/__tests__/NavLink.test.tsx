// @vitest-environment happy-dom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavLink } from '../NavLink';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('NavLink', () => {
  it('marks the home link active on exact / match', () => {
    mockPathname.mockReturnValue('/');
    render(<NavLink href="/">Home</NavLink>);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark the home link active on a nested route', () => {
    mockPathname.mockReturnValue('/resume');
    render(<NavLink href="/">Home</NavLink>);
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('marks a section link active when pathname starts with href', () => {
    mockPathname.mockReturnValue('/resume/india');
    render(<NavLink href="/resume">Resume</NavLink>);
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute('aria-current', 'page');
  });

  it('marks a section link active on exact match', () => {
    mockPathname.mockReturnValue('/portfolio');
    render(<NavLink href="/portfolio">Portfolio</NavLink>);
    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark a section link active on a different route', () => {
    mockPathname.mockReturnValue('/contact');
    render(<NavLink href="/portfolio">Portfolio</NavLink>);
    expect(screen.getByRole('link', { name: 'Portfolio' })).not.toHaveAttribute('aria-current');
  });

  it('renders children correctly', () => {
    mockPathname.mockReturnValue('/');
    render(<NavLink href="/resume">Resume</NavLink>);
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });
});
