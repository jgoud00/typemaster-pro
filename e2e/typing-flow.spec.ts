import { test, expect } from '@playwright/test';

test.describe('Typing Flow & Stability', () => {
    test.beforeEach(async ({ page }) => {
        // Auto-fail tests on any browser console error
        page.on('console', msg => {
            if (msg.type() === 'error') {
                throw new Error(`Browser Console Error: ${msg.text()}`);
            }
        });
    });

    test('navigate to home, type chars, verify stability', async ({ page }) => {
        await page.goto('/');
        
        // Wait for typing area if it exists on home, or navigate to practice
        await page.click('text=Start Practicing');
        await page.waitForURL('**/practice**');
        
        // Type 10 characters
        const keys = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l'];
        for (const key of keys) {
            await page.keyboard.press(key);
            await page.waitForTimeout(50);
        }

        // Verify no errors thrown (handled by beforeEach listener)
    });

    test('verify smart practice hydration delay', async ({ page }) => {
        await page.goto('/practice/smart');
        
        // Wait for loading state to disappear or logic to trigger
        await page.waitForTimeout(600); // 100ms hydration + 500ms buffer
        
        const typingArea = page.locator('[role="application"][aria-label="Typing practice area"]');
        await expect(typingArea).toBeVisible();
        
        // Verify text is not empty or fallback
        const text = await page.locator('[data-testid="typing-text"]').innerText();
        expect(text.length).toBeGreaterThan(0);
    });

    test('verify stats charts render', async ({ page }) => {
        await page.goto('/stats');
        
        // Wait for Recharts or SVG charts
        const charts = page.locator('svg');
        await expect(charts.first()).toBeVisible({ timeout: 10000 });
        
        const chartCount = await charts.count();
        expect(chartCount).toBeGreaterThan(0);
        
        // Verify height
        const box = await charts.first().boundingBox();
        expect(box?.height).toBeGreaterThan(0);
    });

    test('rapid typing stress test', async ({ page }) => {
        await page.goto('/practice?mode=free');
        
        // Wait for hydration
        await page.waitForTimeout(500);

        // Type 50 characters in ~1 second
        const chars = 'the quick brown fox jumps over the lazy dog and runs'.split('');
        for (const char of chars) {
            await page.keyboard.press(char);
            await page.waitForTimeout(20); // 20ms * 50 = 1000ms
        }

        // Verify no "fingerStats undefined" or other errors occurred
    });

    test('legacy: verify WPM updates', async ({ page }) => {
        await page.goto('/practice?mode=free');
        const typingArea = page.locator('[role="application"][aria-label="Typing practice area"]');
        await expect(typingArea).toBeVisible();
        const textbox = typingArea.locator('[role="textbox"]');
        await expect(textbox).toBeVisible();
        
        await page.waitForTimeout(500);
        const keys = ['t', 'h', 'e', ' ', 'q', 'u', 'i', 'c', 'k', ' '];
        for (const key of keys) {
            await page.keyboard.press(key === ' ' ? 'Space' : key);
            await page.waitForTimeout(80);
        }
        const status = page.locator('div[role="status"][aria-live="polite"]');
        await expect(status).toBeVisible();
    });
});
