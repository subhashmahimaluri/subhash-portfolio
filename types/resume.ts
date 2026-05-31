export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  calendly: string;
  summary: string;
  website?: string;
}

export interface Project {
  name: string;
  duration: string;
  link?: string;
  description: string[];
  technologies: string[];
  highlights?: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string; // ISO date string
  endDate: string | 'present';
  highlights: string[];
  projects?: Project[];
}

export interface Skills {
  coreSkills?: string[];
  searchKeywords?: string[];
  frontend: string[];
  backend: string[];
  cloud: string[];
  testing: string[];
  ai: string[];
  architecture: string[];
  coreCompetencies: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution?: string;
  year?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  year?: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface BaseResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  skills: Skills;
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  workAuthorization?: string;
  availability?: string;
  references?: string;
}

export interface CountryOverrides {
  personalInfo?: Partial<PersonalInfo>;
  workAuthorization?: string;
  professionalSummary?: string;
  references?: string;
  gdprNotice?: string;
  languageRequirement?: string;
  truncateExperience?: number;
  maxPages?: number;
  additionalSections?: Record<string, string>;
  hideSections?: string[];
}

export type Country = 'india' | 'uae' | 'germany' | 'uk' | 'eu';

export interface CountryOverride extends Partial<BaseResumeData> {
  truncateExperience?: number;
  maxPages?: number;
  // Allows for additional fields specific to an override that are not in BaseResumeData
  [key: string]: unknown;
}

