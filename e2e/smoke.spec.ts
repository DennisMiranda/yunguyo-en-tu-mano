import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/yunguyo/i);
  });

  test('dev server is running', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
  });
});
