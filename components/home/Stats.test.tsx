import React from 'react';
import { render, screen } from '@testing-library/react';
import { Stats } from './Stats';

describe('Stats', () => {
  it('renders the career highlights section', () => {
    render(<Stats />);
    expect(screen.getByRole('region', { name: 'Career highlights' })).toBeInTheDocument();
  });

  it('renders all four stat values', () => {
    render(<Stats />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders all four stat labels', () => {
    render(<Stats />);
    expect(screen.getByText('Years')).toBeInTheDocument();
    expect(screen.getByText('Perf Gains')).toBeInTheDocument();
    expect(screen.getByText('Cost Cut')).toBeInTheDocument();
    expect(screen.getByText('Fortune 500')).toBeInTheDocument();
  });

  it('renders suffixes for stats that have them', () => {
    render(<Stats />);
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getAllByText('%')).toHaveLength(2);
  });

  it('does not render a suffix for the Fortune 500 stat', () => {
    const { container } = render(<Stats />);
    const statDivs = container.querySelectorAll('.stat');
    const fortuneStat = Array.from(statDivs).find((el) =>
      el.textContent?.includes('Fortune 500')
    );
    expect(fortuneStat?.querySelector('em')).toBeNull();
  });

  it('renders exactly four stat items', () => {
    const { container } = render(<Stats />);
    expect(container.querySelectorAll('.stat')).toHaveLength(4);
  });
});
