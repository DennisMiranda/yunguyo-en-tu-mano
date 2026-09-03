import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('business detail has dynamic title', async ({ page }) => {
    await page.goto('/explorar');
    const primerEmprendimiento = page.locator('a[href*="/explorar/"]').first();
    if (await primerEmprendimiento.isVisible()) {
      await primerEmprendimiento.click();
      await expect(page).toHaveTitle(/Yunguyo/);
    }
  });

  test('category detail has dynamic title', async ({ page }) => {
    await page.goto('/categorias');
    const primeraCategoria = page.locator('a[href*="/categorias/"]').first();
    if (await primeraCategoria.isVisible()) {
      await primeraCategoria.click();
      await expect(page).toHaveTitle(/Yunguyo/);
    }
  });
});
