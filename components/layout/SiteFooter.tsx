interface SocialLink {
  label: string;
  href: string;
}

const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/subhash-mahimaluri' },
  { label: 'GitHub', href: 'https://github.com/subhashmahimaluri' },
  { label: 'Email', href: 'mailto:subhashmahimaluri@gmail.com' },
  { label: 'Schedule a Call', href: 'https://cal.com/subhashmt' },
];

/**
 * Site footer (V2 mock). Server Component — brand line plus the four external
 * contact links, each opening in a new tab with a safe `rel`.
 */
export const SiteFooter = () => {
  return (
    <footer className="site-footer no-print">
      <p className="text-[var(--text-soft)]">
        subhashai.cloud · © 2026 Subhash Mahimaluri
      </p>

      <ul className="flex flex-wrap items-center gap-x-[var(--s-6)] gap-y-[var(--s-2)]">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.href}>
            <a
              className="rounded-[var(--r-sm)] text-[var(--text-soft)] transition-colors hover:text-[var(--text-faint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
};
