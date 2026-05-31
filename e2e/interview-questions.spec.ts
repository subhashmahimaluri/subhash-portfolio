import { test, expect } from '@playwright/test';

test.describe('React Interview Questions Page', () => {
  test('navigation and interaction', async ({ page }) => {
    await page.goto('/react-interview-questions');

    // AC12: Assert HTTP 200 and H1
    await expect(page).toHaveTitle(/React Interview Questions/);
    const h1 = page.locator('h1');
    await expect(h1).toHaveText('React Interview Questions');

    // AC12: Assert Download PDF link
    const pdfLink = page.locator('a:has-text("Download PDF")');
    await expect(pdfLink).toHaveAttribute('href', '/api/interview-pdf');

    // AC12: Filter interactions
    const filterButtons = page.locator('nav[aria-label="Category filter"] button');
    await expect(filterButtons.first()).toBeVisible();

    // AC12: Disclosure widget interaction
    const firstQuestionTrigger = page.locator('button[aria-controls^="panel-"]').first();
    const panelId = await firstQuestionTrigger.getAttribute('aria-controls');
    const panel = page.locator(`#${panelId}`);

    await expect(firstQuestionTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toHaveClass(/hidden/);

    await firstQuestionTrigger.click();
    await expect(firstQuestionTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).not.toHaveClass(/hidden/);

    await firstQuestionTrigger.click();
    await expect(firstQuestionTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toHaveClass(/hidden/);
  });
});
