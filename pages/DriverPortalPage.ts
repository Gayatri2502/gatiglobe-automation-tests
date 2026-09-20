import { Page, Locator, expect } from '@playwright/test';

export class DriverPortalPage {
  readonly page: Page;
  readonly dashboardHeading: Locator;
  readonly header: Locator;
  readonly headerNav: Locator;
  readonly tripUpdatesLink: Locator;
  readonly podsLink: Locator;
  readonly expensesLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeading = this.page.getByRole('heading', { name: /dashboard|my trips|overview/i });
    this.header = this.page.getByRole('banner');
    this.headerNav = this.page.getByRole('navigation');
    this.tripUpdatesLink = this.page.getByRole('link', { name: /trip/i });
    this.podsLink = this.page.getByRole('link', { name: /pod|proof of delivery/i });
    this.expensesLink = this.page.getByRole('link', { name: /expense/i });
    this.logoutButton = this.page.getByRole('button', { name: /log ?out|sign ?out/i });
  }

  nav(label: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(label, 'i') }).or(this.page.getByRole('button', { name: new RegExp(label, 'i') }));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.dashboardHeading.first()).toBeVisible({ timeout: 15_000 });
  }

  async goToTripUpdates(): Promise<void> {
    await this.tripUpdatesLink.first().click();
  }

  async goToPods(): Promise<void> {
    await this.podsLink.first().click();
  }

  async goToExpenses(): Promise<void> {
    await this.expensesLink.first().click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.first().click();
  }
}
