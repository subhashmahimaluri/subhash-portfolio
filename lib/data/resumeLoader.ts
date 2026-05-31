import { BaseResumeData, Country } from '../../types/resume';

// Dummy implementation to satisfy dependencies.
// In a real scenario, this would load and merge JSON files.
export function getResumeData(country: Country): BaseResumeData {
  return {
    personalInfo: {
      name: 'Subhash Mahimaluri',
      title: 'Software Engineer',
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Earth',
      linkedin: 'linkedin.com/in/test',
      github: 'github.com/test',
      calendly: 'cal.com/test',
      summary: 'A summary'
    },
    experience: [],
    skills: {
      frontend: ['React'],
      backend: ['Node.js'],
      cloud: [],
      testing: [],
      ai: [],
      architecture: [],
      coreCompetencies: []
    },
    education: [],
    certifications: [],
    languages: []
  };
}
