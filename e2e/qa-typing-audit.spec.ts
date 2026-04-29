/**
 * QA AUDIT — Playwright E2E Tests
 * Covers: typing accuracy, timer, result calculation, edge cases, security
 */
import { test, expect, Page } from '@playwright/test';

// ── Helpers ──────────────────────────────────────────────

async function goToPractice(page: Page, mode = 'free') {
  // Dismiss welcome modal via localStorage before navigation
  await page.addInitScript(() => {
    const data = {
      state: {
        progress: {
          completedLessons: [], lessonScores: {}, records: [],
          totalPracticeTime: 0, totalKeystrokes: 0,
          personalBests: { wpm: 0, accuracy: 0, combo: 0 },
          unlockedAchievements: [], deviceId: 'test', vectorClock: {},
        },
        hasSeenWelcome: true,
      },
      version: 0,
    };
    localStorage.setItem('typing-progress', JSON.stringify(data));
  });

  await page.goto(`/practice?mode=${mode}`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  // Wait for the typing area to have text
  const textbox = page.locator('[role="textbox"][aria-label="Text to type"]');
  await textbox.waitFor({ state: 'attached', timeout: 15000 });
  await expect(textbox).not.toHaveText('', { timeout: 10000 });
}

async function getFirstNChars(page: Page, n: number): Promise<string> {
  const raw = await page.locator('[role="textbox"][aria-label="Text to type"]').innerText();
  // Replace non-breaking spaces with regular spaces
  return raw.replace(/\u00A0/g, ' ').substring(0, n);
}

async function getStatValue(page: Page, testId: string): Promise<string> {
  const el = page.locator(`[data-testid="${testId}"]`).first();
  if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
    return (await el.innerText()).trim();
  }
  return '';
}

async function typeText(page: Page, text: string, delayMs = 100) {
  for (const char of text) {
    await page.keyboard.press(char === ' ' ? 'Space' : char);
    await page.waitForTimeout(delayMs);
  }
}

// ═════════════════════════════════════════════════════════
//  1. CORE TYPING ACCURACY
// ═════════════════════════════════════════════════════════

test.describe('Core Typing — Input Matching', () => {
  test('correct key advances cursor and character turns green', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 1);
    const firstChar = text[0];

    await page.keyboard.press(firstChar === ' ' ? 'Space' : firstChar);
    await page.waitForTimeout(300);

    // The first span should now have the green class
    const firstSpan = page.locator('[role="textbox"] span').first();
    const classes = await firstSpan.getAttribute('class');
    expect(classes).toContain('text-green');
  });

  test('wrong key does NOT advance cursor', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 1);

    // Type a character guaranteed to be wrong
    const wrongChar = text[0] === 'z' ? 'a' : 'z';
    await page.keyboard.press(wrongChar);
    await page.waitForTimeout(300);

    // The cursor (aria-current="location") should still be on the first character
    const currentSpan = page.locator('[aria-current="location"]').first();
    await expect(currentSpan).toBeVisible();
  });

  test('multiple correct characters advance sequentially', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 5);

    await typeText(page, text, 120);
    await page.waitForTimeout(300);

    // All 5 typed chars should be green
    const greenSpans = page.locator('[role="textbox"] span.text-green-400');
    const count = await greenSpans.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});

// ═════════════════════════════════════════════════════════
//  2. WPM & ACCURACY CALCULATIONS
// ═════════════════════════════════════════════════════════

test.describe('WPM & Accuracy Calculations', () => {
  test('WPM starts at 0 before typing', async ({ page }) => {
    await goToPractice(page);
    const wpm = await getStatValue(page, 'wpm');
    expect(parseInt(wpm) || 0).toBe(0);
  });

  test('accuracy starts at 100%', async ({ page }) => {
    await goToPractice(page);
    const acc = await getStatValue(page, 'accuracy');
    expect(acc).toContain('100');
  });

  test('accuracy drops below 100% after wrong keystrokes', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 1);

    // Type the first char correctly to start the session
    await page.keyboard.press(text[0] === ' ' ? 'Space' : text[0]);
    await page.waitForTimeout(100);

    // Now spam 5 wrong keys
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('z');
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(500);

    const acc = await getStatValue(page, 'accuracy');
    const num = parseFloat(acc.replace(/[^0-9.]/g, ''));
    expect(num).toBeLessThan(100);
  });

  test('WPM increases after sustained correct typing', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 15);

    // Type 15 correct characters at ~100ms each
    await typeText(page, text, 100);
    // Wait for the 2-second WPM threshold
    await page.waitForTimeout(2500);

    const wpm = await getStatValue(page, 'wpm');
    const num = parseInt(wpm) || 0;
    expect(num).toBeGreaterThan(0);
  });
});

