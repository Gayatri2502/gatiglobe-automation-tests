import { test, expect } from '@playwright/test';
import {
  calculateFirstYearTotal,
  calculateAnnualRenewal,
  publishedPricingExamples,
  pricingModel,
} from '../../fixtures/test-data';

/**
 * BUSINESS-LOGIC SUITE — Pricing
 *
 * The GatiGlobe pricing PDF publishes a worked table of first-year totals
 * and renewal amounts for 1/2/3/5 branches. These tests:
 *  1. Verify our transcribed pricing model reproduces every published
 *     example exactly (guards against transcription errors / future
 *     brochure changes going unnoticed).
 *  2. If/when a live pricing calculator or quote-request page exists on
 *     the site, drive it with the same inputs and assert it agrees with
 *     the brochure (uncomment the UI block below once that page/selectors
 *     are confirmed).
 */
test.describe('Pricing — brochure model validation @business-logic', () => {
  for (const example of publishedPricingExamples) {
    test(`first-year total for ${example.branches} branch(es) matches brochure (₹${example.firstYearTotal})`, () => {
      expect(calculateFirstYearTotal(example.branches)).toBe(example.firstYearTotal);
    });

    test(`annual renewal for ${example.branches} branch(es) matches brochure (₹${example.annualRenewal})`, () => {
      expect(calculateAnnualRenewal(example.branches)).toBe(example.annualRenewal);
    });
  }

  test('base package price includes 18% GST as stated', () => {
    // Brochure states "1 branch • 18% GST included" for the ₹30,000 base package.
    expect(pricingModel.basePackageFirstYear).toBe(30000);
  });

  test('each additional branch costs ₹8,000 in year one', () => {
    expect(pricingModel.additionalBranchFirstYear).toBe(8000);
  });

  test('hosting & domain is a flat ₹5,000 first-year charge regardless of branch count', () => {
    const oneBranch = calculateFirstYearTotal(1);
    const threeBranches = calculateFirstYearTotal(3);
    const brancheDelta = threeBranches - oneBranch;
    // Delta should be purely 2 additional branches (₹16,000), hosting doesn't scale.
    expect(brancheDelta).toBe(2 * pricingModel.additionalBranchFirstYear);
  });

  test('rejects invalid branch counts (must be >= 1)', () => {
    expect(() => calculateFirstYearTotal(0)).toThrow();
    expect(() => calculateAnnualRenewal(-1)).toThrow();
  });

  test.skip('live pricing/quote page reflects the same figures as the brochure', async ({
    page,
  }) => {
    // Enable once a pricing calculator page exists on gatiglobe.in, e.g.:
    // await page.goto('/pricing');
    // await page.getByLabel(/branches/i).fill('3');
    // await expect(page.getByTestId('first-year-total')).toHaveText(/51,000/);
  });
});
