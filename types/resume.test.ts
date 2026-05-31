import { describe, expect, it } from 'vitest';
import {
  BaseResumeData,
  Certification,
  COUNTRIES,
  Country,
  CountryOverrides,
  Education,
  Experience,
  Language,
  PersonalInfo,
  Project,
  Skills,
} from './resume';

describe('types/resume.ts', () => {
  it('PersonalInfo interface should be assignable', () => {
    const personalInfo: PersonalInfo = {
      calendly: 'https://calendly.com/test',
      email: 'test@example.com',
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
      location: 'Test City, TS',
      name: 'Test Name',
      phone: '123-456-7890',
      summary: 'A highly skilled professional.',
      title: 'Senior Developer',
      website: 'https://test.com',
    };
    expect(personalInfo).toBeDefined();
  });

  it('Project interface should be assignable', () => {
    const project: Project = {
      description: ['Developed feature A', 'Optimized performance'],
      duration: '6 months',
      highlights: ['Achieved X', 'Reduced Y'],
      link: 'https://project.com',
      name: 'Test Project',
      technologies: ['React', 'Node.js'],
    };
    expect(project).toBeDefined();
  });

  it('Experience interface should be assignable', () => {
    const experience: Experience = {
      company: 'Tech Corp',
      endDate: 'present',
      highlights: ['Led team', 'Mentored juniors'],
      id: 'exp1',
      location: 'Remote',
      projects: [
        {
          description: ['Built dashboard'],
          duration: '3 months',
          name: 'Dashboard',
          technologies: ['Vue'],
        },
      ],
      role: 'Software Engineer',
      startDate: '2020-01-01',
    };
    expect(experience).toBeDefined();
  });

  it('Skills interface should be assignable', () => {
    const skills: Skills = {
      ai: ['ML', 'NLP'],
      architecture: ['Microservices', 'Event-driven'],
      backend: ['Python', 'Go'],
      cloud: ['AWS', 'Azure'],
      coreCompetencies: ['Agile', 'Problem Solving'],
      coreSkills: ['TypeScript', 'JavaScript'],
      frontend: ['React', 'Next.js'],
      searchKeywords: ['Developer', 'Engineer'],
      testing: ['Jest', 'Playwright'],
    };
    expect(skills).toBeDefined();
  });

  it('Education interface should be assignable', () => {
    const education: Education = {
      degree: 'M.Sc.',
      field: 'Computer Science',
      institution: 'University of Test',
      year: '2018',
    };
    expect(education).toBeDefined();
  });

  it('Certification interface should be assignable', () => {
    const certification: Certification = {
      issuer: 'AWS',
      name: 'Certified Developer',
      year: '2021',
    };
    expect(certification).toBeDefined();
  });

  it('Language interface should be assignable', () => {
    const language: Language = {
      language: 'English',
      proficiency: 'Fluent',
    };
    expect(language).toBeDefined();
  });

  it('BaseResumeData interface should be assignable with all fields', () => {
    const resumeData: BaseResumeData = {
      availability: 'Immediately',
      certifications: [
        { name: 'Certified Scrum Master' },
      ],
      education: [
        { degree: 'B.Sc.', field: 'Software Engineering', institution: 'Test Uni' },
      ],
      experience: [
        {
          company: 'Org A',
          endDate: '2023-12-31',
          highlights: ['Achieved X'],
          id: 'orgA',
          location: 'Anywhere',
          role: 'Dev',
          startDate: '2020-01-01',
        },
      ],
      languages: [
        { language: 'Spanish', proficiency: 'Conversational' },
      ],
      personalInfo: {
        calendly: 'link',
        email: 'email',
        github: 'link',
        linkedin: 'link',
        location: 'Earth',
        name: 'John Doe',
        phone: '123',
        summary: 'Summary',
        title: 'Engineer',
      },
      references: 'Available upon request',
      skills: {
        ai: [],
        architecture: [],
        backend: [],
        cloud: [],
        coreCompetencies: [],
        frontend: [],
        testing: [],
      },
      workAuthorization: 'US Citizen',
    };
    expect(resumeData).toBeDefined();
  });

  it('CountryOverrides interface should be assignable', () => {
    const overrides: CountryOverrides = {
      additionalSections: { 'custom': 'Custom Content' },
      gdprNotice: 'GDPR info here',
      hideSections: ['education'],
      languageRequirement: 'English only',
      maxPages: 2,
      personalInfo: { email: 'new@example.com', phone: '987-654-3210' },
      professionalSummary: 'New summary for country',
      references: 'References upon request for country X',
      truncateExperience: 3,
      workAuthorization: 'Visa required',
    };
    expect(overrides).toBeDefined();

    // Check partial personalInfo
    expect(overrides.personalInfo?.email).toBe('new@example.com');
  });

  it('Country union type should contain expected members', () => {
    const country: Country = 'india';
    expect(country).toBe('india');
    // Ensure type checking for other members
    const country2: Country = 'uae';
    const country3: Country = 'germany';
    const country4: Country = 'uk';
    const country5: Country = 'eu';
    expect(country2).toBe('uae');
    expect(country3).toBe('germany');
    expect(country4).toBe('uk');
    expect(country5).toBe('eu');
  });

  it('COUNTRIES constant should have exactly five entries', () => {
    expect(Object.keys(COUNTRIES)).toHaveLength(5);
  });

  it('COUNTRIES constant should map each Country key to a human-readable label', () => {
    expect(COUNTRIES).toHaveProperty('india');
    expect(COUNTRIES.india).toBe('India');
    expect(COUNTRIES).toHaveProperty('uae');
    expect(COUNTRIES.uae).toBe('UAE / Dubai');
    expect(COUNTRIES).toHaveProperty('germany');
    expect(COUNTRIES.germany).toBe('Germany');
    expect(COUNTRIES).toHaveProperty('uk');
    expect(COUNTRIES.uk).toBe('United Kingdom');
    expect(COUNTRIES).toHaveProperty('eu');
    expect(COUNTRIES.eu).toBe('European Union');
  });
});