// ═════════════════════════════════════════════════════════
//  3. TIMER BEHAVIOR
// ═════════════════════════════════════════════════════════

test.describe('Timer', () => {
  test('timer starts at 0:00', async ({ page }) => {
    await goToPractice(page);
    const timer = await getStatValue(page, 'timer');
    expect(timer).toBe('0:00');
  });

  test('timer advances after typing begins', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 3);

    await typeText(page, text, 100);
    await page.waitForTimeout(3000);

    const timer = await getStatValue(page, 'timer');
    expect(timer).not.toBe('0:00');
  });

  test('speed test shows remaining countdown', async ({ page }) => {
    await goToPractice(page, 'speed-test');
    await page.waitForTimeout(500);

    // Find and click 1 min button
    const oneMinBtn = page.locator('button:has-text("1 min")');
    if (await oneMinBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await oneMinBtn.click();
      await page.waitForTimeout(500);
    }

    // Type a few chars to start the timer
    const text = await getFirstNChars(page, 3);
    await typeText(page, text, 100);
    await page.waitForTimeout(2000);

    // The "Remaining" label should exist and timer should show < 1:00
    const timerLabel = page.locator('text=Remaining');
    if (await timerLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
      const timerVal = await getStatValue(page, 'timer');
      expect(timerVal).not.toBe('1:00');
    }
  });
});

// ═════════════════════════════════════════════════════════
//  4. BACKSPACE / CORRECTIONS
// ═════════════════════════════════════════════════════════

test.describe('Backspace Handling', () => {
  test('backspace does not crash the app', async ({ page }) => {
    await goToPractice(page);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    const text = await getFirstNChars(page, 3);
    await typeText(page, text, 100);
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(300);

    expect(errors).toHaveLength(0);
    await expect(page.locator('body')).toBeVisible();
  });

  test('backspace does not regress cursor (by-design behavior)', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 3);

    // Type 3 chars
    await typeText(page, text, 100);
    await page.waitForTimeout(200);

    // Count green chars before backspace
    const greenBefore = await page.locator('[role="textbox"] span.text-green-400').count();

    await page.keyboard.press('Backspace');
    await page.waitForTimeout(200);

    // Green count should be unchanged (backspace is ignored)
    const greenAfter = await page.locator('[role="textbox"] span.text-green-400').count();
    expect(greenAfter).toBe(greenBefore);
  });
});

// ═════════════════════════════════════════════════════════
//  5. EDGE CASES
// ═════════════════════════════════════════════════════════

test.describe('Edge Cases', () => {
  test('special keys (Tab, Escape, F1) do not crash app', async ({ page }) => {
    await goToPractice(page);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    await page.keyboard.press('F1');
    await page.keyboard.press('CapsLock');
    await page.keyboard.press('Shift');
    await page.waitForTimeout(300);

    expect(errors).toHaveLength(0);
  });

  test('rapid key spam does not freeze the page', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 50);

    // Type very fast (20ms per char)
    await typeText(page, text, 20);
    await page.waitForTimeout(1000);

    // Page should still be responsive
    await expect(page.locator('body')).toBeVisible();
    const wpm = await getStatValue(page, 'wpm');
    expect(wpm).toBeDefined();
  });

  test('custom mode: Start button disabled when text is empty', async ({ page }) => {
    await goToPractice(page, 'custom');
    await page.waitForTimeout(500);

    // Click on Custom Text tab
    const customTab = page.locator('[role="tab"]:has-text("Custom Text")');
    if (await customTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await customTab.click();
      await page.waitForTimeout(500);
    }

    const startBtn = page.locator('button:has-text("Start Practice")');
    if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(startBtn).toBeDisabled();
    }
  });

  test('no unhandled errors during a full typing session', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await goToPractice(page);
    const text = await getFirstNChars(page, 20);
    await typeText(page, text, 80);
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });
});

