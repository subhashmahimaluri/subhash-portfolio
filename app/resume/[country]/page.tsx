import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { getResumeData, getAvailableCountries } from '@/lib/data/resume-loader';
import {
  Country,
  COUNTRIES,
  BaseResumeData,
  Experience,
  Project,
  Education,
  Certification,
  Language,
} from '@/types/resume';

interface ResumePageProps {
  params: Promise<{
    country: string;
  }>;
}

// Module-level helper: turns **bold** markdown into <strong> nodes.
export function parseMarkdownBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
    }
    return part;
  });
}

export async function generateStaticParams() {
  const countries = getAvailableCountries();
  return countries.map((country) => ({ country }));
}

export async function generateMetadata({ params }: ResumePageProps): Promise<Metadata> {
  const { country: countrySlug } = await params;

  if (!Object.keys(COUNTRIES).includes(countrySlug)) {
    return {
      title: 'Resume - Not Found',
      robots: { index: false, follow: false },
    };
  }

  const country = countrySlug as Country;
  const resumeData = getResumeData(country);
  const countryLabel = COUNTRIES[country];
  const description =
    resumeData.professionalSummary?.replace(/\*\*/g, '').substring(0, 160) ||
    `Resume for ${resumeData.personalInfo.name}`;

  return {
    title: `Resume — ${countryLabel}`,
    description,
    openGraph: {
      type: 'profile',
      title: `Resume — ${countryLabel}`,
      description,
      url: `https://subhashmahimaluri.com/resume/${country}`,
    },
    alternates: {
      canonical: `https://subhashmahimaluri.com/resume/${country}`,
    },
  };
}

const sectionHeadingClass = 'section-title';
const contactLinkStyle: React.CSSProperties = { color: 'var(--link-strong)', fontWeight: 600 };

