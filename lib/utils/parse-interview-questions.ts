// Server-only module: the node:fs / node:path imports below make it impossible to
// bundle into a Client Component, so fs/path never leak to the client. (A 'use server'
// directive is wrong here — that marks the file as Server Actions, which must be async.)
import fs from 'node:fs';
import path from 'node:path';

export interface InterviewQuestion {
  question: string;
  strongAnswer: string | undefined;
  weakAnswer: string | undefined;
  redFlag: string | undefined;
  followUps: string[];
}

export interface CodingQuestion {
  question: string;
  answer: string | undefined;
  followUp: string | undefined;
}

export interface InterviewCategoryType {
  title: string;
  type: 'interview';
  questions: InterviewQuestion[];
}

export interface CodingCategoryType {
  title: string;
  type: 'coding';
  questions: CodingQuestion[];
}

export type InterviewCategory = InterviewCategoryType | CodingCategoryType;

type FieldKey = keyof InterviewQuestion | keyof CodingQuestion;

export function parseInterviewQuestions(): InterviewCategory[] {
  const filePath = path.join(process.cwd(), 'data', 'interview-questions.md');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const categories: InterviewCategory[] = [];
  let currentCategory: InterviewCategory | null = null;
  let currentQuestion: Partial<InterviewQuestion & CodingQuestion> | null = null;
  let currentField: FieldKey | null = null;

  const flushQuestion = () => {
    if (currentQuestion && currentCategory) {
      if (currentCategory.type === 'interview') {
        const q: InterviewQuestion = {
          question: currentQuestion.question || '',
          strongAnswer: currentQuestion.strongAnswer,
          weakAnswer: currentQuestion.weakAnswer,
          redFlag: currentQuestion.redFlag,
          followUps: currentQuestion.followUps || [],
        };
        currentCategory.questions.push(q);
      } else {
        const q: CodingQuestion = {
          question: currentQuestion.question || '',
          answer: currentQuestion.answer,
          followUp: currentQuestion.followUp,
        };
        currentCategory.questions.push(q);
      }
    }
    currentQuestion = null;
    currentField = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      flushQuestion();
      const title = trimmed.slice(3).trim();
      const type = title.toLowerCase().includes('coding') ? 'coding' : 'interview';
      currentCategory = type === 'coding' 
        ? { title, type: 'coding', questions: [] }
        : { title, type: 'interview', questions: [] };
      categories.push(currentCategory);
      continue;
    }

    if (!currentCategory) continue;

    const questionMatch = trimmed.match(/^\d+\.\s+(.*)/);
    if (questionMatch) {
      flushQuestion();
      currentQuestion = {};
      const rest = questionMatch[1].trim();
      if (rest.startsWith('You ask:')) {
        currentField = 'question';
        currentQuestion.question = rest.replace('You ask:', '').trim();
      }
      continue;
    }

    if (!currentQuestion) continue;

    if (trimmed === '⸻' || trimmed === '') {
      continue;
    }

    // Label detection
    if (trimmed.startsWith('You ask:')) {
      currentField = 'question';
      currentQuestion.question = trimmed.replace('You ask:', '').trim();
    } else if (trimmed.startsWith('Follow-ups:')) {
      currentField = 'followUps';
      currentQuestion.followUps = trimmed.replace('Follow-ups:', '').trim().split('?').map(s => s.trim() + '?').filter(s => s.length > 1);
    } else if (trimmed.startsWith('Strong answer:')) {
      currentField = 'strongAnswer';
      currentQuestion.strongAnswer = trimmed.replace('Strong answer:', '').trim();
    } else if (trimmed.startsWith('Weak answer:')) {
      currentField = 'weakAnswer';
      currentQuestion.weakAnswer = trimmed.replace('Weak answer:', '').trim();
    } else if (trimmed.startsWith('Red flag:')) {
      currentField = 'redFlag';
      currentQuestion.redFlag = trimmed.replace('Red flag:', '').trim();
    } else if (trimmed.startsWith('Answer:')) {
      currentField = 'answer';
      currentQuestion.answer = trimmed.replace('Answer:', '').trim();
    } else if (trimmed.startsWith('Follow-up:')) {
      currentField = 'followUp';
      currentQuestion.followUp = trimmed.replace('Follow-up:', '').trim();
    } else if (currentField) {
      // Continuation line
      if (currentField === 'followUps') {
        const lastIdx = (currentQuestion.followUps?.length || 1) - 1;
        if (!currentQuestion.followUps) currentQuestion.followUps = [];
        if (currentQuestion.followUps[lastIdx]) {
          currentQuestion.followUps[lastIdx] += ' ' + trimmed;
        } else {
          currentQuestion.followUps.push(trimmed);
        }
      } else {
        const existing = (currentQuestion[currentField] as string) || '';
        (currentQuestion[currentField] as string) = (existing + ' ' + trimmed).trim();
      }
    }
  }

  flushQuestion();
  return categories;
}
