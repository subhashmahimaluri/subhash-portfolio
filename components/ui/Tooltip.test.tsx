import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders the tooltip content', () => {
    render(<Tooltip content="Save file"><button>Save</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Save file');
  });

  it('renders the trigger children', () => {
    render(<Tooltip content="Save file"><button>Save</button></Tooltip>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('links trigger to tooltip via aria-describedby', () => {
    render(<Tooltip content="Save file" id="tip-save"><button>Save</button></Tooltip>);
    const trigger = screen.getByRole('button', { name: 'Save' }).closest('.tooltip-trigger');
    expect(trigger).toHaveAttribute('aria-describedby', 'tip-save');
    expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'tip-save');
  });

  it('applies top position class by default', () => {
    render(<Tooltip content="Info"><span>Hover</span></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip--top');
  });

  it('applies the given position class', () => {
    render(<Tooltip content="Info" position="bottom"><span>Hover</span></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip--bottom');
  });

  it('applies left and right position classes', () => {
    const { rerender } = render(<Tooltip content="Info" position="left"><span>x</span></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip--left');
    rerender(<Tooltip content="Info" position="right"><span>x</span></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip--right');
  });

  it('generates a stable id from content when no id prop given', () => {
    render(<Tooltip content="Delete item"><span>x</span></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'tooltip-delete-item');
  });

  // BUG: id generation lowercases but does not strip punctuation — "Save!" → "tooltip-save!"
  it('strips punctuation from the generated id', () => {
    render(<Tooltip content="Save!"><span>x</span></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'tooltip-save');
  });
});
