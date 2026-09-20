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

/** Returns today's date in ISO YYYY-MM-DD form (e.g. 2026-09-20). */
export function getTodayISODate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns a set of likely display variants for today's date as it might
 * appear in the "My Bookings" table (ISO, GB short, US short, slash, dash).
 * Use this to assert dateCreated without hard-coding a single locale format.
 */
export function getTodayBookingDateVariants(): string[] {
  const now = new Date();
  const iso = now.toISOString().split('T')[0]; // 2026-09-20
  const gbShort = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); // 20 Sept 2026
  const usShort = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); // Sept 20, 2026
  const gbSlash = now.toLocaleDateString('en-GB'); // 20/09/2026
  const dash = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`; // 20-09-2026
  const monthYear = now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  return [iso, gbShort, usShort, gbSlash, dash, monthYear];
}
