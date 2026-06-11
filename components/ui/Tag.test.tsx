import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders the label text', () => {
    render(<Tag label="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('applies the base tag class', () => {
    const { container } = render(<Tag label="React" />);
    expect(container.firstChild).toHaveClass('tag');
  });

  it('applies the default variant class when no variant given', () => {
    const { container } = render(<Tag label="React" />);
    expect(container.firstChild).toHaveClass('tag--default');
  });

  it('applies the correct variant class', () => {
    const { container } = render(<Tag label="React" variant="blue" />);
    expect(container.firstChild).toHaveClass('tag--blue');
  });

  it('does not render a dismiss button when onDismiss is omitted', () => {
    render(<Tag label="React" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders a dismiss button when onDismiss is provided', () => {
    render(<Tag label="React" onDismiss={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const onDismiss = vi.fn();
    render(<Tag label="React" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismiss button aria-label says Remove <label>', () => {
    render(<Tag label="TypeScript" onDismiss={() => {}} />);
    expect(screen.getByRole('button', { name: 'Remove TypeScript' })).toBeInTheDocument();
  });
});
