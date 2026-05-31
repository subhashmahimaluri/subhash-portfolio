import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PortfolioPage from './page';

import projectsData from '@/lib/data/portfolio/projects.json';

describe('PortfolioPage', () => {
  it('renders exactly one h1 with text Portfolio', () => {
    render(<PortfolioPage />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(/^Portfolio$/);
  });

  it('renders all project titles from the JSON as h2', () => {
    render(<PortfolioPage />);
    projectsData.forEach(project => {
      const h2 = screen.getByRole('heading', { level: 2, name: project.title });
      expect(h2).toBeDefined();
    });
  });

  it('displays company and at least one technology for every project', () => {
    render(<PortfolioPage />);
    projectsData.forEach(project => {
      // Check for company name
      const companyElements = screen.getAllByText(new RegExp(project.company, 'i'));
      expect(companyElements.length).toBeGreaterThan(0);
      
      // Check for at least one technology
      const tech = project.technologies[0];
      const techElements = screen.getAllByText(tech);
      expect(techElements.length).toBeGreaterThan(0);
    });
  });

  it('shows fallback message when projects array is empty', async () => {
    vi.doMock('@/lib/data/portfolio/projects.json', () => ({
      default: []
    }));
    
    // Reset modules to clear cache for the mock change
    vi.resetModules();
    const FreshPortfolioPage = (await import('./page')).default;
    render(<FreshPortfolioPage />);
    
    expect(screen.getByText('No projects to display.')).toBeDefined();
  });
});
