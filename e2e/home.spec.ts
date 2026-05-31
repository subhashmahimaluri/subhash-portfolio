import { test, expect } from '@playwright/test';

test.describe('Home Page E2E', () => {
  test('should load home page, display main heading, and navigate to resume', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();

    // AC8: asserts HTTP 200 (implied by page.goto success and element visibility)
    // and a single h1 with "Subhash Mahimaluri"
    const h1Element = page.getByRole('heading', { level: 1, name: 'Subhash Mahimaluri' });
    await expect(h1Element).toBeVisible();
    await expect(h1Element).toHaveText('Subhash Mahimaluri');

    // Ensure only one h1 on the page (AC7)
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // AC8: clicks "View resume" and verifies navigation to /resume
    const viewResumeLink = page.getByRole('link', { name: 'View Resume', exact: true });
    await expect(viewResumeLink).toBeVisible();
    await viewResumeLink.click();
    await expect(page).toHaveURL(/.*\/resume/);
    await expect(page.getByRole('heading', { level: 1, name: 'Resume' })).toBeVisible(); // Assuming resume page has an h1 "Resume"
  });
});
