'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress, PerformanceRecord, LessonScore } from '@/types';

interface ProgressStore {
    progress: UserProgress;

    // Onboarding
    hasSeenWelcome: boolean;
    setHasSeenWelcome: (seen: boolean) => void;

    // Daily tracking
    todayPracticeTime: number;
    todayLessonsCompleted: number;
    todayBestAccuracy: number;
    lastResetDate: string | null;
    checkAndResetDaily: () => void;
    addTodayPracticeTime: (seconds: number) => void;
    incrementTodayLessons: () => void;
    setTodayBestAccuracy: (accuracy: number) => void;

    // Actions
    completeLesson: (lessonId: string, wpm: number, accuracy: number, score: number) => void;
    addRecord: (record: PerformanceRecord) => void;
    updatePersonalBests: (wpm: number, accuracy: number, combo: number) => void;
    addPracticeTime: (seconds: number) => void;
    addKeystrokes: (count: number) => void;
    unlockAchievement: (id: string) => void;
    resetProgress: () => void;

    // Data Export/Import
    exportData: () => void;
    importData: (jsonData: string) => boolean;

    // Getters
    isLessonCompleted: (lessonId: string) => boolean;
    getLessonScore: (lessonId: string) => LessonScore | undefined;
    getRecentRecords: (count: number) => PerformanceRecord[];

    // Sync
    adoptRemoteState: (remote: UserProgress) => void;
}

const computeHash = (data: any): string => {
    const s = JSON.stringify(data);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return (h >>> 0).toString(16);
};

const incrementClock = (progress: UserProgress): UserProgress => {
    let deviceId = progress.deviceId;
    if (!deviceId) {
        deviceId = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    }
    const currentClock = progress.vectorClock?.[deviceId] || 0;
    const nextProgress = {
        ...progress,
        deviceId,
        vectorClock: {
            ...(progress.vectorClock || {}),
            [deviceId]: currentClock + 1
        }
    };
    // Append integrity hash
    return { ...nextProgress, integrityHash: computeHash(nextProgress) };
};

const initialProgress: UserProgress = {
    completedLessons: [],
    lessonScores: {},
    records: [],
    totalPracticeTime: 0,
    totalKeystrokes: 0,
    personalBests: {
        wpm: 0,
        accuracy: 0,
        combo: 0,
    },
    unlockedAchievements: [],
    deviceId: '',
    vectorClock: {},
};

