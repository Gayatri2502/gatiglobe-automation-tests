# Page Object Methods — Consolidated Reference

> **Audit output** — every public method/getter that exists across `pages/` before the `CustomerPortalPage` "New Booking" extension.  
> Generated: 2026-09-20 — updated 2026-09-20 to remove SuperAdmin (out of scope). Source of truth is the class files themselves. Treat this file as an index so you do not need to open files to discover what is already automatable.  
> Locator strategy note: all locators use resilient `getByRole` / `getByLabel` / `getByPlaceholder` with `.or()` fallbacks per `README.md` "Selector hardening" — tighten to `getByTestId` after `codegen` against the live DOM.
> **Note:** `SuperAdminPage` (`pages/SuperAdminPage.ts`) and its fixtures/tests were removed from the project as Super Admin went out of scope.

---

## 1. `LoginPage` — `pages/LoginPage.ts`

Unified `/login` plus direct portal logins. Covers Staff ERP / Customer / Driver tab selection and email vs. mobile auth.

| Signature | Returns | Purpose |
|---|---|---|
| `constructor(page: Page)` | `LoginPage` | Stores `Page` handle for the instance. |
| `gotoUnifiedLogin()` | `Promise<void>` | Navigates to `LOGIN_URLS.unifiedLogin` (`/login`). |
| `gotoCustomerLogin()` | `Promise<void>` | Navigates to `LOGIN_URLS.customer` (`/portal/customer/login`). |
| `gotoDriverLogin()` | `Promise<void>` | Navigates to `LOGIN_URLS.driver` (`/portal/driver/login`). |
| `selectTab(tabName: 'Staff ERP' \| 'Customer' \| 'Driver')` | `Promise<void>` | Clicks the portal tab on unified login (`getByRole('tab')` → `getByRole('button')` → `getByText` fallbacks). |
| `get emailField` | `Locator` | `getByLabel(/email/i).or(getByPlaceholder(/email/i))` — email input. |
| `get mobileField` | `Locator` | `getByLabel(/mobile\|phone/i).or(getByPlaceholder(/mobile\|phone/i))` — 10-digit mobile input for Driver. |
| `get workspaceField` | `Locator` | `getByLabel(/workspace/i).or(getByPlaceholder(/workspace/i))` — tenant slug, optional. |
| `get passwordField` | `Locator` | `getByLabel(/password/i).or(getByPlaceholder(/password/i))`. |
| `get submitButton` | `Locator` | `getByRole('button', {name: /log ?in\|sign ?in/i})`. |
| `get errorMessage` | `Locator` | `getByRole('alert').or(getByText(/invalid\|incorrect\|failed\|error/i))` — login failure banner. |
| `fillWorkspaceIfPresent(workspace: string)` | `Promise<void>` | Fills workspace field only if it exists in DOM (avoids failing on portals that do not expose it). |
| `loginWithEmail(email: string, password: string, workspace?: string)` | `Promise<void>` | Fills email + password (+ optional workspace) and clicks submit. |
| `loginWithMobile(mobile: string, password: string, workspace?: string)` | `Promise<void>` | Fills mobile + password (+ optional workspace) and clicks submit. |
| `expectLoginError()` | `Promise<void>` | Asserts `errorMessage` is visible within 10s. |
| `expectRedirectedAwayFromLogin()` | `Promise<void>` | Asserts URL no longer contains `/login` within 15s. |

**File:** `pages/LoginPage.ts` — class `LoginPage`

---

## 2. `StaffErpPage` — `pages/StaffErpPage.ts`

Backoffice / fleet-owner operations — Base Package modules (Fleet, Trips & dispatch, Customers, Reports, Branches).

| Signature | Returns | Purpose |
|---|---|---|
| `constructor(page: Page)` | `StaffErpPage` | Stores `Page`. |
| `get dashboardHeading` | `Locator` | `getByRole('heading', {name: /dashboard\|overview/i})`. |
| `nav(label: string)` | `Locator` | `getByRole('link', {name: new RegExp(label,'i')})` — generic nav helper, caller passes regex string (e.g., `fleet\|vehicle`). |
| `expectLoaded()` | `Promise<void>` | Asserts dashboard heading visible (15s). |
| `goToFleet()` | `Promise<void>` | `nav('fleet\|vehicle').click()` — Fleet & Vehicle Management. |
| `goToTripsAndDispatch()` | `Promise<void>` | `nav('trip\|dispatch').click()` — Trips & Dispatch board. |
| `goToCustomers()` | `Promise<void>` | `nav('customer').click()` — Customer Management. |
| `goToReports()` | `Promise<void>` | `nav('report').click()` — Reports & Operational Control. |
| `goToBranches()` | `Promise<void>` | `nav('branch').click()` — Branch management (multi-branch scaling). |
| `logout()` | `Promise<void>` | Clicks logout/sign-out button. |

