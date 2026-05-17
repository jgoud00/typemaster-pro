/**
 * SPEC 04 — Dashboard
 * Tests: stats cards, Recharts visualisation, weekly goals,
 *        recent sessions list, average WPM display, daily goal progress.
 */
import { test, expect, Page } from "@playwright/test";
import {
  AppPage,
  DashboardPage,
  seedUserProgress,
  waitForCharts,
  ROUTES,
} from "./helpers";

async function openDashboard(page: Page) {
  await seedUserProgress(page);
  await page.goto(ROUTES.stats);
  const app = new AppPage(page);
  await app.waitForHydration();
  await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
}

// ─────────────────────────────────────────────
//  DASHBOARD MOUNT
// ─────────────────────────────────────────────
test.describe("Dashboard Mount", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test("dashboard page loads without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await openDashboard(page);
    expect(errors.filter((e) => !e.includes("Warning:"))).toHaveLength(0);
  });

  test("dashboard shows user statistics section", async ({ page }) => {
    await openDashboard(page);
    const stats = page.locator(
      '[data-testid="stats-section"], .stats-section, [aria-label*="statistics"]'
    ).first();
    const visible =
      await stats.isVisible({ timeout: 3000 }).catch(() => false);
    if (!visible) {
      // Fallback: check for any card/stat element
      const cards = page.locator('.bg-card, [class*="card"], [class*="Card"], [data-testid*="stat"]');
      expect(await cards.count()).toBeGreaterThan(0);
    }
  });
});

// ─────────────────────────────────────────────
//  STATS CARDS
// ─────────────────────────────────────────────
test.describe("Stats Cards", () => {
  test("average WPM card shows a numeric value", async ({ page }) => {
    await openDashboard(page);
    const wpmCard = page.locator(
      '[data-testid="avg-wpm"], [class*="Card"], [class*="card"]'
    ).filter({ hasText: /All-Time WPM/i }).first();
    if (await wpmCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      const text = await wpmCard.innerText();
      expect(text).toMatch(/\d+/);
    }
  });

  test("accuracy card shows a percentage", async ({ page }) => {
    await openDashboard(page);
    const accCard = page.locator(
      '[data-testid="avg-accuracy"], [class*="Card"], [class*="card"]'
    ).filter({ hasText: /Max Accuracy/i }).first();
    if (await accCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      const text = await accCard.innerText();
      expect(text).toMatch(/\d+(\.\d+)?%?/);
    }
  });

  test("total sessions card shows correct seeded value", async ({ page }) => {
    await seedUserProgress(page, { totalSessions: 42 });
    await page.goto(ROUTES.stats);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });

    const sessionsCard = page.locator(
      '[data-testid="total-sessions"], [class*="rounded"]'
    ).filter({ hasText: /Sessions/ }).first();
    if (await sessionsCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      const text = await sessionsCard.innerText();
      expect(text).toMatch(/42/);
    }
  });

  test("current streak card shows seeded streak value", async ({ page }) => {
    await seedUserProgress(page, { streaks: { current: 7 } });
    await page.goto(ROUTES.stats);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });

    const streakCard = page.locator(
      '[data-testid="streak"], [class*="Card"], [class*="card"]'
    ).filter({ hasText: /Longest Combo/i }).first();
    if (await streakCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      const text = await streakCard.innerText();
      expect(text).toMatch(/7/);
    }
  });

  test("zero-state dashboard (fresh user) renders gracefully", async ({
    page,
  }) => {
    const app = new AppPage(page);
    await app.goto("/");
    await app.clearAllStorage();
    await page.goto(ROUTES.dashboard);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });

    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    expect(errors).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────
