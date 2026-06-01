import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('globals.css reduced-motion handling', () => {
  it('honors prefers-reduced-motion and disables orb animation', () => {
    const cssPath = path.join(process.cwd(), 'app', 'globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    expect(cssContent).toContain('prefers-reduced-motion');
    expect(cssContent).toContain('animation: none');
  });
});
