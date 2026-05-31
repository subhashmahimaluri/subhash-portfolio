import { Metadata } from 'next';
import projectsData from '@/lib/data/portfolio/projects.json';
import { PortfolioProject, PROJECT_CATEGORIES } from '@/types/portfolio';

const projects = projectsData as PortfolioProject[];

export const generateMetadata = (): Metadata => {
  return {
    title: 'Portfolio',
    description: 'Explore a curated collection of software development projects, showcasing expertise in frontend, fullstack, AI/ML, enterprise, and cloud solutions.',
    openGraph: {
      title: 'Portfolio | Subhash Mahimaluri',
      description: 'Explore a curated collection of software development projects.',
      type: 'website',
    },
  };
};

export default function PortfolioPage() {
  if (projects.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-navy-600 dark:text-orange-100">Portfolio</h1>
        <p>No projects to display.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4 text-navy-600 dark:text-orange-100">Portfolio</h1>
      <p className="text-lg mb-12 text-gray-700 dark:text-gray-300 max-w-3xl">
        Welcome to my portfolio, a curated selection of projects demonstrating my expertise in various domains. 
        Each project highlights key challenges, solutions, and impact.
      </p>

      <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <li key={project.id}>
          <article
            tabIndex={0}
            className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 dark:focus-visible:ring-orange-500"
          >
            <header className="flex justify-between items-start mb-2">
              <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 rounded">
                {PROJECT_CATEGORIES[project.category]}
              </span>
              {project.featured && (
                <span className="text-xs font-semibold text-navy-600 dark:text-orange-400 flex items-center">
                  <span className="mr-1">★</span> Featured
                </span>
              )}
            </header>

            <h2 className="text-xl font-bold mb-1 text-navy-600 dark:text-gray-100">
              {project.title}
            </h2>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {project.company} &middot; {project.role}
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              {project.duration}
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
              {project.description}
            </p>
            
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
