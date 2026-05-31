import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EducationPage from './page';
import { getResumeData } from '@/lib/data/resume-loader';

vi.mock('@/lib/data/resume-loader', () => ({
  getResumeData: vi.fn(),
}));

describe('EducationPage', () => {
  it('renders education and certification entries correctly', () => {
    (getResumeData as any).mockReturnValue({
      education: [
        { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'University A', year: '2020' },
        { degree: 'High School', year: '2016' }
      ],
      certifications: [
        { name: 'AWS Cloud Practitioner', issuer: 'Amazon', year: '2021' },
        { name: 'Generic Cert', year: '2022' }
      ]
    });

    render(<EducationPage />);

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

  it('renders fallback paragraphs when arrays are empty', () => {
    (getResumeData as any).mockReturnValue({
      education: [],
      certifications: []
    });

    render(<EducationPage />);

    // AC8(c)
    expect(screen.getByText('No education entries available.')).toBeInTheDocument();
    expect(screen.getByText('No certifications listed.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('contains required headings and landmarks', () => {
    (getResumeData as any).mockReturnValue({
      education: [],
      certifications: []
    });

    render(<EducationPage />);

    // AC8(d)
    expect(screen.getByRole('heading', { level: 1, name: 'Education & Certifications' })).toBeInTheDocument();

    // AC8(e)
    expect(screen.getByRole('region', { name: 'Academic Background' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Professional Certifications' })).toBeInTheDocument();
  });
});
