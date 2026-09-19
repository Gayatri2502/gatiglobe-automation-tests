import { test, expect } from '../../fixtures/fixtures';

/**
 * Customer Portal functional coverage — "B2B shippers & clients:
 * bookings, tracking, documents" per the access map in the credentials doc.
 */
test.describe('Customer Portal — Bookings, Tracking & Documents @customer', () => {
  test('dashboard loads after login', async ({ customerPortalLoggedIn }) => {
    await customerPortalLoggedIn.expectLoaded();
  });

  test('Bookings section is reachable', async ({ customerPortalLoggedIn, page }) => {
    await customerPortalLoggedIn.expectLoaded();
    await customerPortalLoggedIn.goToBookings();
    await expect(page).toHaveURL(/booking/i);
  });

  test('Tracking section is reachable', async ({ customerPortalLoggedIn, page }) => {
    await customerPortalLoggedIn.expectLoaded();
    await customerPortalLoggedIn.goToTracking();
    await expect(page).toHaveURL(/track/i);
  });

  test('Documents section is reachable', async ({ customerPortalLoggedIn, page }) => {
    await customerPortalLoggedIn.expectLoaded();
    await customerPortalLoggedIn.goToDocuments();
    await expect(page).toHaveURL(/document/i);
  });

  test.skip('create a new booking and confirm it appears in the bookings list', async () => {
    // Placeholder — flesh out once the "New Booking" form fields are
    // confirmed against the live DOM.
  });

  test.skip('download a shipment document (POD/invoice) as PDF', async () => {
    // Placeholder for a file-download assertion using page.waitForEvent('download').
  });
});
