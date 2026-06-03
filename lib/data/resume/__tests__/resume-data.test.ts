import { describe, it, expect } from 'vitest';
import base from '../base.json';
import india from '../india.json';
import uae from '../uae.json';
import germany from '../germany.json';
import uk from '../uk.json';
import eu from '../eu.json';

describe('Resume Data Integrity', () => {
  describe('base.json', () => {
    it('should have all required sections', () => {
      expect(base).toHaveProperty('personalInfo');
      expect(base).toHaveProperty('experience');
      expect(base).toHaveProperty('skills');
      expect(base).toHaveProperty('education');
      expect(base).toHaveProperty('certifications');
      expect(base).toHaveProperty('languages');
    });

    it('should not contain control fields', () => {
      const controlFields = ['truncateExperience', 'maxPages', 'gdprNotice', 'languageRequirement'];
      controlFields.forEach(field => {
        expect(base).not.toHaveProperty(field);
      });
    });

    it('should have a valid personalInfo section', () => {
      const { personalInfo } = base;
      // `summary` lives on the country overrides (per-market), not on base.
      const required = ['name', 'title', 'email', 'phone', 'location', 'linkedin', 'github', 'calendly', 'website'];
      required.forEach(field => {
        expect(personalInfo).toHaveProperty(field);
        expect(personalInfo[field as keyof typeof personalInfo]).not.toBe('');
      });
    });

    it('should have at least three experience entries with unique ids', () => {
      expect(base.experience.length).toBeGreaterThanOrEqual(3);
      const ids = base.experience.map(exp => exp.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
      
      base.experience.forEach(exp => {
        expect(exp.id).toMatch(/^[a-z0-9-]+$/);
      });
    });

    it('should have valid dates in experience', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      let presentCount = 0;
      
      base.experience.forEach(exp => {
        expect(exp.startDate).toMatch(dateRegex);
        if (exp.endDate === 'present') {
          presentCount++;
        } else {
          expect(exp.endDate).toMatch(dateRegex);
        }
        expect(exp.highlights.length).toBeGreaterThan(0);
      });
      
      expect(presentCount).toBeLessThanOrEqual(1);
    });

    it('should have all required skill categories', () => {
      const categories = ['frontend', 'backend', 'cloud', 'testing', 'ai', 'architecture', 'coreCompetencies'];
      categories.forEach(cat => {
        expect(base.skills).toHaveProperty(cat);
        expect(Array.isArray(base.skills[cat as keyof typeof base.skills])).toBe(true);
        expect(base.skills[cat as keyof typeof base.skills].length).toBeGreaterThan(0);
      });
    });

    it('should have at least one entry in education, certifications, and languages', () => {
      expect(base.education.length).toBeGreaterThanOrEqual(1);
      expect(base.certifications.length).toBeGreaterThanOrEqual(1);
      expect(base.languages.length).toBeGreaterThanOrEqual(1);
    });

    it('should not contain any non-public contact data', () => {
      const stringified = JSON.stringify(base);
      // Simple check for things that shouldn't be there
      const forbidden = ['street', 'postcode', 'national id', 'passport', 'dob', 'banking'];
      forbidden.forEach(word => {
        expect(stringified.toLowerCase()).not.toContain(word);
      });
    });

    it('should use absolute https or mailto URLs', () => {
      const urlFields = ['linkedin', 'github', 'calendly', 'website'];
      urlFields.forEach(field => {
        const url = base.personalInfo[field as keyof typeof base.personalInfo];
        expect(url).toMatch(/^(https:\/\/|mailto:)/);
      });
    });
  });

  describe('Country Overrides', () => {
    const overrides: Array<{ name: string; data: Record<string, unknown> }> = [
      { name: 'india', data: india },
      { name: 'uae', data: uae },
      { name: 'germany', data: germany },
      { name: 'uk', data: uk },
      { name: 'eu', data: eu }
    ];

    it('should only contain valid override keys', () => {
      const validKeys = [
        'personalInfo', 'workAuthorization', 'professionalSummary',
        'references', 'gdprNotice', 'languageRequirement',
        'truncateExperience', 'maxPages', 'additionalSections', 'hideSections',
        'skills', 'availability'
      ];
      
      overrides.forEach(({ name, data }) => {
        Object.keys(data).forEach(key => {
          expect(validKeys).toContain(key);
        });
      });
    });

    it('should not contain market-invariant fields or unauthorized array sections', () => {
      const invariantFields = ['email', 'linkedin', 'github', 'calendly'];
      const unauthorizedArraySections = ['experience', 'education', 'certifications', 'languages'];
      
      overrides.forEach(({ name, data }) => {
        if (data.personalInfo) {
          invariantFields.forEach(field => {
            expect(data.personalInfo).not.toHaveProperty(field);
          });
        }
        unauthorizedArraySections.forEach(section => {
          expect(data).not.toHaveProperty(section);
        });
      });
    });

    it('should satisfy AC5 requirements for specific countries', () => {
      // Germany, UK, EU: truncateExperience: 3, maxPages: 2
      [germany, uk, eu].forEach(data => {
        expect(data).toHaveProperty('truncateExperience', 3);
        expect(data).toHaveProperty('maxPages', 2);
      });

      // India, UAE: neither
      [india, uae].forEach(data => {
        expect(data).not.toHaveProperty('truncateExperience');
        expect(data).not.toHaveProperty('maxPages');
      });

      // Germany, EU: gdprNotice present
      [germany, eu].forEach(data => {
        expect(data).toHaveProperty('gdprNotice');
        expect(typeof data.gdprNotice).toBe('string');
        expect(data.gdprNotice?.length).toBeGreaterThan(0);
      });

      // India, UAE, UK: no gdprNotice
      [india, uae, uk].forEach(data => {
        expect(data).not.toHaveProperty('gdprNotice');
      });
    });
  });
});
