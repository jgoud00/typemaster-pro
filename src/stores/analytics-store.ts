'use client';

import { create } from 'zustand';
import { KeystrokeEvent, KeyStat, BigramStat, WeaknessProfile, Finger } from '@/types';

interface AnalyticsStore {
    // Session analytics
    sessionKeystrokes: KeystrokeEvent[];

    // Cumulative stats (for weakness detection)
    keyStats: Record<string, KeyStat>;
    bigramStats: Record<string, BigramStat>;
    fingerStats: Record<Finger, { correct: number; total: number }>;

    // Actions
    recordKeystroke: (keystroke: KeystrokeEvent) => void;
    clearSession: () => void;

    // Analytics getters
    getWeaknessProfile: () => WeaknessProfile;
    getKeyAccuracy: (key: string) => number;
    getProblematicKeys: (threshold?: number) => string[];
    getAverageHesitation: () => number;
}

const initialFingerStats: Record<Finger, { correct: number; total: number }> = {
    'left-pinky': { correct: 0, total: 0 },
    'left-ring': { correct: 0, total: 0 },
    'left-middle': { correct: 0, total: 0 },
    'left-index': { correct: 0, total: 0 },
    'right-index': { correct: 0, total: 0 },
    'right-middle': { correct: 0, total: 0 },
    'right-ring': { correct: 0, total: 0 },
    'right-pinky': { correct: 0, total: 0 },
    'thumb': { correct: 0, total: 0 },
};

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
    sessionKeystrokes: [],
    keyStats: {},
    bigramStats: {},
    fingerStats: { ...initialFingerStats },

    recordKeystroke: (keystroke: KeystrokeEvent) => {
        set(state => {
            // Update session keystrokes
            const newSessionKeystrokes = [...state.sessionKeystrokes, keystroke];

            // Update key stats
            const keyStats = { ...state.keyStats };
            const existing = keyStats[keystroke.expected] || {
                totalAttempts: 0,
                errors: 0,
                totalHesitation: 0,
                averageSpeed: 0,
            };

            keyStats[keystroke.expected] = {
                totalAttempts: existing.totalAttempts + 1,
                errors: existing.errors + (keystroke.isCorrect ? 0 : 1),
                totalHesitation: existing.totalHesitation + keystroke.hesitationMs,
                averageSpeed: (existing.totalHesitation + keystroke.hesitationMs) / (existing.totalAttempts + 1),
            };

            // Update bigram stats
            const bigramStats = { ...state.bigramStats };
            if (keystroke.previousKey) {
                const bigram = keystroke.previousKey + keystroke.expected;
                const existingBigram = bigramStats[bigram] || {
                    bigram,
                    totalAttempts: 0,
                    errors: 0,
                    averageTime: 0,
                };

                bigramStats[bigram] = {
                    bigram,
                    totalAttempts: existingBigram.totalAttempts + 1,
                    errors: existingBigram.errors + (keystroke.isCorrect ? 0 : 1),
                    averageTime: (existingBigram.averageTime * existingBigram.totalAttempts + keystroke.hesitationMs) / (existingBigram.totalAttempts + 1),
                };
            }

            // Update finger stats
            const fingerStats = { ...state.fingerStats };
            const finger = keystroke.finger;
            fingerStats[finger] = {
                correct: fingerStats[finger].correct + (keystroke.isCorrect ? 1 : 0),
                total: fingerStats[finger].total + 1,
            };

            return {
                sessionKeystrokes: newSessionKeystrokes,
                keyStats,
                bigramStats,
                fingerStats,
            };
        });
    },

    clearSession: () => {
        set({ sessionKeystrokes: [] });
    },

    getWeaknessProfile: () => {
        const state = get();
        const problemKeys: string[] = [];

        // Find keys with <85% accuracy
        Object.entries(state.keyStats).forEach(([key, stat]) => {
            const accuracy = stat.totalAttempts > 0
                ? ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100
                : 100;
            if (accuracy < 85 && stat.totalAttempts >= 5) {
                problemKeys.push(key);
            }
        });

        // Sort by error rate (worst first)
        problemKeys.sort((a, b) => {
            const aRate = state.keyStats[a].errors / state.keyStats[a].totalAttempts;
            const bRate = state.keyStats[b].errors / state.keyStats[b].totalAttempts;
            return bRate - aRate;
        });

        return {
            keyStats: state.keyStats,
            bigramStats: state.bigramStats,
            fingerAccuracy: state.fingerStats,
            averageHesitation: get().getAverageHesitation(),
            problemKeys,
        };
    },

    getKeyAccuracy: (key: string) => {
        const stat = get().keyStats[key];
        if (!stat || stat.totalAttempts === 0) return 100;
        return ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100;
    },

    getProblematicKeys: (threshold = 85) => {
        const { keyStats } = get();
        return Object.entries(keyStats)
            .filter(([, stat]) => {
                if (stat.totalAttempts < 5) return false;
                const accuracy = ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100;
                return accuracy < threshold;
            })
            .map(([key]) => key)
            .sort((a, b) => {
                const aRate = keyStats[a].errors / keyStats[a].totalAttempts;
                const bRate = keyStats[b].errors / keyStats[b].totalAttempts;
                return bRate - aRate;
            });
    },

    getAverageHesitation: () => {
        const keystrokes = get().sessionKeystrokes;
        if (keystrokes.length === 0) return 0;
        const total = keystrokes.reduce((sum, k) => sum + k.hesitationMs, 0);
        return total / keystrokes.length;
    },
}));
