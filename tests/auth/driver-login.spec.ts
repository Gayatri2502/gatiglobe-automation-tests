import { test, expect } from '../../fixtures/fixtures';
import { driverUsers, invalidCredentials } from '../../fixtures/test-data';

/**
 * Driver Portal is "mobile optimised" and logs in via 10-digit mobile
 * number, not email — per the credentials doc's "Quick testing tips".
 * This suite runs against Mobile Chrome / Mobile Safari projects only
 * (see playwright.config.ts testMatch for tests/driver-portal + this dir
 * pattern — adjust config testMatch to include tests/auth/driver-login
 * if you want it under the mobile projects explicitly).
 */
test.describe('Driver Portal — Authentication @auth @driver', () => {
  test('driver 1 logs in with mobile number only (no email field required)', async ({
    loginPage,
  }) => {
    await loginPage.gotoUnifiedLogin();
    await loginPage.selectTab('Driver');
    await expect(loginPage.emailField).toHaveCount(0); // driver login should not require email
    await loginPage.loginWithMobile(driverUsers.driver1.mobile, driverUsers.driver1.password);
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('driver 2 logs in successfully via direct portal URL', async ({ loginPage }) => {
    await loginPage.gotoDriverLogin();
    await loginPage.loginWithMobile(driverUsers.driver2.mobile, driverUsers.driver2.password);
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('demo driver logs in successfully', async ({ loginPage }) => {
    await loginPage.gotoDriverLogin();
    await loginPage.loginWithMobile(driverUsers.demo.mobile, driverUsers.demo.password);
    await loginPage.expectRedirectedAwayFromLogin();
  });

  test('rejects a malformed/too-short mobile number', async ({ loginPage }) => {
    await loginPage.gotoDriverLogin();
    await loginPage.loginWithMobile(
      invalidCredentials.invalidMobile.identifier,
      invalidCredentials.invalidMobile.password,
    );
    await loginPage.expectLoginError();
  });

  test('rejects a valid mobile number with wrong password', async ({ loginPage }) => {
    await loginPage.gotoDriverLogin();
    await loginPage.loginWithMobile(
      driverUsers.driver1.mobile,
      invalidCredentials.wrongPassword.password,
    );
    await loginPage.expectLoginError();
  });

  test('driver portal renders usably on a small mobile viewport', async ({ loginPage, page }) => {
    await loginPage.gotoDriverLogin();
    const box = await loginPage.submitButton.first().boundingBox();
    expect(box, 'login button should be visible/tappable on mobile viewport').not.toBeNull();
  });
});
