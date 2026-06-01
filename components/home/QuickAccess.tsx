import Link from 'next/link';
import type { ReactNode } from 'react';

interface QuickCard {
  label: string;
  href: string;
  description: string;
  icon: ReactNode;
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const QUICK_CARDS: ReadonlyArray<QuickCard> = [
  {
    label: 'Resume',
    href: '/resume',
    description: 'Full work history, achievements, and downloadable PDF.',
    icon: (
      <svg {...iconProps}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h6" />
      </svg>
    ),
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    description: 'Selected projects across platforms, AI, and cloud systems.',
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    label: 'Education',
    href: '/education',
    description: 'Academic background, certifications, and credentials.',
    icon: (
      <svg {...iconProps}>
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
      </svg>
    ),
  },
  {
    label: 'React Interview Q&A',
    href: '/react-interview-questions',
    description: 'A curated library of React interview questions and answers.',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="2.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    label: 'Contact',
    href: '/contact',
    description: 'Get in touch about roles, consulting, or collaboration.',
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m4 7 8 5 8-5" />
      </svg>
    ),
  },
  {
    label: 'Featured Work',
    href: '/portfolio',
    description: 'GatheredHQ & RexQR — SaaS platforms built end to end.',
    icon: (
      <svg {...iconProps}>
        <polygon points="12 2 15.1 8.6 22 9.3 16.8 14 18.3 21 12 17.4 5.7 21 7.2 14 2 9.3 8.9 8.6 12 2" />
      </svg>
    ),
  },
];

/**
 * Quick-access card grid (V2 mock). Each card is a glass panel whose whole
 * surface is clickable via the heading link's stretched `::after`.
 */
export function QuickAccess() {
  return (
    <section className="quick" aria-labelledby="quick-title">
      <div className="container">
        <h2 id="quick-title" className="section-label">
          Quick Access
        </h2>
        <div className="cards-grid">
          {QUICK_CARDS.map((card) => (
            <div className="qcard" key={card.label}>
              <span className="badge" aria-hidden="true">
                {card.icon}
              </span>
              <h3>
                <Link href={card.href}>{card.label}</Link>
              </h3>
              <p>{card.description}</p>
              <span className="go">
                Open <span className="arrow" aria-hidden="true">→</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