**File:** `pages/StaffErpPage.ts` — class `StaffErpPage`

---

## 3. `CustomerPortalPage` — `pages/CustomerPortalPage.ts`

B2B shipper / client portal: Bookings, Tracking, Documents (+ extended New Booking, Lorry Receipts, Invoices, Statement flows — see extension diff).

| Signature | Returns | Purpose |
|---|---|---|
| `constructor(page: Page)` | `CustomerPortalPage` | Stores `Page`. |
| `get dashboardHeading` | `Locator` | `getByRole('heading', {name: /dashboard\|overview\|bookings/i})`. |
| `nav(label: string)` | `Locator` | `getByRole('link', {name: new RegExp(label,'i')})` — generic nav helper. |
| `expectLoaded()` | `Promise<void>` | Asserts dashboard heading visible (15s). |
| `goToBookings()` | `Promise<void>` | `nav('booking').click()` — My Bookings list. |
| `goToTracking()` | `Promise<void>` | `nav('track').click()` — Shipment Tracking. |
| `goToDocuments()` | `Promise<void>` | `nav('document').click()` — Documents section. |
| `logout()` | `Promise<void>` | Clicks logout/sign-out button. |

> **Extended methods** (added for US-313 New Booking coverage — same file, resilient `getByLabel` primary with `getByPlaceholder`/`getByRole` fallbacks): `expectDashboardLoaded()`, `getKpiValue()`, `getBookingRowCount()`, `getFirstBookingRow()`, `clickNewBooking()`, `fillNewBookingForm()`, `submitNewBooking()`, `getNewBookingValidationErrors()`, `createBooking()`, `goToLorryReceipts()`, `searchLorryReceipts()`, `goToInvoices()`, `openInvoice()`, `getInvoiceModalDetails()`, `closeInvoiceModal()`, `goToStatement()`, `getAccountSummary()` — see `pages/CustomerPortalPage.ts` JSDoc for per-method intent.

**File:** `pages/CustomerPortalPage.ts` — class `CustomerPortalPage`

---

## 4. `DriverPortalPage` — `pages/DriverPortalPage.ts`

Mobile-optimised field-staff portal: Trip updates, PODs, Expenses. Designed for `Mobile Chrome` / `Mobile Safari` projects.

| Signature | Returns | Purpose |
|---|---|---|
| `constructor(page: Page)` | `DriverPortalPage` | Stores `Page`. |
| `get dashboardHeading` | `Locator` | `getByRole('heading', {name: /dashboard\|my trips\|overview/i})`. |
| `nav(label: string)` | `Locator` | `getByRole('link', {name: /label/i}).or(getByRole('button', {name: /label/i}))` — handles both link and button nav on mobile. |
| `expectLoaded()` | `Promise<void>` | Asserts dashboard heading visible (15s). |
| `goToTripUpdates()` | `Promise<void>` | `nav('trip').click()` — Trip updates feed. |
| `goToPods()` | `Promise<void>` | `nav('pod\|proof of delivery').click()` — POD proof-of-delivery. |
| `goToExpenses()` | `Promise<void>` | `nav('expense').click()` — Expense claims. |
| `logout()` | `Promise<void>` | Clicks logout/sign-out button. |

**File:** `pages/DriverPortalPage.ts` — class `DriverPortalPage`

---

## How to use this index

- **Before adding a new interaction**, check this file first — if a method already exists, reuse it rather than scattering raw `page.getBy...` locators in specs.
- **Hardening path:** per `README.md` § "Selector hardening", replace the generic `getByRole`/`getByLabel` locators above with `getByTestId` once `npx playwright codegen` has been run against the live DOM; update this file when you do.
- **Fixtures layer** (not Page Objects, but often confused): `fixtures/fixtures.ts` exposes `loginPage`, `*Page`, and pre-authenticated `*LoggedIn` fixtures (`staffErpLoggedIn`, `customerPortalLoggedIn`, `driverPortalLoggedIn`) that wrap the classes above — see `fixtures/test-data.ts` for credentials/URLs/pricing model and `utils/helpers.ts` for `formatINR`, `retry`, `uniqueSuffix`, date helpers.
