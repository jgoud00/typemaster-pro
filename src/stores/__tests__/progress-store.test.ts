import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../progress-store';
import { act } from '@testing-library/react';

describe('ProgressStore', () => {
    beforeEach(() => {
        // Reset store to initial state
        const { resetProgress } = useProgressStore.getState();
        resetProgress();
    });

    describe('Initial State', () => {
        it('should have correct initial values', () => {
            const state = useProgressStore.getState();

            expect(state.progress.completedLessons).toEqual([]);
            expect(state.progress.totalPracticeTime).toBe(0);
            expect(state.progress.totalKeystrokes).toBe(0);
            expect(state.progress.personalBests.wpm).toBe(0);
            expect(state.progress.personalBests.accuracy).toBe(0);
        });
    });

    describe('completeLesson()', () => {
        it('should add lesson to completed lessons', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.completeLesson('lesson-1', 45, 95, 100);
            });

            // Assert
            const state = useProgressStore.getState();
            expect(state.progress.completedLessons).toContain('lesson-1');
        });

        it('should calculate correct star rating', () => {
            // Arrange: 3 stars = accuracy >= 95% and wpm >= 40
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.completeLesson('lesson-3star', 45, 96, 100);
            });

            // Assert
            const score = useProgressStore.getState().getLessonScore('lesson-3star');
            expect(score?.stars).toBe(3);
        });

        it('should not duplicate lesson on repeated completion', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.completeLesson('lesson-dup', 40, 90, 100);
                store.completeLesson('lesson-dup', 45, 95, 110);
            });

            // Assert
            const state = useProgressStore.getState();
            const count = state.progress.completedLessons.filter(l => l === 'lesson-dup').length;
            expect(count).toBe(1);
        });

        it('should keep best scores when completing lesson multiple times', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act: First attempt (lower scores)
            act(() => {
                store.completeLesson('lesson-best', 35, 85, 80);
            });

            // Second attempt (higher scores)
            act(() => {
                store.completeLesson('lesson-best', 50, 98, 120);
            });

            // Assert: Should keep the better scores
            const score = useProgressStore.getState().getLessonScore('lesson-best');
            expect(score?.bestWpm).toBe(50);
            expect(score?.bestAccuracy).toBe(98);
            expect(score?.attempts).toBe(2);
        });
    });

    describe('addRecord()', () => {
        it('should add performance record', () => {
            // Arrange
            const store = useProgressStore.getState();
            const record = {
                id: 'test-1',
                wpm: 55,
                accuracy: 97,
                duration: 60,
                timestamp: Date.now(),
                errors: 3,
                mode: 'lesson' as const,
                totalChars: 200,
                maxCombo: 50,
                score: 1000,
            };

            // Act
            act(() => {
                store.addRecord(record);
            });

            // Assert
            const state = useProgressStore.getState();
            expect(state.progress.records).toHaveLength(1);
            expect(state.progress.records[0].wpm).toBe(55);
        });

        it('should limit records to 100 entries', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act: Add 110 records
            act(() => {
                for (let i = 0; i < 110; i++) {
                    store.addRecord({
                        id: `test-${i}`,
                        wpm: 50 + i,
                        accuracy: 90,
                        duration: 60,
                        timestamp: Date.now() + i,
                        errors: 1,
                        mode: 'lesson' as const,
                        totalChars: 100,
                        maxCombo: 20,
                        score: 500,
                    });
                }
            });

            // Assert: Should only keep last 100
            const state = useProgressStore.getState();
            expect(state.progress.records.length).toBeLessThanOrEqual(100);
        });
    });

    describe('updatePersonalBests()', () => {
        it('should update personal bests with higher values', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.updatePersonalBests(60, 98, 50);
            });

            // Assert
            const state = useProgressStore.getState();
            expect(state.progress.personalBests.wpm).toBe(60);
            expect(state.progress.personalBests.accuracy).toBe(98);
            expect(state.progress.personalBests.combo).toBe(50);
        });

        it('should NOT update personal bests with lower values', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act: Set high values first
            act(() => {
                store.updatePersonalBests(80, 99, 100);
            });

            // Try to set lower values
            act(() => {
                store.updatePersonalBests(60, 90, 50);
            });

            // Assert: Original high values should remain
            const state = useProgressStore.getState();
            expect(state.progress.personalBests.wpm).toBe(80);
            expect(state.progress.personalBests.accuracy).toBe(99);
            expect(state.progress.personalBests.combo).toBe(100);
        });
    });

    describe('addPracticeTime()', () => {
        it('should accumulate practice time', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.addPracticeTime(120); // 2 minutes
                store.addPracticeTime(180); // 3 minutes
            });

            // Assert
            const state = useProgressStore.getState();
            expect(state.progress.totalPracticeTime).toBe(300); // 5 minutes
        });
    });

    describe('addKeystrokes()', () => {
        it('should accumulate keystroke count', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.addKeystrokes(500);
                store.addKeystrokes(350);
            });

            // Assert
            const state = useProgressStore.getState();
            expect(state.progress.totalKeystrokes).toBe(850);
        });
    });

    describe('unlockAchievement()', () => {
        it('should add achievement to unlocked list', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.unlockAchievement('speed-demon');
            });

            // Assert
            const state = useProgressStore.getState();
            expect(state.progress.unlockedAchievements).toContain('speed-demon');
        });

        it('should not duplicate achievements', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.unlockAchievement('first-lesson');
                store.unlockAchievement('first-lesson');
            });

            // Assert
            const state = useProgressStore.getState();
            const count = state.progress.unlockedAchievements.filter(a => a === 'first-lesson').length;
            expect(count).toBe(1);
        });
    });

    describe('Daily Tracking', () => {
        it('should track today practice time', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.addTodayPracticeTime(60);
                store.addTodayPracticeTime(120);
            });

            // Assert
            const state = useProgressStore.getState();
            expect(state.todayPracticeTime).toBe(180);
        });

        it('should increment today lessons completed', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            act(() => {
                store.incrementTodayLessons();
                store.incrementTodayLessons();
            });

            // Assert
            const state = useProgressStore.getState();
            expect(state.todayLessonsCompleted).toBe(2);
        });
    });

    describe('resetProgress()', () => {
        it('should reset all progress to initial state', () => {
            // Arrange
            const store = useProgressStore.getState();
            act(() => {
                store.completeLesson('test-lesson', 50, 95, 100);
                store.addKeystrokes(1000);
                store.unlockAchievement('test-achievement');
            });

            // Act
            act(() => {
                store.resetProgress();
            });

            // Assert
            const state = useProgressStore.getState();
            expect(state.progress.completedLessons).toEqual([]);
            expect(state.progress.totalKeystrokes).toBe(0);
            expect(state.progress.unlockedAchievements).toEqual([]);
        });
    });

    describe('Data Export/Import', () => {
        it('should export data in correct format', () => {
            // Arrange
            const store = useProgressStore.getState();
            act(() => {
                store.completeLesson('export-test', 45, 95, 100);
            });

            // Act: Export calls document.createElement, which is mocked
            // We just verify the function exists and doesn't throw
            expect(() => store.exportData()).not.toThrow();
        });

        it('should import valid data', () => {
            // Arrange
            const store = useProgressStore.getState();
            const exportData = JSON.stringify({
                version: '1.0',
                data: {
                    progress: {
                        completedLessons: ['imported-lesson'],
                        lessonScores: {},
                        records: [],
                        totalPracticeTime: 500,
                        totalKeystrokes: 2000,
                        personalBests: { wpm: 70, accuracy: 98, combo: 30 },
                        unlockedAchievements: ['test'],
                    },
                    hasSeenWelcome: true,
                },
            });

            // Act
            let result: boolean;
            act(() => {
                result = store.importData(exportData);
            });

            // Assert
            expect(result!).toBe(true);
            const state = useProgressStore.getState();
            expect(state.progress.completedLessons).toContain('imported-lesson');
            expect(state.progress.totalKeystrokes).toBe(2000);
        });

        it('should reject invalid data', () => {
            // Arrange
            const store = useProgressStore.getState();

            // Act
            let result: boolean;
            act(() => {
                result = store.importData('{ invalid json');
            });

            // Assert
            expect(result!).toBe(false);
        });
    });
});
