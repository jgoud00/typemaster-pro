import { describe, it, expect } from 'vitest';
import { mlWorker } from './ml.worker';
import { KeystrokeEvent, KeyStat } from '../types';

describe('ML Worker Algorithms', () => {
    describe('calculateHMMState', () => {
        const createHistory = (key: string, isCorrect: boolean, count: number): KeystrokeEvent[] => {
            return Array(count).fill(null).map(() => ({
                key,
                expected: key,
                isCorrect,
                timestamp: Date.now(),
                hesitationMs: 100,
                finger: 'left-index',
                previousKey: null,
            }));
        };

        it('returns learning for insufficient history', () => {
            const history = createHistory('a', true, 5);
            expect(mlWorker.calculateHMMState(history, 'a')).toBe('learning');
        });

        it('returns mastered for high accuracy history', () => {
            const history = createHistory('a', true, 20);
            expect(mlWorker.calculateHMMState(history, 'a')).toBe('mastered');
        });

        it('returns proficient for moderate accuracy history', () => {
            const history = [
                ...createHistory('a', true, 17),
                ...createHistory('a', false, 3)
            ];
            expect(mlWorker.calculateHMMState(history, 'a')).toBe('proficient');
        });

        it('detects regressing state', () => {
            const history = [
                ...createHistory('a', true, 20), // Older: 100% accuracy
                ...createHistory('a', false, 20) // Recent: 0% accuracy
            ];
            expect(mlWorker.calculateHMMState(history, 'a')).toBe('regressing');
        });
    });

    describe('updateBayesianModel', () => {
        it('returns valid lowerBound < accuracy < upperBound', () => {
            const stat: KeyStat = {
                totalAttempts: 100,
                errors: 10,
                totalHesitation: 10000,
                averageSpeed: 100,
            };
            const result = mlWorker.updateBayesianModel(stat);
            
            expect(result.accuracy).toBeGreaterThan(0.8);
            expect(result.accuracy).toBeLessThan(0.95);
            expect(result.lowerBound).toBeLessThan(result.accuracy);
            expect(result.accuracy).toBeLessThan(result.upperBound);
        });
    });

    describe('predictNextError', () => {
        it('returns value between 0 and 1', () => {
            const contexts = [
                { wpm: 10, accuracy: 0.99, recentErrors: 0, fatigue: 0 },
                { wpm: 150, accuracy: 0.70, recentErrors: 5, fatigue: 1 },
                { wpm: 60, accuracy: 0.95, recentErrors: 1, fatigue: 0.5 }
            ];

            contexts.forEach(ctx => {
                const prediction = mlWorker.predictNextError(ctx);
                expect(prediction).toBeGreaterThanOrEqual(0);
                expect(prediction).toBeLessThanOrEqual(1);
            });
        });
    });
});