export default async function ResumePage({ params }: ResumePageProps) {
  const { country: countrySlug } = await params;

  if (!Object.keys(COUNTRIES).includes(countrySlug)) {
    notFound();
  }

  const country = countrySlug as Country;
  const data: BaseResumeData = getResumeData(country);

  const { personalInfo, experience, skills, education, certifications, languages } = data;
  // Old resume data carries the summary on personalInfo.summary; newer data may
  // set a top-level professionalSummary. Prefer the explicit top-level value.
  const professionalSummary = data.professionalSummary ?? personalInfo.summary;

  const showWorkAuthorization = !!data.workAuthorization;
  const hideCertifications = country === 'uk';
  const showAvailability = country === 'uae' && !!data.availability;
  const referencesText = data.references || 'Available on request';

  return (
    <section className="page" aria-labelledby="resume-name">
      <div className="container" style={{ maxWidth: 880 }}>
        {/* Header */}
        <header
          className="panel"
          style={{ textAlign: 'center', marginBottom: 'var(--s-6)' }}
        >
          <h1 id="resume-name" style={{ fontSize: 'clamp(30px, 5vw, 44px)' }}>
            {personalInfo.name}
          </h1>
          <p className="role" style={{ marginTop: 'var(--s-2)' }}>
            {personalInfo.title}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'var(--s-4)',
              marginTop: 'var(--s-4)',
              color: 'var(--text-soft)',
            }}
          >
            <a
              href={`mailto:${personalInfo.email}`}
              rel="noopener noreferrer"
              style={contactLinkStyle}
              aria-label={`Email ${personalInfo.name} at ${personalInfo.email}`}
            >
              {personalInfo.email}
            </a>
            <span>{personalInfo.phone}</span>
            <span>{personalInfo.location}</span>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={contactLinkStyle}
              aria-label={`LinkedIn profile of ${personalInfo.name}`}
            >
              LinkedIn
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              style={contactLinkStyle}
              aria-label={`GitHub profile of ${personalInfo.name}`}
            >
              GitHub
            </a>
            {personalInfo.website && (
              <a
                href={personalInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                style={contactLinkStyle}
                aria-label={`Website of ${personalInfo.name}`}
              >
                Website
              </a>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {professionalSummary && (
          <section aria-labelledby="professional-summary-heading" className="panel" style={{ marginBottom: 'var(--s-6)' }}>
            <h2 id="professional-summary-heading" className={sectionHeadingClass}>
              Professional Summary
            </h2>
            <p className="prose">{parseMarkdownBold(professionalSummary)}</p>
          </section>
        )}

        {/* Experience */}
        <section aria-labelledby="experience-heading" className="panel" style={{ marginBottom: 'var(--s-6)' }}>
          <h2 id="experience-heading" className={sectionHeadingClass}>
            Experience
          </h2>
          {experience.map((exp: Experience) => (
            <div key={exp.id} style={{ marginBottom: 'var(--s-6)' }}>
              <h3>
                {exp.role} at {exp.company}
              </h3>
              <p className="when" style={{ marginTop: 'var(--s-1)' }}>
                {exp.location} | {exp.startDate} - {exp.endDate}
              </p>
              <ul className="prose" style={{ paddingLeft: 'var(--s-5)', marginTop: 'var(--s-3)' }}>
                {exp.highlights.map((highlight, index) => (
                  <li key={index}>{parseMarkdownBold(highlight)}</li>
                ))}
              </ul>
              {exp.projects && exp.projects.length > 0 && (
                <div style={{ marginTop: 'var(--s-4)' }}>
                  <h4 style={{ fontSize: 16, marginBottom: 'var(--s-2)' }}>Projects:</h4>
                  {exp.projects.map((project: Project, index: number) => (
                    <div key={index} style={{ marginBottom: 'var(--s-4)' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={contactLinkStyle}
                          >
                            {project.name}
                          </a>
                        ) : (
                          project.name
                        )}{' '}
                        ({project.duration})
                      </p>
                      <ul className="prose" style={{ paddingLeft: 'var(--s-5)' }}>
                        {project.description.map((desc, idx) => (
                          <li key={idx}>{parseMarkdownBold(desc)}</li>
                        ))}
                      </ul>
                      {project.technologies && project.technologies.length > 0 && (
                        <p style={{ color: 'var(--text-soft)', fontSize: 14, marginTop: 'var(--s-1)' }}>
                          <strong>Technologies:</strong> {project.technologies.join(', ')}
                        </p>
                      )}
                      {project.highlights && project.highlights.length > 0 && (
                        <ul className="prose" style={{ paddingLeft: 'var(--s-5)', fontSize: 14 }}>
                          {project.highlights.map((highlight, idx) => (
                            <li key={idx}>{parseMarkdownBold(highlight)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Skills */}
        <section aria-labelledby="skills-heading" className="panel" style={{ marginBottom: 'var(--s-6)' }}>
          <h2 id="skills-heading" className={sectionHeadingClass}>
            Skills
          </h2>
          <div className="prose">
            {skills.coreSkills && skills.coreSkills.length > 0 && (
              <p>
                <strong>Core:</strong> {skills.coreSkills.join(', ')}
              </p>
            )}
            {skills.frontend && skills.frontend.length > 0 && (
              <p>
                <strong>Frontend:</strong> {skills.frontend.join(', ')}
              </p>
            )}
            {skills.backend && skills.backend.length > 0 && (
              <p>
                <strong>Backend:</strong> {skills.backend.join(', ')}
              </p>
            )}
            {skills.cloud && skills.cloud.length > 0 && (
              <p>
                <strong>Cloud:</strong> {skills.cloud.join(', ')}
              </p>
            )}
            {skills.testing && skills.testing.length > 0 && (
              <p>
                <strong>Testing:</strong> {skills.testing.join(', ')}
              </p>
            )}
            {skills.ai && skills.ai.length > 0 && (
              <p>
                <strong>AI/ML:</strong> {skills.ai.join(', ')}
              </p>
            )}
            {skills.architecture && skills.architecture.length > 0 && (
              <p>
                <strong>Architecture:</strong> {skills.architecture.join(', ')}
              </p>
            )}
            {skills.coreCompetencies && skills.coreCompetencies.length > 0 && (
              <p>
                <strong>Core Competencies:</strong> {skills.coreCompetencies.join(', ')}
              </p>
            )}
          </div>
        </section>

        {/* Work Authorization */}
        {showWorkAuthorization && (
          <section aria-labelledby="work-authorization-heading" className="panel" style={{ marginBottom: 'var(--s-6)' }}>
            <h2 id="work-authorization-heading" className={sectionHeadingClass}>
              Work Authorization
            </h2>
            <p className="prose">{data.workAuthorization}</p>
          </section>
        )}

        {/* Education */}
        <section aria-labelledby="education-heading" className="panel" style={{ marginBottom: 'var(--s-6)' }}>
          <h2 id="education-heading" className={sectionHeadingClass}>
            Education
          </h2>
          {education.map((edu: Education, index: number) => (
            <div key={index} style={{ marginBottom: 'var(--s-4)' }}>
              <h3>
                {edu.degree} in {edu.field}
              </h3>
              <p className="prose">
                {edu.institution && <span>{edu.institution}</span>}
                {edu.year && <span>, {edu.year}</span>}
              </p>
            </div>
          ))}
        </section>

        {/* Certifications (hidden for UK) */}
        {!hideCertifications && certifications && certifications.length > 0 && (
          <section aria-labelledby="certifications-heading" className="panel" style={{ marginBottom: 'var(--s-6)' }}>
            <h2 id="certifications-heading" className={sectionHeadingClass}>
              Certifications
            </h2>
            <ul className="prose" style={{ paddingLeft: 'var(--s-5)' }}>
              {certifications.map((cert: Certification, index: number) => (
                <li key={index}>
                  {cert.name}
                  {cert.issuer && <span> ({cert.issuer})</span>}
                  {cert.year && <span>, {cert.year}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Availability (only for UAE and if present) */}
        {showAvailability && (
          <section aria-labelledby="availability-heading" className="panel" style={{ marginBottom: 'var(--s-6)' }}>
            <h2 id="availability-heading" className={sectionHeadingClass}>
              Availability
            </h2>
            <p className="prose">{data.availability}</p>
          </section>
        )}

        {/* Languages */}
        <section aria-labelledby="languages-heading" className="panel" style={{ marginBottom: 'var(--s-6)' }}>
          <h2 id="languages-heading" className={sectionHeadingClass}>
            Languages
          </h2>
          <ul className="prose" style={{ paddingLeft: 'var(--s-5)' }}>
            {languages.map((lang: Language, index: number) => (
              <li key={index}>
                {lang.language} ({lang.proficiency})
              </li>
            ))}
          </ul>
        </section>

        {/* References */}
        <section aria-labelledby="references-heading" className="panel" style={{ marginBottom: 'var(--s-6)' }}>
          <h2 id="references-heading" className={sectionHeadingClass}>
            References
          </h2>
          <p className="prose">{referencesText}</p>
        </section>

        {/* Download PDF */}
        <div style={{ textAlign: 'center', marginTop: 'var(--s-8)' }}>
          <a
            href={`/api/resume-pdf?country=${country}`}
            download
            rel="noopener noreferrer"
            className="btn btn-primary"
            aria-label={`Download PDF resume for ${COUNTRIES[country]}`}
          >
            Download PDF
          </a>
        </div>
      </div>
    </section>
  );
}
