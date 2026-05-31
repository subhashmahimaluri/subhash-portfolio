import { describe, it, expect } from 'vitest';
import { generateMetadata } from './page';

describe('Home generateMetadata', () => {
  it('returns the Home title, a description, and an openGraph website block', () => {
    const metadata = generateMetadata();
    expect(metadata.title).toBe('Home');
    expect(metadata.description).toBeTruthy();
    expect((metadata.openGraph as { type?: string })?.type).toBe('website');
  });
});