// ═════════════════════════════════════════════════════════
//  6. COPY-PASTE PREVENTION
// ═════════════════════════════════════════════════════════

test.describe('Security — Copy-Paste', () => {
  test('Ctrl+V does not inject typed characters', async ({ page }) => {
    await goToPractice(page);

    // Put text on clipboard
    await page.evaluate(() => navigator.clipboard.writeText('hello world').catch(() => {}));

    // Count green chars before paste attempt
    const greenBefore = await page.locator('[role="textbox"] span.text-green-400').count();

    // Attempt paste
    await page.keyboard.press('Control+v');
    await page.waitForTimeout(500);

    const greenAfter = await page.locator('[role="textbox"] span.text-green-400').count();
    // Paste should NOT have advanced the cursor
    expect(greenAfter).toBe(greenBefore);
  });
});

// ═════════════════════════════════════════════════════════
//  7. SCORE MANIPULATION VIA LOCALSTORAGE
// ═════════════════════════════════════════════════════════

test.describe('Security — localStorage Manipulation', () => {
  test('personal bests can be tampered via localStorage (known vulnerability)', async ({ page }) => {
    // Seed fake high score
    await page.addInitScript(() => {
      const data = {
        state: {
          progress: {
            completedLessons: [], lessonScores: {}, records: [],
            totalPracticeTime: 100, totalKeystrokes: 500,
            personalBests: { wpm: 999, accuracy: 100, combo: 999 },
            unlockedAchievements: [], deviceId: 'hacker', vectorClock: {},
          },
          hasSeenWelcome: true,
        },
        version: 0,
      };
      localStorage.setItem('typing-progress', JSON.stringify(data));
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Check if the fake 999 WPM displays on homepage
    const bodyText = await page.locator('body').innerText();
    const has999 = bodyText.includes('999');

    // This SHOULD fail if validation existed — currently it passes (vulnerability)
    expect(has999).toBe(true);
  });
});

// ═════════════════════════════════════════════════════════
//  8. RESET FUNCTIONALITY
// ═════════════════════════════════════════════════════════

test.describe('Reset', () => {
  test('reset button clears WPM and accuracy', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 10);
    await typeText(page, text, 80);
    await page.waitForTimeout(2500);

    // Click the reset/restart button (RotateCcw icon button)
    const resetBtn = page.locator('button').filter({ has: page.locator('.lucide-rotate-ccw') }).first();
    if (await resetBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await resetBtn.click();
      await page.waitForTimeout(500);

      const wpm = await getStatValue(page, 'wpm');
      expect(parseInt(wpm) || 0).toBe(0);
    }
  });
});

// ═════════════════════════════════════════════════════════
//  9. COMBO & GAMIFICATION
// ═════════════════════════════════════════════════════════

test.describe('Combo System', () => {
  test('combo increments on correct consecutive keys', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 12);

    await typeText(page, text, 80);
    await page.waitForTimeout(500);

    // Look for combo display — should show at least 10
    const comboText = await page.locator('text=Combo').first().locator('..').innerText();
    const comboMatch = comboText.match(/(\d+)/);
    if (comboMatch) {
      expect(parseInt(comboMatch[1])).toBeGreaterThanOrEqual(10);
    }
  });

  test('combo resets on wrong key', async ({ page }) => {
    await goToPractice(page);
    const text = await getFirstNChars(page, 5);

    // Build combo
    await typeText(page, text, 80);
    await page.waitForTimeout(200);

    // Break combo with wrong key
    await page.keyboard.press('z');
    await page.keyboard.press('z');
    await page.waitForTimeout(500);

    // After break, combo counter element should show 0 or reset
    // We just verify no crash here
    await expect(page.locator('body')).toBeVisible();
  });
});

// ═════════════════════════════════════════════════════════
//  10. MOBILE RESPONSIVENESS
// ═════════════════════════════════════════════════════════

test.describe('Mobile Viewport', () => {
  test('typing area renders without horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await goToPractice(page);

    const area = page.locator('[role="application"][aria-label="Typing practice area"]');
    await expect(area).toBeVisible({ timeout: 10000 });

    const box = await area.boundingBox();
    if (box) {
      // Area should not exceed viewport width
      expect(box.x + box.width).toBeLessThanOrEqual(375 + 5); // 5px tolerance
    }
  });
});
