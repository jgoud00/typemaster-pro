'use client';

import { create } from 'zustand';
import { KeystrokeEvent, KeyStat, BigramStat, TrigramStat, WeaknessProfile, Finger } from '@/types';
import type { Remote } from 'comlink';
import type { MLWorkerAPI, SkillState, BayesianResult } from '../workers/ml.worker';

interface AnalyticsStore {
    // Session analytics
    sessionKeystrokes: KeystrokeEvent[];

    // Cumulative stats
    keyStats: Record<string, KeyStat>;
    bigramStats: Record<string, BigramStat>;
    trigramStats: Record<string, TrigramStat>;
    fingerStats: Record<Finger, { correct: number; total: number }>;

    // ML Results
    mlResults: {
        skillStates: Record<string, SkillState>;
        bayesianEstimates: Record<string, BayesianResult>;
        errorPrediction: number;
    };

    // Actions
    recordKeystroke: (
        keystroke: KeystrokeEvent,
        context: { wpm: number; accuracy: number },
        mlWorker?: Remote<MLWorkerAPI> | null
    ) => Promise<void>;
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
    trigramStats: {},
    fingerStats: { ...initialFingerStats },
    mlResults: {
        skillStates: {},
        bayesianEstimates: {},
        errorPrediction: 0,
    },

    recordKeystroke: async (keystroke, context, mlWorker) => {
        // 1. Update Core Stats (Synchronous)
        set(state => {
            const newSessionKeystrokes = [...state.sessionKeystrokes, keystroke];
            const keyStats = { ...state.keyStats };
            const existing = keyStats[keystroke.expected] || {
                totalAttempts: 0,
                errors: 0,
                totalHesitation: 0,
                averageSpeed: 0,
            };

            const updatedKeyStat = {
                totalAttempts: existing.totalAttempts + 1,
                errors: existing.errors + (keystroke.isCorrect ? 0 : 1),
                totalHesitation: existing.totalHesitation + keystroke.hesitationMs,
                averageSpeed: (existing.totalHesitation + keystroke.hesitationMs) / (existing.totalAttempts + 1),
            };

            keyStats[keystroke.expected] = updatedKeyStat;

            const bigramStats = { ...state.bigramStats };
            if (keystroke.previousKey) {
                const bigram = keystroke.previousKey + keystroke.expected;
                const existingB = bigramStats[bigram] || { bigram, totalAttempts: 0, errors: 0, averageTime: 0 };
                bigramStats[bigram] = {
                    ...existingB,
                    totalAttempts: existingB.totalAttempts + 1,
                    errors: existingB.errors + (keystroke.isCorrect ? 0 : 1),
                    averageTime: (existingB.averageTime * existingB.totalAttempts + keystroke.hesitationMs) / (existingB.totalAttempts + 1),
                };
            }

            const fingerStats = { ...state.fingerStats };
            const currentFinger = fingerStats[keystroke.finger];
            if (currentFinger) {
                fingerStats[keystroke.finger] = {
                    correct: currentFinger.correct + (keystroke.isCorrect ? 1 : 0),
                    total: currentFinger.total + 1,
                };
            }

            return {
                sessionKeystrokes: newSessionKeystrokes,
                keyStats,
                bigramStats,
                fingerStats,
            };
        });

        // 2. Offload ML (Asynchronous via Worker)
        if (mlWorker) {
            try {
                const state = get();
                const currentStat = state.keyStats[keystroke.expected];
                
                const [bayesian, hmm, prediction] = await Promise.all([
                    mlWorker.updateBayesianModel(currentStat),
                    mlWorker.calculateHMMState(state.sessionKeystrokes, keystroke.expected),
                    mlWorker.predictNextError({
                        wpm: context.wpm,
                        accuracy: context.accuracy / 100,
                        recentErrors: state.sessionKeystrokes.slice(-10).filter(k => !k.isCorrect).length,
                        fatigue: state.sessionKeystrokes.length / 500
                    })
                ]);

                set(state => ({
                    mlResults: {
                        skillStates: { ...state.mlResults.skillStates, [keystroke.expected]: hmm },
                        bayesianEstimates: { ...state.mlResults.bayesianEstimates, [keystroke.expected]: bayesian },
                        errorPrediction: prediction,
                    }
                }));
            } catch (error) {
                console.warn('[MLWorker] inference failed:', error);
            }
        }
    },

    clearSession: () => set({ sessionKeystrokes: [], mlResults: { skillStates: {}, bayesianEstimates: {}, errorPrediction: 0 } }),

    getWeaknessProfile: () => {
        const state = get();
        return {
            keyStats: state.keyStats,
            bigramStats: state.bigramStats,
            trigramStats: state.trigramStats,
            fingerAccuracy: state.fingerStats,
            averageHesitation: get().getAverageHesitation(),
            problemKeys: get().getProblematicKeys(),
        };
    },

    getKeyAccuracy: (key: string) => {
        const stat = get().keyStats[key];
        return stat && stat.totalAttempts > 0 ? ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100 : 100;
    },

    getProblematicKeys: (threshold = 85) => {
        const { keyStats } = get();
        return Object.entries(keyStats)
            .filter(([, s]) => s.totalAttempts >= 5 && ((s.totalAttempts - s.errors) / s.totalAttempts) * 100 < threshold)
            .map(([k]) => k);
    },

    getAverageHesitation: () => {
        const ks = get().sessionKeystrokes;
        return ks.length === 0 ? 0 : ks.reduce((s, k) => s + k.hesitationMs, 0) / ks.length;
    },
}));
