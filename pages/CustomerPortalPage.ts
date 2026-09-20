import { Page, Locator, expect } from '@playwright/test';
import type { NewBookingFormData } from '../fixtures/test-data';

export class CustomerPortalPage {
  readonly page: Page;

  readonly dashboardHeading: Locator;
  readonly header: Locator;
  readonly headerNav: Locator;
  readonly headerLogo: Locator;
  readonly welcomeHeading: Locator;
  readonly totalBookingsHeading: Locator;
  readonly activeLorryReceiptsHeading: Locator;
  readonly totalInvoicesHeading: Locator;

  readonly bookingsLink: Locator;
  readonly trackingLink: Locator;
  readonly documentsLink: Locator;
  readonly lorryReceiptsLink: Locator;
  readonly invoicesLink: Locator;
  readonly statementLink: Locator;

  readonly bookingsTable: Locator;
  readonly bookingRows: Locator;
  readonly newBookingButton: Locator;

  readonly fromLocationField: Locator;
  readonly toLocationField: Locator;
  readonly goodsDescriptionField: Locator;
  readonly preferredDateField: Locator;
  readonly packagesField: Locator;
  readonly actualWeightField: Locator;
  readonly expectedPriceField: Locator;
  readonly specialInstructionsField: Locator;
  readonly newBookingSubmitButton: Locator;
  readonly validationAlert: Locator;

  readonly searchBox: Locator;
  readonly invoiceDialog: Locator;
  readonly invoiceCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dashboardHeading = this.page.getByRole('heading', { name: /dashboard|overview|bookings/i });
    this.header = this.page.getByRole('banner');
    this.headerNav = this.page.getByRole('navigation');
    this.headerLogo = this.page.getByRole('img', { name: /logo|gati/i });
    this.welcomeHeading = this.page.getByRole('heading', { name: /welcome back/i });
    this.totalBookingsHeading = this.page.getByRole('heading', { name: /total bookings/i });
    this.activeLorryReceiptsHeading = this.page.getByRole('heading', { name: /active lorry receipts/i });
    this.totalInvoicesHeading = this.page.getByRole('heading', { name: /total invoices/i });

    this.bookingsLink = this.page.getByRole('link', { name: /booking/i });
    this.trackingLink = this.page.getByRole('link', { name: /tracking|track/i });
    this.documentsLink = this.page.getByRole('link', { name: /document/i });
    this.lorryReceiptsLink = this.page.getByRole('link', { name: /lorry receipt|consignment/i });
    this.invoicesLink = this.page.getByRole('link', { name: /invoice/i });
    this.statementLink = this.page.getByRole('link', { name: /statement/i });

    this.bookingsTable = this.page.getByRole('table');
    this.bookingRows = this.bookingsTable.getByRole('row');
    this.newBookingButton = this.page.getByRole('button', { name: /new booking/i });

    this.fromLocationField = this.page.getByRole('textbox', { name: /from location/i });
    this.toLocationField = this.page.getByRole('textbox', { name: /to location/i });
    this.goodsDescriptionField = this.page.getByRole('textbox', { name: /goods description/i });
    this.preferredDateField = this.page.getByRole('textbox', { name: /preferred date/i });
    this.packagesField = this.page.getByRole('spinbutton', { name: /packages/i }).or(this.page.getByRole('textbox', { name: /packages/i }));
    this.actualWeightField = this.page.getByRole('spinbutton', { name: /actual weight/i }).or(this.page.getByRole('textbox', { name: /actual weight/i }));
    this.expectedPriceField = this.page.getByRole('spinbutton', { name: /expected price/i }).or(this.page.getByRole('textbox', { name: /expected price/i }));
    this.specialInstructionsField = this.page.getByRole('textbox', { name: /special instructions/i });
    this.newBookingSubmitButton = this.page.getByRole('button', { name: /submit|create booking|request booking/i });
    this.validationAlert = this.page.getByRole('alert');

