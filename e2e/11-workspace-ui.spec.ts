import { test, expect } from '@playwright/test';

test('workspace search opens a real lesson and Escape restores focus', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('button', { name: 'Search lessons and pages' });
  await search.click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox').fill('Home Position');
  await expect(dialog.getByRole('link', { name: 'Home Position: F and J' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(search).toBeFocused();
  await search.click();
  await page.getByRole('dialog').getByRole('textbox').fill('Home Position');
  await page.getByRole('dialog').getByRole('link', { name: 'Home Position: F and J' }).click();
  await expect(page).toHaveURL(/lessons\/home-1-fj/);
  await expect(
    page.getByRole('heading', { name: 'Home Position: F and J', exact: true }),
  ).toBeVisible();
});

test('curriculum filters, empty state and locked lessons', async ({ page }) => {
  await page.goto('/lessons');
  await expect(page.locator('.lesson-card')).toHaveCount(73);
  await expect(page.locator('a.lesson-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Top Row', exact: true }).click();
  await expect(page.locator('.lesson-card')).toHaveCount(15);
  await page.getByRole('textbox', { name: 'Search curriculum' }).fill('no-such-lesson-123');
  await expect(page.getByRole('heading', { name: 'No lessons found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.lesson-card')).toHaveCount(73);
});

test('mobile drawer navigates, closes and fits a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open mobile menu' }).click();
  await page
    .getByRole('navigation', { name: 'Mobile Navigation' })
    .getByRole('link', { name: 'Lessons', exact: true })
    .click();
  await expect(page).toHaveURL(/\/lessons$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
});

test('sign-in dialog is labeled and closes with Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in', exact: true }).last().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(dialog.getByLabel('Display name')).toBeVisible();
  await expect(dialog.getByLabel('Email address')).toBeVisible();
  await expect(dialog.getByLabel('Password', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('theme selection persists and updates the workspace', async ({ page }) => {
  await page.goto('/settings');
  await page.getByLabel('Workspace theme').selectOption('dark');
  await expect(page.locator('html')).toHaveClass('dark');
  await page.reload();
  await expect(page.getByLabel('Workspace theme')).toHaveValue('dark');
  await expect(page.locator('html')).toHaveClass('dark');
});

test('typing input still records correct characters and backspace', async ({ page }) => {
  await page.goto('/lessons/home-1-fj');
  await expect(
    page.getByRole('heading', { name: 'Home Position: F and J', exact: true }),
  ).toBeVisible();
  await page.locator('[data-typing-shim]').focus();
  for (let i = 0; i < 2; i++) {
    const char = await page.locator('[aria-current="location"]').innerText();
    await page.keyboard.type(char.replace(/\u00a0/g, ' '), { delay: 200 });
  }
  await expect(page.locator('.char-correct')).toHaveCount(2);
  await page.keyboard.press('Backspace');
  await expect(page.locator('.char-correct')).toHaveCount(1);
});

test('analytics timeframe changes the plotted sessions', async ({ page }) => {
  await page.addInitScript(() => {
    const now = Date.now();
    const records = [1, 14, 60].map((days, i) => ({
      id: `test-${i}`,
      timestamp: now - days * 86400000,
      wpm: 40 + i * 10,
      accuracy: 95,
      duration: 60,
      mode: 'free',
      maxCombo: 10,
      score: 100,
      totalChars: 100,
      errors: 5,
    }));
    localStorage.setItem(
      'typing-progress',
      JSON.stringify({
        state: {
          progress: {
            completedLessons: [],
            lessonScores: {},
            records,
            totalPracticeTime: 180,
            totalKeystrokes: 300,
            personalBests: { wpm: 60, accuracy: 95, combo: 10 },
            unlockedAchievements: [],
            deviceId: 'ui-test',
            vectorClock: {},
          },
        },
        version: 0,
      }),
    );
    // Build a valid persisted fixture; the store rejects unsigned progress blobs.
    const stored = JSON.parse(localStorage.getItem('typing-progress')!);
    const serialized = JSON.stringify(stored.state.progress);
    let hash = 0;
    for (let i = 0; i < serialized.length; i++)
      hash = Math.trunc(Math.imul(31, hash) + (serialized.codePointAt(i) ?? 0));
    stored.state.progress.integrityHash = (hash >>> 0).toString(16);
    localStorage.setItem('typing-progress', JSON.stringify(stored));
  });
  await page.goto('/stats');
  await expect(page.locator('.recharts-line-dots circle')).toHaveCount(2);
  await page.getByRole('button', { name: '7D', exact: true }).click();
  await expect(page.locator('.recharts-line-dots circle')).toHaveCount(1);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.recharts-line-dots circle')).toHaveCount(3);
});

test('statistics reset confirmation can be dismissed without deleting data', async ({ page }) => {
  await page.goto('/stats');
  await page.getByRole('button', { name: 'Danger Zone' }).click();
  await page.getByRole('button', { name: 'Reset All Statistics' }).click();
  await expect(page.getByRole('dialog', { name: 'Reset your statistics?' })).toBeVisible();
  await page.getByRole('button', { name: 'Keep my progress' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});


test('editorial theme is the default and existing dark settings migrate without losing preferences', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByLabel('Workspace theme')).toHaveValue('light');
  await expect(page.locator('html')).toHaveClass(/light/);
  await page.evaluate(() => localStorage.setItem('typemaster-settings', JSON.stringify({ version: 0, state: { settings: { theme: 'dark', volume: 35, keyboardLayout: 'dvorak' } } })));
  await page.reload();
  await expect(page.getByLabel('Workspace theme')).toHaveValue('light');
  await expect(page.getByRole('slider', { name: 'Volume' })).toHaveAttribute('aria-valuenow', '35');
});


test('header dark mode toggle persists across navigation and reload on narrow mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveClass('dark');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open mobile menu' }).click();
  await page.getByRole('navigation', { name: 'Mobile Navigation' }).getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(page.getByLabel('Workspace theme')).toHaveValue('dark');
  await page.reload();
  await expect(page.locator('html')).toHaveClass('dark');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.locator('html')).toHaveClass('light');
  await expect(page.getByLabel('Workspace theme')).toHaveValue('light');
});


test('startup skeleton is accessible, responsive and respects reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/_next/static/chunks/*.js', async route => {
    await pending;
    await route.continue();
  });
  try {
    await page.goto('/', { waitUntil: 'commit' });
    const loading = page.getByRole('status', { name: 'Loading workspace' });
    await expect(loading).toBeVisible();
    await expect(loading).toHaveAttribute('aria-busy', 'true');
    await expect(loading.locator('.skeleton-shimmer').first()).toHaveCSS('animation-name', 'none');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: 'docs/ui/monochrome-skeleton.png', fullPage: true });
  } finally {
    release();
  }
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Loading workspace' })).toHaveCount(0);
});
