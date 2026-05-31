import { expect, test } from 'vitest';
import { PortfolioProject, PROJECT_CATEGORIES } from '../types/portfolio';

test('PortfolioProject interface structure', () => {
  const testPortfolioProject: PortfolioProject = {
    id: 'proj1',
    title: 'Enterprise CRM System',
    company: 'Global Corp',
    role: 'Full Stack Developer',
    duration: '18 months',
    description: 'Developed a robust CRM system for enterprise clients.',
    challenges: ['Integrating legacy systems', 'Scaling for large data volumes'],
    solutions: ['Microservices architecture', 'Optimized database queries'],
    impact: ['Improved sales efficiency by 20%', 'Reduced data processing time'],
    technologies: ['React', 'Spring Boot', 'PostgreSQL', 'AWS'],
    category: 'enterprise',
    featured: true,
  };
  expect(testPortfolioProject).toBeDefined();
});

test('PROJECT_CATEGORIES constant', () => {
  const expectedCategories: PortfolioProject['category'][] = [
    'enterprise',
    'ai-ml',
    'frontend',
    'fullstack',
    'cloud',
  ];
  expect(Object.keys(PROJECT_CATEGORIES)).toHaveLength(expectedCategories.length);
  expectedCategories.forEach(category => {
    expect(Object.keys(PROJECT_CATEGORIES)).toContain(category);
    expect(typeof PROJECT_CATEGORIES[category]).toBe('string');
    expect(PROJECT_CATEGORIES[category]).not.toBe('');
  });
});
