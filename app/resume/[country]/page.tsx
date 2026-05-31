import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { getResumeData, getAvailableCountries } from '@/lib/data/resume-loader';
import {
  Country,
  COUNTRIES,
  BaseResumeData,
  Experience,
  Project,
  Skills,
  Education,
  Certification,
  Language,
  PersonalInfo,
} from '@/types/resume';

interface ResumePageProps {
  params: {
    country: string;
  };
}

// AC1: Module-level parseMarkdownBold helper
export function parseMarkdownBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
    }
    return part;
  });
}

// AC2: generateStaticParams for SSG
export async function generateStaticParams() {
  const countries = getAvailableCountries();
  return countries.map((country) => ({
    country,
  }));
}

// AC6: generateMetadata for SEO
export async function generateMetadata({ params }: ResumePageProps): Promise<Metadata> {
  const countrySlug = params.country;

  // Validate country before fetching data for metadata
  if (!Object.keys(COUNTRIES).includes(countrySlug)) {
    // If country is not valid, metadata should not be generated for it.
    // However, Next.js expects a Metadata object. For invalid paths,
    // generateStaticParams prevents pre-rendering, and notFound() will handle runtime.
    // We provide a fallback, though it shouldn't be reached for invalid SSG paths.
    return {
      title: 'Resume - Not Found',
      robots: { index: false, follow: false },
    };
  }

  const country = countrySlug as Country;
  const resumeData = getResumeData(country);
  const countryLabel = COUNTRIES[country];
  const description = resumeData.professionalSummary?.replace(/\*\*/g, '').substring(0, 160) || `Resume for ${resumeData.personalInfo.name}`;

  return {
    title: `Resume — ${countryLabel}`,
    description,
    openGraph: {
      type: 'profile',
      title: `Resume — ${countryLabel}`,
      description,
      url: `https://subhashmahimaluri.com/resume/${country}`,
      // Optionally add more openGraph properties like images if available
    },
    alternates: {
      canonical: `https://subhashmahimaluri.com/resume/${country}`,
    },
  };
}

