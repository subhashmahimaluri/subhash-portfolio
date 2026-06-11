import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders the label', () => {
    render(<Chip label="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('applies md size class by default', () => {
    const { container } = render(<Chip label="React" />);
    expect(container.firstChild).toHaveClass('chip--md');
  });

  it('applies sm size class when size is sm', () => {
    const { container } = render(<Chip label="React" size="sm" />);
    expect(container.firstChild).toHaveClass('chip--sm');
  });

  it('does not render a remove button when onRemove is not provided', () => {
    render(<Chip label="React" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders a remove button when onRemove is provided', () => {
    render(<Chip label="React" onRemove={() => {}} />);
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
  });

  it('calls onRemove when the remove button is clicked', async () => {
    const onRemove = vi.fn();
    render(<Chip label="React" onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('remove button aria-label includes the chip label', () => {
    render(<Chip label="TypeScript" onRemove={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Remove TypeScript');
  });
});
