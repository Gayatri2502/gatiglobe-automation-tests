import { Page, expect } from '@playwright/test';

/** Driver Portal — mobile field staff: trip updates, PODs, expenses. Mobile-optimised. */
export class DriverPortalPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get dashboardHeading() {
    return this.page.getByRole('heading', { name: /dashboard|my trips|overview/i });
  }

  nav(label: string) {
    return this.page.getByRole('link', { name: new RegExp(label, 'i') })
      .or(this.page.getByRole('button', { name: new RegExp(label, 'i') }));
  }

  async expectLoaded() {
    await expect(this.dashboardHeading.first()).toBeVisible({ timeout: 15_000 });
  }

  async goToTripUpdates() {
    await this.nav('trip').first().click();
  }

  async goToPods() {
    await this.nav('pod|proof of delivery').first().click();
  }

  async goToExpenses() {
    await this.nav('expense').first().click();
  }

  async logout() {
    await this.page.getByRole('button', { name: /log ?out|sign ?out/i }).click();
  }
}
