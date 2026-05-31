import { describe, expect, it } from 'vitest';
import { PortfolioCategory, PortfolioProject, PROJECT_CATEGORIES } from './portfolio';

describe('types/portfolio.ts', () => {
  it('PortfolioCategory union type should contain expected members', () => {
    const category1: PortfolioCategory = 'enterprise';
    expect(category1).toBe('enterprise');
    const category2: PortfolioCategory = 'ai-ml';
    expect(category2).toBe('ai-ml');
    const category3: PortfolioCategory = 'frontend';
    expect(category3).toBe('frontend');
    const category4: PortfolioCategory = 'fullstack';
    expect(category4).toBe('fullstack');
    const category5: PortfolioCategory = 'cloud';
    expect(category5).toBe('cloud');
  });

  it('PortfolioProject interface should be assignable', () => {
    const project: PortfolioProject = {
      category: 'enterprise',
      challenges: ['Scalability', 'Integration'],
      company: 'Global Corp',
      description: 'Developed a large-scale enterprise application.',
      duration: '18 months',
      featured: true,
      id: 'proj1',
      impact: ['Increased revenue by 15%', 'Improved efficiency'],
      role: 'Lead Architect',
      solutions: ['Microservices architecture', 'Cloud deployment'],
      technologies: ['Java', 'Spring Boot', 'AWS', 'React'],
      title: 'Enterprise CRM Platform',
    };
    expect(project).toBeDefined();
    expect(project.featured).toBe(true);
    expect(project.category).toBe('enterprise');
  });

  it('PROJECT_CATEGORIES constant should have exactly five entries', () => {
    expect(Object.keys(PROJECT_CATEGORIES)).toHaveLength(5);
  });

  it('PROJECT_CATEGORIES constant should map each category key to a non-empty display label', () => {
    expect(PROJECT_CATEGORIES).toHaveProperty('enterprise');
    expect(PROJECT_CATEGORIES.enterprise).toBe('Enterprise');
    expect(PROJECT_CATEGORIES.enterprise).not.toBe('');

    expect(PROJECT_CATEGORIES).toHaveProperty('ai-ml');
    expect(PROJECT_CATEGORIES['ai-ml']).toBe('AI/ML');
    expect(PROJECT_CATEGORIES['ai-ml']).not.toBe('');

    expect(PROJECT_CATEGORIES).toHaveProperty('frontend');
    expect(PROJECT_CATEGORIES.frontend).toBe('Frontend Architecture');
    expect(PROJECT_CATEGORIES.frontend).not.toBe('');

    expect(PROJECT_CATEGORIES).toHaveProperty('fullstack');
    expect(PROJECT_CATEGORIES.fullstack).toBe('Full Stack');
    expect(PROJECT_CATEGORIES.fullstack).not.toBe('');

    expect(PROJECT_CATEGORIES).toHaveProperty('cloud');
    expect(PROJECT_CATEGORIES.cloud).toBe('Cloud Infrastructure');
    expect(PROJECT_CATEGORIES.cloud).not.toBe('');
  });
});
