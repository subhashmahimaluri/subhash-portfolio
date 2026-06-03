import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { notFound } from 'next/navigation';

// Mock resume-loader and next/navigation
vi.mock('@/lib/data/resume-loader', () => ({
  getResumeData: vi.fn((country: string): unknown => {
    switch (country) {
      case 'india':
        return {
          personalInfo: {
            name: 'John Doe',
            title: 'Software Engineer',
            email: 'john@example.com',
            phone: '123-456-7890',
            location: 'India',
            linkedin: 'linkedin.com/john',
            github: 'github.com/john',
            calendly: 'cal.com/john',
          },
          professionalSummary: 'A highly skilled **Software Engineer** with 5 years of experience.',
          experience: [
            { id: '1', company: 'Tech Corp', role: 'Dev', location: 'India', startDate: '2020-01-01', endDate: 'present', highlights: ['Developed **key features**'] },
          ],
          skills: { coreSkills: ['JavaScript'], frontend: [], backend: [], cloud: [], testing: [], ai: [], architecture: [], coreCompetencies: [] },
          education: [],
          certifications: [{ name: 'AWS Certified', issuer: 'AWS', year: '2022' }],
          languages: [],
        };
      case 'uk':
        return {
          personalInfo: {
            name: 'Jane Doe',
            title: 'Software Engineer',
            email: 'jane@example.com',
            phone: '123-456-7890',
            location: 'UK',
            linkedin: 'linkedin.com/jane',
            github: 'github.com/jane',
            calendly: 'cal.com/jane',
          },
          professionalSummary: 'Experienced developer.',
          experience: [],
          skills: {},
          education: [],
          certifications: [{ name: 'Azure Certified', issuer: 'Microsoft', year: '2023' }], // Should be hidden for UK
          languages: [],
        };
      case 'uae':
        return {
          personalInfo: {
            name: 'Ahmed Doe',
            title: 'Software Engineer',
            email: 'ahmed@example.com',
            phone: '123-456-7890',
            location: 'UAE',
            linkedin: 'linkedin.com/ahmed',
            github: 'github.com/ahmed',
            calendly: 'cal.com/ahmed',
          },
          professionalSummary: 'Dynamic professional.',
          experience: [],
          skills: {},
          education: [],
          certifications: [],
          languages: [],
          availability: 'Immediately available for full-time roles.',
        };
      default:
        return {
          personalInfo: {
            name: 'Default User',
            title: 'Developer',
            email: 'default@example.com',
            phone: '111-222-3333',
            location: 'World',
            linkedin: 'linkedin.com/default',
            github: 'github.com/default',
            calendly: 'cal.com/default',
          },
          professionalSummary: 'A generic summary.',
          experience: [],
          skills: {},
          education: [],
          certifications: [],
          languages: [],
        };
    }
  }),
  getAvailableCountries: vi.fn(() => ['india', 'uae', 'germany', 'uk', 'eu']),
}));

// notFound() throws in real Next.js, halting render before any data load.
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

// Import the component and helper for testing
import ResumePage, { generateStaticParams, generateMetadata, parseMarkdownBold } from '../[country]/page';

describe('parseMarkdownBold', () => {
  // AC8: parseMarkdownBold is tested for no-bold, single-bold, and multi-bold inputs.
  it('should return plain text if no bold markdown is present', () => {
    const text = 'This is plain text.';
    const result = render(<div>{parseMarkdownBold(text)}</div>);
    expect(result.container).toHaveTextContent('This is plain text.');
    expect(result.container.querySelector('strong')).not.toBeInTheDocument();
  });

  it('should convert single bold markdown to strong tags', () => {
    const text = 'This is **bold** text.';
    const result = render(<div>{parseMarkdownBold(text)}</div>);
    expect(result.container).toHaveTextContent('This is bold text.');
    expect(result.container.querySelector('strong')).toHaveTextContent('bold');
  });

  it('should convert multiple bold markdowns to strong tags', () => {
    const text = '**Hello** world, this is **really** important.';
    const result = render(<div>{parseMarkdownBold(text)}</div>);
    expect(result.container).toHaveTextContent('Hello world, this is really important.');
    const strongElements = result.container.querySelectorAll('strong');
    expect(strongElements).toHaveLength(2);
    expect(strongElements[0]).toHaveTextContent('Hello');
    expect(strongElements[1]).toHaveTextContent('really');
  });

  it('should handle mixed content correctly', () => {
    const text = 'Start **bold**, then normal, then **end bold**.';
    const result = render(<div>{parseMarkdownBold(text)}</div>);
    expect(result.container).toHaveTextContent('Start bold, then normal, then end bold.');
    const strongElements = result.container.querySelectorAll('strong');
    expect(strongElements).toHaveLength(2);
    expect(strongElements[0]).toHaveTextContent('bold');
    expect(strongElements[1]).toHaveTextContent('end bold');
  });

  it('should return React.ReactNode (no raw HTML)', () => {
    const text = 'This is **bold** content.';
    const result = parseMarkdownBold(text);
    // This implicitly checks it's not a raw string but a React element tree
    expect(React.isValidElement(result) || Array.isArray(result)).toBe(true);
  });
});

