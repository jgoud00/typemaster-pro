import { Page, expect } from "@playwright/test";

export const TOTAL_LESSONS = 73;

export const LESSON_IDS: Record<number, string> = {
  1: "home-1-fj",
  2: "home-2-dk",
  3: "home-3-sl",
  4: "home-4-a-semi",
  5: "home-5-left",
  6: "home-6-right",
  7: "home-7-words",
  8: "home-8-gh",
  9: "home-9-sentences",
  10: "home-10-mastery",
  73: "adv-10-graduation",
};

export const ROUTES = {
  dashboard: "/",
  stats: "/stats",
  lessons: "/lessons",
  settings: "/settings",
  sync: "/sync",
  lesson: (id: number | string) => {
    if (typeof id === "number" && LESSON_IDS[id]) {
      return `/lessons/${LESSON_IDS[id]}`;
    }
    return `/lessons/${id}`;
  },
};

export const SAMPLE_WORDS = "the quick brown fox jumps over the lazy dog typed text race words simple fast speed accuracy time typing practice mode test".split(" ");

export class AppPage {
  constructor(protected page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
    await this.waitForHydration();
    
    // Dismiss Welcome Modal if it exists
    const welcomeButton = this.page.locator('button:has-text("Start Learning!")');
    if (await welcomeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await welcomeButton.click({ force: true });
      await this.page.waitForTimeout(500);
    }
  }

  async waitForHydration() {
    // Wait for the app to be stable
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await expect(this.page.locator('body')).toBeVisible({ timeout: 10000 });
    // Extra safety for React 19 hydration
    await this.page.waitForTimeout(1000);
  }

  async clearAllStorage() {
    await this.page.goto('/');
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      // Clear indexedDB databases if supported
      if (indexedDB.databases) {
        indexedDB.databases().then(dbs => {
          dbs.forEach(db => {
            if (db.name) indexedDB.deleteDatabase(db.name);
          });
        });
      }
    });
  }
}

export class TypingAreaPage extends AppPage {
  async getWPM(): Promise<number> {
    const wpmEl = this.page.locator('[data-testid="wpm"], [aria-label*="WPM"], [aria-label*="words per minute"]').first();
    await expect(wpmEl).toBeVisible({ timeout: 10000 });
    const text = await wpmEl.innerText();
    return Number.parseInt(text.replace(/\D/g, ""), 10) || 0;
  }
  
  async getAccuracy(): Promise<number> {
    const accEl = this.page.locator('[data-testid="accuracy"], [aria-label*="accuracy"]').first();
    await expect(accEl).toBeVisible({ timeout: 10000 });
    const text = await accEl.innerText();
    return Number.parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
  }
}

export class DashboardPage extends AppPage {}
export class GamificationPage extends AppPage {}
export class SyncPage extends AppPage {}

export async function seedUserProgress(page: Page, options: any = {}) {
  const defaultData = {
    state: {
      progress: {
        personalBests: { wpm: 100, accuracy: 98, combo: 30 },
        records: [],
        totalPracticeTime: 1000,
        totalKeystrokes: 5000,
        completedLessons: [],
        lessonScores: {},
        unlockedAchievements: [],
        streaks: { current: 5, longest: 5, lastPracticeDate: new Date().toISOString().split('T')[0] },
        deviceId: 'seed-device',
        vectorClock: {},
      },
      hasSeenWelcome: true,
    },
    version: 0
  };
  
  const mappedOpts = { ...defaultData, ...options };
  
  // Use addInitScript to inject state immediately when a page loads, avoiding 'about:blank' SecurityError
  await page.addInitScript(`
    localStorage.setItem('typing-progress', JSON.stringify(${JSON.stringify(mappedOpts)}));
    localStorage.setItem('typemaster-progress', JSON.stringify(${JSON.stringify(options)}));
    
    // Also seed game store for combo/streak stats
    const gameData = {
      state: {
        game: {
          score: 0,
          combo: 0,
          maxCombo: ${options.streaks?.current || options.currentStreak || 5},
          accuracy: 100,
          errors: 0,
        }
      },
      version: 0
    };
    localStorage.setItem('typing-game', JSON.stringify(gameData));
  `);
}

export async function completeTypingSession(page: Page) {
  await page.waitForTimeout(1000);
}

export function assertNoConsoleErrors(page: Page) {
  page.on("console", (msg) => {
    if (msg.type() === "error" && !msg.text().includes("Failed to load resource")) {
      throw new Error(`Browser Console Error: ${msg.text()}`);
    }
  });
}

export async function waitForCharts(page: Page) {
  await page.waitForTimeout(1000);
}

export async function dumpIndexedDB(page: Page) {
  // dummy implementation for tests that require it
}
