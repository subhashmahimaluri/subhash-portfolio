import type { Metadata } from 'next';
import { getResumeData } from '@/lib/data/resume-loader';
import { Education, Certification } from '@/types/resume';

export function generateMetadata(): Metadata {
  const description =
    "A detailed overview of Subhash Mahimaluri's academic background and professional certifications.";
  return {
    title: 'Education',
    description,
    openGraph: {
      title: 'Education',
      description,
      type: 'website',
    },
  };
}

const { education, certifications } = getResumeData('india');

export default function EducationPage() {
  return (
    <section className="page" aria-labelledby="education-title">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">Credentials</span>
          <h1 id="education-title">Education &amp; Certifications</h1>
          <p className="lead">Academic background and professional certifications.</p>
        </header>

        <section aria-labelledby="education-heading" className="panel">
          <h2 id="education-heading" className="section-title">
            Academic Background
          </h2>
          {education.length > 0 ? (
            <ul className="timeline">
              {education.map((edu: Education, index: number) => (
                <li key={index}>
                  {edu.year && <p className="when">{edu.year}</p>}
                  <p className="what">
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  {edu.institution && <p className="where">{edu.institution}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No education entries available.</p>
          )}
        </section>

        <section aria-labelledby="certifications-heading" className="panel">
          <h2 id="certifications-heading" className="section-title">
            Professional Certifications
          </h2>
          {certifications.length > 0 ? (
            <ul className="data-grid" style={{ listStyle: 'none', padding: 0 }}>
              {certifications.map((cert: Certification, index: number) => (
                <li key={index} className="data-card">
                  <h3>{cert.name}</h3>
                  {cert.issuer && <p>{cert.issuer}</p>}
                  {cert.year && (
                    <p className="when" style={{ marginTop: 'var(--s-2)' }}>
                      {cert.year}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No certifications listed.</p>
          )}
        </section>
      </div>
    </section>
  );
}
