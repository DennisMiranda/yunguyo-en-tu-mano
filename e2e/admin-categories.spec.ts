import { test, expect } from '@playwright/test';

test.describe('Admin Categories', () => {
  test('categories page is accessible', async ({ page }) => {
    const response = await page.goto('/admin/categorias');
    expect(response?.status()).toBeLessThan(500);
  });

  test('new category page is accessible', async ({ page }) => {
    const response = await page.goto('/admin/categorias/nueva');
    expect(response?.status()).toBeLessThan(500);
  });
});
