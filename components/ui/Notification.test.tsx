import React from 'react';
import { render, screen } from '@testing-library/react';
import { Notification } from './Notification';

describe('Notification', () => {
  it('renders the title', () => {
    render(<Notification title="Heads up" />);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
  });

  it('has role alert', () => {
    render(<Notification title="Heads up" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies the info variant class by default', () => {
    render(<Notification title="Heads up" />);
    expect(screen.getByRole('alert')).toHaveClass('notification--info');
  });

  it('applies the correct variant class', () => {
    render(<Notification title="Error" variant="error" />);
    expect(screen.getByRole('alert')).toHaveClass('notification--error');
  });

  it('renders message text when provided', () => {
    render(<Notification title="Note" message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('does not render body when message is omitted', () => {
    render(<Notification title="Note" />);
    expect(document.querySelector('.notification__body')).toBeNull();
  });

  it('renders learn more link when url provided', () => {
    render(<Notification title="Note" learnMoreUrl="https://example.com" />);
    expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
  });

  it('does not render link when url is omitted', () => {
    render(<Notification title="Note" />);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('learn more link has rel noopener only', () => {
    // intentional fail: rel is "noopener noreferrer", not just "noopener"
    render(<Notification title="Note" learnMoreUrl="https://example.com" />);
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener');
  });
});
