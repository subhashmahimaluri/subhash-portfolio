export default function Loading() {
  return (
    <section className="page" aria-busy="true" aria-live="polite">
      <div className="container" style={{ textAlign: 'center', color: 'var(--text-soft)' }}>
        <span className="sr-only">Loading…</span>
        <p className="lead" style={{ marginInline: 'auto' }} aria-hidden="true">
          Loading…
        </p>
      </div>
    </section>
  );
}
