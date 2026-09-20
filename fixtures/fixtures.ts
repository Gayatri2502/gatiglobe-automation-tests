import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { StaffErpPage } from '../pages/StaffErpPage';
import { CustomerPortalPage } from '../pages/CustomerPortalPage';
import { DriverPortalPage } from '../pages/DriverPortalPage';
import { staffErpUsers, customerUsers, driverUsers } from './test-data';

/**
 * Extended fixtures: each `*LoggedIn` fixture returns a Page that is already
 * authenticated into the given portal, so individual tests can skip
 * re-doing the login flow and focus on the feature under test.
 */
type Fixtures = {
  loginPage: LoginPage;
  staffErpPage: StaffErpPage;
  customerPortalPage: CustomerPortalPage;
  driverPortalPage: DriverPortalPage;

  staffErpLoggedIn: StaffErpPage;
  customerPortalLoggedIn: CustomerPortalPage;
  driverPortalLoggedIn: DriverPortalPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
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

  staffErpLoggedIn: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.gotoUnifiedLogin();
    await login.selectTab('Staff ERP');
    await login.loginWithEmail(staffErpUsers.owner.email, staffErpUsers.owner.password);
    await use(new StaffErpPage(page));
  },

  customerPortalLoggedIn: async ({ page }, use) => {
    const login = new LoginPage(page);
    // Flow: open link https://www.gatiglobe.in/login?role=customer
    await login.gotoCustomerLogin();
    // Click Customer tab per [Image 1] SELECT LOGIN AUTHORITY
    await login.clickCustomer();
    // Then start entering details: Workspace → Email → Password → Sign in
    await login.fillWorkspaceIfPresent(customerUsers.workspace);
    await login.emailField.first().fill(customerUsers.demo.email);
    await login.passwordField.first().fill(customerUsers.demo.password);
    await login.submitButton.first().click();
    await use(new CustomerPortalPage(page));
  },

  driverPortalLoggedIn: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.gotoUnifiedLogin();
    await login.selectTab('Driver');
    await use(new DriverPortalPage(page));
  },
});

export { expect };