// AC1: ResumePage as a React Server Component
export default async function ResumePage({ params }: ResumePageProps) {
  const countrySlug = params.country;

  // AC3: Validate country slug against allowlist and call notFound()
  if (!Object.keys(COUNTRIES).includes(countrySlug)) {
    notFound();
  }

  // AC7: Cast only after validation
  const country = countrySlug as Country;
  const data: BaseResumeData = getResumeData(country);

  const { personalInfo, professionalSummary, experience, skills, education, certifications, languages } = data;

  // AC4: Conditional rendering
  const showWorkAuthorization = !!data.workAuthorization;
  const hideCertifications = country === 'uk';
  const showAvailability = country === 'uae' && !!data.availability;
  const referencesText = data.references || 'Available on request';

  const sectionHeadingClass = 'text-2xl font-bold text-orange-600 dark:text-orange-500 mb-4';
  const subHeadingClass = 'text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2';
  const paragraphClass = 'text-gray-700 dark:text-gray-300 mb-2 leading-relaxed';

  return (
    <main role="main" className="container mx-auto px-4 py-8 max-w-4xl bg-white dark:bg-gray-900 shadow-lg rounded-lg my-8">
      {/* Header */}
      <header className="text-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {personalInfo.name}
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">{personalInfo.title}</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-gray-600 dark:text-gray-400">
          <a
            href={`mailto:${personalInfo.email}`}
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
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
            className="text-blue-600 dark:text-blue-400 hover:underline"
            aria-label={`LinkedIn profile of ${personalInfo.name}`}
          >
            LinkedIn
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
            aria-label={`GitHub profile of ${personalInfo.name}`}
          >
            GitHub
          </a>
          {personalInfo.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              aria-label={`Website of ${personalInfo.name}`}
            >
              Website
            </a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {professionalSummary && (
        <section aria-labelledby="professional-summary-heading" className="mb-8">
          <h2 id="professional-summary-heading" className={sectionHeadingClass}>
            Professional Summary
          </h2>
          <p className={paragraphClass}>{parseMarkdownBold(professionalSummary)}</p>
        </section>
      )}

      {/* Experience */}
      <section aria-labelledby="experience-heading" className="mb-8">
        <h2 id="experience-heading" className={sectionHeadingClass}>
          Experience
        </h2>
        {experience.map((exp: Experience) => (
          <div key={exp.id} className="mb-6 last:mb-0">
            <h3 className={subHeadingClass}>
              {exp.role} at {exp.company}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {exp.location} | {exp.startDate} - {exp.endDate}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {exp.highlights.map((highlight, index) => (
                <li key={index} className={paragraphClass}>{parseMarkdownBold(highlight)}</li>
              ))}
            </ul>
            {exp.projects && exp.projects.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Projects:</h4>
                {exp.projects.map((project: Project, index: number) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                          {project.name}
                        </a>
                      ) : (
                        project.name
                      )} ({project.duration})
                    </p>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {project.description.map((desc, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">{parseMarkdownBold(desc)}</li>
                      ))}
                    </ul>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                      </p>
                    )}
                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="list-disc pl-5 space-y-0.5 text-sm text-gray-700 dark:text-gray-300">
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
      <section aria-labelledby="skills-heading" className="mb-8">
        <h2 id="skills-heading" className={sectionHeadingClass}>
          Skills
        </h2>
        {skills.coreSkills && skills.coreSkills.length > 0 && (
          <p className={paragraphClass}>
            <span className="font-semibold">Core:</span> {skills.coreSkills.join(', ')}
          </p>
        )}
        {skills.frontend && skills.frontend.length > 0 && (
          <p className={paragraphClass}>
            <span className="font-semibold">Frontend:</span> {skills.frontend.join(', ')}
          </p>
        )}
        {skills.backend && skills.backend.length > 0 && (
          <p className={paragraphClass}>
            <span className="font-semibold">Backend:</span> {skills.backend.join(', ')}
          </p>
        )}
        {skills.cloud && skills.cloud.length > 0 && (
          <p className={paragraphClass}>
            <span className="font-semibold">Cloud:</span> {skills.cloud.join(', ')}
          </p>
        )}
        {skills.testing && skills.testing.length > 0 && (
          <p className={paragraphClass}>
            <span className="font-semibold">Testing:</span> {skills.testing.join(', ')}
          </p>
        )}
        {skills.ai && skills.ai.length > 0 && (
          <p className={paragraphClass}>
            <span className="font-semibold">AI/ML:</span> {skills.ai.join(', ')}
          </p>
        )}
        {skills.architecture && skills.architecture.length > 0 && (
          <p className={paragraphClass}>
            <span className="font-semibold">Architecture:</span> {skills.architecture.join(', ')}
          </p>
        )}
        {skills.coreCompetencies && skills.coreCompetencies.length > 0 && (
          <p className={paragraphClass}>
            <span className="font-semibold">Core Competencies:</span> {skills.coreCompetencies.join(', ')}
          </p>
        )}
      </section>

      {/* Work Authorization */}
      {showWorkAuthorization && (
        <section aria-labelledby="work-authorization-heading" className="mb-8">
          <h2 id="work-authorization-heading" className={sectionHeadingClass}>
            Work Authorization
          </h2>
          <p className={paragraphClass}>{data.workAuthorization}</p>
        </section>
      )}

      {/* Education */}
      <section aria-labelledby="education-heading" className="mb-8">
        <h2 id="education-heading" className={sectionHeadingClass}>
          Education
        </h2>
        {education.map((edu: Education, index: number) => (
          <div key={index} className="mb-4 last:mb-0">
            <p className={subHeadingClass}>{edu.degree} in {edu.field}</p>
            <p className="text-gray-700 dark:text-gray-300">
              {edu.institution && <span>{edu.institution}</span>}
              {edu.year && <span>, {edu.year}</span>}
            </p>
          </div>
        ))}
      </section>

      {/* Certifications (AC4: hidden for UK) */}
      {!hideCertifications && certifications && certifications.length > 0 && (
        <section aria-labelledby="certifications-heading" className="mb-8">
          <h2 id="certifications-heading" className={sectionHeadingClass}>
            Certifications
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {certifications.map((cert: Certification, index: number) => (
              <li key={index} className={paragraphClass}>
                {cert.name}
                {cert.issuer && <span> ({cert.issuer})</span>}
                {cert.year && <span>, {cert.year}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Availability (AC4: only for UAE and if present) */}
      {showAvailability && (
        <section aria-labelledby="availability-heading" className="mb-8">
          <h2 id="availability-heading" className={sectionHeadingClass}>
            Availability
          </h2>
          <p className={paragraphClass}>{data.availability}</p>
        </section>
      )}

      {/* Languages */}
      <section aria-labelledby="languages-heading" className="mb-8">
        <h2 id="languages-heading" className={sectionHeadingClass}>
          Languages
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          {languages.map((lang: Language, index: number) => (
            <li key={index} className={paragraphClass}>
              {lang.language} ({lang.proficiency})
            </li>
          ))}
        </ul>
      </section>

      {/* References */}
      <section aria-labelledby="references-heading" className="mb-8">
        <h2 id="references-heading" className={sectionHeadingClass}>
          References
        </h2>
        <p className={paragraphClass}>{referencesText}</p>
      </section>

      {/* AC5: Download PDF link */}
      <div className="text-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <a
          href={`/api/resume-pdf?country=${country}`}
          download
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm
                     text-white bg-orange-600 hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-offset-2 focus-visible:ring-orange-400 dark:focus-visible:ring-offset-gray-900"
          aria-label={`Download PDF resume for ${COUNTRIES[country]}`}
        >
          Download PDF
        </a>
      </div>
    </main>
  );
}
