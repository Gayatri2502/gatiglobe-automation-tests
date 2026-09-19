import { Page, expect } from '@playwright/test';

/**
 * Super Admin — platform owner: provisioning, tenants, system settings.
 * Selectors are role/text based placeholders; harden with data-testid
 * once the real DOM is available (see README).
 */
export class SuperAdminPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get dashboardHeading() {
    return this.page.getByRole('heading', { name: /dashboard|overview/i });
  }

  get tenantsNav() {
    return this.page.getByRole('link', { name: /tenant/i });
  }

  get systemSettingsNav() {
    return this.page.getByRole('link', { name: /settings/i });
  }

  get userProvisioningNav() {
    return this.page.getByRole('link', { name: /user|provision/i });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/superadmin/i);
    await expect(this.dashboardHeading.first()).toBeVisible({ timeout: 15_000 });
  }

  async goToTenants() {
    await this.tenantsNav.first().click();
  }

  async goToSystemSettings() {
    await this.systemSettingsNav.first().click();
  }

  async logout() {
    await this.page.getByRole('button', { name: /log ?out|sign ?out/i }).click();
  }
}
