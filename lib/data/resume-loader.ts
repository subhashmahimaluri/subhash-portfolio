import { deepMerge } from '@/lib/utils/deep-merge';
import { BaseResumeData, Country, CountryOverride } from '@/types/resume';

// Import base resume data
import baseResumeData from '@/lib/data/resume/base.json';

// Import country-specific override data
import indiaOverrideData from '@/lib/data/resume/india.json';
import uaeOverrideData from '@/lib/data/resume/uae.json';
import germanyOverrideData from '@/lib/data/resume/germany.json';
import ukOverrideData from '@/lib/data/resume/uk.json';
import euOverrideData from '@/lib/data/resume/eu.json';

const AVAILABLE_COUNTRIES: Country[] = ['india', 'uae', 'germany', 'uk', 'eu'];

const COUNTRY_OVERRIDES: Record<Country, CountryOverride> = {
  india: indiaOverrideData as unknown as CountryOverride,
  uae: uaeOverrideData as unknown as CountryOverride,
  germany: germanyOverrideData as unknown as CountryOverride,
  uk: ukOverrideData as unknown as CountryOverride,
  eu: euOverrideData as unknown as CountryOverride,
};

/**
 * Returns a list of available country codes for resume data.
 * @returns {Country[]} An array of supported country codes.
 */
export function getAvailableCountries(): Country[] {
  return AVAILABLE_COUNTRIES;
}

/**
 * Retrieves the merged resume data for a specific country, applying overrides and truncation.
 *
 * @param country The country code for which to retrieve the resume data.
 * @returns {BaseResumeData} The fully merged and optionally truncated resume data.
 * @throws {RangeError} If the provided country is not supported.
 */
export function getResumeData(country: Country): BaseResumeData {
  if (!AVAILABLE_COUNTRIES.includes(country)) {
    throw new RangeError(`Unsupported country: ${country}`);
  }

  const base = baseResumeData as BaseResumeData;
  const override = COUNTRY_OVERRIDES[country];

  // Create a shallow copy of the override to avoid mutating the imported module constant
  const sanitizedOverride: CountryOverride = { ...override };

  const truncateCount = sanitizedOverride.truncateExperience;
  delete sanitizedOverride.truncateExperience; // Remove truncateExperience before merging

  // Perform deep merge
  const mergedData = deepMerge(
    base as unknown as Record<string, unknown>,
    sanitizedOverride as unknown as Record<string, unknown>
  ) as unknown as BaseResumeData;

  // Apply experience truncation if specified and positive
  if (typeof truncateCount === 'number' && truncateCount > 0) {
    mergedData.experience = mergedData.experience.slice(0, truncateCount);
  }

  // Ensure no 'truncateExperience' key in the final result object
  if ('truncateExperience' in mergedData) {
    // This check is primarily for safety, deepMerge should not carry it over
    // if it's not present in the base and removed from the override.
    const finalData = mergedData as Record<string, unknown>;
    delete finalData.truncateExperience;
  }

  return mergedData;
}
