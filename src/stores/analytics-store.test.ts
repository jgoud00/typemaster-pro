import { describe, it, expect, beforeEach } from 'vitest';
import { useAnalyticsStore } from './analytics-store';
import { KeystrokeEvent } from '@/types';

describe('analytics-store', () => {
    beforeEach(() => {
        useAnalyticsStore.getState().clearSession();
    });

    const createKeystroke = (key: string, isCorrect: boolean, delay = 100): KeystrokeEvent => ({
        key: isCorrect ? key : 'x',
        expected: key,
        isCorrect,
        hesitationMs: delay,
        timestamp: Date.now(),
        finger: 'right-index',
        previousKey: null,
    });

    it('should initialize with empty state correctly', () => {
        const state = useAnalyticsStore.getState();
        expect(state.sessionKeystrokes).toEqual([]);
        expect(state.keyStats).toEqual({});
        expect(state.getAverageHesitation()).toBe(0);
    });

    it('should aggregate key stats correctly upon recording keystrokes', async () => {
        const store = useAnalyticsStore.getState();
        
        // Record 3 correct 'a's and 1 incorrect 'a'
        await store.recordKeystroke(createKeystroke('a', true, 100), { wpm: 60, accuracy: 100 });
        await store.recordKeystroke(createKeystroke('a', true, 100), { wpm: 60, accuracy: 100 });
        await store.recordKeystroke(createKeystroke('a', true, 100), { wpm: 60, accuracy: 100 });
        await store.recordKeystroke(createKeystroke('a', false, 200), { wpm: 60, accuracy: 100 });

        const updatedStore = useAnalyticsStore.getState();
        const stat = updatedStore.keyStats['a'];
        
        expect(stat).toBeDefined();
        expect(stat.totalAttempts).toBe(4);
        expect(stat.errors).toBe(1);
        expect(stat.totalHesitation).toBe(500);
        expect(stat.averageSpeed).toBe(500 / 4); // 125ms
    });

    it('should calculate bigram stats when previousKey is present', async () => {
        const store = useAnalyticsStore.getState();
        
        const ks = createKeystroke('b', true, 150);
        ks.previousKey = 'a'; // 'a' -> 'b'
        
        await store.recordKeystroke(ks, { wpm: 60, accuracy: 100 });

        const stat = useAnalyticsStore.getState().bigramStats['ab'];
        expect(stat).toBeDefined();
        expect(stat.totalAttempts).toBe(1);
        expect(stat.errors).toBe(0);
        expect(stat.averageTime).toBe(150);
    });

    it('should calculate average hesitation accurately', async () => {
        const store = useAnalyticsStore.getState();
        
        await store.recordKeystroke(createKeystroke('a', true, 100), { wpm: 60, accuracy: 100 });
        await store.recordKeystroke(createKeystroke('b', true, 500), { wpm: 60, accuracy: 100 });
        
        expect(useAnalyticsStore.getState().getAverageHesitation()).toBe(300);
    });

    it('should accurately identify problematic keys', async () => {
        const store = useAnalyticsStore.getState();
        
        // 'a' gets 10 attempts, 2 errors (80% accuracy) -> problematic if threshold is 85
        for (let i = 0; i < 8; i++) await store.recordKeystroke(createKeystroke('a', true), { wpm: 60, accuracy: 100 });
        for (let i = 0; i < 2; i++) await store.recordKeystroke(createKeystroke('a', false), { wpm: 60, accuracy: 100 });
        
        // 'b' gets 10 attempts, 0 errors (100% accuracy) -> not problematic
        for (let i = 0; i < 10; i++) await store.recordKeystroke(createKeystroke('b', true), { wpm: 60, accuracy: 100 });
        
        // 'c' gets 3 attempts, 3 errors (0% accuracy) -> not problematic because attempts < 5
        for (let i = 0; i < 3; i++) await store.recordKeystroke(createKeystroke('c', false), { wpm: 60, accuracy: 100 });

        const problems = useAnalyticsStore.getState().getProblematicKeys(85);
        expect(problems).toContain('a');
        expect(problems).not.toContain('b');
        expect(problems).not.toContain('c');
    });

    it('should clear session successfully', async () => {
        const store = useAnalyticsStore.getState();
        await store.recordKeystroke(createKeystroke('a', true, 100), { wpm: 60, accuracy: 100 });
        
        expect(useAnalyticsStore.getState().getAverageHesitation()).toBe(100);
        
        store.clearSession();
        
        // Key stats persist beyond session, but hesitation averages reset
        expect(useAnalyticsStore.getState().getAverageHesitation()).toBe(0);
        expect(useAnalyticsStore.getState().sessionKeystrokes).toEqual([]);
    });
});
