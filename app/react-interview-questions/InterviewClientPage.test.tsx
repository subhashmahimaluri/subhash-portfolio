import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InterviewClientPage } from './InterviewClientPage';
import { InterviewCategory } from '@/lib/utils/parse-interview-questions';

const mockCategories: InterviewCategory[] = [
  {
    title: 'General',
    type: 'interview',
    questions: [
      {
        question: 'Q1',
        strongAnswer: 'Strong 1',
        weakAnswer: 'Weak 1',
        redFlag: 'Red 1',
        followUps: ['F1'],
      }
    ]
  },
  {
    title: 'Coding',
    type: 'coding',
    questions: [
      {
        question: 'C1',
        answer: 'const x = 1;',
        followUp: 'F-Coding',
      }
    ]
  }
];

describe('InterviewClientPage', () => {
  it('renders filter buttons and questions', () => {
    render(<InterviewClientPage categories={mockCategories} />);
    
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /general/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /coding/i })).toBeInTheDocument();

    // Category titles render as <h2> sections ('General'/'Coding' also appear as
    // filter buttons, so scope these to the heading role).
    expect(screen.getByRole('heading', { level: 2, name: 'General' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Coding' })).toBeInTheDocument();
  });

  it('filters questions based on category selection', () => {
    render(<InterviewClientPage categories={mockCategories} />);
    
    fireEvent.click(screen.getByRole('button', { name: /general/i }));

    // Filtering to General shows only its section heading; the Coding section heading
    // is gone (its filter button persists, hence the heading-scoped query).
    expect(screen.getByRole('heading', { level: 2, name: 'General' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Coding' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /all/i }));
    expect(screen.getByRole('heading', { level: 2, name: 'Coding' })).toBeInTheDocument();
  });

  it('toggles question expansion', () => {
    render(<InterviewClientPage categories={mockCategories} />);
    
    const trigger = screen.getByRole('button', { name: /Q1/i });
    const panelId = trigger.getAttribute('aria-controls');
    const panel = document.getElementById(panelId!);
    
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveClass('hidden');
    
    fireEvent.click(trigger);
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveClass('hidden');
    
    fireEvent.click(trigger);
    
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveClass('hidden');
  });
});
