import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page, { generateMetadata } from './page';

vi.mock('@/lib/utils/parse-interview-questions', () => ({
  parseInterviewQuestions: vi.fn(() => []),
}));

vi.mock('./InterviewClientPage', () => ({
  InterviewClientPage: () => <div data-testid="client-page" />,
}));

describe('InterviewQuestionsPage', () => {
  it('renders the correct heading and PDF link', () => {
    render(<Page />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('React Interview Questions');
    
    const pdfLink = screen.getByRole('link', { name: /download pdf/i });
    expect(pdfLink).toHaveAttribute('href', '/api/interview-pdf');
    expect(pdfLink).toHaveAttribute('download');
  });

  it('generates correct metadata', () => {
    const metadata = generateMetadata();
    expect(metadata.title).toBe('React Interview Questions');
    expect(metadata.description).not.toBe('');
    expect(metadata.openGraph?.title).toBe('React Interview Questions');
  });
});
