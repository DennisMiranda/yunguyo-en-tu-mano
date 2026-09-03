import { test, expect } from '@playwright/test';

test.describe('Supabase Connection', () => {
  test('app loads without supabase errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');

    // No supabase-related errors should occur
    const supabaseErrors = errors.filter((e) =>
      e.toLowerCase().includes('supabase')
    );
    expect(supabaseErrors).toHaveLength(0);
  });

  test('can query categorias via REST API', async ({ request }) => {
    test.skip(!process.env.VITE_SUPABASE_URL, 'Supabase not configured');

    const response = await request.get(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/categorias?select=*&limit=1`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY || ''}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });
});