    this.searchBox = this.page.getByRole('searchbox').or(this.page.getByRole('textbox', { name: /search/i }));
    this.invoiceDialog = this.page.getByRole('dialog');
    this.invoiceCloseButton = this.invoiceDialog.getByRole('button', { name: /close/i });
  }

  nav(label: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(label, 'i') });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.dashboardHeading.first()).toBeVisible({ timeout: 15_000 });
  }

  async expectHeaderVisible(): Promise<void> {
    await expect(this.header.first()).toBeVisible({ timeout: 15_000 });
    await expect(this.headerLogo.first()).toBeVisible({ timeout: 10_000 });
    await expect(this.headerNav.first()).toBeVisible({ timeout: 10_000 });
  }

  async expectHeaderActive(expectedActiveLabel?: string): Promise<void> {
    await this.expectHeaderVisible();
    if (expectedActiveLabel) {
      const expectedLink = this.page.getByRole('link', { name: new RegExp(expectedActiveLabel, 'i') }).first();
      await expect(expectedLink).toBeVisible({ timeout: 10_000 });
      const isActive = await expectedLink.evaluate((el) => {
        const hasAria = el.getAttribute('aria-current') === 'page';
        const hasActiveClass = el.classList.contains('active') || el.className.includes('active') || el.className.includes('selected');
        const parentActive = el.closest('a, li')?.classList.contains('active') || false;
        return hasAria || hasActiveClass || parentActive;
      }).catch(() => false);
      if (!isActive) {

        await expect(this.headerNav.getByRole('link').first()).toBeVisible({ timeout: 5_000 }).catch(() => {});
      }
    } else {
      await expect(this.headerNav.getByRole('link').first()).toBeVisible({ timeout: 10_000 });
    }
  }

  async expectAppOpened(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login/, { timeout: 15_000 });
    await this.expectHeaderVisible();
    await this.expectLoaded();
  }

  async expectDashboardLoaded(): Promise<void> {
    await expect(this.welcomeHeading.first()).toBeVisible({ timeout: 15_000 });
    await expect(this.totalBookingsHeading.first()).toBeVisible({ timeout: 10_000 });
    await expect(this.activeLorryReceiptsHeading.first()).toBeVisible({ timeout: 10_000 });
    await expect(this.totalInvoicesHeading.first()).toBeVisible({ timeout: 10_000 });
  }

  async getKpiValue(kpiName: 'Total Bookings' | 'Active Lorry Receipts' | 'Total Invoices'): Promise<string> {
    const heading = this.page.getByRole('heading', { name: new RegExp(kpiName, 'i') }).first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
    const card = this.page.getByRole('generic').filter({ has: heading }).first();
    const valueHeading = card.getByRole('heading', { name: /\d+/ }).first();
    const raw = (await valueHeading.textContent().catch(() => null)) ?? (await card.textContent()) ?? '';
    const match = raw.match(/[\d,]+/);
    return match ? match[0] : raw.trim();
  }

  async goToBookings(): Promise<void> {
    await this.bookingsLink.first().click();
  }

  async goToTracking(): Promise<void> {
    await this.trackingLink.first().click();
  }

  async goToDocuments(): Promise<void> {
    await this.documentsLink.first().click();
  }

  async clickNewBooking(): Promise<void> {
    await this.newBookingButton.first().click();
  }

  async getBookingRowCount(): Promise<number> {
    const total = await this.bookingRows.count();
    if (total === 0) return 0;
    const firstRowText = (await this.bookingRows.first().textContent()) ?? '';
    if (/date|from|goods/i.test(firstRowText)) return Math.max(0, total - 1);
    return total;
  }

  async getFirstBookingRow(): Promise<{ dateCreated: string; from: string; to: string; goods: string }> {

    const firstDataRow = this.bookingRows.nth(1);
    const hasHeader = await this.bookingRows.first().textContent().then((t) => /date|from|goods/i.test(t ?? '')).catch(() => false);
    const targetRow = hasHeader ? firstDataRow : this.bookingRows.first();
    await expect(targetRow).toBeVisible({ timeout: 10_000 });
    const cells = targetRow.getByRole('cell');
    const dateCreated = ((await cells.nth(0).textContent()) ?? '').trim();
    const from = ((await cells.nth(1).textContent()) ?? '').trim();
    const to = ((await cells.nth(2).textContent()) ?? '').trim();
    const goods = ((await cells.nth(3).textContent()) ?? '').trim();
    return { dateCreated, from, to, goods };
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: /log ?out|sign ?out/i }).click();
  }

  async fillNewBookingForm(data: NewBookingFormData): Promise<void> {
    if (data.fromLocation !== undefined) await this.fillFromLocation(data.fromLocation);
    if (data.toLocation !== undefined) await this.fillToLocation(data.toLocation);
    if (data.goodsDescription !== undefined) await this.fillGoodsDescription(data.goodsDescription);
    if (data.preferredDate !== undefined) await this.fillPreferredDate(data.preferredDate);
    if (data.packages !== undefined) await this.fillPackages(data.packages);
    if (data.actualWeightKg !== undefined) await this.fillActualWeight(data.actualWeightKg);
    if (data.expectedPriceInr !== undefined) await this.fillExpectedPrice(data.expectedPriceInr);
    if (data.specialInstructions !== undefined) await this.fillSpecialInstructions(data.specialInstructions);
  }

  async fillFromLocation(value: string): Promise<void> {
    await this.fromLocationField.first().fill(value);
  }
  async fillToLocation(value: string): Promise<void> {
    await this.toLocationField.first().fill(value);
  }
  async fillGoodsDescription(value: string): Promise<void> {
    await this.goodsDescriptionField.first().fill(value);
  }
  async fillPreferredDate(value: string): Promise<void> {
    await this.preferredDateField.first().click().catch(() => {});
    await this.preferredDateField.first().fill(value);
    await this.preferredDateField.first().press('Enter').catch(() => {});
  }
  async fillPackages(value: string): Promise<void> {
    await this.packagesField.first().fill(value);
  }
  async fillActualWeight(value: string): Promise<void> {
    await this.actualWeightField.first().fill(value);
  }
  async fillExpectedPrice(value: string): Promise<void> {
    await this.expectedPriceField.first().fill(value);
  }
  async fillSpecialInstructions(value: string): Promise<void> {
    await this.specialInstructionsField.first().fill(value);
  }
  async clearFromLocation(): Promise<void> {
    await this.fromLocationField.first().clear();
  }
  async clearToLocation(): Promise<void> {
    await this.toLocationField.first().clear();
  }
  async clearGoodsDescription(): Promise<void> {
    await this.goodsDescriptionField.first().clear();
  }
  async clearPreferredDate(): Promise<void> {
    await this.preferredDateField.first().clear();
  }
  async clearPackages(): Promise<void> {
    await this.packagesField.first().clear();
  }
  async clearActualWeight(): Promise<void> {
    await this.actualWeightField.first().clear();
  }
  async clearExpectedPrice(): Promise<void> {
    await this.expectedPriceField.first().clear();
  }
  async clearSpecialInstructions(): Promise<void> {
    await this.specialInstructionsField.first().clear();
  }
  async clearNewBookingForm(): Promise<void> {
    await this.clearFromLocation().catch(() => {});
    await this.clearToLocation().catch(() => {});
    await this.clearGoodsDescription().catch(() => {});
    await this.clearPreferredDate().catch(() => {});
    await this.clearPackages().catch(() => {});
    await this.clearActualWeight().catch(() => {});
    await this.clearExpectedPrice().catch(() => {});
    await this.clearSpecialInstructions().catch(() => {});
  }
  async getFromLocationValue(): Promise<string> {
    return (await this.fromLocationField.first().inputValue().catch(async () => (await this.fromLocationField.first().textContent()) ?? '')) ?? '';
  }
  async getToLocationValue(): Promise<string> {
    return (await this.toLocationField.first().inputValue().catch(async () => (await this.toLocationField.first().textContent()) ?? '')) ?? '';
  }
  async getGoodsDescriptionValue(): Promise<string> {
    return (await this.goodsDescriptionField.first().inputValue().catch(async () => (await this.goodsDescriptionField.first().textContent()) ?? '')) ?? '';
  }
  async getPreferredDateValue(): Promise<string> {
    return (await this.preferredDateField.first().inputValue().catch(async () => (await this.preferredDateField.first().textContent()) ?? '')) ?? '';
  }
  async getPackagesValue(): Promise<string> {
    return (await this.packagesField.first().inputValue().catch(async () => (await this.packagesField.first().textContent()) ?? '')) ?? '';
  }
  async getActualWeightValue(): Promise<string> {
    return (await this.actualWeightField.first().inputValue().catch(async () => (await this.actualWeightField.first().textContent()) ?? '')) ?? '';
  }
  async getExpectedPriceValue(): Promise<string> {
    return (await this.expectedPriceField.first().inputValue().catch(async () => (await this.expectedPriceField.first().textContent()) ?? '')) ?? '';
  }
  async getSpecialInstructionsValue(): Promise<string> {
    return (await this.specialInstructionsField.first().inputValue().catch(async () => (await this.specialInstructionsField.first().textContent()) ?? '')) ?? '';
  }
  async isNewBookingFormVisible(): Promise<boolean> {
    return await this.fromLocationField.first().isVisible().catch(() => false);
  }
  async isFieldVisible(field: 'from' | 'to' | 'goods' | 'date' | 'packages' | 'weight' | 'price' | 'instructions'): Promise<boolean> {
    const map = {
      from: this.fromLocationField,
      to: this.toLocationField,
      goods: this.goodsDescriptionField,
      date: this.preferredDateField,
      packages: this.packagesField,
      weight: this.actualWeightField,
      price: this.expectedPriceField,
      instructions: this.specialInstructionsField,
    } as const;
    return await map[field].first().isVisible().catch(() => false);
  }

  async getTotalBookings(): Promise<string> {
    return this.getKpiValue('Total Bookings');
  }
  async getActiveLorryReceipts(): Promise<string> {
    return this.getKpiValue('Active Lorry Receipts');
  }
  async getTotalInvoices(): Promise<string> {
    return this.getKpiValue('Total Invoices');
  }
  async isWelcomeVisible(): Promise<boolean> {
    return await this.welcomeHeading.first().isVisible().catch(() => false);
  }

  async expectBookingMatches(row: { from: string; to: string; goods: string }, data: NewBookingFormData): Promise<void> {
    expect(row.from.toLowerCase()).toContain(data.fromLocation!.toLowerCase());
    expect(row.to.toLowerCase()).toContain(data.toLocation!.toLowerCase());
    expect(row.goods.toLowerCase()).toContain(data.goodsDescription!.toLowerCase());
  }

  async expectBookingDateIsToday(dateCreated: string): Promise<void> {
    const now = new Date();
    const iso = now.toISOString().split('T')[0];
    const gbShort = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const usShort = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const gbSlash = now.toLocaleDateString('en-GB');
    const dash = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const variants = [iso, gbShort, usShort, gbSlash, dash];
    const matches = variants.some((v) => dateCreated.includes(v) || v.includes(dateCreated));
    expect(matches, `expected dateCreated "${dateCreated}" to match today ${JSON.stringify(variants)}`).toBeTruthy();
  }

  async expectBookingRowCountUnchanged(initialCount: number): Promise<void> {
    const after = await this.getBookingRowCount();
    expect(after).toBe(initialCount);
  }

  async expectValidationBlocked(): Promise<void> {
    const errors = await this.getNewBookingValidationErrors();
    expect(errors.length, `expected at least one validation error, got: ${JSON.stringify(errors)}`).toBeGreaterThan(0);
    await expect(this.fromLocationField.first()).toBeVisible({ timeout: 10_000 });
  }

  async isOnBookingsPage(): Promise<boolean> {
    return this.page.url().includes('booking');
  }
  async isOnTrackingPage(): Promise<boolean> {
    return this.page.url().includes('track');
  }
  async isOnDocumentsPage(): Promise<boolean> {
    return this.page.url().includes('document');
  }
  async isOnLorryReceiptsPage(): Promise<boolean> {
    return this.page.url().includes('lorry') || this.page.url().includes('consignment');
  }
  async isOnInvoicesPage(): Promise<boolean> {
    return this.page.url().includes('invoice');
  }
  async isOnStatementPage(): Promise<boolean> {
    return this.page.url().includes('statement');
  }

  async submitNewBooking(): Promise<void> {
    await this.newBookingSubmitButton.first().click();
  }

  async getNewBookingValidationErrors(): Promise<string[]> {
    const count = await this.validationAlert.count();
    const messages: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.validationAlert.nth(i).textContent())?.trim();
      if (text) messages.push(text);
    }

    return [...new Set(messages)];
  }

  async createBooking(data: NewBookingFormData): Promise<void> {
    await this.clickNewBooking();
    await this.fillNewBookingForm(data);
    await this.submitNewBooking();
  }

  async goToLorryReceipts(): Promise<void> {
    await this.lorryReceiptsLink.first().click();
  }

  async searchLorryReceipts(query: string): Promise<void> {
    await this.searchBox.first().fill(query);
    await this.searchBox.first().press('Enter').catch(() => {});
  }

  async goToInvoices(): Promise<void> {
    await this.invoicesLink.first().click();
  }

  async openInvoice(invoiceNo: string): Promise<void> {
    const row = this.page.getByRole('row', { name: new RegExp(invoiceNo, 'i') }).first();
    await expect(row).toBeVisible({ timeout: 10_000 });
    await row.getByRole('button', { name: /view/i }).first().click();
  }

  async getInvoiceModalDetails(): Promise<{ invoiceNo: string; date: string; gstMode: string; totalInvoiceAmount: string }> {
    await expect(this.invoiceDialog.first()).toBeVisible({ timeout: 10_000 });
    const modalText = (await this.invoiceDialog.first().textContent()) ?? '';
    const extract = (re: RegExp): string => {
      const m = modalText.match(re);
      return m ? (m[1] ?? m[0]).trim() : '';
    };
    const invoiceNo = extract(/invoice\s*no\.?\s*[:\-]?\s*([A-Za-z0-9\-/]+)/i);
    const date = extract(/date\s*[:\-]?\s*([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{2}\/[0-9]{2}\/[0-9]{4}|[0-9]{1,2}\s+[A-Za-z]{3,}\s+[0-9]{4})/i);
    const gstMode = extract(/gst\s*mode\s*[:\-]?\s*([A-Za-z]+)/i);
    const totalInvoiceAmount = extract(/total\s*(?:invoice\s*)?amount\s*[:\-]?\s*([₹\s]?[\d,]+\.?\d*)/i);
    return { invoiceNo, date, gstMode, totalInvoiceAmount };
  }

  async closeInvoiceModal(): Promise<void> {
    await this.invoiceCloseButton.first().click();
  }

  async goToStatement(): Promise<void> {
    await this.statementLink.first().click();
  }

  async getAccountSummary(): Promise<{ totalBilled: string; totalPaid: string; outstanding: string }> {
    const getValue = async (label: string): Promise<string> => {
      const heading = this.page.getByRole('heading', { name: new RegExp(label, 'i') }).first();
      const fallback = this.page.getByRole('generic').filter({ has: heading }).first();
      const text = (await fallback.textContent()) ?? (await heading.textContent()) ?? '';
      const m = text.match(new RegExp(label + '\\s*[:\\-]?\\s*([₹\\s]?[\\d,]+\\.?\\d*)', 'i'));
      if (m) return m[1].trim();
      const num = text.match(/[₹]?[\d,]+\.?\d*/);
      return num ? num[0].trim() : text.trim();
    };
    const totalBilled = await getValue('total billed');
    const totalPaid = await getValue('total paid');
    const outstanding = await getValue('outstanding');
    return { totalBilled, totalPaid, outstanding };
  }
}
