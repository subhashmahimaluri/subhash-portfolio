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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(value: string): string {
  if (!value || value.toLowerCase() === 'present') return 'Present';
  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) return value;
  return `${MONTHS[parseInt(match[2], 10) - 1]} ${match[1]}`;
}

function formatPeriod(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
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
  const summary = resumeData.professionalSummary ?? resumeData.personalInfo.summary;
  const description =
    summary?.replace(/\*\*/g, '').substring(0, 160) || `Resume for ${resumeData.personalInfo.name}`;

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

interface SkillGroup {
  label: string;
  items?: string[];
}

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

  const skillGroups: SkillGroup[] = [
    { label: 'Frontend', items: skills.frontend },
    { label: 'Backend & APIs', items: skills.backend },
    { label: 'Cloud & DevOps', items: skills.cloud },
    { label: 'Testing & Quality', items: skills.testing },
    { label: 'AI & Automation', items: skills.ai },
    { label: 'Architecture & Design', items: skills.architecture },
    { label: 'Core Competencies', items: skills.coreCompetencies },
  ];

  return (
    <section className="page" aria-labelledby="resume-name">
      <div className="container">
        <div className="resume">
          <article className="resume-doc">
            {/* Header */}
            <header className="resume-header">
              <h1 id="resume-name">{personalInfo.name}</h1>
              <p className="resume-role">{personalInfo.title}</p>
              <div className="resume-contact">
                <a
                  href={`mailto:${personalInfo.email}`}
                  rel="noopener noreferrer"
                  aria-label={`Email ${personalInfo.name} at ${personalInfo.email}`}
                >
                  {personalInfo.email}
                </a>
                <span className="sep" aria-hidden="true">
                  |
                </span>
                <span>{personalInfo.phone}</span>
                <span className="sep" aria-hidden="true">
                  |
                </span>
                <span>{personalInfo.location}</span>
                {personalInfo.website && (
                  <>
                    <span className="sep" aria-hidden="true">
                      |
                    </span>
                    <a
                      href={personalInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Website of ${personalInfo.name}`}
                    >
                      {personalInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                  </>
                )}
                <span className="sep" aria-hidden="true">
                  |
                </span>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn profile of ${personalInfo.name}`}
                >
                  LinkedIn
                </a>
                <span className="sep" aria-hidden="true">
                  |
                </span>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub profile of ${personalInfo.name}`}
                >
                  GitHub
                </a>
              </div>
            </header>

            {/* Professional Summary */}
            {professionalSummary && (
              <section aria-labelledby="professional-summary-heading" className="resume-section">
                <h2 id="professional-summary-heading">Professional Summary</h2>
                <p className="resume-summary">{parseMarkdownBold(professionalSummary)}</p>
              </section>
            )}

            {/* Experience */}
            <section aria-labelledby="experience-heading" className="resume-section">
              <h2 id="experience-heading">Professional Experience</h2>
              {experience.map((exp: Experience) => (
                <div key={exp.id} className="resume-entry">
                  <div className="resume-entry-head">
                    <h3>
                      {exp.role} at {exp.company}
                    </h3>
                    <span className="resume-meta">
                      {exp.location} | {formatPeriod(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  <ul className="resume-list">
                    {exp.highlights.map((highlight, index) => (
                      <li key={index}>{parseMarkdownBold(highlight)}</li>
                    ))}
                  </ul>
                  {exp.projects && exp.projects.length > 0 && (
                    <>
                      <h4 style={{ marginTop: 'var(--s-4)', fontSize: 14, color: 'var(--text-faint)' }}>
                        Projects:
                      </h4>
                      {exp.projects.map((project: Project, index: number) => (
                        <div key={index} className="resume-project">
                          <p className="resume-project-title">
                            {project.link ? (
                              <a href={project.link} target="_blank" rel="noopener noreferrer">
                                {project.name}
                              </a>
                            ) : (
                              project.name
                            )}{' '}
                            ({project.duration})
                          </p>
                          <ul className="resume-list">
                            {project.description.map((desc, idx) => (
                              <li key={idx}>{parseMarkdownBold(desc)}</li>
                            ))}
                            {project.highlights?.map((highlight, idx) => (
                              <li key={`h-${idx}`}>{parseMarkdownBold(highlight)}</li>
                            ))}
                          </ul>
                          {project.technologies && project.technologies.length > 0 && (
                            <p className="resume-tech">
                              <strong>Technologies:</strong> {project.technologies.join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </section>

            {/* Skills */}
            <section aria-labelledby="skills-heading" className="resume-section">
              <h2 id="skills-heading">Technical Expertise</h2>
              {skills.coreSkills && skills.coreSkills.length > 0 && (
                <p className="resume-skills-core">
                  <strong style={{ color: 'var(--link-strong)' }}>Core Skills:</strong>{' '}
                  {skills.coreSkills.join(' • ')}
                </p>
              )}
              <div className="resume-skills">
                {skillGroups
                  .filter((group) => group.items && group.items.length > 0)
                  .map((group) => (
                    <div key={group.label} className="resume-skill-group">
                      <p>
                        <strong>{group.label}:</strong> {group.items!.join(', ')}
                      </p>
                    </div>
                  ))}
              </div>
            </section>

            {/* Work Authorization */}
            {showWorkAuthorization && (
              <section aria-labelledby="work-authorization-heading" className="resume-section">
                <h2 id="work-authorization-heading">Work Authorization</h2>
                <p className="resume-summary">{data.workAuthorization}</p>
              </section>
            )}

            {/* Education */}
            <section aria-labelledby="education-heading" className="resume-section">
              <h2 id="education-heading">Education</h2>
              {education.map((edu: Education, index: number) => (
                <div key={index} className="resume-entry-head" style={{ marginBottom: 'var(--s-2)' }}>
                  <h3>
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="resume-meta">
                    {edu.institution}
                    {edu.institution && edu.year ? ' | ' : ''}
                    {edu.year}
                  </span>
                </div>
              ))}
            </section>

            {/* Certifications (hidden for UK) */}
            {!hideCertifications && certifications && certifications.length > 0 && (
              <section aria-labelledby="certifications-heading" className="resume-section">
                <h2 id="certifications-heading">Certifications</h2>
                <ul className="resume-list">
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
              <section aria-labelledby="availability-heading" className="resume-section">
                <h2 id="availability-heading">Availability</h2>
                <p className="resume-summary">{data.availability}</p>
              </section>
            )}

            {/* Languages */}
            <section aria-labelledby="languages-heading" className="resume-section">
              <h2 id="languages-heading">Languages</h2>
              <p className="resume-summary">
                {languages.map((lang: Language) => `${lang.language} (${lang.proficiency})`).join(' • ')}
              </p>
            </section>

            {/* References */}
            <section aria-labelledby="references-heading" className="resume-section">
              <h2 id="references-heading">References</h2>
              <p className="resume-summary">{referencesText}</p>
            </section>

            <div className="resume-actions no-print">
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
          </article>
        </div>
      </div>
    </section>
  );
}
