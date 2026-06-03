import { describe, it, expect } from 'vitest';
import { generateMetadata } from './page';

describe('Home generateMetadata', () => {
  it('returns an absolute brand title, a description, and an openGraph website block', () => {
    const metadata = generateMetadata();
    // Homepage uses an absolute title (the root segment bypasses title.template).
    expect((metadata.title as { absolute: string }).absolute).toContain('Subhash Mahimaluri');
    expect(metadata.description).toBeTruthy();
    expect((metadata.openGraph as { type?: string })?.type).toBe('website');
  });
});
