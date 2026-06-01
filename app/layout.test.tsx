import { describe, it, expect, vi } from 'vitest';

// next/font/google is a build-time macro; stub it so the module imports under Vitest.
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter', className: 'inter' }),
  Sora: () => ({ variable: '--font-sora', className: 'sora' }),
}));

import RootLayout, { metadata } from './layout';

describe('RootLayout', () => {
  it('exports metadata with a title template and website openGraph', () => {
    expect(metadata.title).toMatchObject({ template: '%s | Subhash Mahimaluri' });
    expect(metadata.description).toBeTruthy();
    expect((metadata.openGraph as { type?: string })?.type).toBe('website');
  });

  it('renders an <html> root wrapping the provided children', () => {
    // Call as a function rather than mounting — RTL cannot mount <html> into a <div>.
    const tree = RootLayout({ children: 'page-content' }) as React.ReactElement<{ lang: string }>;
    expect(tree.type).toBe('html');
    expect(tree.props.lang).toBe('en');
  });
});
