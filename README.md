# GatiGlobe E-Transport ERP — Playwright Test Suite

Functional & automation tests for all four GatiGlobe portals (Super
Admin, Staff ERP, Customer, Driver) plus a business-logic suite that
validates the pricing brochure's math. See **[TEST_PLAN.md](./TEST_PLAN.md)**
for the full testing strategy and phased rollout.

## Project structure

```
gatiglobe-playwright-tests/
├── playwright.config.ts        # browser/device projects, reporters, timeouts
├── package.json
├── .env.example                 # copy to .env, fill in real credentials
├── TEST_PLAN.md                 # testing journey/strategy (read this first)
│
├── fixtures/
│   ├── test-data.ts              # all credentials, URLs, pricing model — from the PDF
│   └── fixtures.ts               # custom Playwright fixtures (pre-authenticated pages)
│
├── pages/                        # Page Object Model, one per portal
│   ├── LoginPage.ts               # unified /login + tab selection + super admin login
│   ├── SuperAdminPage.ts
│   ├── StaffErpPage.ts
│   ├── CustomerPortalPage.ts
│   └── DriverPortalPage.ts
│
├── utils/
│   └── helpers.ts                 # currency formatting, retry, unique strings
│
└── tests/
    ├── smoke/                     # Phase 1 — are all entry points up?
    │   └── portal-access.spec.ts
    ├── auth/                      # Phase 2 — login positive/negative per portal
    │   ├── superadmin-login.spec.ts
    │   ├── staff-login.spec.ts
    │   ├── customer-login.spec.ts
    │   └── driver-login.spec.ts
    ├── superadmin/                # Phase 3 — functional coverage per portal
    │   └── tenant-provisioning.spec.ts
    ├── staff-erp/
    │   └── core-modules.spec.ts
    ├── customer-portal/
    │   └── bookings-tracking.spec.ts
    ├── driver-portal/
    │   └── trip-pod-expenses.spec.ts
    └── business-logic/            # Phase 4 — pricing math vs. brochure
        └── pricing-calculations.spec.ts
```

## Setup

```bash
npm install
npx playwright install --with-deps   # downloads browser binaries
cp .env.example .env                 # then fill in real credentials if they differ
```

## Running tests

```bash
npm test                    # everything, all projects
npm run test:smoke          # Phase 1 only — fast sanity check
npm run test:auth           # Phase 2 — all 4 portals' login flows
npm run test:superadmin     # Phase 3 — one portal at a time
npm run test:staff
npm run test:customer
npm run test:driver
npm run test:business-logic # Phase 4 — pure pricing-math checks, no browser
npm run test:ui             # interactive Playwright UI mode (great for debugging)
npm run test:headed         # see the browser while tests run
npm run report               # open the last HTML report
```

Filter by tag (each suite is tagged, e.g. `@auth`, `@staff`, `@business-logic`):

```bash
npx playwright test --grep @auth
```

## Selector hardening (important — read before extending)

The PDF documents URLs, roles, and credentials, but not the live DOM. The
Page Objects in `pages/*.ts` currently use resilient but generic
role/label-based locators (`getByRole`, `getByLabel`, `getByPlaceholder`)
so the suite is runnable immediately. For long-term stability:

1. Run `npm run codegen` (or `npx playwright codegen <portal-url>`)
   against the real site to record actual selectors.
2. Ask the dev team to add `data-testid` attributes to key elements
   (login fields, nav links, submit buttons) if not already present.
3. Swap the generic locators in each Page Object for
   `page.getByTestId('...')` — faster, less flaky, and immune to copy
   changes.

Several tests in the functional suites (`tests/*/**.spec.ts`) are left as
`test.skip(...)` placeholders (creating a trip, a booking, a POD upload,
an expense claim, provisioning a user, activating a branch) precisely
because their form fields aren't knowable from the PDF alone — un-skip
and fill these in once you've inspected the live forms.

## Secrets

All ten documented accounts (2 super admin, 2 staff, 3 customer, 3
driver) live in `fixtures/test-data.ts`, with values overridable from
`.env`. **Do not commit a real `.env` file** — `.gitignore` already
excludes it. Because these credentials came from an internal PDF, treat
them as sensitive: rotate them if this repository is ever shared outside
the immediate team, and prefer a secrets manager (CI secret store, 1Password,
Vault, etc.) over plain `.env` files in any shared/CI environment.

## CI

See TEST_PLAN.md §5 for a suggested phased CI job structure (smoke → auth
→ functional → business-logic).