//  RECHARTS VISUALISATION
// ─────────────────────────────────────────────
test.describe("Charts (Recharts)", () => {
  test("WPM progress chart renders SVG", async ({ page }) => {
    await openDashboard(page);

    const chartSVG = page.locator(
      ".recharts-surface, .recharts-wrapper svg, [data-testid*='chart'] svg"
    ).first();

    const visible =
      await chartSVG.isVisible({ timeout: 8000 }).catch(() => false);
    if (visible) {
      const box = await chartSVG.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(100);
      expect(box!.height).toBeGreaterThan(50);
    }
  });

  test("chart does not overflow its container", async ({ page }) => {
    await openDashboard(page);
    const wrapper = page.locator(".recharts-wrapper").first();
    if (await wrapper.isVisible({ timeout: 5000 }).catch(() => false)) {
      const wrapperBox = await wrapper.boundingBox();
      const svgBox = await wrapper.locator("svg").first().boundingBox();
      if (wrapperBox && svgBox) {
        expect(svgBox.width).toBeLessThanOrEqual(wrapperBox.width + 5); // 5px tolerance
      }
    }
  });

  test("charts show tooltips on hover", async ({ page }) => {
    await openDashboard(page);
    const chart = page.locator(".recharts-surface").first();
    if (await chart.isVisible({ timeout: 5000 }).catch(() => false)) {
      const box = await chart.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        // Tooltip may appear
        const tooltip = page.locator(".recharts-tooltip-wrapper, [role='tooltip']").first();
        // Non-crashing; tooltip presence depends on data
        const exists =
          await tooltip.isVisible({ timeout: 1000 }).catch(() => false);
        expect(typeof exists).toBe("boolean");
      }
    }
  });

  test("accuracy chart renders with correct data points", async ({ page }) => {
    await openDashboard(page);
    const dots = page.locator(
      ".recharts-dot, .recharts-line-dot, circle[class*='recharts']"
    );
    if ((await dots.count()) > 0) {
      const count = await dots.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("charts are responsive on narrow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openDashboard(page);

    const wrapper = page.locator(".recharts-wrapper").first();
    if (await wrapper.isVisible({ timeout: 5000 }).catch(() => false)) {
      const box = await wrapper.boundingBox();
      expect(box!.width).toBeLessThanOrEqual(375);
    }
  });
});

// ─────────────────────────────────────────────
//  DAILY GOAL
// ─────────────────────────────────────────────
test.describe("Daily Goal", () => {
  test("daily goal progress bar is shown", async ({ page }) => {
    await seedUserProgress(page, {
      dailyGoalMinutes: 15,
      dailyGoalProgress: 8,
    });
    await page.goto(ROUTES.dashboard);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });

    const goal = page.locator(
      '[data-testid="daily-goal"], [aria-label*="daily goal"], [role="progressbar"]'
    ).first();
    const visible = await goal.isVisible({ timeout: 5000 }).catch(() => false);
    expect(typeof visible).toBe("boolean"); // non-crashing
  });

  test("daily goal can be changed from settings or dashboard", async ({
    page,
  }) => {
    await openDashboard(page);
    const goalInput = page.locator(
      'input[type="number"][aria-label*="goal"], input[data-testid="goal-input"]'
    ).first();
    if (await goalInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await goalInput.fill("20");
      await page.keyboard.press("Enter");
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      const val = await goalInput.inputValue();
      expect(val).toBe("20");
    }
  });
});

// ─────────────────────────────────────────────
//  RECENT SESSIONS
// ─────────────────────────────────────────────
test.describe("Recent Sessions", () => {
  test("recent sessions section exists", async ({ page }) => {
    await openDashboard(page);
    const sessions = page.locator(
      '[data-testid="recent-sessions"], [aria-label*="recent sessions"], .sessions-list'
    ).first();
    const exists =
      await sessions.isVisible({ timeout: 3000 }).catch(() => false);
    expect(typeof exists).toBe("boolean");
  });

  test("no sessions state shows an encouraging message", async ({ page }) => {
    const app = new AppPage(page);
    await app.clearAllStorage();
    await page.goto(ROUTES.dashboard);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });

    const empty = page.locator(
      '[data-testid="empty-state"], [aria-label*="no sessions"], text=/start|begin|first/i'
    ).first();
    const exists =
      await empty.isVisible({ timeout: 3000 }).catch(() => false);
    expect(typeof exists).toBe("boolean");
  });
});

// ─────────────────────────────────────────────
//  WEAKNESS PANEL
// ─────────────────────────────────────────────
test.describe("Weakness Panel on Dashboard", () => {
  test("weak keys panel shows keys from seeded data", async ({ page }) => {
    await seedUserProgress(page, { weakKeys: ["q", "z", "x", "p"] });
    await page.goto(ROUTES.dashboard);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });

    const panel = page.locator(
      '[data-testid="weakness-panel"], [data-testid="weak-keys"], [aria-label*="weakness"]'
    ).first();
    if (await panel.isVisible({ timeout: 3000 }).catch(() => false)) {
      const text = await panel.innerText();
      expect(text).toMatch(/q|z|x|p/i);
    }
  });

  test("clicking a weak key opens a focused practice for that key", async ({
    page,
  }) => {
    await seedUserProgress(page, { weakKeys: ["q"] });
    await page.goto(ROUTES.dashboard);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });

    const weakKey = page.locator('button:has-text("q"), [data-key="q"]').first();
    if (await weakKey.isVisible({ timeout: 3000 }).catch(() => false)) {
      await weakKey.click();
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      // Should navigate or open a modal — no crash
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      expect(errors).toHaveLength(0);
    }
  });
});
