import { test, expect } from '@playwright/test';

test.describe('Resume Country Page', () => {
  // AC9: A Playwright e2e test visits `/resume/uae`
  test('should display UAE resume with correct title, H1, and PDF link', async ({ page }) => {
    await page.goto('/resume/uae');

    // AC9: title contains "UAE"
    await expect(page).toHaveTitle(/Resume — UAE/);

    // AC9: `<h1>` visible
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Ahmed Doe'); // Assuming fixture data has Ahmed Doe for UAE

    // AC9: Download PDF link `href` contains `country=uae`
    const downloadPdfLink = page.getByRole('link', { name: 'Download PDF' });
    await expect(downloadPdfLink).toBeVisible();
    await expect(downloadPdfLink).toHaveAttribute('href', '/api/resume-pdf?country=uae');
    await expect(downloadPdfLink).toHaveAttribute('download', '');
    await expect(downloadPdfLink).toHaveAttribute('rel', 'noopener noreferrer');

    // AC5: focus-visible ring check
    await downloadPdfLink.focus();
    // This is hard to assert visually in Playwright. We can check class names if explicitly added.
    // For now, checking for existence and attributes is sufficient given other tests cover styling.
    await expect(downloadPdfLink).toHaveClass(/focus-visible:ring-2/);
    await expect(downloadPdfLink).toHaveClass(/focus-visible:ring-orange-400/);
    await expect(downloadPdfLink).toHaveClass(/focus-visible:outline-none/);
  });

  // AC9: and `/resume/uk` (no element with text "Certifications").
  test('should not display Certifications section for UK resume', async ({ page }) => {
    await page.goto('/resume/uk');

    await expect(page).toHaveTitle(/Resume — United Kingdom/);

    // Assert that the "Certifications" heading is NOT present
    await expect(page.getByRole('heading', { level: 2, name: 'Certifications' })).not.toBeVisible();
  });

  test('should show 404 for an invalid country slug', async ({ page }) => {
    const response = await page.goto('/resume/invalid-country-slug');
    expect(response?.status()).toBe(404);
    await expect(page.getByText('This page could not be found.')).toBeVisible(); // Next.js default 404 text
  });
});
