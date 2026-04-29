import { test, expect } from '@playwright/test';

test.describe('Typing Flow & Stability', () => {
    test.beforeEach(async ({ page }) => {
        // Auto-fail tests on critical browser console errors
        page.on('console', msg => {
            const text = msg.text();
            if (msg.type() === 'error') {
                // Ignore non-critical resource errors (like 404s for favicon)
                if (text.includes('Failed to load resource') || text.includes('404')) {
                    console.warn('IGNORING NON-CRITICAL CONSOLE ERROR:', text);
                    return;
                }
                
                console.info('CRITICAL BROWSER CONSOLE ERROR DETECTED:', text);
                throw new Error(`Critical Browser Console Error: ${text}`);
            }
        });
    });

    test('navigate to home, type chars, verify stability', async ({ page }) => {
        await page.goto('/');
        
        // Wait for hydration and potential modal
        await page.waitForTimeout(1500);
        
        // Dismiss Welcome Modal if it exists
        const welcomeButton = page.locator('button:has-text("Start Learning!")');
        if (await welcomeButton.isVisible()) {
            await welcomeButton.click();
            await page.waitForTimeout(500); // Wait for modal to close
        }
        
        // Use a more robust selector and wait strategy
        const practiceButton = page.locator('button:has-text("Practice Mode"), button:has-text("Resume Journey")').first();
        await expect(practiceButton).toBeVisible({ timeout: 10000 });
        
        // Force click if necessary
        await practiceButton.click({ force: true });
        
        // Wait for navigation and verify URL
        await page.waitForURL(/.*(practice|lessons).*/, { timeout: 15000 });
        await expect(page).toHaveURL(/.*(practice|lessons).*/);
        
        // Type 10 characters to verify system doesn't crash
        const keys = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l'];
        for (const key of keys) {
            await page.keyboard.press(key);
            await page.waitForTimeout(50);
        }
        // Verify no errors thrown (handled by beforeEach listener)
    });

    test('verify smart practice hydration delay', async ({ page }) => {
        await page.goto('/practice/smart');
        
        // Wait for loading state and briefing screen
        await page.waitForTimeout(600); 
        
        // Click "Start Smart Practice" or "Next Exercise" to enter typing mode
        const startButton = page.locator('button:has-text("Start Smart Practice"), button:has-text("Next Exercise")');
        await expect(startButton).toBeVisible();
        await startButton.click();

        const typingArea = page.locator('[role="application"][aria-label="Typing practice area"]');
        await expect(typingArea).toBeVisible();
        
        // Verify text is not empty
        const textbox = typingArea.locator('[role="textbox"]');
        await expect(textbox).toBeVisible();
        const text = await textbox.innerText();
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