describe('generateStaticParams', () => {
  // AC2: generateStaticParams returns at least the five country objects
  it('should return params for all available countries', async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([
      { country: 'india' },
      { country: 'uae' },
      { country: 'germany' },
      { country: 'uk' },
      { country: 'eu' },
    ]);
  });
});

describe('generateMetadata', () => {
  it('should generate metadata for a valid country (india)', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ country: 'india' }) });
    expect(metadata.title).toBe('Resume — India');
    expect(metadata.description).toBe('A highly skilled Software Engineer with 5 years of experience.');
    expect((metadata.openGraph as { type?: string })?.type).toBe('profile');
    expect(metadata.openGraph?.url).toBe('https://subhashmahimaluri.com/resume/india');
  });

  it('should generate metadata for a valid country (uk)', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ country: 'uk' }) });
    expect(metadata.title).toBe('Resume — United Kingdom');
    expect(metadata.openGraph?.url).toBe('https://subhashmahimaluri.com/resume/uk');
  });

  it('should return a fallback title for an invalid country', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ country: 'invalid' }) });
    expect(metadata.title).toBe('Resume - Not Found');
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});


describe('ResumePage', () => {
  // AC8: (a) `india` renders name, summary, experience and skills headings, and a Download PDF link whose `href` contains `country=india`;
  it('should render the resume page for India with correct headings and PDF link', async () => {
    render(await ResumePage({ params: Promise.resolve({ country: 'india' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Professional Summary' })).toBeInTheDocument();
    // parseMarkdownBold splits the summary across multiple nodes (a <strong> in the
    // middle), so assert on the section's concatenated textContent rather than a single node.
    expect(screen.getByRole('region', { name: 'Professional Summary' })).toHaveTextContent(
      'A highly skilled Software Engineer with 5 years of experience.'
    );
    // parseMarkdownBold produced a <strong> inside the summary ('Software Engineer' also
    // appears as the header title, so scope the check to the summary region).
    expect(
      screen.getByRole('region', { name: 'Professional Summary' }).querySelector('strong')
    ).toHaveTextContent('Software Engineer');
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Dev at Tech Corp' })).toBeInTheDocument();
    // Highlight 'Developed **key features**' is split across nodes by parseMarkdownBold.
    expect(screen.getByRole('region', { name: 'Experience' })).toHaveTextContent('Developed key features');
    expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument();

    const pdfLink = screen.getByRole('link', { name: /Download PDF/i });
    expect(pdfLink).toBeInTheDocument();
    expect(pdfLink).toHaveAttribute('href', '/api/resume-pdf?country=india');
    expect(pdfLink).toHaveAttribute('download', '');
    expect(pdfLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // Renders every conditional section/branch from a fully-populated resume:
  // website link, experience with nested projects (link, technologies, highlights),
  // all skill groups, work authorization, education detail, certifications, languages,
  // and an explicit references value (not the fallback).
  it('renders all sections for a fully populated resume', async () => {
    const { getResumeData } = vi.mocked(await import('@/lib/data/resume-loader'));
    getResumeData.mockReturnValueOnce({
      personalInfo: {
        name: 'Full User', title: 'Architect', email: 'full@example.com', phone: '999',
        location: 'Berlin', linkedin: 'linkedin.com/full', github: 'github.com/full',
        calendly: 'cal.com/full', website: 'https://full.dev',
      },
      professionalSummary: 'Seasoned **architect**.',
      experience: [
        {
          id: 'e1', company: 'ACME', role: 'Lead', location: 'Berlin',
          startDate: '2019-01-01', endDate: 'present', highlights: ['Shipped **things**'],
          projects: [
            {
              name: 'Platform', link: 'https://proj.dev', duration: '2y',
              description: ['Built it'], technologies: ['Go', 'k8s'], highlights: ['Scaled it'],
            },
          ],
        },
      ],
      skills: {
        coreSkills: ['Leadership'], frontend: ['React'], backend: ['Node'], cloud: ['AWS'],
        testing: ['Vitest'], ai: ['LLM'], architecture: ['DDD'], coreCompetencies: ['Agile'],
      },
      education: [{ degree: 'MSc', field: 'CS', institution: 'TU Berlin', year: '2015' }],
      certifications: [{ name: 'CKA', issuer: 'CNCF', year: '2021' }],
      languages: [{ language: 'German', proficiency: 'Native' }],
      workAuthorization: 'EU Citizen',
      references: 'Provided on file.',
    } as unknown as ReturnType<typeof getResumeData>);

    render(await ResumePage({ params: Promise.resolve({ country: 'germany' }) }));

    expect(screen.getByRole('link', { name: /Website of Full User/i })).toHaveAttribute('href', 'https://full.dev');
    expect(screen.getByRole('heading', { level: 4, name: 'Projects:' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Platform' })).toHaveAttribute('href', 'https://proj.dev');
    expect(screen.getByText(/Go, k8s/)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Skills' })).toHaveTextContent('Leadership');
    expect(screen.getByRole('heading', { level: 2, name: 'Work Authorization' })).toBeInTheDocument();
    expect(screen.getByText('EU Citizen')).toBeInTheDocument();
    expect(screen.getByText('MSc in CS')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Certifications' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Languages' })).toHaveTextContent('German (Native)');
    expect(screen.getByText('Provided on file.')).toBeInTheDocument();
  });

  // AC8: (b) `uk` does not render the Certifications heading;
  it('should not render Certifications section for UK', async () => {
    render(await ResumePage({ params: Promise.resolve({ country: 'uk' }) }));
    expect(screen.queryByRole('heading', { level: 2, name: 'Certifications' })).not.toBeInTheDocument();
  });

  // AC8: (c) `uae` renders the Availability heading when the fixture supplies it;
  it('should render Availability section for UAE when data is present', async () => {
    render(await ResumePage({ params: Promise.resolve({ country: 'uae' }) }));
    expect(screen.getByRole('heading', { level: 2, name: 'Availability' })).toBeInTheDocument();
    expect(screen.getByText('Immediately available for full-time roles.')).toBeInTheDocument();
  });

  it('should not render Work Authorization section if data is not present', async () => {
    render(await ResumePage({ params: Promise.resolve({ country: 'india' }) }));
    expect(screen.queryByRole('heading', { level: 2, name: 'Work Authorization' })).not.toBeInTheDocument();
  });

  // AC8: (d) an unknown country triggers `notFound()` and never calls `getResumeData`.
  it('should call notFound() for an unknown country and not call getResumeData', async () => {
    const { getResumeData } = vi.mocked(await import('@/lib/data/resume-loader'));
    const { notFound } = vi.mocked(await import('next/navigation'));

    // notFound() throws, so rendering the invalid country rejects before getResumeData runs.
    await expect(ResumePage({ params: Promise.resolve({ country: 'unknown' }) })).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFound).toHaveBeenCalledTimes(1);
    expect(getResumeData).not.toHaveBeenCalledWith('unknown'); // getResumeData should not be called
  });

  it('should render "Available on request" for references if not provided', async () => {
    render(await ResumePage({ params: Promise.resolve({ country: 'india' }) }));
    expect(screen.getByRole('heading', { level: 2, name: 'References' })).toBeInTheDocument();
    expect(screen.getByText('Available on request')).toBeInTheDocument();
  });

  it('should render email link with correct attributes', async () => {
    render(await ResumePage({ params: Promise.resolve({ country: 'india' }) }));
    const emailLink = screen.getByText('john@example.com');
    expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
    expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should apply correct aria-labelledby and id attributes to sections', async () => {
    render(await ResumePage({ params: Promise.resolve({ country: 'india' }) }));

    const summarySection = screen.getByRole('region', { name: 'Professional Summary' });
    expect(summarySection).toBeInTheDocument();
    expect(summarySection).toHaveAttribute('aria-labelledby', 'professional-summary-heading');
    expect(screen.getByRole('heading', { level: 2, name: 'Professional Summary' })).toHaveAttribute('id', 'professional-summary-heading');

    const experienceSection = screen.getByRole('region', { name: 'Experience' });
    expect(experienceSection).toBeInTheDocument();
    expect(experienceSection).toHaveAttribute('aria-labelledby', 'experience-heading');
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toHaveAttribute('id', 'experience-heading');

    const skillsSection = screen.getByRole('region', { name: 'Skills' });
    expect(skillsSection).toBeInTheDocument();
    expect(skillsSection).toHaveAttribute('aria-labelledby', 'skills-heading');
    expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toHaveAttribute('id', 'skills-heading');

    const educationSection = screen.getByRole('region', { name: 'Education' });
    expect(educationSection).toBeInTheDocument();
    expect(educationSection).toHaveAttribute('aria-labelledby', 'education-heading');
    expect(screen.getByRole('heading', { level: 2, name: 'Education' })).toHaveAttribute('id', 'education-heading');
  });
});
