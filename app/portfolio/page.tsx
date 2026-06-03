import type { Metadata } from 'next';
import projectsData from '@/lib/data/portfolio/projects.json';
import { PortfolioProject, PROJECT_CATEGORIES } from '@/types/portfolio';

const projects = projectsData as PortfolioProject[];

export const generateMetadata = (): Metadata => {
  return {
    title: 'Portfolio',
    description:
      'Explore a curated collection of software development projects, showcasing expertise in frontend, fullstack, AI/ML, enterprise, and cloud solutions.',
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
      <section className="page" aria-labelledby="portfolio-title">
        <div className="container">
          <header className="page-head">
            <h1 id="portfolio-title">Portfolio</h1>
          </header>
          <p style={{ textAlign: 'center', color: 'var(--text-soft)' }}>
            No projects to display.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="page" aria-labelledby="portfolio-title">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">Selected Work</span>
          <h1 id="portfolio-title">Portfolio</h1>
          <p className="lead">
            A curated selection of projects across platforms, AI, and cloud systems — each
            highlighting the challenge, the solution, and the impact.
          </p>
        </header>

        <ul role="list" className="cards-grid" style={{ listStyle: 'none', padding: 0 }}>
          {projects.map((project) => (
            <li key={project.id}>
              <article
                tabIndex={0}
                className="data-card"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <header
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 'var(--s-3)',
                    marginBottom: 'var(--s-3)',
                  }}
                >
                  <span className="section-title" style={{ margin: 0 }}>
                    {PROJECT_CATEGORIES[project.category]}
                  </span>
                  {project.featured && (
                    <span className="featured-marker" style={{ color: 'var(--accent-on)' }}>
                      <span aria-hidden="true">★</span> Featured
                    </span>
                  )}
                </header>

                <h2 style={{ fontSize: 20 }}>{project.title}</h2>
                <p style={{ color: 'var(--link-strong)', fontWeight: 600, marginTop: 'var(--s-1)' }}>
                  {project.company} &middot; {project.role}
                </p>
                <p className="when" style={{ marginTop: 'var(--s-1)' }}>
                  {project.duration}
                </p>
                <p style={{ color: 'var(--text-soft)', margin: 'var(--s-4) 0', flexGrow: 1 }}>
                  {project.description}
                </p>

                <ul className="tag-row">
                  {project.technologies.map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
