import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * GatiGlobe E-Transport ERP — Playwright configuration.
 * Base URL and all credentials come from fixtures/test-data.ts,
 * which reads from .env for anything sensitive.
 * See TEST_PLAN.md for the full testing strategy.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.gatiglobe.in',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: false,
  },

  projects: [
    // Desktop browser coverage for Super Admin / Staff ERP / Customer Portal
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: '**/driver-portal/**',
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: '**/driver-portal/**',
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: '**/driver-portal/**',
    },

    // Driver Portal is explicitly "mobile optimised" per the credentials doc —
    // test it on real mobile viewports/UA.
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: '**/driver-portal/**',
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] },
      testMatch: '**/driver-portal/**',
    },
  ],

  // Uncomment if you want Playwright to boot a local server before tests:
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
