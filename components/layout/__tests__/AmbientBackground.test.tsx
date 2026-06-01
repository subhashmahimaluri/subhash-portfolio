// @vitest-environment happy-dom
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AmbientBackground } from '../AmbientBackground';

describe('AmbientBackground', () => {
  it('renders three orbs (orb-1, orb-2, orb-3)', () => {
    const { container } = render(<AmbientBackground />);

    const orbs = container.querySelectorAll('.orb');
    expect(orbs).toHaveLength(3);
    expect(container.querySelector('.orb-1')).not.toBeNull();
    expect(container.querySelector('.orb-2')).not.toBeNull();
    expect(container.querySelector('.orb-3')).not.toBeNull();
  });

  it('renders a single grain overlay', () => {
    const { container } = render(<AmbientBackground />);
    expect(container.querySelectorAll('.grain')).toHaveLength(1);
  });

  it('marks every decorative element aria-hidden so screen readers skip it', () => {
    const { container } = render(<AmbientBackground />);

    const decorations = container.querySelectorAll('.bg-fx, .orb, .grain');
    expect(decorations.length).toBeGreaterThan(0);
    decorations.forEach((el) => {
      // The orbs inherit aria-hidden from the bg-fx wrapper; the wrapper and the
      // grain set it explicitly. None of these are exposed to assistive tech.
      const hidden =
        el.getAttribute('aria-hidden') === 'true' || el.closest('[aria-hidden="true"]') !== null;
      expect(hidden).toBe(true);
    });
  });

  it('contains no focusable elements', () => {
    const { container } = render(<AmbientBackground />);
    expect(
      container.querySelectorAll('a, button, input, select, textarea, [tabindex]'),
    ).toHaveLength(0);
  });
});
