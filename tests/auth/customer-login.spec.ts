import { test, expect } from '../../fixtures/fixtures';
import { customerUsers, invalidCredentials } from '../../fixtures/test-data';

test.describe('Customer Portal — Authentication @auth @customer', () => {
  test('Apex Electronics account can log in', async ({ loginPage }) => {
    await loginPage.gotoUnifiedLogin();
    await loginPage.selectTab('Customer');
    await loginPage.loginWithEmail(
      customerUsers.apexElectronics.email,
      customerUsers.apexElectronics.password,
      customerUsers.workspace,
    );
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('Tata Motors account can log in', async ({ loginPage }) => {
    await loginPage.gotoUnifiedLogin();
    await loginPage.selectTab('Customer');
    await loginPage.loginWithEmail(
      customerUsers.tataMotors.email,
      customerUsers.tataMotors.password,
      customerUsers.workspace,
    );
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('Demo customer account can log in via direct portal URL', async ({ loginPage }) => {
    await loginPage.gotoCustomerLogin();
    await loginPage.loginWithEmail(customerUsers.demo.email, customerUsers.demo.password);
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('one tenant cannot see another tenant\'s data after login (data isolation)', async ({
    browser,
  }) => {
    const apexContext = await browser.newContext();
    const apexPage = await apexContext.newPage();
    const apexLogin = new (await import('../../pages/LoginPage')).LoginPage(apexPage);
    await apexLogin.gotoCustomerLogin();
    await apexLogin.loginWithEmail(
      customerUsers.apexElectronics.email,
      customerUsers.apexElectronics.password,
    );
    await apexLogin.expectRedirectedAwayFromLogin();

    // Assert the Tata Motors account name/company never appears in Apex's session.
    await expect(apexPage.getByText(/tata motors/i)).toHaveCount(0);

    await apexContext.close();
  });

  test('rejects incorrect password for a real customer email', async ({ loginPage }) => {
    await loginPage.gotoCustomerLogin();
    await loginPage.loginWithEmail(
      customerUsers.demo.email,
      invalidCredentials.wrongPassword.password,
    );
    await loginPage.expectLoginError();
  });

  test('unauthenticated user cannot access booking pages directly', async ({ page }) => {
    await page.goto('/portal/customer/bookings');
    await expect(page).toHaveURL(/login/i);
  });
});
