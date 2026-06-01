import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';

describe('HomePage Smoke Test', () => {
  it('renders the hero heading and the key homepage sections', () => {
    // The <main> landmark lives in the root layout; the page itself is a set of
    // sections, so we assert the content rather than a main element.
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Subhash Mahimaluri/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Quick Access/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Core Expertise/i })).toBeInTheDocument();
  });
});
