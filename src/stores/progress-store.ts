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
}

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
                    progress: {
                        ...progress,
                        completedLessons: progress.completedLessons.includes(lessonId)
                            ? progress.completedLessons
                            : [...progress.completedLessons, lessonId],
                        lessonScores: {
                            ...progress.lessonScores,
                            [lessonId]: newScore,
                        },
                    },
                });
            },

            addRecord: (record: PerformanceRecord) => {
                set(state => ({
                    progress: {
                        ...state.progress,
                        records: [...state.progress.records.slice(-99), record],
                    },
                }));
            },

            updatePersonalBests: (wpm: number, accuracy: number, combo: number) => {
                set(state => ({
                    progress: {
                        ...state.progress,
                        personalBests: {
                            wpm: Math.max(wpm, state.progress.personalBests.wpm),
                            accuracy: Math.max(accuracy, state.progress.personalBests.accuracy),
                            combo: Math.max(combo, state.progress.personalBests.combo),
                        },
                    },
                }));
            },

            addPracticeTime: (seconds: number) => {
                set(state => ({
                    progress: {
                        ...state.progress,
                        totalPracticeTime: state.progress.totalPracticeTime + seconds,
                    },
                }));
            },

            addKeystrokes: (count: number) => {
                set(state => ({
                    progress: {
                        ...state.progress,
                        totalKeystrokes: state.progress.totalKeystrokes + count,
                    },
                }));
            },

            unlockAchievement: (id: string) => {
                set(state => ({
                    progress: {
                        ...state.progress,
                        unlockedAchievements: state.progress.unlockedAchievements.includes(id)
                            ? state.progress.unlockedAchievements
                            : [...state.progress.unlockedAchievements, id],
                    },
                }));
            },

            resetProgress: () => {
                set({
                    progress: initialProgress,
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

            importData: (jsonData: string): boolean => {
                try {
                    const data = JSON.parse(jsonData);

                    if (data.version !== '1.0') {
                        return false;
                    }

                    set({
                        progress: data.data.progress,
                        hasSeenWelcome: data.data.hasSeenWelcome,
                    });

                    return true;
                } catch {
                    return false;
                }
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
        }),
        {
            name: 'typing-progress',
        }
    )
);
