Vinayak
# GatiGlobe E-Transport ERP — Playwright Test Suite

Customer Portal automation (data-driven via `test-data/syst-customer-portal.json` keyed by testcase name `TCP-20-0*`) — all reusable tiny→lengthy methods in `pages/CustomerPortalPage.ts` (`readonly Locator` in `constructor` via `getByRole`, no `xpath`), scripts only call page methods. Super Admin removed as out-of-scope; only `tests/customer-portal/TCP-20-0*.spec.ts` kept per request, running **1 worker, headed, header active** (`playwright.config.ts: workers:1`). See **[TEST_PLAN.md](./TEST_PLAN.md)** and `docs/PAGE_OBJECT_METHODS.md` for structure.

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
│   ├── LoginPage.ts               # unified /login + tab selection
│   ├── StaffErpPage.ts            # Staff ERP (kept for completeness, all readonly getByRole)
│   ├── CustomerPortalPage.ts      # Customer portal — all tiny→lengthy reusable at one place (readonly getByRole in constructor)
│   └── DriverPortalPage.ts
│
├── test-data/
│   └── syst-customer-portal.json  # data-driven for TCP-20-0* via testcase name
│
├── utils/
│   └── helpers.ts                 # currency formatting, retry, unique strings, date helpers
│
└── tests/
    └── customer-portal/           # only customer-portal kept (per request)
        ├── TCP-20-01.spec.ts      # TC-313-01 — all fields filled
        ├── TCP-20-02.spec.ts      # TC-313-02 — mandatory validation
        ├── TCP-20-03.spec.ts      # TC-313-03 — without optional
        ├── TCP-20-04.spec.ts      # TC-313-04 — numeric validation
        └── TCP-20-05.spec.ts      # TC-313-05 — list + today date
```

## Setup

```bash
npm install
npx playwright install --with-deps   # downloads browser binaries
cp .env.example .env                 # then fill in real credentials if they differ
```

## Running tests (1 worker, headed, header active)

```bash
npm test                    # customer-portal only, 1 worker (playwright.config.ts: workers:1)
npm run test:customer       # same: tests/customer-portal — 15 tests (5×3 browsers)
npm run test:headed         # headed, 1 worker — app opens visibly, header active checked
npm run test:ui             # UI mode, 1 worker
npm run test:debug          # debug mode, 1 worker
npm run report              # open last HTML report
npx playwright test --workers=1 --headed  # explicit 1-worker headed
npx playwright test --grep TCP-20-01      # single testcase by name via JSON key
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
