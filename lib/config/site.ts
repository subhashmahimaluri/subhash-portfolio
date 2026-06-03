/**
 * Canonical site configuration — single source of truth for SEO, sitemap,
 * robots, structured data, and the root layout metadata.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://subhashai.cloud').replace(
  /\/$/,
  '',
);

export const SITE_NAME = 'subhashai.cloud';
export const AUTHOR_NAME = 'Subhash Mahimaluri';
export const SITE_TITLE = 'Subhash Mahimaluri — Solution Architect, Cloud & AI Systems';
export const SITE_DESCRIPTION =
  'Subhash Mahimaluri — Lead Software Engineer, React Architect, and AI Systems engineer with 15+ years building scalable platforms for Fortune 500 enterprises including National Grid UK, Shell, and Intuit. Expert in React, Next.js, React Native, TypeScript, AI/LLM systems, agentic architecture, and cloud architecture.';

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/subhash-mahimaluri',
  github: 'https://github.com/subhashmahimaluri',
  email: 'subhashmahimaluri@gmail.com',
  cal: 'https://cal.com/subhashmt',
};
