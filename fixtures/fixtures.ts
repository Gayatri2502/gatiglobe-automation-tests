import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SuperAdminPage } from '../pages/SuperAdminPage';
import { StaffErpPage } from '../pages/StaffErpPage';
import { CustomerPortalPage } from '../pages/CustomerPortalPage';
import { DriverPortalPage } from '../pages/DriverPortalPage';
import { superAdminUsers, staffErpUsers, customerUsers, driverUsers } from './test-data';

/**
 * Extended fixtures: each `*LoggedIn` fixture returns a Page that is already
 * authenticated into the given portal, so individual tests can skip
 * re-doing the login flow and focus on the feature under test.
 */
type Fixtures = {
  loginPage: LoginPage;
  superAdminPage: SuperAdminPage;
  staffErpPage: StaffErpPage;
  customerPortalPage: CustomerPortalPage;
  driverPortalPage: DriverPortalPage;

  superAdminLoggedIn: SuperAdminPage;
  staffErpLoggedIn: StaffErpPage;
  customerPortalLoggedIn: CustomerPortalPage;
  driverPortalLoggedIn: DriverPortalPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  superAdminPage: async ({ page }, use) => {
    await use(new SuperAdminPage(page));
  },
  staffErpPage: async ({ page }, use) => {
    await use(new StaffErpPage(page));
  },
  customerPortalPage: async ({ page }, use) => {
    await use(new CustomerPortalPage(page));
  },
  driverPortalPage: async ({ page }, use) => {
    await use(new DriverPortalPage(page));
  },

  superAdminLoggedIn: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.gotoSuperAdminLogin();
    await login.loginWithEmail(
      superAdminUsers.platformSuperAdmin.email,
      superAdminUsers.platformSuperAdmin.password,
    );
    await use(new SuperAdminPage(page));
  },

  staffErpLoggedIn: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.gotoUnifiedLogin();
    await login.selectTab('Staff ERP');
    await login.loginWithEmail(staffErpUsers.owner.email, staffErpUsers.owner.password);
    await use(new StaffErpPage(page));
  },

  customerPortalLoggedIn: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.gotoUnifiedLogin();
    await login.selectTab('Customer');
    await login.loginWithEmail(customerUsers.demo.email, customerUsers.demo.password);
    await use(new CustomerPortalPage(page));
  },

  driverPortalLoggedIn: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.gotoUnifiedLogin();
    await login.selectTab('Driver');
    await login.loginWithMobile(driverUsers.demo.mobile, driverUsers.demo.password);
    await use(new DriverPortalPage(page));
  },
});

export { expect };
