'use client';

import { useEffect } from 'react';

/**
 * Catches errors thrown in the root layout itself. It must render its own
 * <html>/<body> because the layout failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#0a0f1e',
          color: '#e6ecf5',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Something went wrong</h1>
          <p style={{ color: '#9aa7bd', marginBottom: '24px' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#ff6b35',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              padding: '12px 24px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
