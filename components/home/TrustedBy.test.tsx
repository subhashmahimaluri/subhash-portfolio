import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrustedBy } from './TrustedBy';

const EXPECTED = ['National Grid UK', 'Shell', 'Intuit', 'TimeInc'];

describe('TrustedBy', () => {
  it('renders all four enterprise wordmarks', () => {
    render(<TrustedBy />);
    EXPECTED.forEach((org) => {
      expect(screen.getByText(org)).toBeInTheDocument();
    });
  });

  it('renders exactly four wordmarks', () => {
    const { container } = render(<TrustedBy />);
    expect(container.querySelectorAll('.wordmarks li')).toHaveLength(4);
  });
});
