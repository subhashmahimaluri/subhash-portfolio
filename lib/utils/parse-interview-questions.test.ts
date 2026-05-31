import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import { parseInterviewQuestions } from '@/lib/utils/parse-interview-questions';

vi.mock('node:fs');

describe('parseInterviewQuestions', () => {
  it('correctly parses mixed interview and coding categories', () => {
    const mockContent = `
## Behavior
1. You ask: Question 1
Strong answer: Good
Weak answer: Bad
Red flag: Dangerous
Follow-ups: Q1? Q2?

## Coding Challenge
1. You ask: Code 1
Answer: Logic
Follow-up: Opt

⸻

2. You ask: Code 2
Continuation
Answer: Solution
`;
    vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

    const result = parseInterviewQuestions();

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Behavior');
    expect(result[0].type).toBe('interview');
    expect(result[1].type).toBe('coding');

    const interviewCategory = result[0] as any;
    expect(interviewCategory.questions[0].question).toBe('Question 1');
    expect(interviewCategory.questions[0].strongAnswer).toBe('Good');
    expect(interviewCategory.questions[0].weakAnswer).toBe('Bad');
    expect(interviewCategory.questions[0].redFlag).toBe('Dangerous');
    expect(interviewCategory.questions[0].followUps).toEqual(['Q1?', 'Q2?']);
    
    const codingCategory = result[1] as any;
    expect(codingCategory.questions).toHaveLength(2);
    expect(codingCategory.questions[0].question).toBe('Code 1');
    expect(codingCategory.questions[0].answer).toBe('Logic');
    expect(codingCategory.questions[0].followUp).toBe('Opt');
    expect(codingCategory.questions[1].question).toBe('Code 2 Continuation');
  });

  it('handles multi-line continuation with spaces', () => {
    const mockContent = `
## Test
1. You ask: Line 1
Line 2
Answer: Ans 1
Ans 2
`;
    vi.mocked(fs.readFileSync).mockReturnValue(mockContent);
    const result = parseInterviewQuestions();
    const q = result[0].questions[0] as any;
    expect(q.question).toBe('Line 1 Line 2');
    expect(q.answer).toBe('Ans 1 Ans 2');
  });

  it('is case-insensitive for coding type detection', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('## Some CODING stuff\n1. You ask: Q\nAnswer: A');
    const result = parseInterviewQuestions();
    expect(result[0].type).toBe('coding');
  });

  it('ignores separators and blank lines without creating spurious questions', () => {
    const mockContent = `
## Cat
1. You ask: Q1
Answer: A1

⸻


⸻
`;
    vi.mocked(fs.readFileSync).mockReturnValue(mockContent);
    const result = parseInterviewQuestions();
    expect(result[0].questions).toHaveLength(1);
  });

  it('includes the trailing question at EOF', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('## Cat\n1. You ask: Last\nAnswer: Final');
    const result = parseInterviewQuestions();
    expect(result[0].questions[0].question).toBe('Last');
  });
});
