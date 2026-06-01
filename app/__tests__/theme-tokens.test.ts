import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('theme-tokens', () => {
  it('globals.css contains required CSS variables and dark theme block', () => {
    const cssPath = path.join(process.cwd(), 'app', 'globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    expect(cssContent).toContain('--navy:');
    expect(cssContent).toContain('--accent:');
    expect(cssContent).toContain('--text:');
    expect(cssContent).toContain('--bg-soft:');
    expect(cssContent).toContain('--shadow-md:');
    expect(cssContent).toContain('[data-theme="dark"]');
  });
});
