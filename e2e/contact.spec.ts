import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test('should load correctly and verify contact channels', async ({ page }) => {
    await page.goto('/contact');
    
    // AC11: Assert HTTP 200 (navigation successful)
    await expect(page).toHaveURL(/\/contact/);
    
    // AC11: Assert <h1> is visible
    const heading = page.getByRole('heading', { name: 'Get in Touch' });
    await expect(heading).toBeVisible();

    // AC11: Verify Email link
    const emailLink = page.getByRole('link', { name: 'Send an email to Subhash Mahimaluri' });
    await expect(emailLink).toHaveAttribute('href', 'mailto:subhash.yexaa@gmail.com');

    // AC11: Verify LinkedIn link
    const linkedinLink = page.getByRole('link', { name: 'View Subhash Mahimaluri on LinkedIn' });
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('href', /linkedin\.com/);

    // AC11: Verify Schedule-a-Call link
    const calLink = page.getByRole('link', { name: 'Schedule a Call with Subhash Mahimaluri' });
    await expect(calLink).toHaveAttribute('href', /cal\.com/);
  });
});
