export interface Certification {
  issuer?: string;
  name: string;
  year?: string;
}

export type Country = 'india' | 'uae' | 'germany' | 'uk' | 'eu';

export const COUNTRIES: Record<Country, string> = {
  'eu': 'European Union',
  'germany': 'Germany',
  'india': 'India',
  'uk': 'United Kingdom',
  'uae': 'UAE / Dubai',
};

export interface CountryOverrides {
  additionalSections?: Record<string, string>;
  gdprNotice?: string;
  hideSections?: string[];
  languageRequirement?: string;
  maxPages?: number;
  personalInfo?: Partial<PersonalInfo>;
  professionalSummary?: string;
  references?: string;
  truncateExperience?: number;
  workAuthorization?: string;
}

export interface Education {
  degree: string;
  field: string;
  institution?: string;
  year?: string;
}

export interface Experience {
  company: string;
  endDate: string | 'present';
  highlights: string[];
  id: string;
  location: string;
  projects?: Project[];
  role: string;
  startDate: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface PersonalInfo {
  calendly: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  name: string;
  phone: string;
  summary: string;
  title: string;
  website?: string;
}

export interface Project {
  description: string[];
  duration: string;
  highlights?: string[];
  link?: string;
  name: string;
  technologies: string[];
}

export interface Skills {
  ai: string[];
  architecture: string[];
  backend: string[];
  cloud: string[];
  coreCompetencies: string[];
  coreSkills?: string[];
  frontend: string[];
  searchKeywords?: string[];
  testing: string[];
}

export interface BaseResumeData {
  availability?: string;
  certifications: Certification[];
  education: Education[];
  experience: Experience[];
  languages: Language[];
  personalInfo: PersonalInfo;
  references?: string;
  skills: Skills;
  workAuthorization?: string;
}
