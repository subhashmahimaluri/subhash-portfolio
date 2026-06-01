import { test, expect } from '@playwright/test';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Resume', path: '/resume' },
  { name: 'Education', path: '/education' },
  { name: 'React Q&A', path: '/react-interview-questions' },
  { name: 'Contact', path: '/contact' },
] as const;

test.describe('Site header', () => {
  test('the skip link is keyboard-reachable on the first Tab from page load', async ({ page }) => {
    await page.goto('/');

    // The skip link is the first focusable element in <body>.
    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute('href', '#main');
  });

  test('the skip link moves focus to the main landmark', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await expect(page.locator('main#main')).toBeVisible();
  });

  for (const link of NAV_LINKS) {
    test(`the "${link.name}" nav link navigates to ${link.path}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');

      const nav = page.getByRole('navigation', { name: 'Main navigation' });
      await nav.getByRole('link', { name: link.name, exact: true }).click();

      // Generous timeout: the dev server compiles each route on its first visit.
      await expect(page).toHaveURL(link.path, { timeout: 20_000 });
    });
  }

  test('the active page link exposes aria-current="page"', async ({ page }) => {
    await page.goto('/portfolio');
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link', { name: 'Portfolio', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
