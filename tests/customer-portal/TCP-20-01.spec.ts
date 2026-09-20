import { test, expect } from '../../fixtures/fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { CustomerPortalPage } from '../../pages/CustomerPortalPage';
import systData from '../../test-data/syst-customer-portal.json';
import { customerUsers } from '../../fixtures/test-data';

test('TCP-20-01', async ({ page }) => {
  const data = (systData as any)['TCP-20-01'];
  const loginPage = new LoginPage(page);
  const customerPage = new CustomerPortalPage(page);
  
  await loginPage.gotoCustomerLogin();
  await loginPage.clickCustomerTab();

  // Then start entering details: Workspace → Email → Password
  await loginPage.fillWorkspaceIfPresent(customerUsers.workspace);
  await loginPage.emailField.first().fill(customerUsers.demo.email);
  await loginPage.passwordField.first().fill(customerUsers.demo.password);
  await loginPage.submitButton.first().click();

  // App opened, header should be active
  await customerPage.expectAppOpened();
  await customerPage.expectHeaderActive();

  // Booking flow — all reusable methods in CustomerPortalPage, data via testcase name
  await customerPage.goToBookings();
  await customerPage.expectHeaderActive('Booking');
  await customerPage.createBooking(data);
  await customerPage.goToBookings();
  const row = await customerPage.getFirstBookingRow();
  await expect(page).toHaveURL(/booking/i);
});
