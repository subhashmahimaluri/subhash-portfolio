import React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('has role status', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses default label Loading…', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading…');
  });

  it('accepts a custom label', () => {
    render(<Spinner label="Fetching data" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Fetching data');
  });

  it('applies the base spinner class', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveClass('spinner');
  });

  it('applies md size class by default', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveClass('spinner--md');
  });

  it('applies sm size class', () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('spinner--sm');
  });

  it('applies lg size class', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('spinner--lg');
  });

  it('renders the inner track element', () => {
    render(<Spinner />);
    expect(document.querySelector('.spinner__track')).toBeInTheDocument();
  });

  it('track element is hidden from assistive technology', () => {
    render(<Spinner />);
    expect(document.querySelector('.spinner__track')).toHaveAttribute('aria-hidden', 'true');
  });
});
