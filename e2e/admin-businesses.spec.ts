import { test, expect } from '@playwright/test';

test.describe('Admin Businesses', () => {
  test('businesses page is accessible', async ({ page }) => {
    const response = await page.goto('/admin/emprendimientos');
    expect(response?.status()).toBeLessThan(500);
  });

  test('new business page is accessible', async ({ page }) => {
    const response = await page.goto('/admin/emprendimientos/nuevo');
    expect(response?.status()).toBeLessThan(500);
  });
});
