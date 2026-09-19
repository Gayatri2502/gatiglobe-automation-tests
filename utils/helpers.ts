import { Page } from '@playwright/test';

/** Format a number as an Indian-Rupee currency string, e.g. 35000 -> "₹35,000". */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Wait for network to go idle-ish without hard-failing on long-poll/websocket apps. */
export async function waitForStableNetwork(page: Page, timeout = 5000) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(Math.min(timeout, 1000)); // small settle buffer
}

/** Retry a flaky async action a handful of times before failing. */
export async function retry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 500): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

/** Generate a unique-ish test string, useful for form inputs that must be unique. */
export function uniqueSuffix(prefix = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
