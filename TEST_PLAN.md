# GatiGlobe E-Transport ERP — Test Plan

Source of truth: `GatiGlobe_Pricing_and_Credentials.pdf` (pricing brochure +
platform access credentials). This plan turns that document into a
concrete, phased Playwright testing journey.

## 1. What we're testing

| # | Area | Source in PDF |
|---|------|----------------|
| 1 | Unified auth domain (`gatiglobe.in`) and 4 portal login flows | "Access Map" section |
| 2 | Super Admin portal — provisioning, tenants, system settings | Portal 1 credentials table |
| 3 | Staff ERP portal — fleet, trips/dispatch, customers, finance, reports | Portal 2 credentials table + Base Package feature list |
| 4 | Customer portal — bookings, tracking, documents, multi-tenant isolation | Portal 3 credentials table (Apex, Tata Motors, Demo) |
| 5 | Driver portal — mobile-first, mobile-number login, trip updates/PODs/expenses | Portal 4 credentials table |
| 6 | Pricing/business logic — base package, hosting, per-branch add-on, renewal math | Pricing & Quotation pages |

## 2. Testing phases (recommended execution order)

### Phase 1 — Smoke (`tests/smoke`)
Run first, always. Confirms the unified login domain and all 4 portal
entry points are up (`/login`, `/portal/superadmin/login`,
`/portal/customer/login`, `/portal/driver/login`) before spending time on
deeper suites. ~30 seconds.

```
npm run test:smoke
```

### Phase 2 — Authentication (`tests/auth`)
One spec file per portal, each covering:
- **Positive path**: every credential set in the PDF logs in successfully
  (2 super admin accounts, 2 staff accounts, 3 customer accounts, 3 driver
  accounts — 10 accounts total).
- **Negative path**: wrong password, unknown identifier, empty fields,
  malformed input, a basic injection-style payload — all must fail
  gracefully with a visible error, never a crash or silent success.
- **Session behavior**: reload persistence, logout, and direct deep-link
  access while unauthenticated (must redirect to login).
- **Driver-portal specific**: mobile-number-only login (no email field),
  and mobile-viewport usability, since the doc explicitly flags this
  portal as mobile-optimised.

```
npm run test:auth
```

### Phase 3 — Portal functional suites
Once auth is verified, each portal gets a functional suite exercising the
modules named in the doc's "Access Map":

- `tests/superadmin` — tenant management, system settings navigation,
  (skipped placeholders for provisioning a user and activating a branch,
  pending live DOM confirmation — see §4).
- `tests/staff-erp` — Fleet & vehicle management, Trips & dispatch,
  Customer management, Reports, Branch management, and an Owner
  permission spot-check ("full 86 system permissions").
- `tests/customer-portal` — Bookings, Tracking, Documents, plus a
  **tenant-isolation test**: logging in as Apex Electronics must never
  surface Tata Motors' data.
- `tests/driver-portal` — Trip updates, PODs, Expenses, run specifically
  under the `Mobile Chrome` / `Mobile Safari` Playwright projects.

```
npm run test:superadmin
npm run test:staff
npm run test:customer
npm run test:driver
```

### Phase 4 — Business logic (`tests/business-logic`)
Pure-calculation tests (no browser needed) that reproduce the brochure's
worked pricing table exactly:

| Branches | Base | Hosting | Add'l branches | **First-year total** | **Annual renewal** |
|---|---|---|---|---|---|
| 1 | ₹30,000 | ₹5,000 | — | **₹35,000** | **₹12,000** |
| 2 | ₹30,000 | ₹5,000 | ₹8,000 | **₹43,000** | **₹20,000** |
| 3 | ₹30,000 | ₹5,000 | ₹16,000 | **₹51,000** | **₹28,000** |
| 5 | ₹30,000 | ₹5,000 | ₹32,000 | **₹67,000** | **₹44,000** |

These guard against the pricing model or a future live calculator ever
drifting from the published brochure. A skipped test stub is included to
wire up a real pricing/quote-calculator page on the site once one exists.

```
npm run test:business-logic
```

## 3. Cross-cutting coverage (built into config, not a separate phase)

- **Browser matrix**: Chromium, Firefox, WebKit for the three desktop
  portals; Mobile Chrome (Pixel 7) and Mobile Safari (iPhone 14) for the
  Driver portal.
- **Resilience**: `retain-on-failure` trace, screenshot, and video
  capture on every failing test for fast debugging.
- **Isolation**: every test gets a fresh browser context — no shared
  cookies/localStorage between tests, so login state never leaks between
  the 10 documented accounts.
- **Secrets hygiene**: credentials live in `fixtures/test-data.ts` with
  `.env` overrides; `.env` is gitignored. Never commit real passwords to
  source control even though they came from an internal PDF — rotate
  them if this repo is ever made public or shared outside the team.

## 4. Known gaps / next steps

The PDF documents *what* exists (URLs, roles, credentials, pricing) but
not the live DOM structure of each page. To move from "reachable and
role-gated" assertions to deep functional coverage:

1. Run `npm run codegen` against each portal to record real selectors.
2. Replace the role/label-based locators in `pages/*.ts` with
   `data-testid` selectors once available (see README → "Selector
   hardening").
3. Un-skip the `test.skip(...)` placeholders in each functional suite
   (new trip creation, new booking, POD photo upload, expense
   submission, user provisioning, branch activation) once their forms
   are inspected.
4. If a live pricing calculator/quote page ships on gatiglobe.in, un-skip
   the corresponding test in `tests/business-logic`.
5. Add API-level tests once backend endpoints are documented, to
   complement UI E2E coverage and speed up the suite.

## 5. Suggested CI wiring

Run Phase 1 → 2 → 3 → 4 in that order as separate CI jobs, so a smoke
failure fails fast without burning time on the full matrix:

```yaml
# illustrative only
jobs:
  smoke:        { run: npm run test:smoke }
  auth:         { needs: smoke,  run: npm run test:auth }
  functional:   { needs: auth,   run: npx playwright test tests/superadmin tests/staff-erp tests/customer-portal tests/driver-portal }
  business:     { needs: smoke,  run: npm run test:business-logic }
```
