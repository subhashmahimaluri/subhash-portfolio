import { describe, it, expect } from 'vitest';
import { getResumeData, getAvailableCountries } from './resume-loader';
import type { Country } from '@/types/resume';
import base from './resume/base.json';
import india from './resume/india.json';
import uae from './resume/uae.json';
import germany from './resume/germany.json';
import uk from './resume/uk.json';
import eu from './resume/eu.json';

const OVERRIDES = { india, uae, germany, uk, eu } as const;

describe('resume-loader', () => {
  it('returns the five available countries in order', () => {
    expect(getAvailableCountries()).toEqual(['india', 'uae', 'germany', 'uk', 'eu']);
  });

  it('throws RangeError for an unsupported country', () => {
    const unsupported = 'france' as Country;
    expect(() => getResumeData(unsupported)).toThrow(RangeError);
    expect(() => getResumeData(unsupported)).toThrow('Unsupported country: france');
  });

  it('returns an object with a clean prototype (no pollution)', () => {
    expect(Object.getPrototypeOf(getResumeData('india'))).toBe(Object.prototype);
    expect(Object.getPrototypeOf(getResumeData('uae'))).toBe(Object.prototype);
  });

  describe.each(Object.keys(OVERRIDES) as Country[])('getResumeData("%s")', (country) => {
    const merged = getResumeData(country);
    const override = OVERRIDES[country] as Record<string, unknown>;
    const overridePI = (override.personalInfo ?? {}) as Record<string, string>;

    it('lets the override win on personalInfo scalar fields', () => {
      if (overridePI.location) expect(merged.personalInfo.location).toBe(overridePI.location);
      if (overridePI.summary) expect(merged.personalInfo.summary).toBe(overridePI.summary);
      if (overridePI.phone) expect(merged.personalInfo.phone).toBe(overridePI.phone);
    });

    it('retains base values for fields the override does not set', () => {
      expect(merged.personalInfo.name).toBe(base.personalInfo.name);
      expect(merged.personalInfo.email).toBe(base.personalInfo.email);
    });

    it('strips the truncateExperience control field from the result', () => {
      expect('truncateExperience' in merged).toBe(false);
    });

    it('truncates experience only when the override asks for it', () => {
      const expected = (override.truncateExperience as number | undefined) ?? base.experience.length;
      expect(merged.experience).toHaveLength(expected);
      expect(merged.experience[0].company).toBe(base.experience[0].company);
    });

    it('passes through workAuthorization / gdprNotice / languageRequirement / maxPages when present', () => {
      for (const key of ['workAuthorization', 'gdprNotice', 'languageRequirement', 'maxPages'] as const) {
        if (key in override) {
          expect(merged as unknown as Record<string, unknown>).toHaveProperty(key, override[key]);
        }
      }
    });
  });

  it('truncates Germany / UK / EU to 3 experiences', () => {
    for (const c of ['germany', 'uk', 'eu'] as const) {
      expect(getResumeData(c).experience).toHaveLength(3);
    }
  });

  it('does not truncate India / UAE', () => {
    for (const c of ['india', 'uae'] as const) {
      expect(getResumeData(c).experience).toHaveLength(base.experience.length);
    }
  });
});
