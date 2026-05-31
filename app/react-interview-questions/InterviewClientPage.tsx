'use client';

import { useState, useId } from 'react';
import { InterviewCategory, InterviewQuestion, CodingQuestion } from '@/lib/utils/parse-interview-questions';

interface InterviewClientPageProps {
  categories: InterviewCategory[];
}

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

  const filteredCategories = filter === 'all' 
    ? categories 
    : categories.filter(c => c.title === filter);

  const filterButtonClass = "py-2 px-4 rounded-full text-sm font-medium focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none transition-colors";

  return (
    <div className="space-y-12">
      <nav className="flex flex-wrap gap-2 mb-8" aria-label="Category filter">
        <button
          onClick={() => setFilter('all')}
          className={`${filterButtonClass} ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.title}
            onClick={() => setFilter(cat.title)}
            className={`${filterButtonClass} ${filter === cat.title ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          >
            {cat.title}
          </button>
        ))}
      </nav>

      {filteredCategories.map((category, catIdx) => (
        <section key={category.title} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.title}</h2>
          <div className="space-y-4">
            {category.questions.map((q, qIdx) => {
              const qId = `q-${catIdx}-${qIdx}`;
              const panelId = `panel-${qId}`;
              const isExpanded = expandedIds.has(qId);
              
              return (
                <div key={qId} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    id={qId}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => toggleQuestion(qId)}
                    className="w-full text-left py-4 px-6 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none transition-colors flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">{q.question}</span>
                    <span className={`transform transition-transform motion-safe:duration-200 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true">
                      ▼
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={qId}
                    className={`px-6 py-4 space-y-4 bg-white dark:bg-gray-900 transition-all motion-safe:duration-200 ${isExpanded ? 'block' : 'hidden'}`}
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

function InterviewAnswerPanel({ question }: { question: InterviewQuestion }) {
  return (
    <>
      {question.strongAnswer && (
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-green-700 dark:text-green-400">Strong Answer</h3>
          <p className="text-gray-700 dark:text-gray-300">{question.strongAnswer}</p>
        </div>
      )}
      {question.weakAnswer && (
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">Weak Answer</h3>
          <p className="text-gray-700 dark:text-gray-300">{question.weakAnswer}</p>
        </div>
      )}
      {question.redFlag && (
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-red-700 dark:text-red-400">Red Flag</h3>
          <p className="text-gray-700 dark:text-gray-300">{question.redFlag}</p>
        </div>
      )}
      {question.followUps && question.followUps.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Follow-ups</h3>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
            {question.followUps.map((f, i) => <li key={i}>{f}</li>)}
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
          <h3 className="text-sm font-bold uppercase tracking-wider text-green-700 dark:text-green-400">Answer</h3>
          <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto">
            <code className="text-sm font-mono text-gray-900 dark:text-gray-100">{question.answer}</code>
          </pre>
        </div>
      )}
      {question.followUp && (
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Follow-up</h3>
          <p className="text-gray-700 dark:text-gray-300">{question.followUp}</p>
        </div>
      )}
    </>
  );
}
