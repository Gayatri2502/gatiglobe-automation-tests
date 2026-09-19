import { test, expect } from '../../fixtures/fixtures';

/**
 * Staff ERP functional coverage, mapped directly to the "Base Package"
 * feature list in the pricing brochure:
 *   ✓ Core E-Transport ERP
 *   ✓ Fleet & vehicle management
 *   ✓ Trips & dispatch
 *   ✓ Customer management
 *   ✓ Reports & operational control
 */
test.describe('Staff ERP — Core Operational Modules @staff', () => {
  test('dashboard loads after login', async ({ staffErpLoggedIn }) => {
    await staffErpLoggedIn.expectLoaded();
  });

  test('Fleet & Vehicle Management module is reachable', async ({ staffErpLoggedIn, page }) => {
    await staffErpLoggedIn.expectLoaded();
    await staffErpLoggedIn.goToFleet();
    await expect(page).toHaveURL(/fleet|vehicle/i);
  });

  test('Trips & Dispatch module is reachable', async ({ staffErpLoggedIn, page }) => {
    await staffErpLoggedIn.expectLoaded();
    await staffErpLoggedIn.goToTripsAndDispatch();
    await expect(page).toHaveURL(/trip|dispatch/i);
  });

  test('Customer Management module is reachable', async ({ staffErpLoggedIn, page }) => {
    await staffErpLoggedIn.expectLoaded();
    await staffErpLoggedIn.goToCustomers();
    await expect(page).toHaveURL(/customer/i);
  });

  test('Reports & operational control module is reachable', async ({ staffErpLoggedIn, page }) => {
    await staffErpLoggedIn.expectLoaded();
    await staffErpLoggedIn.goToReports();
    await expect(page).toHaveURL(/report/i);
  });

  test('Branch management module is reachable (multi-branch scaling)', async ({
    staffErpLoggedIn,
    page,
  }) => {
    await staffErpLoggedIn.expectLoaded();
    await staffErpLoggedIn.goToBranches();
    await expect(page).toHaveURL(/branch/i);
  });

  test('Owner role sees full permission set (spot-check on a permission-gated action)', async ({
    staffErpLoggedIn,
  }) => {
    // The doc states the Owner has "full 86 system permissions" — a
    // lightweight spot check that an admin-only action/nav item is visible.
    await staffErpLoggedIn.expectLoaded();
    await expect(staffErpLoggedIn.nav('setting|admin|permission').first()).toBeVisible();
  });

  test.skip('create a new trip and verify it appears in dispatch board', async () => {
    // Placeholder for a full CRUD/E2E trip-lifecycle test once form
    // fields for "New Trip" are confirmed against the live DOM.
  });
});
