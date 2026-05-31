import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrustedBy } from './TrustedBy';

describe('TrustedBy', () => {
  it('asserts all six organisation names appear', () => {
    render(<TrustedBy />);

    const expectedOrganisations = [
      'Telstra',
      'NTT Data',
      'Emirates NBD',
      'Deloitte',
      'HSBC',
      'DXC Technology',
    ];

    expectedOrganisations.forEach((org) => {
      expect(screen.getByText(org)).toBeInTheDocument();
    });
  });

  it('renders the correct number of organisation spans', () => {
    render(<TrustedBy />);
    const orgSpans = screen.getAllByText(/Telstra|NTT Data|Emirates NBD|Deloitte|HSBC|DXC Technology/);
    expect(orgSpans).toHaveLength(6);
  });
});
