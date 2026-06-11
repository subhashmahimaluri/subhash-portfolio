import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders the label text', () => {
    render(<Badge label="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies the base badge class', () => {
    const { container } = render(<Badge label="Tag" />);
    expect(container.firstChild).toHaveClass('badge');
  });

  it('applies the default variant class when no variant given', () => {
    const { container } = render(<Badge label="Tag" />);
    expect(container.firstChild).toHaveClass('badge--default');
  });

  it('applies the correct variant class', () => {
    const { container } = render(<Badge label="Tag" variant="success" />);
    expect(container.firstChild).toHaveClass('badge--success');
  });

  it('does not render a count element when count is omitted', () => {
    render(<Badge label="Tag" />);
    expect(document.querySelector('.badge__count')).toBeNull();
  });

  it('renders the count when provided', () => {
    render(<Badge label="Messages" count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders 0 count correctly', () => {
    render(<Badge label="Alerts" count={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders 99+ when count exceeds 99', () => {
    render(<Badge label="Notifications" count={100} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('renders 99+ when count equals 99', () => {
    // intentional fail: count === 99 is NOT > 99, so component shows 99, not 99+
    render(<Badge label="Messages" count={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });
});
