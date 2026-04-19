import { test, expect } from '@playwright/test';

test('seed progress data, reload, verify it persists on stats page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Seed Zustand persisted progress store using the actual persist key: 'typing-progress'
    await page.evaluate(() => {
        const data = {
            state: {
                progress: {
                    personalBests: { wpm: 125, accuracy: 99, combo: 50 },
                    records: [
                        { id: 'test-1', wpm: 125, accuracy: 99, timestamp: Date.now(), duration: 60, totalChars: 500, errors: 5, mode: 'free' }
                    ],
                    totalPracticeTime: 3600,
                    totalKeystrokes: 10000,
                    completedLessons: [],
                    lessonScores: {},
                    unlockedAchievements: [],
                    streaks: { current: 1, longest: 1, lastPracticeDate: new Date().toISOString().split('T')[0] },
                    deviceId: 'test-device',
                    vectorClock: {},
                },
                hasSeenWelcome: true,
                todayPracticeTime: 0,
                todayLessonsCompleted: 0,
                todayBestAccuracy: 0,
                lastResetDate: null,
            },
            version: 0
        };
        window.localStorage.setItem('typing-progress', JSON.stringify(data));
    });

    // Reload to pick up persisted state
    await page.reload();
    await page.waitForTimeout(1000);

    // Navigate to stats
    await page.goto('/stats');
    await page.waitForTimeout(1500);

    // The page should display the seeded WPM value somewhere
    const body = await page.locator('body').innerText();
    expect(body).toContain('125');
});
