import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('images have alt text', async ({ page }) => {
    await page.goto('/explorar');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/admin/login');
    const inputs = page.locator('input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const id = await inputs.nth(i).getAttribute('id');
      const ariaLabel = await inputs.nth(i).getAttribute('aria-label');
      const hasLabel = id
        ? await page.locator(`label[for="${id}"]`).isVisible()
        : false;
      expect(hasLabel || ariaLabel).toBeTruthy();
    }
  });
});
