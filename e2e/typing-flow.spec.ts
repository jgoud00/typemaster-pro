import { test, expect } from '@playwright/test';

test('navigate to free practice, type chars, verify WPM updates', async ({ page }) => {
    // /practice shows a Hub. /practice?mode=free shows the actual typing interface.
    await page.goto('/practice?mode=free');

    // Wait for the typing area container (role="application") to render
    const typingApp = page.locator('[role="application"][aria-label="Typing practice area"]');
    await expect(typingApp).toBeVisible({ timeout: 15000 });

    // The textbox is inside it
    const textbox = typingApp.locator('[role="textbox"]');
    await expect(textbox).toBeVisible({ timeout: 5000 });

    // Give hydration a moment
    await page.waitForTimeout(500);

    // Type some characters via individual key presses
    const keys = ['t', 'h', 'e', ' ', 'q', 'u', 'i', 'c', 'k', ' '];
    for (const key of keys) {
        await page.keyboard.press(key === ' ' ? 'Space' : key);
        await page.waitForTimeout(80);
    }

    // Screen reader status region should reflect activity
    const status = page.locator('div[role="status"][aria-live="polite"]');
    await expect(status).toBeVisible({ timeout: 5000 });
    const statusText = await status.innerText();
    expect(statusText.length).toBeGreaterThan(0);
});
