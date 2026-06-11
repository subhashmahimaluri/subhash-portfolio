import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeaturedProject } from './FeaturedProject';

const TECH_STACK = ['Aider', 'Gemini 2.5', 'Azure DevOps', 'GitHub Actions', 'Power Automate', 'MCP'];

describe('FeaturedProject', () => {
  it('renders the featured section with correct labelling', () => {
    render(<FeaturedProject />);
    expect(screen.getByRole('region', { name: 'Sparks' })).toBeInTheDocument();
  });

  it('renders the project title', () => {
    render(<FeaturedProject />);
    expect(screen.getByRole('heading', { name: 'Sparks' })).toBeInTheDocument();
  });

  it('renders the featured marker text', () => {
    render(<FeaturedProject />);
    expect(screen.getByText(/Featured Project/)).toBeInTheDocument();
  });

  it('renders the Open Source chip', () => {
    render(<FeaturedProject />);
    expect(screen.getByText('Open Source · 2026')).toBeInTheDocument();
  });

  it('renders the project description', () => {
    render(<FeaturedProject />);
    expect(screen.getByText(/open-source agentic harness/i)).toBeInTheDocument();
  });

  it('renders all tech stack chips', () => {
    render(<FeaturedProject />);
    TECH_STACK.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it('renders exactly six tech stack items', () => {
    const { container } = render(<FeaturedProject />);
    expect(container.querySelectorAll('.tech-chips li')).toHaveLength(6);
  });

  it('renders the GitHub link with correct href and rel', () => {
    render(<FeaturedProject />);
    const link = screen.getByRole('link', { name: 'View on GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/subhashmahimaluri/sparks');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the architecture link with correct href', () => {
    render(<FeaturedProject />);
    const link = screen.getByRole('link', { name: 'Read the Architecture' });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/subhashmahimaluri/sparks/blob/main/ARCHITECTURE.md'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
