import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusPill } from './StatusPill';

describe('StatusPill', () => {
  it('renders default label for active status', () => {
    render(<StatusPill status="active" />);
    expect(screen.getByRole('status')).toHaveTextContent('Active');
  });

  it('renders default label for inactive status', () => {
    render(<StatusPill status="inactive" />);
    expect(screen.getByRole('status')).toHaveTextContent('Inactive');
  });

  it('renders default label for pending status', () => {
    render(<StatusPill status="pending" />);
    expect(screen.getByRole('status')).toHaveTextContent('Pending');
  });

  it('renders a custom label when provided', () => {
    render(<StatusPill status="active" label="Live" />);
    expect(screen.getByRole('status')).toHaveTextContent('Live');
  });

  it('custom label overrides the default', () => {
    render(<StatusPill status="pending" label="In Review" />);
    expect(screen.getByRole('status')).not.toHaveTextContent('Pending');
    expect(screen.getByRole('status')).toHaveTextContent('In Review');
  });

  it('applies the correct status modifier class', () => {
    render(<StatusPill status="inactive" />);
    expect(screen.getByRole('status')).toHaveClass('status-pill--inactive');
  });

  it('always carries the base class', () => {
    render(<StatusPill status="active" />);
    expect(screen.getByRole('status')).toHaveClass('status-pill');
  });
});
