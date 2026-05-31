import React from 'react';

const EXPERTISE: ReadonlyArray<string> = [
  'Solution Architecture',
  'Cloud-Native Platforms',
  'AI & LLM Integrations',
  'Microservices & APIs',
  'Event-Driven Systems',
  'Azure & AWS',
  'DevOps & CI/CD',
  'Data Engineering',
  'React & Next.js',
  'TypeScript',
  'Enterprise Integration',
  'Agile Delivery',
];

export function CoreExpertise() {
  return (
    <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto py-8">
      {EXPERTISE.map((skill) => (
        <span
          key={skill}
          className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-orange-100 dark:text-orange-800
                     rounded-full text-sm font-medium whitespace-nowrap"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
