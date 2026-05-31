import { expect, test } from 'vitest';
import {
  PersonalInfo,
  Project,
  Experience,
  Skills,
  Education,
  Certification,
  Language,
  BaseResumeData,
  CountryOverrides,
  Country,
  COUNTRIES,
} from '../src/types/resume';

test('PersonalInfo interface structure', () => {
  const testPersonalInfo: PersonalInfo = {
    name: 'John Doe',
    title: 'Software Engineer',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    calendly: 'calendly.com/johndoe',
    summary: 'Experienced developer.',
  };
  expect(testPersonalInfo).toBeDefined();
});

test('Project interface structure', () => {
  const testProject: Project = {
    name: 'E-commerce Platform',
    duration: '6 months',
    description: ['Developed a full-stack e-commerce platform.'],
    technologies: ['React', 'Node.js', 'MongoDB'],
  };
  expect(testProject).toBeDefined();
});

test('Experience interface structure', () => {
  const testExperience: Experience = {
    id: 'exp1',
    company: 'Tech Solutions Inc.',
    role: 'Lead Developer',
    location: 'Remote',
    startDate: '2020-01-01',
    endDate: 'present',
    highlights: ['Led a team of 5 developers.'],
    projects: [],
  };
  expect(testExperience).toBeDefined();
});

test('Skills interface structure', () => {
  const testSkills: Skills = {
    frontend: ['React', 'Next.js'],
    backend: ['Node.js', 'Express'],
    cloud: ['AWS', 'Azure'],
    testing: ['Jest', 'Vitest'],
    ai: ['TensorFlow'],
    architecture: ['Microservices'],
    coreCompetencies: ['Agile', 'DevOps'],
  };
  expect(testSkills).toBeDefined();
});

test('Education interface structure', () => {
  const testEducation: Education = {
    degree: 'M.Sc.',
    field: 'Computer Science',
    institution: 'University of Example',
    year: '2018',
  };
  expect(testEducation).toBeDefined();
});

test('Certification interface structure', () => {
  const testCertification: Certification = {
    name: 'AWS Certified Developer',
    issuer: 'Amazon',
    year: '2021',
  };
  expect(testCertification).toBeDefined();
});

test('Language interface structure', () => {
  const testLanguage: Language = {
    language: 'English',
    proficiency: 'Native',
  };
  expect(testLanguage).toBeDefined();
});

test('BaseResumeData interface structure', () => {
  const fullResumeData: BaseResumeData = {
    personalInfo: {
      name: 'Jane Doe',
      title: 'Senior Engineer',
      email: 'jane.doe@example.com',
      phone: '098-765-4321',
      location: 'London, UK',
      linkedin: 'linkedin.com/in/janedoe',
      github: 'github.com/janedoe',
      calendly: 'calendly.com/janedoe',
      summary: 'Passionate about web development.',
      website: 'janedoe.com',
    },
    experience: [
      {
        id: 'exp2',
        company: 'Innovate Co.',
        role: 'Software Engineer',
        location: 'London',
        startDate: '2018-05-01',
        endDate: '2020-12-31',
        highlights: ['Developed critical features.'],
      },
    ],
    skills: {
      frontend: ['Vue.js'],
      backend: ['Python', 'Django'],
      cloud: ['GCP'],
      testing: ['Cypress'],
      ai: [],
      architecture: [],
      coreCompetencies: ['Mentoring'],
      coreSkills: ['Leadership'],
    },
    education: [
      {
        degree: 'B.Eng.',
        field: 'Software Engineering',
        institution: 'Another University',
        year: '2016',
      },
    ],
    certifications: [],
    languages: [{ language: 'French', proficiency: 'Fluent' }],
    workAuthorization: 'UK Citizen',
    availability: 'Immediate',
    references: 'Available upon request',
  };
  expect(fullResumeData).toBeDefined();
});

test('CountryOverrides interface structure', () => {
  const overrides: CountryOverrides = {
    personalInfo: {
      location: 'Dubai, UAE',
    },
    gdprNotice: 'GDPR compliance applied.',
    truncateExperience: 2,
    hideSections: ['references'],
  };
  expect(overrides).toBeDefined();
});

test('Country and COUNTRIES constant', () => {
  const expectedCountries: Country[] = ['india', 'uae', 'germany', 'uk', 'eu'];
  expect(Object.keys(COUNTRIES)).toHaveLength(expectedCountries.length);
  expectedCountries.forEach(country => {
    expect(Object.keys(COUNTRIES)).toContain(country);
    expect(typeof COUNTRIES[country]).toBe('string');
    expect(COUNTRIES[country]).not.toBe('');
  });
});
