import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero is displayed correctly', async ({ page }) => {
    await expect(page.locator('h1:text("Yunguyo en tu mano")')).toBeVisible();
  });

  test('search is displayed below hero', async ({ page }) => {
    await expect(
      page.locator('input[placeholder="Buscar emprendimientos..."]')
    ).toBeVisible();
    await expect(page.locator('button:text("Buscar")')).toBeVisible();
  });

  test('search redirects to /explorar with query', async ({ page }) => {
    await page.fill(
      'input[placeholder="Buscar emprendimientos..."]',
      'restaurante'
    );
    await page.click('button:text("Buscar")');
    await expect(page).toHaveURL(/\/explorar\?q=restaurante/);
  });

  test('categories section is displayed', async ({ page }) => {
    await expect(page.locator('text=Explora por categoría')).toBeVisible();
  });

  test('footer is displayed', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Yunguyo en tu mano');
  });
});
