import { test, expect } from '../../fixtures/fixtures';
import { superAdminUsers, invalidCredentials } from '../../fixtures/test-data';

test.describe('Super Admin — Authentication @auth @superadmin', () => {
  test('platform super admin can log in successfully', async ({ loginPage, page }) => {
    await loginPage.gotoSuperAdminLogin();
    await loginPage.loginWithEmail(
      superAdminUsers.platformSuperAdmin.email,
      superAdminUsers.platformSuperAdmin.password,
    );
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('default system super admin can log in successfully', async ({ loginPage }) => {
    await loginPage.gotoSuperAdminLogin();
    await loginPage.loginWithEmail(
      superAdminUsers.systemSuperAdmin.email,
      superAdminUsers.systemSuperAdmin.password,
    );
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('rejects an incorrect password', async ({ loginPage }) => {
    await loginPage.gotoSuperAdminLogin();
    await loginPage.loginWithEmail(
      superAdminUsers.platformSuperAdmin.email,
      invalidCredentials.wrongPassword.password,
    );
    await loginPage.expectLoginError();
    await expect(loginPage.page).toHaveURL(/superadmin/i);
  });

  test('rejects an unknown email', async ({ loginPage }) => {
    await loginPage.gotoSuperAdminLogin();
    await loginPage.loginWithEmail(
      invalidCredentials.unknownEmail.identifier,
      invalidCredentials.unknownEmail.password,
    );
    await loginPage.expectLoginError();
  });

  test('rejects empty credentials with inline validation, not a crash', async ({ loginPage }) => {
    await loginPage.gotoSuperAdminLogin();
    await loginPage.submitButton.first().click();
    // Should stay on the login page rather than navigating anywhere.
    await expect(loginPage.page).toHaveURL(/superadmin/i);
  });

  test('does not authenticate on a basic SQL-injection-style payload', async ({ loginPage }) => {
    await loginPage.gotoSuperAdminLogin();
    await loginPage.loginWithEmail(
      invalidCredentials.sqlInjectionAttempt.identifier,
      invalidCredentials.sqlInjectionAttempt.password,
    );
    await loginPage.expectLoginError();
  });

  test('unauthenticated user cannot access a super admin deep link directly', async ({ page }) => {
    await page.goto('/portal/superadmin/tenants');
    await expect(page).toHaveURL(/login/i);
  });
});
