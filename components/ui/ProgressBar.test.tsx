import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders an element with progressbar role', () => {
    render(<ProgressBar value={50} label="Loading" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow to the current value', () => {
    render(<ProgressBar value={60} label="Loading" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');
  });

  it('sets aria-valuemin to 0', () => {
    render(<ProgressBar value={50} label="Loading" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0');
  });

  it('sets aria-valuemax to the max prop', () => {
    render(<ProgressBar value={50} max={200} label="Loading" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '200');
  });

  it('defaults max to 100', () => {
    render(<ProgressBar value={50} label="Loading" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
  });

  it('does not render percentage text by default', () => {
    render(<ProgressBar value={50} label="Loading" />);
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it('renders percentage text when showPercentage is true', () => {
    render(<ProgressBar value={50} max={100} label="Upload" showPercentage />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('floors percentage to nearest integer', () => {
    render(<ProgressBar value={1} max={3} label="Steps" showPercentage />);
    expect(screen.getByText('33%')).toBeInTheDocument();
  });
});
