import type { Metadata } from 'next';
import Link from 'next/link';
import { getAvailableCountries, COUNTRIES } from '@/lib/data/resume-loader';

export const metadata: Metadata = {
  title: 'Resume',
  description: "Explore Subhash Mahimaluri's tailored resumes for various international markets.",
};

export default function ResumeMarketPage() {
  const countries = getAvailableCountries();

  return (
    <section className="page" aria-labelledby="resume-title">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">Resume</span>
          <h1 id="resume-title">Choose Your Resume Market</h1>
          <p className="lead">
            Select a country or region below to view my tailored resume for that market.
          </p>
        </header>

        <ul className="data-grid" style={{ listStyle: 'none', padding: 0 }}>
          {countries.map((country) => (
            <li key={country}>
              <Link
                href={`/resume/${country}`}
                aria-label={`View ${COUNTRIES[country]} resume`}
                className="data-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: 120,
                  fontFamily: 'var(--font-sora), sans-serif',
                  fontWeight: 700,
                  fontSize: 20,
                  color: 'var(--text)',
                }}
              >
                {COUNTRIES[country]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
