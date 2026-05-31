import { test, expect } from '@playwright/test';

test.describe('Navbar and Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page renders the navbar visibly', async ({ page }) => {
    await expect(page.locator('header[role="banner"]')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await expect(page.getByText('subhashai.cloud')).toBeVisible();
  });

  test('clicking the Portfolio link navigates to /portfolio', async ({ page }) => {
    // Ensure desktop nav is visible for this test, as mobile nav is tested separately
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.getByRole('link', { name: 'Portfolio' }).click();
    await expect(page).toHaveURL('/portfolio');
    await expect(page.getByText('Subhash Mahimaluri')).toBeVisible(); // A general element on the page
  });

  test('footer is visible on the home page', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.getByText(/© \d{4} Subhash Mahimaluri\. All rights reserved\./)).toBeVisible();
    await expect(page.getByLabel('LinkedIn profile')).toBeVisible();
    await expect(page.getByLabel('GitHub profile')).toBeVisible();
    await expect(page.getByLabel('Email Subhash Mahimaluri')).toBeVisible();
    await expect(page.getByLabel('Schedule a call')).toBeVisible();
  });

  test('at 375px × 812px viewport the hamburger button is visible and clicking it reveals the nav link list', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const desktopNav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(desktopNav).not.toBeVisible(); // Desktop nav should be hidden

    const toggleButton = page.getByLabel('Toggle navigation');
    await expect(toggleButton).toBeVisible();
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toHaveClass(/hidden/); // Mobile menu should be hidden

    await toggleButton.click(); // Click to open
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    await expect(mobileMenu).not.toHaveClass(/hidden/); // Mobile menu should be visible

    // Verify some links are visible in the opened menu
    await expect(page.getByRole('link', { name: 'Home' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Portfolio' }).first()).toBeVisible();

    await toggleButton.click(); // Click to close
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileMenu).toHaveClass(/hidden/); // Mobile menu should be hidden again
  });
});
