'use client';

import { create } from 'zustand';
import { KeystrokeEvent, KeyStat, BigramStat, TrigramStat, WeaknessProfile, Finger } from '@/types';
import type { Remote } from 'comlink';
import type { MLWorkerAPI } from '@/workers/ml-worker';
import type { BayesianState, HMMState, AnalyticsPayload } from '@/types/analytics';

interface AnalyticsStore {
    sessionKeystrokes: KeystrokeEvent[];
    keyStats: Record<string, KeyStat>;
    bigramStats: Record<string, BigramStat>;
    trigramStats: Record<string, TrigramStat>;
    fingerStats: Record<Finger, { correct: number; total: number }>;

    mlResults: {
        skillStates: Record<string, HMMState>;
        bayesianEstimates: Record<string, BayesianState>;
        errorPrediction: number;
    };

    lastSyncedAt?: number;
    isSyncing: boolean;
    syncError: string | null;
    vectorClock: Record<string, number>;
    deviceId: string;

    initDeviceId: () => void;
    recordKeystroke: (
        keystroke: KeystrokeEvent,
        context: { wpm: number; accuracy: number },
        mlWorker?: Remote<MLWorkerAPI> | null
    ) => Promise<void>;
    clearSession: () => void;
    startSession: () => void;
    mergeRemoteData: (remoteData: AnalyticsPayload) => void;
    setSyncStatus: (isSyncing: boolean, error: string | null) => void;
    markSynced: () => void;

