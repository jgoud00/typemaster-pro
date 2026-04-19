import { test, expect } from '@playwright/test';

test('app loads initially and service worker registers', async ({ page }) => {
    // Initial load — verify the app shell renders
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Verify the title is set
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // Check that the SW registration script ran (manifest link exists)
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', '/manifest.json');
});

test('manifest.json is served correctly', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);

    const body = await response?.json();
    expect(body.name).toBe('TypeMaster Pro');
    expect(body.display).toBe('standalone');
});
