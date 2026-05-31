export type PortfolioCategory = 'enterprise' | 'ai-ml' | 'frontend' | 'fullstack' | 'cloud';

export const PROJECT_CATEGORIES: Record<PortfolioCategory, string> = {
  'ai-ml': 'AI/ML',
  'cloud': 'Cloud Infrastructure',
  'enterprise': 'Enterprise',
  'frontend': 'Frontend Architecture',
  'fullstack': 'Full Stack',
};

export interface PortfolioProject {
  category: PortfolioCategory;
  challenges: string[];
  company: string;
  description: string;
  duration: string;
  featured: boolean;
  id: string;
  impact: string[];
  role: string;
  solutions: string[];
  technologies: string[];
  title: string;
}
