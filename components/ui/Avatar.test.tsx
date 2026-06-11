import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders with img role and the name as accessible label', () => {
    render(<Avatar name="Alice Johnson" />);
    expect(screen.getByRole('img', { name: 'Alice Johnson' })).toBeInTheDocument();
  });

  it('renders initials for a two-word name', () => {
    render(<Avatar name="Alice Johnson" />);
    expect(screen.getByText('AJ')).toBeInTheDocument();
  });

  it('renders a single initial for a one-word name', () => {
    render(<Avatar name="Alice" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('initials span is decorative (aria-hidden)', () => {
    const { container } = render(<Avatar name="Alice Johnson" />);
    expect(container.querySelector('.avatar__initials')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the md size class by default', () => {
    const { container } = render(<Avatar name="Alice Johnson" />);
    expect(container.firstChild).toHaveClass('avatar--md');
  });

  it('applies the sm size class when size is sm', () => {
    const { container } = render(<Avatar name="Alice Johnson" size="sm" />);
    expect(container.firstChild).toHaveClass('avatar--sm');
  });

  it('renders an img element when src is provided', () => {
    const { container } = render(<Avatar name="Alice Johnson" src="/alice.jpg" />);
    expect(container.querySelector('img')).toHaveAttribute('alt', 'Alice Johnson');
  });

  // BUG: initials logic uses first + last word — "A B C" → "AC", not "AB"
  it('uses first and second word for three-word names', () => {
    render(<Avatar name="Alice B Johnson" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });
});
