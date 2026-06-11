import React from 'react';
import { render, screen } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
  it('renders the value as visible text', () => {
    render(<Counter value={5} label="Notifications" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('provides an accessible label combining label and value', () => {
    render(<Counter value={3} label="Messages" />);
    expect(screen.getByLabelText('Messages: 3')).toBeInTheDocument();
  });

  it('applies the default variant class', () => {
    const { container } = render(<Counter value={1} label="Items" />);
    expect(container.firstChild).toHaveClass('counter--default');
  });

  it('applies the given variant class', () => {
    const { container } = render(<Counter value={1} label="Items" variant="danger" />);
    expect(container.firstChild).toHaveClass('counter--danger');
  });

  it('displays the raw value when it is below max', () => {
    render(<Counter value={50} label="Score" max={99} />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('displays max+ when value exceeds max', () => {
    render(<Counter value={150} label="Score" max={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('displays max+ when value is one above max', () => {
    render(<Counter value={100} label="Score" max={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('does not cap when value equals max exactly', () => {
    render(<Counter value={99} label="Score" max={99} />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });
});
