import { Page, Locator, expect } from '@playwright/test';
import { LOGIN_URLS } from '../fixtures/test-data';

export class LoginPage {
  readonly page: Page;
  readonly workspaceField: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly mobileField: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly customerTab: Locator;
  readonly staffErpTab: Locator;
  readonly driverTab: Locator;
  readonly segmentedGroup: Locator;

  constructor(page: Page) {
    this.page = page;

    this.segmentedGroup = this.page.getByRole('radiogroup', { name: /segmented control/i });
    this.customerTab = this.page.getByRole('radio', { name: /customer/i });
    this.staffErpTab = this.page.getByRole('radio', { name: /staff erp/i });
    this.driverTab = this.page.getByRole('radio', { name: /driver/i });

    this.workspaceField = this.page.getByRole('textbox', { name: /workspace identifier/i });
    this.emailField = this.page.getByRole('textbox', { name: /email address/i });
    this.passwordField = this.page.getByRole('textbox', { name: /password/i });
    this.mobileField = this.page.getByRole('textbox', { name: /mobile|phone/i });

    this.submitButton = this.page.getByRole('button', { name: /sign in to customer portal/i }).or(this.page.getByRole('button', { name: /sign in/i }));
    this.errorMessage = this.page.getByRole('alert');
  }

  async gotoUnifiedLogin(): Promise<void> {

    try {
      const resp = await this.page.goto(LOGIN_URLS.unifiedLogin, { waitUntil: 'domcontentloaded' });
      if (resp && resp.status() === 404) throw new Error('404');
    } catch {
      await this.page.goto('/');
      await this.page.getByRole('link', { name: /sign in/i }).first().click();
      await this.page.waitForURL(/login/, { timeout: 10_000 }).catch(() => {});
    }
  }

  async gotoCustomerLogin(): Promise<void> {

    try {
      const resp = await this.page.goto(LOGIN_URLS.customer, { waitUntil: 'domcontentloaded' });
      if (resp && resp.status() === 404) throw new Error('404');

      const body = await this.page.textContent('body').catch(() => '');
      if (body && /This page doesn’t exist|404 NOT_FOUND/i.test(body)) throw new Error('404-body');
    } catch {
      await this.gotoUnifiedLogin();

      if (await this.customerTab.count()) await this.customerTab.first().click().catch(() => {});

      if (!this.page.url().includes('role=customer')) {
        await this.page.goto(LOGIN_URLS.customer).catch(() => {});

        const status = await this.page.evaluate(() => document.body.innerText).catch(() => '');
        if (/404 NOT_FOUND/i.test(status)) await this.gotoUnifiedLogin().catch(() => {});
      }
    }
  }

  async gotoDriverLogin(): Promise<void> {
    await this.page.goto(LOGIN_URLS.driver);
  }

  async selectTab(tabName: 'Staff ERP' | 'Customer' | 'Driver'): Promise<void> {
    const map = {
      'Staff ERP': this.staffErpTab,
      Customer: this.customerTab,
      Driver: this.driverTab,
    } as const;
    await map[tabName].first().click();
  }

  async fillWorkspaceIfPresent(workspace: string): Promise<void> {
    if (await this.workspaceField.count()) {
      await this.workspaceField.first().fill(workspace);
    }
  }

  async loginWithEmail(email: string, password: string, workspace?: string): Promise<void> {
    if (workspace) await this.fillWorkspaceIfPresent(workspace);
    await this.emailField.first().fill(email);
    await this.passwordField.first().fill(password);
    await this.submitButton.first().click();
  }

  async clickCustomer(): Promise<void> {
    await this.customerTab.first().click();

    await expect(this.workspaceField.first()).toBeVisible({ timeout: 10_000 }).catch(() => {});
    await expect(this.customerTab).toBeChecked({ timeout: 5_000 }).catch(() => {});
  }

  async clickCustomerTab(): Promise<void> {
    await this.clickCustomer();
  }

  async loginAsCustomer(workspace: string, email: string, password: string): Promise<void> {

    await this.clickCustomer();
    await this.fillWorkspaceIfPresent(workspace);
    await this.emailField.first().fill(email);
    await this.passwordField.first().fill(password);
    await this.submitButton.first().click();
  }

}
