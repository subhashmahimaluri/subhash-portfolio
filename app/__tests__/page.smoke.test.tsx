import { render, screen } from '@testing-library/react';
import HomePage from '../page';

describe('HomePage Smoke Test', () => {
  it('renders the main content and heading', () => {
    render(<HomePage />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();

    const headingElement = screen.getByRole('heading', { level: 1, name: /Subhash Mahimaluri/i });
    expect(headingElement).toBeVisible();
  });
});
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3005',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3005',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 120 seconds
  },
});
