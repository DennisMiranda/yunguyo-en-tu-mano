import { test, expect } from '@playwright/test';

test.describe('Supabase Connection', () => {
  test('app loads without critical errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');

    const criticalErrors = errors.filter(
      (e) => !e.includes('supabaseUrl is required')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('can query categorias via REST API', async ({ request }) => {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    test.skip(!url || !key, 'Supabase not configured');

    const response = await request.get(
      `${url}/rest/v1/categorias?select=*&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });
});
