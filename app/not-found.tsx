import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="page" aria-labelledby="nf-title">
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="eyebrow">404</span>
        <h1 id="nf-title" style={{ marginTop: 'var(--s-5)', fontSize: 'clamp(32px, 6vw, 52px)' }}>
          Page not found
        </h1>
        <p className="lead" style={{ marginInline: 'auto' }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="hero-ctas" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" href="/">
            Back to home
          </Link>
          <Link className="btn btn-outline" href="/portfolio">
            View portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
