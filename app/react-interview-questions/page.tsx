import type { Metadata } from 'next';
import { parseInterviewQuestions } from '@/lib/utils/parse-interview-questions';
import { InterviewClientPage } from './InterviewClientPage';

export const generateMetadata = (): Metadata => {
  const title = 'React Interview Questions';
  const description =
    'Prepare for your next React and JavaScript interviews with this comprehensive collection of common questions and detailed answers.';

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
    <section className="page" aria-labelledby="react-qa-title">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">Interview Prep</span>
          <h1 id="react-qa-title">React Interview Questions</h1>
          <p className="lead">
            Prepare for your next React and JavaScript interviews with this comprehensive
            collection of common questions and detailed answers.
          </p>
        </header>

        <div style={{ textAlign: 'center', marginBottom: 'var(--s-12)' }}>
          <a href="/api/interview-pdf" download className="btn btn-outline">
            Download PDF
          </a>
        </div>

        <InterviewClientPage categories={categories} />
      </div>
    </section>
  );
}
