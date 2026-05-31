import { Metadata } from 'next';
import Link from 'next/link';
import { getAvailableCountries, COUNTRIES } from '@/lib/data/resume-loader';

export const metadata: Metadata = {
  title: 'Resume',
  description: "Explore Subhash Mahimaluri's tailored resumes for various international markets.",
};

export default function ResumeMarketPage() {
  const countries = getAvailableCountries();

  return (
    <main role="main" className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
        Choose Your Resume Market
      </h1>
      <p className="text-xl text-center text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Select a country or region below to view my tailored resume for that market.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <li key={country}>
            <Link
              href={`/resume/${country}`}
              aria-label={`View ${COUNTRIES[country]} resume`}
              className="group relative flex flex-col items-center justify-center h-full p-6
                         border border-blue-800 bg-white dark:bg-gray-800 rounded-lg shadow-sm
                         hover:shadow-md transition-shadow duration-200
                         focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
            >
              <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {COUNTRIES[country]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
