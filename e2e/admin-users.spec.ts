import { test, expect } from '@playwright/test';

test.describe('Admin Users', () => {
  test('users page is accessible', async ({ page }) => {
    const response = await page.goto('/admin/usuarios');
    expect(response?.status()).toBeLessThan(500);
  });
});
