import { test, expect } from '../../fixtures/fixtures';
import { staffErpUsers, invalidCredentials } from '../../fixtures/test-data';

test.describe('Staff ERP — Authentication @auth @staff', () => {
  test('owner account logs in via unified login, Staff ERP tab', async ({ loginPage }) => {
    await loginPage.gotoUnifiedLogin();
    await loginPage.selectTab('Staff ERP');
    await loginPage.loginWithEmail(
      staffErpUsers.owner.email,
      staffErpUsers.owner.password,
      staffErpUsers.workspace,
    );
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('default admin account logs in successfully', async ({ loginPage }) => {
    await loginPage.gotoUnifiedLogin();
    await loginPage.selectTab('Staff ERP');
    await loginPage.loginWithEmail(
      staffErpUsers.defaultAdmin.email,
      staffErpUsers.defaultAdmin.password,
      staffErpUsers.workspace,
    );
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('rejects wrong password for a valid staff email', async ({ loginPage }) => {
    await loginPage.gotoUnifiedLogin();
    await loginPage.selectTab('Staff ERP');
    await loginPage.loginWithEmail(
      staffErpUsers.owner.email,
      invalidCredentials.wrongPassword.password,
      staffErpUsers.workspace,
    );
    await loginPage.expectLoginError();
  });

  test('rejects login against a non-existent workspace slug', async ({ loginPage }) => {
    await loginPage.gotoUnifiedLogin();
    await loginPage.selectTab('Staff ERP');
    await loginPage.loginWithEmail(
      staffErpUsers.owner.email,
      staffErpUsers.owner.password,
      'this-workspace-does-not-exist',
    );
    await loginPage.expectLoginError();
  });

  test('session persists across a page reload after login', async ({ staffErpLoggedIn, page }) => {
    await staffErpLoggedIn.expectLoaded();
    await page.reload();
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('logout returns user to the login page', async ({ staffErpLoggedIn, page }) => {
    await staffErpLoggedIn.expectLoaded();
    await staffErpLoggedIn.logout();
    await expect(page).toHaveURL(/login/i);
  });
});
