import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders the label text', () => {
    render(<Chip label="TypeScript" />);
    expect(screen.getByRole('button', { name: 'TypeScript' })).toBeInTheDocument();
  });

  it('applies the base chip class', () => {
    render(<Chip label="TypeScript" />);
    expect(screen.getByRole('button')).toHaveClass('chip');
  });

  it('applies filled variant by default', () => {
    render(<Chip label="TypeScript" />);
    expect(screen.getByRole('button')).toHaveClass('chip--filled');
  });

  it('applies outlined variant class', () => {
    render(<Chip label="TypeScript" variant="outlined" />);
    expect(screen.getByRole('button')).toHaveClass('chip--outlined');
  });

  it('is not selected by default', () => {
    render(<Chip label="TypeScript" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies selected class and aria-pressed when selected', () => {
    render(<Chip label="TypeScript" selected />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('chip--selected');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Chip label="TypeScript" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw when clicked without onClick handler', async () => {
    render(<Chip label="TypeScript" />);
    await userEvent.click(screen.getByRole('button'));
  });
});
