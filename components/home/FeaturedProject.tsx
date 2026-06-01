const TECH_STACK: ReadonlyArray<string> = [
  'Aider',
  'Gemini 2.5',
  'Azure DevOps',
  'GitHub Actions',
  'Power Automate',
  'MCP',
];

/**
 * Featured project spotlight (V2 mock) — the Sparks open-source harness, in a
 * dark gradient card wrapped by an animated conic-gradient border.
 */
export function FeaturedProject() {
  return (
    <section className="featured" aria-labelledby="featured-title">
      <div className="container">
        <div className="featured-shell">
          <article className="featured-card">
            <p className="featured-marker">
              <span className="star" aria-hidden="true">
                ★
              </span>{' '}
              Featured Project
            </p>
            <div className="featured-head">
              <h2 id="featured-title">Sparks</h2>
              <span className="chip">Open Source · 2026</span>
            </div>
            <p className="desc">
              An open-source agentic harness that turns Azure DevOps PBIs into reviewed pull
              requests in minutes. Built on patterns from Stripe Minions, Anthropic harness
              engineering, and Karpathy&apos;s CLAUDE.md principles. Multi-IDE (Copilot, Claude
              Code, Cursor), polyglot, and self-evaluating.
            </p>
            <ul className="tech-chips" aria-label="Sparks technology stack">
              {TECH_STACK.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <div className="featured-actions">
              <a
                className="btn btn-white"
                href="https://github.com/subhashmahimaluri"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
              <a className="btn btn-outline-dark" href="/portfolio">
                Read the Architecture
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
