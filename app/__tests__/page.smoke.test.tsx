import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';

describe('HomePage Smoke Test', () => {
  it('renders the main content and heading', () => {
    render(<HomePage />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();

    const headingElement = screen.getByRole('heading', { level: 1, name: /Subhash Mahimaluri/i });
    expect(headingElement).toBeVisible();
  });
});
