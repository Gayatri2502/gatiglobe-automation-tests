import { Page, expect } from '@playwright/test';

/**
 * Staff ERP Backoffice — fleet owner & operations.
 * Covers modules called out in the pricing brochure's Base Package:
 * Fleet & vehicle management, Trips & dispatch, Customer management,
 * Reports & operational control.
 */
export class StaffErpPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get dashboardHeading() {
    return this.page.getByRole('heading', { name: /dashboard|overview/i });
  }

  nav(label: string) {
    return this.page.getByRole('link', { name: new RegExp(label, 'i') });
  }

  async expectLoaded() {
    await expect(this.dashboardHeading.first()).toBeVisible({ timeout: 15_000 });
  }

  async goToFleet() {
    await this.nav('fleet|vehicle').first().click();
  }

  async goToTripsAndDispatch() {
    await this.nav('trip|dispatch').first().click();
  }

  async goToCustomers() {
    await this.nav('customer').first().click();
  }

  async goToReports() {
    await this.nav('report').first().click();
  }

  async goToBranches() {
    await this.nav('branch').first().click();
  }

  async logout() {
    await this.page.getByRole('button', { name: /log ?out|sign ?out/i }).click();
  }
}
