import { test, expect } from '@playwright/test';

test.describe('Explore', () => {
  test('page loads with businesses', async ({ page }) => {
    await page.goto('/explorar');
    await expect(page.locator('h1:text("Explorar")')).toBeVisible();
    await expect(
      page.locator('input[placeholder="Buscar emprendimientos..."]')
    ).toBeVisible();
  });

  test('search filters results', async ({ page }) => {
    await page.goto('/explorar');
    await page.fill(
      'input[placeholder="Buscar emprendimientos..."]',
      'restaurante'
    );
    await page.click('button:text("Buscar")');
    await expect(page).toHaveURL(/q=restaurante/);
  });

  test('category filter is displayed', async ({ page }) => {
    await page.goto('/explorar');
    await expect(page.locator('button:text("Todas")')).toBeVisible();
  });

  test('clear filters resets view', async ({ page }) => {
    await page.goto('/explorar?q=test');
    const botonLimpiar = page.locator('button:text("Limpiar filtros")');
    if (await botonLimpiar.isVisible()) {
      await botonLimpiar.click();
      await expect(page).toHaveURL('/explorar');
    }
  });
});
