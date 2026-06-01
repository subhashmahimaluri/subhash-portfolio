interface Stat {
  value: string;
  suffix?: string;
  label: string;
}

const STATS: ReadonlyArray<Stat> = [
  { value: '15', suffix: '+', label: 'Years' },
  { value: '40', suffix: '%', label: 'Perf Gains' },
  { value: '25', suffix: '%', label: 'Cost Cut' },
  { value: '3', label: 'Fortune 500' },
];

/**
 * Career-highlight stats (V2 mock). Static figures — no client-side count-up —
 * so they render server-side and are correct with JS disabled.
 */
export function Stats() {
  return (
    <section className="stats" aria-label="Career highlights">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="num">
                <span>{stat.value}</span>
                {stat.suffix ? <em>{stat.suffix}</em> : null}
              </div>
              <div className="label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
