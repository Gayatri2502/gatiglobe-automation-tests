import { test, expect } from '../../fixtures/fixtures';

/**
 * Super Admin functional coverage.
 * Per the credentials doc: "Additional users, roles or portal permissions
 * can be provisioned from the Super Admin portal at any time" and it owns
 * "provisioning, tenants, system settings".
 */
test.describe('Super Admin — Tenant & System Management @superadmin', () => {
  test('dashboard loads with key navigation available', async ({ superAdminLoggedIn }) => {
    await superAdminLoggedIn.expectLoaded();
    await expect(superAdminLoggedIn.tenantsNav.first()).toBeVisible();
  });

  test('can navigate to Tenants management', async ({ superAdminLoggedIn, page }) => {
    await superAdminLoggedIn.expectLoaded();
    await superAdminLoggedIn.goToTenants();
    await expect(page).toHaveURL(/tenant/i);
  });

  test('can navigate to System Settings', async ({ superAdminLoggedIn, page }) => {
    await superAdminLoggedIn.expectLoaded();
    await superAdminLoggedIn.goToSystemSettings();
    await expect(page).toHaveURL(/setting/i);
  });

  test.skip('super admin can provision a new user/role — fill in once UI is confirmed', async ({
    superAdminLoggedIn,
  }) => {
    // Placeholder: flesh out once the actual "add user" form fields/DOM
    // are known. Kept skipped to avoid creating throwaway data in shared
    // environments without an explicit teardown step.
  });

  test.skip('super admin can activate a new branch for a tenant', async ({ superAdminLoggedIn }) => {
    // Placeholder — mirrors "new branch activation" mentioned in the
    // support/handover section of the credentials doc.
  });
});
