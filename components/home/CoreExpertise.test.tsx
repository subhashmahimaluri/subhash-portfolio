import React from 'react';
import { render, screen } from '@testing-library/react';
import { CoreExpertise } from './CoreExpertise';

const EXPECTED = [
  'React',
  'Next.js',
  'React Native',
  'TypeScript',
  'Node.js',
  'Micro Frontends',
  'Agentic AI',
  'AI / LLM Systems',
  'RAG · Vector DBs',
  'Cloud Architecture',
  'Azure DevOps',
  'AWS',
];

describe('CoreExpertise', () => {
  it('renders all 12 expertise labels', () => {
    render(<CoreExpertise />);
    EXPECTED.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders exactly 12 chips', () => {
    const { container } = render(<CoreExpertise />);
    expect(container.querySelectorAll('.chip-cloud li')).toHaveLength(12);
  });
});
