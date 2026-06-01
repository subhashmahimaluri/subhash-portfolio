import Link from 'next/link';

const CAL_URL = 'https://cal.com/subhashmt';

/**
 * Homepage hero (V2 mock) — eyebrow pill, gradient name, role line, bio, and
 * the primary "View Resume" / "Schedule a Call" CTAs.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-inner">
          <span className="pill">
            <span className="dot" aria-hidden="true" />
            Solution Architect
          </span>
          <h1 id="hero-title">Subhash Mahimaluri</h1>
          <p className="role">Solution Architect · Cloud Architect · AI Systems</p>
          <p className="bio">
            15+ years building scalable platforms for Fortune 500 enterprises including
            National Grid UK, Shell, and Intuit. Expert in React, Next.js, React Native,
            TypeScript, AI/LLM systems, and cloud architecture.
          </p>
          <div className="hero-ctas">
            <Link className="btn btn-primary" href="/resume" aria-label="View resume">
              View Resume <span aria-hidden="true">→</span>
            </Link>
            <a
              className="btn btn-outline"
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Schedule a call"
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
