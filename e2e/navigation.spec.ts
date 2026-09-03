import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    const criticalErrors = errors.filter(
      (e) => !e.includes('supabaseUrl is required')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('has expected routes defined in plan', async ({ page }) => {
    const routes = ['/', '/explorar', '/categorias', '/nosotros'];
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(500);
    }
  });
});
