'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the server logs / monitoring.
    console.error(error);
  }, [error]);

  return (
    <section className="page" aria-labelledby="err-title">
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="eyebrow">Something went wrong</span>
        <h1 id="err-title" style={{ marginTop: 'var(--s-5)', fontSize: 'clamp(30px, 5vw, 46px)' }}>
          An unexpected error occurred
        </h1>
        <p className="lead" style={{ marginInline: 'auto' }}>
          Sorry about that — please try again. If the problem persists, reach out via the contact
          page.
        </p>
        <div className="hero-ctas" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn btn-primary" onClick={reset}>
            Try again
          </button>
          {/* Full reload (not next/link) intentionally resets app state after an error. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="btn btn-outline" href="/">
            Back to home
          </a>
        </div>
      </div>
    </section>
  );
}
