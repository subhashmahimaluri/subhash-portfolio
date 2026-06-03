const ORGANISATIONS: ReadonlyArray<string> = [
  'National Grid UK',
  'Shell',
  'Intuit',
  'TimeInc',
];

/**
 * "Trusted by" enterprise wordmarks (V2 mock).
 */
export function TrustedBy() {
  return (
    <section className="trusted" aria-labelledby="trusted-title">
      <div className="container">
        <h2 id="trusted-title" className="section-label">
          Trusted by Enterprise Teams At
        </h2>
        <ul className="wordmarks">
          {ORGANISATIONS.map((org) => (
            <li key={org}>{org}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
