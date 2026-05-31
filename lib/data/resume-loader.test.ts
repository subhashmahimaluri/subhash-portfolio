import { describe, it, expect, beforeAll } from 'vitest';
import { getResumeData, getAvailableCountries } from './resume-loader';
import { BaseResumeData, Country } from '@/types/resume';

describe('resume-loader', () => {
  // AC6 (g): getAvailableCountries() returns the five values in order.
  it('should return the correct list of available countries', () => {
    const countries = getAvailableCountries();
    expect(countries).toEqual(['india', 'uae', 'germany', 'uk', 'eu']);
  });

  // AC6 (f): getResumeData('france' as Country) throws a RangeError whose message includes "Unsupported country: france"
  it('should throw RangeError for an unsupported country', () => {
    const unsupportedCountry = 'france' as Country;
    expect(() => getResumeData(unsupportedCountry)).toThrow(RangeError);
    expect(() => getResumeData(unsupportedCountry)).toThrow('Unsupported country: france');
  });

  // AC7: The returned object has no polluted prototype
  it('should return an object with Object.prototype as its prototype', () => {
    const indiaResume = getResumeData('india');
    expect(Object.getPrototypeOf(indiaResume)).toBe(Object.prototype);

    const uaeResume = getResumeData('uae');
    expect(Object.getPrototypeOf(uaeResume)).toBe(Object.prototype);
  });

  describe('getResumeData for "uae"', () => {
    let uaeResume: BaseResumeData;

    beforeAll(() => {
      uaeResume = getResumeData('uae');
    });

    // AC6 (a): override wins on scalar fields like personalInfo.location and summary for uae
    it('should apply scalar overrides for UAE (location, summary)', () => {
      expect(uaeResume.personalInfo.location).toBe('Dubai, UAE');
      expect(uaeResume.personalInfo.summary).toBe('AI Solutions Architect with experience in the MENA region, helping enterprises leverage modern web technologies and AI for digital transformation.');
    });

    // AC6 (a): base values survive for fields absent from the override
    it('should retain base values for fields not present in UAE override (e.g., personalInfo.name)', () => {
      expect(uaeResume.personalInfo.name).toBe('Subhash Mahimaluri');
      expect(uaeResume.personalInfo.email).toBe('hello@subhash.dev');
    });

    // AC6 (b): arrays are replaced (not concatenated) when an override supplies one (not applicable in this case but structure check)
    it('should maintain base experience array if not overridden', () => {
      expect(Array.isArray(uaeResume.experience)).toBe(true);
      expect(uaeResume.experience.length).toBeGreaterThan(0);
      expect(uaeResume.experience[0].company).toBe('Tech Corp Solutions'); // From base
    });

    // AC6 (e): 'truncateExperience' in result is false
    it('should not have "truncateExperience" in the final result', () => {
      expect('truncateExperience' in uaeResume).toBe(false);
    });

    // AC6 (d): no truncation when the field is absent
    it('should not truncate experience as truncateExperience is absent in UAE override', () => {
      // Base has 3 experiences. UAE override does not specify truncateExperience.
      expect(uaeResume.experience).toHaveLength(3);
    });

    it('should include workAuthorization from UAE override', () => {
      expect(uaeResume.workAuthorization).toBe('Employment Visa Required');
    });
  });

  describe('getResumeData for "germany"', () => {
    let germanyResume: BaseResumeData;

    beforeAll(() => {
      germanyResume = getResumeData('germany');
    });

    // AC6 (a): override wins on scalar fields like personalInfo.location and summary for germany
    it('should apply scalar overrides for Germany (location, summary, phone)', () => {
      expect(germanyResume.personalInfo.location).toBe('Berlin, Germany');
      expect(germanyResume.personalInfo.summary).toBe('Full Stack Engineer with a strong focus on quality, performance, and data privacy. Experienced in working with German tech startups and scale-ups.');
      expect(germanyResume.personalInfo.phone).toBe('+49 151 12345678'); // Overridden phone
    });

    // AC6 (a): base values survive for fields absent from the override
    it('should retain base values for fields not present in Germany override (e.g., personalInfo.name)', () => {
      expect(germanyResume.personalInfo.name).toBe('Subhash Mahimaluri');
    });

    // AC6 (c): truncation applies when truncateExperience: N is set and result.experience.length === N
    it('should truncate experience to 3 for Germany', () => {
      expect(germanyResume.experience).toHaveLength(3);
      expect(germanyResume.experience[0].company).toBe('Tech Corp Solutions');
      expect(germanyResume.experience[2].company).toBe('StartUp Hub');
    });

    // AC6 (e): 'truncateExperience' in result is false
    it('should not have "truncateExperience" in the final result for Germany', () => {
      expect('truncateExperience' in germanyResume).toBe(false);
    });

    it('should include gdprNotice and languageRequirement from Germany override', () => {
      expect(germanyResume).toHaveProperty('gdprNotice', 'I hereby consent to the processing of my personal data for recruitment purposes in accordance with the GDPR.');
      expect(germanyResume).toHaveProperty('languageRequirement', 'German: B1 (Intermediate)');
    });
  });

  describe('getResumeData for "uk"', () => {
    let ukResume: BaseResumeData;

    beforeAll(() => {
      ukResume = getResumeData('uk');
    });

    // AC6 (c): truncation applies when truncateExperience: N is set and result.experience.length === N
    it('should truncate experience to 3 for UK', () => {
      expect(ukResume.experience).toHaveLength(3);
      expect(ukResume.experience[0].company).toBe('Tech Corp Solutions');
      expect(ukResume.experience[2].company).toBe('StartUp Hub');
    });

    // AC6 (e): 'truncateExperience' in result is false
    it('should not have "truncateExperience" in the final result for UK', () => {
      expect('truncateExperience' in ukResume).toBe(false);
    });

    it('should include workAuthorization from UK override', () => {
      expect(ukResume.workAuthorization).toBe('British Citizen / Right to Work in UK');
    });
  });

  describe('getResumeData for "india"', () => {
    let indiaResume: BaseResumeData;

    beforeAll(() => {
      indiaResume = getResumeData('india');
    });

    // AC6 (d): no truncation when the field is absent (e.g. getResumeData('india'))
    it('should not truncate experience for India as truncateExperience is absent', () => {
      expect(indiaResume.experience).toHaveLength(3); // Base has 3 experiences
    });

    // AC6 (e): 'truncateExperience' in result is false
    it('should not have "truncateExperience" in the final result for India', () => {
      expect('truncateExperience' in indiaResume).toBe(false);
    });

    it('should apply scalar overrides for India (location, summary, phone)', () => {
      expect(indiaResume.personalInfo.location).toBe('Hyderabad, Telangana, India');
      expect(indiaResume.personalInfo.summary).toBe('Full Stack Engineer based in Hyderabad, specializing in high-performance web applications and AI integrations for the Indian tech ecosystem.');
      expect(indiaResume.personalInfo.phone).toBe('+91 99999 99999'); // Overridden phone
    });

    it('should include workAuthorization from India override', () => {
      expect(indiaResume.workAuthorization).toBe('Authorized to work in India');
    });

    // AC6 (b): arrays are replaced (not concatenated) when an override supplies one
    it('should replace the skills.frontend array with the override from India', () => {
      expect(indiaResume.skills.frontend).toEqual(["React", "Next.js", "TypeScript", "HTML5", "CSS3"]);
      // Ensure other skill categories from base are still present
      expect(indiaResume.skills.backend).toContain("Node.js");
    });
  });

  describe('getResumeData for "eu"', () => {
    let euResume: BaseResumeData;

    beforeAll(() => {
      euResume = getResumeData('eu');
    });

    // AC6 (c): truncation applies when truncateExperience: N is set and result.experience.length === N
    it('should truncate experience to 3 for EU', () => {
      expect(euResume.experience).toHaveLength(3);
    });

    // AC6 (e): 'truncateExperience' in result is false
    it('should not have "truncateExperience" in the final result for EU', () => {
      expect('truncateExperience' in euResume).toBe(false);
    });

    it('should apply scalar overrides for EU (location, summary, phone, gdprNotice, maxPages)', () => {
      expect(euResume.personalInfo.location).toBe('Paris, France');
      expect(euResume.personalInfo.summary).toBe('Experienced Full Stack Developer specialized in building scalable European-wide platforms with a focus on accessibility and data sovereignty.');
      expect(euResume.personalInfo.phone).toBe('+33 1 23 45 67 89');
      expect(euResume).toHaveProperty('gdprNotice', 'By submitting this application, I agree to the processing of my personal data according to European Union data protection regulations.');
      expect(euResume).toHaveProperty('maxPages', 2);
      // Ensure fields not overridden are still from base
      expect(euResume.personalInfo.name).toBe('Subhash Mahimaluri');
    });
    // The eu.json override does not specify languageRequirement or workAuthorization.
    // They should thus not be present in the merged result if not in base, or from base if present.
    it('should not include languageRequirement or workAuthorization for EU if not specified in override or base', () => {
      expect('languageRequirement' in euResume).toBe(false);
      expect('workAuthorization' in euResume).toBe(false);
    });
  });
});
