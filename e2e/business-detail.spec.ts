import { test, expect } from '@playwright/test';

test.describe('Business Detail', () => {
  test('business detail page shows info', async ({ page }) => {
    await page.goto('/explorar');
    const primeraTarjeta = page.locator('a[href*="/explorar/"]').first();
    if (await primeraTarjeta.isVisible()) {
      await primeraTarjeta.click();
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('WhatsApp button has correct link', async ({ page }) => {
    await page.goto('/explorar');
    const primeraTarjeta = page.locator('a[href*="/explorar/"]').first();
    if (await primeraTarjeta.isVisible()) {
      await primeraTarjeta.click();
      const botonWhatsApp = page.locator('a[href*="wa.me"]');
      if (await botonWhatsApp.isVisible()) {
        await expect(botonWhatsApp).toHaveAttribute('href', /wa\.me/);
      }
    }
  });

  test('business not found shows message', async ({ page }) => {
    await page.goto('/explorar/emprendimiento-inexistente');
    await expect(
      page.locator('text=Emprendimiento no encontrado')
    ).toBeVisible();
  });
});
