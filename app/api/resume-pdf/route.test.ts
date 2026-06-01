import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { generateResumeHTML } from '../../../lib/utils/resumePdfGenerator';
import { BaseResumeData } from '../../../types/resume';

vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        setContent: vi.fn().mockResolvedValue(undefined),
        pdf: vi.fn().mockResolvedValue(Buffer.from('mock-pdf-content')),
      }),
      close: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

vi.mock('../../../lib/data/resume-loader', () => ({
  getResumeData: vi.fn((country) => ({
    personalInfo: {
      name: 'Subhash Mahimaluri',
      title: 'Software Engineer',
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Earth',
      linkedin: '',
      github: '',
      calendly: '',
      summary: ''
    },
    experience: [],
    skills: { frontend: [], backend: [], cloud: [], testing: [], ai: [], architecture: [], coreCompetencies: [] },
    education: [],
    certifications: [{ name: 'AWS Certified' }],
    languages: [],
    availability: 'Available immediately',
    workAuthorization: 'Authorized to work'
  }))
}));

describe('GET /api/resume-pdf', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid country parameter without launching Puppeteer', async () => {
    const req = new Request('http://localhost/api/resume-pdf?country=france');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toEqual({ error: 'Invalid country parameter' });
    // AC9(f): validation rejects before any Puppeteer launch.
    const puppeteer = await import('puppeteer');
    expect(vi.mocked(puppeteer.default.launch)).not.toHaveBeenCalled();
  });

  it('returns application/pdf with default uae country', async () => {
    const req = new Request('http://localhost/api/resume-pdf');
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/pdf');
    expect(res.headers.get('Content-Disposition')).toContain('filename="Subhash_Mahimaluri_Resume_uae.pdf"');
  });

  it('returns 500 if Puppeteer fails', async () => {
    const puppeteer = await import('puppeteer');
    vi.mocked(puppeteer.default.launch).mockRejectedValueOnce(new Error('Browser crash'));
    
    const req = new Request('http://localhost/api/resume-pdf?country=uk');
    const res = await GET(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data).toEqual({ error: 'PDF generation failed' });
  });
});

describe('generateResumeHTML', () => {
  const mockData: BaseResumeData = {
    personalInfo: {
      name: 'Subhash Mahimaluri',
      title: 'Dev',
      email: 'a@b.com',
      phone: '123',
      location: 'UK',
      linkedin: '',
      github: '',
      calendly: '',
      summary: ''
    },
    experience: [],
    skills: { frontend: [], backend: [], cloud: [], testing: [], ai: [], architecture: [], coreCompetencies: [] },
    education: [],
    certifications: [{ name: 'AWS Certified' }],
    languages: [],
    availability: 'Available immediately',
    workAuthorization: 'Authorized to work'
  };

  it('starts with <!DOCTYPE html and includes personal name', () => {
    const html = generateResumeHTML(mockData, 'uae');
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('Subhash Mahimaluri');
  });

  it('escapes <script> tags', () => {
    const maliciousData = { ...mockData, personalInfo: { ...mockData.personalInfo, name: '<script>alert(1)</script>' } };
    const html = generateResumeHTML(maliciousData, 'uae');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('renders **bold** as <strong>bold</strong>', () => {
    const boldData = { ...mockData, professionalSummary: 'I am **very** good.' };
    const html = generateResumeHTML(boldData, 'uae');
    expect(html).toContain('I am <strong>very</strong> good.');
  });

  it('omits Certifications when country is uk', () => {
    const html = generateResumeHTML(mockData, 'uk');
    expect(html).not.toContain('AWS Certified');
    expect(html).not.toContain('<h2>Certifications</h2>');
  });

  it('renders experience highlights and education entries (with/without institution)', () => {
    const populated: BaseResumeData = {
      ...mockData,
      experience: [
        {
          id: 'e1', company: 'ACME', role: 'Lead', location: 'Berlin',
          startDate: '2019', endDate: 'present', highlights: ['Did **things**'],
        },
      ],
      education: [
        { degree: 'MSc', field: 'CS', institution: 'TU Berlin', year: '2015' },
        { degree: 'BSc', field: 'Math' }, // no institution → exercises the ternary's false branch
      ],
    };
    const html = generateResumeHTML(populated, 'uae');
    expect(html).toContain('Lead at ACME');
    expect(html).toContain('<li>Did <strong>things</strong></li>');
    expect(html).toContain('MSc in CS - TU Berlin');
    expect(html).toContain('BSc in Math');
  });
});
