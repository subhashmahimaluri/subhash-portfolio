import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders the label text', () => {
    render(<Badge label="Open Source" />);
    expect(screen.getByText('Open Source')).toBeInTheDocument();
  });

  it('applies the default variant class when no variant is given', () => {
    const { container } = render(<Badge label="Default" />);
    expect(container.firstChild).toHaveClass('badge--default');
  });

  it('applies the success variant class', () => {
    const { container } = render(<Badge label="Passing" variant="success" />);
    expect(container.firstChild).toHaveClass('badge--success');
  });

  it('applies the warning variant class', () => {
    const { container } = render(<Badge label="Partial" variant="warning" />);
    expect(container.firstChild).toHaveClass('badge--warning');
  });

  it('applies the danger variant class', () => {
    const { container } = render(<Badge label="Failed" variant="danger" />);
    expect(container.firstChild).toHaveClass('badge--danger');
  });

  it('renders the dot element when dot is true', () => {
    const { container } = render(<Badge label="Live" dot />);
    expect(container.querySelector('.badge__dot')).toBeInTheDocument();
  });

  it('does not render the dot element when dot is false', () => {
    const { container } = render(<Badge label="Static" dot={false} />);
    expect(container.querySelector('.badge__dot')).toBeNull();
  });

  it('sets aria-label from the label prop', () => {
    render(<Badge label="Open Source" />);
    expect(screen.getByRole('generic', { name: 'Open Source' })).toBeInTheDocument();
  });

  it('hides the dot from assistive technology', () => {
    const { container } = render(<Badge label="Live" dot />);
    expect(container.querySelector('.badge__dot')).toHaveAttribute('aria-hidden', 'true');
  });
});
