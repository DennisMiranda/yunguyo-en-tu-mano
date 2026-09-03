import { test, expect } from '@playwright/test';

test.describe('Category', () => {
  test('category listing page shows categories', async ({ page }) => {
    await page.goto('/categorias');
    await expect(page.locator('h1:text("Categorías")')).toBeVisible();
  });

  test('category detail shows breadcrumb', async ({ page }) => {
    await page.goto('/categorias');
    const primeraCategoria = page.locator('a[href*="/categorias/"]').first();
    if (await primeraCategoria.isVisible()) {
      await primeraCategoria.click();
      await expect(page.locator('text=Categorías').first()).toBeVisible();
    }
  });

  test('empty category shows message', async ({ page }) => {
    await page.goto('/categorias/categoria-inexistente');
    await expect(page.locator('text=Categoría no encontrada')).toBeVisible();
  });
});
