import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BayesianWeaknessDetector } from '../bayesian-weakness-detector';

describe('BayesianWeaknessDetector', () => {
    let detector: BayesianWeaknessDetector;

    beforeEach(() => {
        localStorage.clear();

        detector = new BayesianWeaknessDetector();
        detector.reset();

        // Clear mocks AFTER reset/setup to ignore those internal calls
        vi.clearAllMocks();
    });

    it('should record keystrokes correctly', () => {
        detector.recordKeystroke('a', true, 100);
        detector.recordKeystroke('a', false, 200);

        // Access private map for testing (using any)
        const stats = (detector as any).keyStats.get('a');
        expect(stats).toBeDefined();
        expect(stats.total).toBe(2);
        expect(stats.correct).toBe(1);
        expect(stats.attempts).toHaveLength(2);
        expect(stats.attempts[0].latencyMs).toBe(100);
        expect(stats.attempts[1].isCorrect).toBe(false);
    });

    it('should analyze key weakness correctly', () => {
        // Record 5 failures
        for (let i = 0; i < 5; i++) {
            detector.recordKeystroke('b', false, 200);
        }

        const result = detector.analyzeKey('b');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.estimatedAccuracy).toBeLessThan(0.5);
            expect(result.isWeak).toBe(true);
        }
    });

    it('should persist data to localStorage', () => {
        detector.recordKeystroke('c', true, 150);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'vibecode_bayesian_weakness_v2',
            expect.stringContaining('attempts')
        );

        // Verify structure of saved data
        // Now calls[0] should be the one from recordKeystroke
        const savedData = vi.mocked(localStorage.setItem).mock.calls[0][1];
        expect(savedData).toContain('"key":"c"');
        expect(savedData).toContain('"isCorrect":true');
    });

    it('should hydrate data from localStorage', () => {
        // Mock stored data
        const mockData = JSON.stringify([
            ['d', {
                key: 'd',
                attempts: [{ timestamp: Date.now(), isCorrect: true, latencyMs: 120 }],
                total: 1,
                correct: 1
            }]
        ]);

        localStorage.setItem('vibecode_bayesian_weakness_v2', mockData);

        const newDetector = new BayesianWeaknessDetector();
        const stats = (newDetector as any).keyStats.get('d');

        expect(stats).toBeDefined();
        expect(stats.total).toBe(1);
        expect(stats.attempts[0].latencyMs).toBe(120);
    });

    it('should prune history when it exceeds limit', () => {
        // Max limit is 1000
        for (let i = 0; i < 1100; i++) {
            detector.recordKeystroke('e', true, 50);
        }

        const stats = (detector as any).keyStats.get('e');
        expect(stats.attempts.length).toBe(1000);
        expect(stats.total).toBe(1000);
    });
});
