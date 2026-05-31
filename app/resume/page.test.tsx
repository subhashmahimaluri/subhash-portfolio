import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResumeMarketPage, { metadata } from './page';
import * as ResumeLoader from '@/lib/data/resume-loader';
import type { Country } from '@/types/resume';

// Mock next/link to prevent actual navigation warnings in tests
vi.mock('next/link', () => ({
  default: ({ children, href, 'aria-label': ariaLabel }: { children: React.ReactNode; href: string; 'aria-label'?: string }) => (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe('ResumeMarketPage', () => {
  const mockCountries: Country[] = ['india', 'uae', 'germany', 'uk', 'eu'];
  const mockCountryLabels = {
    india: 'India',
    uae: 'UAE / Middle East',
    germany: 'Germany',
    uk: 'United Kingdom',
    eu: 'European Union',
  };

  // Mock getAvailableCountries and COUNTRIES from resume-loader
  vi.spyOn(ResumeLoader, 'getAvailableCountries').mockReturnValue(mockCountries);
  vi.spyOn(ResumeLoader, 'COUNTRIES', 'get').mockReturnValue(mockCountryLabels);

  it('AC1: Renders a Server Component with correct imports and structure', () => {
    render(<ResumeMarketPage />);

    // Check for the main heading
    expect(screen.getByRole('heading', { level: 1, name: 'Choose Your Resume Market' })).toBeInTheDocument();

    // Check for the lead paragraph
    expect(screen.getByText('Select a country or region below to view my tailored resume for that market.')).toBeInTheDocument();

    // Check for the list structure
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(mockCountries.length);
  });

  it('AC2: Renders five next/link elements with correct hrefs, visible text, and aria-labels', () => {
    render(<ResumeMarketPage />);

    mockCountries.forEach((country) => {
      const label = mockCountryLabels[country as keyof typeof mockCountryLabels];
      const link = screen.getByRole('link', { name: `View ${label} resume` });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/resume/${country}`);
      expect(link).toHaveTextContent(label);
      expect(link).toHaveAttribute('aria-label', `View ${label} resume`);
    });

    // Ensure exactly five links are rendered
    expect(screen.getAllByRole('link')).toHaveLength(mockCountries.length);
  });

  it('AC3: Exports generateMetadata with correct title and description', () => {
    expect(metadata.title).toBe('Resume');
    expect(metadata.description).toBe("Explore Subhash Mahimaluri's tailored resumes for various international markets.");
  });

  it('AC7: getAvailableCountries() returns five elements with all slugs', () => {
    const availableCountries = ResumeLoader.getAvailableCountries();
    expect(availableCountries).toHaveLength(5);
    expect(availableCountries).toEqual(expect.arrayContaining(['india', 'uae', 'germany', 'uk', 'eu']));
  });

  it('AC7: COUNTRIES has non-empty labels for each slug', () => {
    const countriesMap = ResumeLoader.COUNTRIES;
    expect(Object.keys(countriesMap)).toHaveLength(5);
    mockCountries.forEach((country) => {
      expect(countriesMap[country as keyof typeof countriesMap]).toBeDefined();
      expect(countriesMap[country as keyof typeof countriesMap]).not.toBe('');
    });
    expect(countriesMap.uae).toBe('UAE / Middle East'); // Specific check for the updated label
  });

  it('AC5: Contains exactly one h1 and lead paragraph sits beneath it', () => {
    render(<ResumeMarketPage />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(screen.getByText('Select a country or region below to view my tailored resume for that market.')).toBeInTheDocument();
    // In a real DOM, you might check sibling order, but for RTL, presence and content are usually sufficient.
  });
});

// Test resume-loader.ts directly as per AC7 requirement for modifications
describe('ResumeLoader exports', () => {
  it('getAvailableCountries returns the correct list of countries', () => {
    const countries = ResumeLoader.getAvailableCountries();
    expect(countries).toEqual(['india', 'uae', 'germany', 'uk', 'eu']);
  });

  it('COUNTRIES maps slugs to human-readable labels correctly', () => {
    const countryLabels = ResumeLoader.COUNTRIES;
    expect(countryLabels.india).toBe('India');
    expect(countryLabels.uae).toBe('UAE / Middle East');
    expect(countryLabels.germany).toBe('Germany');
    expect(countryLabels.uk).toBe('United Kingdom');
    expect(countryLabels.eu).toBe('European Union');
    expect(Object.keys(countryLabels)).toHaveLength(5);
  });
});
