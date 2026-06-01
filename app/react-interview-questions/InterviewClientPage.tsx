'use client';

import { useState } from 'react';
import {
  InterviewCategory,
  InterviewQuestion,
  CodingQuestion,
} from '@/lib/utils/parse-interview-questions';

interface InterviewClientPageProps {
  categories: InterviewCategory[];
}

const filterBase =
  'rounded-[var(--r-pill)] px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';
const filterActive = 'bg-[var(--navy)] text-white border border-transparent';
const filterInactive =
  'bg-[var(--glass-strong)] text-[var(--text-soft)] border border-[var(--border)] hover:text-[var(--text)]';

export function InterviewClientPage({ categories }: InterviewClientPageProps) {
  const [filter, setFilter] = useState<string | 'all'>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const filteredCategories =
    filter === 'all' ? categories : categories.filter((c) => c.title === filter);

  return (
    <div className="space-y-12">
      <nav className="flex flex-wrap gap-2 mb-8" aria-label="Category filter">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`${filterBase} ${filter === 'all' ? filterActive : filterInactive}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            type="button"
            key={cat.title}
            onClick={() => setFilter(cat.title)}
            className={`${filterBase} ${filter === cat.title ? filterActive : filterInactive}`}
          >
            {cat.title}
          </button>
        ))}
      </nav>

      {filteredCategories.map((category, catIdx) => (
        <section key={category.title} className="space-y-6">
          <h2 className="section-title" style={{ fontSize: 'clamp(20px, 3vw, 26px)', color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.02em' }}>
            {category.title}
          </h2>
          <div className="space-y-4">
            {category.questions.map((q, qIdx) => {
              const qId = `q-${catIdx}-${qIdx}`;
              const panelId = `panel-${qId}`;
              const isExpanded = expandedIds.has(qId);

              return (
                <div
                  key={qId}
                  className="overflow-hidden rounded-[var(--r-lg)] border border-[var(--glass-border)] bg-[var(--glass-strong)]"
                >
                  <button
                    type="button"
                    id={qId}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => toggleQuestion(qId)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-[var(--nav-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <span className="font-semibold text-[var(--text)]">{q.question}</span>
                    <span
                      className={`text-[var(--accent-on)] transition-transform motion-safe:duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={qId}
                    className={`space-y-4 border-t border-[var(--glass-border)] px-6 py-4 ${isExpanded ? 'block' : 'hidden'}`}
                  >
                    {'answer' in q ? (
                      <CodingAnswerPanel question={q as CodingQuestion} />
                    ) : (
                      <InterviewAnswerPanel question={q as InterviewQuestion} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

const answerLabel = 'text-xs font-bold uppercase tracking-wider';
const answerBody = 'text-[var(--text-soft)]';

function InterviewAnswerPanel({ question }: { question: InterviewQuestion }) {
  return (
    <>
      {question.strongAnswer && (
        <div className="space-y-1">
          <h3 className={`${answerLabel} text-[var(--teal-on)]`}>Strong Answer</h3>
          <p className={answerBody}>{question.strongAnswer}</p>
        </div>
      )}
      {question.weakAnswer && (
        <div className="space-y-1">
          <h3 className={`${answerLabel} text-[var(--accent-on)]`}>Weak Answer</h3>
          <p className={answerBody}>{question.weakAnswer}</p>
        </div>
      )}
      {question.redFlag && (
        <div className="space-y-1">
          <h3 className={`${answerLabel} text-[#e5484d]`}>Red Flag</h3>
          <p className={answerBody}>{question.redFlag}</p>
        </div>
      )}
      {question.followUps && question.followUps.length > 0 && (
        <div className="space-y-1">
          <h3 className={`${answerLabel} text-[var(--link-strong)]`}>Follow-ups</h3>
          <ul className={`list-disc pl-5 ${answerBody}`}>
            {question.followUps.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function CodingAnswerPanel({ question }: { question: CodingQuestion }) {
  return (
    <>
      {question.answer && (
        <div className="space-y-1">
          <h3 className={`${answerLabel} text-[var(--teal-on)]`}>Answer</h3>
          <pre className="overflow-x-auto rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--glass-soft)] p-4">
            <code className="font-mono text-sm text-[var(--text)]">{question.answer}</code>
          </pre>
        </div>
      )}
      {question.followUp && (
        <div className="space-y-1">
          <h3 className={`${answerLabel} text-[var(--link-strong)]`}>Follow-up</h3>
          <p className={answerBody}>{question.followUp}</p>
        </div>
      )}
    </>
  );
}
