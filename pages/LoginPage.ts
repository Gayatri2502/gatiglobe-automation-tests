import { Page, Locator, expect } from '@playwright/test';
import { LOGIN_URLS } from '../fixtures/test-data';

/**
 * NOTE ON SELECTORS
 * The credentials PDF describes page behaviour (URLs, tabs, field types)
 * but not the DOM/test-id structure of the live app. The locators below
 * use resilient, role-based strategies (getByRole/getByLabel/getByPlaceholder)
 * with sensible fallbacks. Once you inspect the real DOM, tighten these to
 * data-testid selectors for speed and stability — see README "Selector
 * hardening" section.
 */
export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoUnifiedLogin() {
    await this.page.goto(LOGIN_URLS.unifiedLogin);
  }

  async gotoSuperAdminLogin() {
    await this.page.goto(LOGIN_URLS.superAdmin);
  }

  async gotoCustomerLogin() {
    await this.page.goto(LOGIN_URLS.customer);
  }

  async gotoDriverLogin() {
    await this.page.goto(LOGIN_URLS.driver);
  }

  /** Select the portal tab on the unified /login page: Staff ERP | Customer | Driver | Super Admin */
  async selectTab(tabName: 'Staff ERP' | 'Customer' | 'Driver' | 'Super Admin') {
    const tab = this.page.getByRole('tab', { name: new RegExp(tabName, 'i') })
      .or(this.page.getByRole('button', { name: new RegExp(tabName, 'i') }))
      .or(this.page.getByText(new RegExp(`^${tabName}$`, 'i')));
    await tab.first().click();
  }

  get emailField(): Locator {
    return this.page.getByLabel(/email/i)
      .or(this.page.getByPlaceholder(/email/i));
  }

  get mobileField(): Locator {
    return this.page.getByLabel(/mobile|phone/i)
      .or(this.page.getByPlaceholder(/mobile|phone/i));
  }

  get workspaceField(): Locator {
    return this.page.getByLabel(/workspace/i)
      .or(this.page.getByPlaceholder(/workspace/i));
  }

  get passwordField(): Locator {
    return this.page.getByLabel(/password/i)
      .or(this.page.getByPlaceholder(/password/i));
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /log ?in|sign ?in/i });
  }

  get errorMessage(): Locator {
    return this.page.getByRole('alert')
      .or(this.page.getByText(/invalid|incorrect|failed|error/i));
  }

  async fillWorkspaceIfPresent(workspace: string) {
    if (await this.workspaceField.count()) {
      await this.workspaceField.first().fill(workspace);
    }
  }

  async loginWithEmail(email: string, password: string, workspace?: string) {
    if (workspace) await this.fillWorkspaceIfPresent(workspace);
    await this.emailField.first().fill(email);
    await this.passwordField.first().fill(password);
    await this.submitButton.first().click();
  }

  async loginWithMobile(mobile: string, password: string, workspace?: string) {
    if (workspace) await this.fillWorkspaceIfPresent(workspace);
    await this.mobileField.first().fill(mobile);
    await this.passwordField.first().fill(password);
    await this.submitButton.first().click();
  }

  async expectLoginError() {
    await expect(this.errorMessage.first()).toBeVisible({ timeout: 10_000 });
  }

  async expectRedirectedAwayFromLogin() {
    await expect(this.page).not.toHaveURL(/\/login/, { timeout: 15_000 });
  }
}
