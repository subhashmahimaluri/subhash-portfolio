interface SocialLink {
  label: string;
  href: string;
  external?: boolean;
}

const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/subhash-mahimaluri', external: true },
  { label: 'GitHub', href: 'https://github.com/subhashmahimaluri', external: true },
  { label: 'Email', href: 'mailto:subhashmahimaluri@gmail.com', external: true },
  { label: 'Schedule a Call', href: 'https://cal.com/subhashmt', external: true },
];

/**
 * Site footer (V2 mock). Server Component — brand line plus the four external
 * contact links, each opening in a new tab with a safe `rel`.
 */
export const SiteFooter = () => {
  return (
    <footer className="site-footer no-print">
      <div className="container">
        <div className="footer-inner">
          <p className="footer-brand">
            <strong>subhashai.cloud</strong> · © 2026 Subhash Mahimaluri
          </p>

          <ul className="footer-links">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
