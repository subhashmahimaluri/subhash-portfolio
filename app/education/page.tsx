import { Metadata } from 'next';
import { getResumeData } from '@/lib/data/resume-loader';
import { Education, Certification } from '@/types/resume';

export function generateMetadata(): Metadata {
  const description = "A detailed overview of Subhash Mahimaluri's academic background and professional certifications.";
  return {
    title: 'Education',
    description,
    openGraph: {
      title: 'Education',
      description,
      type: 'website',
    },
  };
};

const { education, certifications } = getResumeData('india');

export default function EducationPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-primary-navy dark:text-accent-orange">Education & Certifications</h1>

      <section aria-labelledby="education-heading" className="mb-12">
        <h2 id="education-heading" className="text-2xl font-semibold mb-4 text-primary-navy dark:text-accent-orange">
          Academic Background
        </h2>
        {education.length > 0 ? (
          <ul className="space-y-6">
            {education.map((edu: Education, index: number) => (
              <li key={index}>
                <h3 className="text-lg font-medium">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </h3>
                {edu.institution && <p>{edu.institution}</p>}
                {edu.year && <p className="text-sm opacity-80">{edu.year}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No education entries available.</p>
        )}
      </section>

      <section aria-labelledby="certifications-heading">
        <h2 id="certifications-heading" className="text-2xl font-semibold mb-4 text-primary-navy dark:text-accent-orange">
          Professional Certifications
        </h2>
        {certifications.length > 0 ? (
          <ul className="space-y-4">
            {certifications.map((cert: Certification, index: number) => (
              <li key={index}>
                <h3 className="font-medium">{cert.name}</h3>
                {cert.issuer && <p>{cert.issuer}</p>}
                {cert.year && <p className="text-sm opacity-80">{cert.year}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No certifications listed.</p>
        )}
      </section>
    </main>
  );
}
