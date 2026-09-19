import { test, expect } from '../../fixtures/fixtures';

/**
 * Driver Portal functional coverage — "Mobile field staff: trip updates,
 * PODs, expenses" per the access map. Runs on Mobile Chrome / Mobile
 * Safari projects (see playwright.config.ts testMatch for driver-portal).
 */
test.describe('Driver Portal — Trip Updates, PODs & Expenses @driver', () => {
  test('dashboard loads after login on a mobile viewport', async ({ driverPortalLoggedIn }) => {
    await driverPortalLoggedIn.expectLoaded();
  });

  test('Trip updates section is reachable', async ({ driverPortalLoggedIn, page }) => {
    await driverPortalLoggedIn.expectLoaded();
    await driverPortalLoggedIn.goToTripUpdates();
    await expect(page).toHaveURL(/trip/i);
  });

  test('Proof of Delivery (POD) section is reachable', async ({ driverPortalLoggedIn, page }) => {
    await driverPortalLoggedIn.expectLoaded();
    await driverPortalLoggedIn.goToPods();
    await expect(page).toHaveURL(/pod|delivery/i);
  });

  test('Expenses section is reachable', async ({ driverPortalLoggedIn, page }) => {
    await driverPortalLoggedIn.expectLoaded();
    await driverPortalLoggedIn.goToExpenses();
    await expect(page).toHaveURL(/expense/i);
  });

  test.skip('driver can mark a trip as delivered and upload a POD photo', async () => {
    // Placeholder — needs live DOM + a way to seed a demo trip fixture.
    // Uses page.setInputFiles(...) once the upload control is confirmed.
  });

  test.skip('driver can submit a fuel/toll expense with amount and receipt photo', async () => {
    // Placeholder for expense-submission E2E once form fields are known.
  });
});
