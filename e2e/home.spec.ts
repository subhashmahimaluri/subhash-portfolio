import { test, expect } from '@playwright/test';

test.describe('Home Page E2E Smoke Test', () => {
  test('should navigate to home and display main heading', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Subhash Mahimaluri/);

    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    await expect(page.locator('h1')).toBeVisible();
  });
});
