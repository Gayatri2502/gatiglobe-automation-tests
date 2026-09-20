import { Page, Locator, expect } from '@playwright/test';

export class StaffErpPage {
  readonly page: Page;
  readonly dashboardHeading: Locator;
  readonly header: Locator;
  readonly headerNav: Locator;
  readonly fleetLink: Locator;
  readonly tripsLink: Locator;
  readonly customersLink: Locator;
  readonly reportsLink: Locator;
  readonly branchesLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeading = this.page.getByRole('heading', { name: /dashboard|overview/i });
    this.header = this.page.getByRole('banner');
    this.headerNav = this.page.getByRole('navigation');
    this.fleetLink = this.page.getByRole('link', { name: /fleet|vehicle/i });
    this.tripsLink = this.page.getByRole('link', { name: /trip|dispatch/i });
    this.customersLink = this.page.getByRole('link', { name: /customer/i });
    this.reportsLink = this.page.getByRole('link', { name: /report/i });
    this.branchesLink = this.page.getByRole('link', { name: /branch/i });
    this.logoutButton = this.page.getByRole('button', { name: /log ?out|sign ?out/i });
  }

  nav(label: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(label, 'i') });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.dashboardHeading.first()).toBeVisible({ timeout: 15_000 });
  }

  async goToFleet(): Promise<void> {
    await this.fleetLink.first().click();
  }

  async goToTripsAndDispatch(): Promise<void> {
    await this.tripsLink.first().click();
  }

  async goToCustomers(): Promise<void> {
    await this.customersLink.first().click();
  }

  async goToReports(): Promise<void> {
    await this.reportsLink.first().click();
  }

  async goToBranches(): Promise<void> {
    await this.branchesLink.first().click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.first().click();
  }
}
