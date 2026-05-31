export interface PortfolioProject {
  id: string;
  title: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  challenges: string[];
  solutions: string[];
  impact: string[];
  technologies: string[];
  category: 'enterprise' | 'ai-ml' | 'frontend' | 'fullstack' | 'cloud';
  featured: boolean;
}

export const PROJECT_CATEGORIES: Record<PortfolioProject['category'], string> = {
  'enterprise': 'Enterprise',
  'ai-ml': 'AI/ML',
  'frontend': 'Frontend Architecture',
  'fullstack': 'Full Stack',
  'cloud': 'Cloud Infrastructure',
};
