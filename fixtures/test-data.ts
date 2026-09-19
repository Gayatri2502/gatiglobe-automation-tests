/**
 * Central test-data module.
 * Values default to what was supplied in
 * "GatiGlobe_Pricing_and_Credentials.pdf" but can be overridden via .env
 * so this file never needs to change per-environment.
 */

export const BASE_URL = process.env.BASE_URL || 'https://www.gatiglobe.in';

export const LOGIN_URLS = {
  unifiedLogin: `${BASE_URL}/login`,
  superAdmin: `${BASE_URL}/portal/superadmin/login`,
  customer: `${BASE_URL}/portal/customer/login`,
  driver: `${BASE_URL}/portal/driver/login`,
};

export const superAdminUsers = {
  platformSuperAdmin: {
    email: process.env.SUPERADMIN_EMAIL || 'admin@bathiyatech.com',
    password: process.env.SUPERADMIN_PASSWORD || 'changeme123',
    role: 'Platform Super Admin (Provisioning & Tenants)',
  },
  systemSuperAdmin: {
    email: process.env.SYSADMIN_EMAIL || 'super@admin.test',
    password: process.env.SYSADMIN_PASSWORD || 'changeme123',
    role: 'System Super Admin (Default)',
  },
};

export const staffErpUsers = {
  workspace: process.env.STAFF_WORKSPACE || 'gatiglobe',
  owner: {
    email: process.env.STAFF_OWNER_EMAIL || 'ops.manager@gatiglobe.in',
    password: process.env.STAFF_OWNER_PASSWORD || 'Staff@12345',
    role: 'Owner — full 86 system permissions',
  },
  defaultAdmin: {
    email: process.env.STAFF_ADMIN_EMAIL || 'admin@gatiglobe.com',
    password: process.env.STAFF_ADMIN_PASSWORD || 'admin123',
    role: 'Owner — default system admin',
  },
};

export const customerUsers = {
  workspace: process.env.CUSTOMER_WORKSPACE || 'gatiglobe',
  apexElectronics: {
    email: process.env.CUSTOMER_APEX_EMAIL || 'dispatch@apexelectronics.com',
    password: process.env.CUSTOMER_APEX_PASSWORD || 'Customer@12345',
    account: 'Apex Electronics Logistics Hub',
  },
  tataMotors: {
    email: process.env.CUSTOMER_TATA_EMAIL || 'dispatch.8333@tatamotors.com',
    password: process.env.CUSTOMER_TATA_PASSWORD || 'Customer@12345',
    account: 'Tata Motors Commercial Supply Chain Ltd',
  },
  demo: {
    email: process.env.CUSTOMER_DEMO_EMAIL || 'customer@demo.test',
    password: process.env.CUSTOMER_DEMO_PASSWORD || 'customer123',
    account: 'Demo Customer Ltd',
  },
};

export const driverUsers = {
  workspace: process.env.DRIVER_WORKSPACE || 'gatiglobe',
  driver1: {
    mobile: process.env.DRIVER1_MOBILE || '9876543210',
    password: process.env.DRIVER1_PASSWORD || 'Driver@12345',
    name: 'Rajesh Kumar Singh',
    vehicle: 'MH-12-RN-9988',
  },
  driver2: {
    mobile: process.env.DRIVER2_MOBILE || '9819964423',
    password: process.env.DRIVER2_PASSWORD || 'Driver@12345',
    name: 'Balwant Singh Gurjar',
    vehicle: 'MH-14-BT-3752',
  },
  demo: {
    mobile: process.env.DRIVER_DEMO_MOBILE || '9998887776',
    password: process.env.DRIVER_DEMO_PASSWORD || 'driver123',
    name: 'Demo Driver',
    vehicle: null,
  },
};

/**
 * Invalid/negative credentials for auth-failure test cases.
 * These are intentionally wrong and must never authenticate successfully.
 */
export const invalidCredentials = {
  wrongPassword: { identifier: staffErpUsers.owner.email, password: 'WrongPass!123' },
  unknownEmail: { identifier: 'nobody@doesnotexist.test', password: 'anything123' },
  emptyFields: { identifier: '', password: '' },
  malformedEmail: { identifier: 'not-an-email', password: 'Staff@12345' },
  sqlInjectionAttempt: { identifier: "' OR '1'='1", password: "' OR '1'='1" },
  invalidMobile: { identifier: '123', password: 'Driver@12345' },
};

/**
 * Pricing model, transcribed from the GatiGlobe pricing PDF.
 * Used by tests/business-logic/pricing-calculations.spec.ts to validate
 * any pricing calculator/quote UI (or, absent one, the model itself)
 * against the documented brochure figures — including cross-checking
 * the PDF's own internal consistency.
 */
export const pricingModel = {
  basePackageFirstYear: 30000, // includes 18% GST
  hostingAndDomainFirstYear: 5000,
  additionalBranchFirstYear: 8000,
  annualRenewalBase: 12000, // includes 18% GST, from 2nd year
  additionalBranchRenewal: 8000,
  currency: 'INR',
};

export function calculateFirstYearTotal(branchCount: number): number {
  if (branchCount < 1) throw new Error('branchCount must be >= 1');
  const additionalBranches = branchCount - 1;
  return (
    pricingModel.basePackageFirstYear +
    pricingModel.hostingAndDomainFirstYear +
    additionalBranches * pricingModel.additionalBranchFirstYear
  );
}

export function calculateAnnualRenewal(branchCount: number): number {
  if (branchCount < 1) throw new Error('branchCount must be >= 1');
  const additionalBranches = branchCount - 1;
  return (
    pricingModel.annualRenewalBase +
    additionalBranches * pricingModel.additionalBranchRenewal
  );
}

/** Documented brochure examples — used as expected values in tests. */
export const publishedPricingExamples = [
  { branches: 1, firstYearTotal: 35000, annualRenewal: 12000 },
  { branches: 2, firstYearTotal: 43000, annualRenewal: 20000 },
  { branches: 3, firstYearTotal: 51000, annualRenewal: 28000 },
  { branches: 5, firstYearTotal: 67000, annualRenewal: 44000 },
];
