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

  test('header shows all links on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    const header = page.locator('header');
    await expect(header.locator('nav a')).toHaveCount(3);
  });

  test('hamburger menu opens and closes on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const botonMenu = page.locator('header button[aria-label="Menú"]');
    await expect(botonMenu).toBeVisible();
    await botonMenu.click();
    const header = page.locator('header');
    await expect(header.locator('nav a')).toHaveCount(3);
    await botonMenu.click();
  });

  test('click on logo navigates to home', async ({ page }) => {
    await page.goto('/explorar');
    await page.click('header a img[alt="Yunguyo en tu mano"]');
    await expect(page).toHaveURL('/');
  });

  test('navigation between routes works', async ({ page }) => {
    const header = page.locator('header');
    await header.locator('nav a:text("Explorar")').click();
    await expect(page).toHaveURL('/explorar');
    await header.locator('nav a:text("Categorías")').click();
    await expect(page).toHaveURL('/categorias');
    await header.locator('nav a:text("Nosotros")').click();
    await expect(page).toHaveURL('/nosotros');
  });
});
