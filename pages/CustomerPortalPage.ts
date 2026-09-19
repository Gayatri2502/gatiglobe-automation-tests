import { Page, expect } from '@playwright/test';

/** Customer Portal — B2B shippers & clients: bookings, tracking, documents. */
export class CustomerPortalPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get dashboardHeading() {
    return this.page.getByRole('heading', { name: /dashboard|overview|bookings/i });
  }

  nav(label: string) {
    return this.page.getByRole('link', { name: new RegExp(label, 'i') });
  }

  async expectLoaded() {
    await expect(this.dashboardHeading.first()).toBeVisible({ timeout: 15_000 });
  }

  async goToBookings() {
    await this.nav('booking').first().click();
  }

  async goToTracking() {
    await this.nav('track').first().click();
  }

  async goToDocuments() {
    await this.nav('document').first().click();
  }

  async logout() {
    await this.page.getByRole('button', { name: /log ?out|sign ?out/i }).click();
  }
}
