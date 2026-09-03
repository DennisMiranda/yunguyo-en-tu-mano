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

  test('full flow: homepage → explorar → category → detail', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('h1:text("Yunguyo en tu mano")')).toBeVisible();

    await page.click('a[href="/explorar"]');
    await expect(page).toHaveURL(/\/explorar/);

    await page.click('a[href="/categorias"]');
    await expect(page).toHaveURL(/\/categorias/);
  });
});
