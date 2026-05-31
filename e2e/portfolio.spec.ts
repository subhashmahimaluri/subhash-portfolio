import { test, expect } from '@playwright/test';

test.describe('Portfolio Page', () => {
  test('should display portfolio content correctly', async ({ page }) => {
    await page.goto('/portfolio');

    // AC9: Title contains Portfolio | Subhash Mahimaluri
    await expect(page).toHaveTitle(/Portfolio | Subhash Mahimaluri/);

    // AC9: Exactly one h1 with text Portfolio
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Portfolio');

    // AC9: At least one project h2 is visible
    const h2 = page.locator('h2');
    await expect(h2.first()).toBeVisible();

    // AC9: Featured label visible at least once
    const featured = page.getByText('Featured', { exact: false });
    await expect(featured.first()).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/portfolio');
    
    // Press Tab to navigate to the first project card
    await page.keyboard.press('Tab');
    
    // Ensure something is focused in the main area
    const hasFocus = await page.evaluate(() => {
      return document.activeElement !== document.body;
    });
    expect(hasFocus).toBeTruthy();
  });
});