    getAnalyticsPayload: () => AnalyticsPayload;
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

const MAX_SESSION_KEYSTROKES = 200;

// External session buffer — mirrors typing-store pattern.
// Avoids reactive array churn in the store on every keystroke.
const _sessionBuffer: KeystrokeEvent[] = [];

function getSessionBuffer(): KeystrokeEvent[] {
    return _sessionBuffer;
}

function clearSessionBuffer(): void {
    _sessionBuffer.length = 0;
}

function pushSessionKeystroke(ks: KeystrokeEvent): void {
    _sessionBuffer.push(ks);
    if (_sessionBuffer.length > MAX_SESSION_KEYSTROKES * 2) {
        _sessionBuffer.splice(0, _sessionBuffer.length - MAX_SESSION_KEYSTROKES);
    }
}

// Running hesitation accumulator — avoids O(n) scan in getAverageHesitation.
let _hesitationTotal = 0;
let _hesitationCount = 0;

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => {
    let _mlCallCounter = 0;
    let _mlPending = false;

    return {
        // sessionKeystrokes kept in store for external consumers (ML slice reads),
        // but updated lazily — only when ML batch fires (every 5 keystrokes).
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
        vectorClock: {},
        isSyncing: false,
        syncError: null,
        deviceId: '',

        initDeviceId: () => set(s => ({
            deviceId: s.deviceId || (typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2) + Date.now().toString(36)),
        })),

        recordKeystroke: async (keystroke, context, mlWorker) => {
            // Push to external buffer — no reactive state write per keystroke.
            pushSessionKeystroke(keystroke);
            _hesitationTotal += keystroke.hesitationMs;
            _hesitationCount++;

            _mlCallCounter++;
            const shouldFireML = mlWorker && !_mlPending && _mlCallCounter % 5 === 0;

            // Synchronous stat update — single set() call, minimal diff.
            set(state => {
                const prevKeyStat = state.keyStats[keystroke.expected];
                const existing = prevKeyStat ?? {
                    totalAttempts: 0, errors: 0, totalHesitation: 0, averageSpeed: 0,
                };
                const newTotalAttempts = existing.totalAttempts + 1;
                const newTotalHesitation = existing.totalHesitation + keystroke.hesitationMs;

                const keyStats = {
                    ...state.keyStats,
                    [keystroke.expected]: {
                        totalAttempts: newTotalAttempts,
                        errors: existing.errors + (keystroke.isCorrect ? 0 : 1),
                        totalHesitation: newTotalHesitation,
                        averageSpeed: newTotalHesitation / newTotalAttempts,
                    },
                };

                let bigramStats = state.bigramStats;
                if (keystroke.previousKey) {
                    const bigram = keystroke.previousKey + keystroke.expected;
                    const existingB = bigramStats[bigram] ?? {
                        bigram, totalAttempts: 0, errors: 0, averageTime: 0,
                    };
                    bigramStats = {
                        ...bigramStats,
                        [bigram]: {
                            bigram,
                            totalAttempts: existingB.totalAttempts + 1,
                            errors: existingB.errors + (keystroke.isCorrect ? 0 : 1),
                            averageTime:
                                (existingB.averageTime * existingB.totalAttempts + keystroke.hesitationMs) /
                                (existingB.totalAttempts + 1),
                        },
                    };
                }

                const currentFinger = state.fingerStats[keystroke.finger];
                const fingerStats = currentFinger
                    ? {
                        ...state.fingerStats,
                        [keystroke.finger]: {
                            correct: currentFinger.correct + (keystroke.isCorrect ? 1 : 0),
                            total: currentFinger.total + 1,
                        },
                    }
                    : state.fingerStats;

                // Only sync sessionKeystrokes slice to state when ML will consume it.
                // This eliminates the reactive array churn on every non-ML keystroke.
                return shouldFireML
                    ? { keyStats, bigramStats, fingerStats, sessionKeystrokes: [..._sessionBuffer] }
                    : { keyStats, bigramStats, fingerStats };
            });

            if (!shouldFireML || !mlWorker) return;

            _mlPending = true;
            try {
                const state = get();
                const currentStat = state.keyStats[keystroke.expected];
                if (!currentStat) return;

                const tail = _sessionBuffer.slice(-50);
                const errorCount = tail.reduce((n, k) => n + (k.isCorrect ? 0 : 1), 0);

                const [bayesian, hmm, prediction] = await Promise.all([
                    mlWorker.updateBayesianModel(currentStat),
                    mlWorker.calculateHMMState(tail, keystroke.expected),
                    mlWorker.predictNextError({
                        wpm: context.wpm,
                        accuracy: context.accuracy / 100,
                        recentErrors: errorCount,
                        fatigue: _sessionBuffer.length / 500,
                    }),
                ]);

                set(prev => ({
                    mlResults: {
                        skillStates: { ...prev.mlResults.skillStates, [keystroke.expected]: hmm },
                        bayesianEstimates: {
                            ...prev.mlResults.bayesianEstimates,
                            [keystroke.expected]: bayesian,
                        },
                        errorPrediction: prediction,
                    },
                }));
            } catch (err) {
                console.warn('[MLWorker] inference failed:', err);
            } finally {
                _mlPending = false;
            }
        },

        mergeRemoteData: (remoteData: AnalyticsPayload) => {
            set(state => ({
                keyStats: { ...state.keyStats, ...remoteData.keyStats },
                bigramStats: { ...state.bigramStats, ...remoteData.bigramStats },
                trigramStats: { ...state.trigramStats, ...remoteData.trigramStats },
                fingerStats: { ...state.fingerStats, ...remoteData.fingerStats },
                mlResults: {
                    skillStates: { ...state.mlResults.skillStates, ...remoteData.hmmStates },
                    bayesianEstimates: {
                        ...state.mlResults.bayesianEstimates, ...remoteData.bayesianStates,
                    },
                    errorPrediction: remoteData.fatigue?.fatigueLevel ?? state.mlResults.errorPrediction,
                },
                vectorClock: {},
                lastSyncedAt: Date.now(),
            }));
        },

        setSyncStatus: (isSyncing: boolean, syncError: string | null) =>
            set({ isSyncing, syncError }),

        markSynced: () => set({ lastSyncedAt: Date.now(), isSyncing: false, syncError: null }),

        getAnalyticsPayload: () => {
            const state = get();
            return {
                keyStats: state.keyStats,
                fingerStats: state.fingerStats,
                bigramStats: state.bigramStats,
                trigramStats: state.trigramStats,
                bayesianStates: state.mlResults.bayesianEstimates,
                hmmStates: state.mlResults.skillStates,
                fatigue: {
                    fatigueLevel: state.mlResults.errorPrediction,
                    estimatedTimeUntilFatigue: 60,
                },
                syncMeta: { deviceId: state.deviceId, lastSync: state.lastSyncedAt ?? Date.now() },
            };
        },

        clearSession: () => {
            clearSessionBuffer();
            _hesitationTotal = 0;
            _hesitationCount = 0;
            _mlCallCounter = 0;
            _mlPending = false;
            set({
                sessionKeystrokes: [],
                mlResults: { skillStates: {}, bayesianEstimates: {}, errorPrediction: 0 },
            });
        },

        startSession: () => {
            get().clearSession();
        },

        getWeaknessProfile: () => {
            const state = get();
            return {
                keyStats: state.keyStats,
                bigramStats: state.bigramStats,
                trigramStats: state.trigramStats,
                fingerAccuracy: state.fingerStats,
                // O(1) — running accumulator, no array scan.
                averageHesitation: _hesitationCount > 0 ? _hesitationTotal / _hesitationCount : 0,
                problemKeys: get().getProblematicKeys(),
            };
        },

        getKeyAccuracy: (key: string) => {
            const stat = get().keyStats[key];
            return stat && stat.totalAttempts > 0
                ? ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100
                : 100;
        },

        getProblematicKeys: (threshold = 85) => {
            const { keyStats } = get();
            return Object.entries(keyStats)
                .filter(([, s]) =>
                    s.totalAttempts >= 5 &&
                    ((s.totalAttempts - s.errors) / s.totalAttempts) * 100 < threshold
                )
                .map(([k]) => k);
        },

        // O(1) via running accumulator — kept for interface compatibility.
        getAverageHesitation: () =>
            _hesitationCount > 0 ? _hesitationTotal / _hesitationCount : 0,
    };
});