export const useProgressStore = create<ProgressStore>()(
    persist(
        (set, get) => ({
            progress: initialProgress,

            // Onboarding
            hasSeenWelcome: false,
            setHasSeenWelcome: (seen) => set({ hasSeenWelcome: seen }),

            // Daily tracking
            todayPracticeTime: 0,
            todayLessonsCompleted: 0,
            todayBestAccuracy: 0,
            lastResetDate: null,

            checkAndResetDaily: () => {
                const today = new Date().toDateString();
                const { lastResetDate } = get();
                if (lastResetDate !== today) {
                    set({
                        todayPracticeTime: 0,
                        todayLessonsCompleted: 0,
                        todayBestAccuracy: 0,
                        lastResetDate: today,
                    });
                }
            },

            addTodayPracticeTime: (seconds) => {
                get().checkAndResetDaily();
                set((state) => ({ todayPracticeTime: state.todayPracticeTime + seconds }));
            },

            incrementTodayLessons: () => {
                get().checkAndResetDaily();
                set((state) => ({ todayLessonsCompleted: state.todayLessonsCompleted + 1 }));
            },

            setTodayBestAccuracy: (accuracy) => {
                get().checkAndResetDaily();
                set((state) => ({
                    todayBestAccuracy: Math.max(accuracy, state.todayBestAccuracy)
                }));
            },

            completeLesson: (lessonId: string, wpm: number, accuracy: number, _score: number) => {
                const { progress } = get();
                const existingScore = progress.lessonScores[lessonId];

                // Calculate stars (0-3)
                let stars = 0;
                if (accuracy >= 95 && wpm >= 40) stars = 3;
                else if (accuracy >= 90 && wpm >= 30) stars = 2;
                else if (accuracy >= 80) stars = 1;

                const newScore: LessonScore = {
                    bestWpm: Math.max(wpm, existingScore?.bestWpm ?? 0),
                    bestAccuracy: Math.max(accuracy, existingScore?.bestAccuracy ?? 0),
                    completedAt: Date.now(),
                    attempts: (existingScore?.attempts ?? 0) + 1,
                    stars: Math.max(stars, existingScore?.stars ?? 0),
                };

                set({
                    progress: incrementClock({
                        ...progress,
                        completedLessons: progress.completedLessons.includes(lessonId)
                            ? progress.completedLessons
                            : [...progress.completedLessons, lessonId],
                        lessonScores: {
                            ...progress.lessonScores,
                            [lessonId]: newScore,
                        },
                    }),
                });
            },

            addRecord: (record: PerformanceRecord) => {
                set(state => ({
                    progress: incrementClock({
                        ...state.progress,
                        records: [...state.progress.records.slice(-99), record],
                    }),
                }));
            },

            updatePersonalBests: (wpm: number, accuracy: number, combo: number) => {
                set(state => ({
                    progress: incrementClock({
                        ...state.progress,
                        personalBests: {
                            wpm: Math.max(wpm, state.progress.personalBests.wpm),
                            accuracy: Math.max(accuracy, state.progress.personalBests.accuracy),
                            combo: Math.max(combo, state.progress.personalBests.combo),
                        },
                    }),
                }));
            },

            addPracticeTime: (seconds: number) => {
                set(state => ({
                    progress: incrementClock({
                        ...state.progress,
                        totalPracticeTime: state.progress.totalPracticeTime + seconds,
                    }),
                }));
            },

            addKeystrokes: (count: number) => {
                set(state => ({
                    progress: incrementClock({
                        ...state.progress,
                        totalKeystrokes: state.progress.totalKeystrokes + count,
                    }),
                }));
            },

            unlockAchievement: (id: string) => {
                set(state => ({
                    progress: incrementClock({
                        ...state.progress,
                        unlockedAchievements: state.progress.unlockedAchievements.includes(id)
                            ? state.progress.unlockedAchievements
                            : [...state.progress.unlockedAchievements, id],
                    }),
                }));
            },

            resetProgress: () => {
                const prevDeviceId = get().progress.deviceId;
                const newProgress = incrementClock({
                    ...initialProgress,
                    deviceId: prevDeviceId,
                    vectorClock: get().progress.vectorClock || {}
                });
                
                set({
                    progress: newProgress,
                    hasSeenWelcome: false,
                    todayPracticeTime: 0,
                    todayLessonsCompleted: 0,
                    todayBestAccuracy: 0,
                    lastResetDate: null,
                });
            },

            exportData: () => {
                const state = get();
                const data = {
                    version: '1.0',
                    exportDate: new Date().toISOString(),
                    data: {
                        progress: state.progress,
                        hasSeenWelcome: state.hasSeenWelcome,
                    },
                };

                const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: 'application/json',
                });

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `typemaster-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            },

            importData: (json: string): boolean => {
                try {
                    const d = JSON.parse(json);
                    if (d.version !== '1.0' || !d.data?.progress) return false;
                    const p = d.data.progress;
                    const valid = Array.isArray(p.completedLessons) && typeof p.lessonScores === 'object' && 
                                Array.isArray(p.records) && typeof p.totalPracticeTime === 'number';
                    if (!valid) return false;
                    set({ progress: p, hasSeenWelcome: !!d.data.hasSeenWelcome });
                    return true;
                } catch { return false; }
            },

            isLessonCompleted: (lessonId: string) => {
                return get().progress.completedLessons.includes(lessonId);
            },

            getLessonScore: (lessonId: string) => {
                return get().progress.lessonScores[lessonId];
            },

            getRecentRecords: (count: number) => {
                return get().progress.records.slice(-count).reverse();
            },

            adoptRemoteState: (remote: UserProgress) => {
                set({ progress: remote });
            },
        }),
        {
            name: 'typing-progress',
            merge: (persistedState: unknown, currentState: ProgressStore): ProgressStore => {
                const persisted = persistedState as Partial<ProgressStore> | undefined;
                if (!persisted?.progress) return currentState;

                // Anti-Cheat: Validate integrity hash
                const p = persisted.progress;
                const { integrityHash, ...rest } = p;
                if (integrityHash !== computeHash(rest)) {
                    console.warn("Progress data tampered! Resetting.");
                    return currentState;
                }

                // Clamp personal bests to sane maximums to mitigate localStorage tampering
                const pb = p.personalBests ?? currentState.progress.personalBests;
                const clampedProgress: UserProgress = {
                    ...currentState.progress,
                    ...p,
                    personalBests: {
                        wpm: Math.min(Math.max(0, pb.wpm || 0), 250), // Lowered to 250
                        accuracy: Math.min(Math.max(0, pb.accuracy || 0), 100),
                        combo: Math.min(Math.max(0, pb.combo || 0), 2000), // Lowered to 2000
                    },
                };

                return {
                    ...currentState,
                    ...persisted,
                    progress: clampedProgress,
                };
            },
        }
    )
);
