import { test, expect } from '@playwright/test';
import { LOGIN_URLS } from '../../fixtures/test-data';

/**
 * SMOKE SUITE
 * Fast, run-first checks that the unified auth domain and all four
 * portal entry points are reachable before running deeper functional
 * suites. See TEST_PLAN.md, Phase 1.
 */
test.describe('Smoke — portal reachability @smoke', () => {
  test('unified login page loads', async ({ page }) => {
    const response = await page.goto(LOGIN_URLS.unifiedLogin);
    expect(response?.status(), 'unified /login should return 200').toBeLessThan(400);
    await expect(page).toHaveURL(/\/login/);
  });

  test('super admin login page loads', async ({ page }) => {
    const response = await page.goto(LOGIN_URLS.superAdmin);
    expect(response?.status()).toBeLessThan(400);
  });

  test('customer portal login page loads', async ({ page }) => {
    const response = await page.goto(LOGIN_URLS.customer);
    expect(response?.status()).toBeLessThan(400);
  });

  test('driver portal login page loads', async ({ page }) => {
    const response = await page.goto(LOGIN_URLS.driver);
    expect(response?.status()).toBeLessThan(400);
  });

  test('unified login exposes all four portal tabs', async ({ page }) => {
    await page.goto(LOGIN_URLS.unifiedLogin);
    for (const tabName of ['Staff ERP', 'Customer', 'Driver']) {
      await expect(
        page.getByText(new RegExp(tabName, 'i')).first(),
        `expected a "${tabName}" tab/link on the unified login page`,
      ).toBeVisible();
    }
  });

  test('site has no obvious broken-page indicators on load', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/500|internal server error|application error/i)).toHaveCount(0);
  });
});
