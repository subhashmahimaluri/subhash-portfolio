import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// The page reads getResumeData('india') at module scope (AC3), so the value must
// be set BEFORE the page module is imported. A vi.hoisted mock is stable across
// vi.resetModules(), letting each test re-import the page with fresh data.
const { mockGetResumeData } = vi.hoisted(() => ({ mockGetResumeData: vi.fn() }));
vi.mock('@/lib/data/resume-loader', () => ({
  getResumeData: mockGetResumeData,
}));

async function renderEducationPage() {
  vi.resetModules();
  const { default: EducationPage } = await import('./page');
  render(<EducationPage />);
}

describe('Education generateMetadata', () => {
  it('returns the Education title and a description', async () => {
    mockGetResumeData.mockReturnValue({ education: [], certifications: [] });
    vi.resetModules();
    const { generateMetadata } = await import('./page');
    const metadata = generateMetadata();
    expect(metadata.title).toBe('Education');
    expect(metadata.description).toBeTruthy();
  });
});

describe('EducationPage', () => {
  it('renders education and certification entries correctly', async () => {
    mockGetResumeData.mockReturnValue({
      education: [
        { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'University A', year: '2020' },
        { degree: 'High School', year: '2016' }
      ],
      certifications: [
        { name: 'AWS Cloud Practitioner', issuer: 'Amazon', year: '2021' },
        { name: 'Generic Cert', year: '2022' }
      ]
    });

    await renderEducationPage();

    // AC8(a)
    expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('University A')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('High School')).toBeInTheDocument();
    expect(screen.queryByText('High School in')).not.toBeInTheDocument();

    // AC8(b)
    expect(screen.getByText('AWS Cloud Practitioner')).toBeInTheDocument();
    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('Generic Cert')).toBeInTheDocument();
    expect(screen.getAllByText('2021')).toHaveLength(1);
  });

  it('renders fallback paragraphs when arrays are empty', async () => {
    mockGetResumeData.mockReturnValue({
      education: [],
      certifications: []
    });

    await renderEducationPage();

    // AC8(c)
    expect(screen.getByText('No education entries available.')).toBeInTheDocument();
    expect(screen.getByText('No certifications listed.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('contains required headings and landmarks', async () => {
    mockGetResumeData.mockReturnValue({
      education: [],
      certifications: []
    });

    await renderEducationPage();

    // AC8(d)
    expect(screen.getByRole('heading', { level: 1, name: 'Education & Certifications' })).toBeInTheDocument();

    // AC8(e)
    expect(screen.getByRole('region', { name: 'Academic Background' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Professional Certifications' })).toBeInTheDocument();
  });
});
