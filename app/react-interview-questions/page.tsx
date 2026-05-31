import { Metadata } from 'next';
import { parseInterviewQuestions } from '@/lib/utils/parse-interview-questions';
import { InterviewClientPage } from './InterviewClientPage';

export const generateMetadata = (): Metadata => {
  const title = 'React Interview Questions';
  const description = 'Prepare for your next React and JavaScript interviews with this comprehensive collection of common questions and detailed answers.';
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
};

export default function InterviewQuestionsPage() {
  const categories = parseInterviewQuestions();

  return (
    <main className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        React Interview Questions
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Prepare for your next React and JavaScript interviews with this comprehensive collection of common questions and detailed answers.
      </p>
      
      <div className="mb-12">
        <a 
          href="/api/interview-pdf" 
          download
          className="inline-block border py-2 px-4 rounded border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none transition-colors"
        >
          Download PDF
        </a>
      </div>

      <InterviewClientPage categories={categories} />
    </main>
  );
}
