import React from 'react';
import { render, screen } from '@testing-library/react';
import { CoreExpertise } from './CoreExpertise';

describe('CoreExpertise', () => {
  it('asserts all 12 expertise labels appear', () => {
    render(<CoreExpertise />);

    const expectedExpertiseLabels = [
      'Solution Architecture',
      'Cloud-Native Platforms',
      'AI & LLM Integrations',
      'Microservices & APIs',
      'Event-Driven Systems',
      'Azure & AWS',
      'DevOps & CI/CD',
      'Data Engineering',
      'React & Next.js',
      'TypeScript',
      'Enterprise Integration',
      'Agile Delivery',
    ];

    expectedExpertiseLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders the correct number of expertise chips', () => {
    render(<CoreExpertise />);
    const chips = screen.getAllByText(/Solution Architecture|Cloud-Native Platforms|AI & LLM Integrations|Microservices & APIs|Event-Driven Systems|Azure & AWS|DevOps & CI\/CD|Data Engineering|React & Next.js|TypeScript|Enterprise Integration|Agile Delivery/);
    expect(chips).toHaveLength(12);
  });
});
