'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    Achievement,
    AchievementEvent,
    achievements,
    achievementConditions,
    getAchievementById,
    getTotalAchievementPoints,
} from '@/lib/achievements';
import { UserProgress, GameState } from '@/types';

interface UnlockedAchievement {
    id: string;
    unlockedAt: number;
}

interface AchievementState {
    unlockedAchievements: UnlockedAchievement[];
    recentUnlock: Achievement | null;
    notificationQueue: Achievement[];
    totalPoints: number;
}

interface AchievementStore {
    state: AchievementState;

    checkAchievements: (
        progress: UserProgress,
        game: GameState,
        event?: AchievementEvent
    ) => Achievement[];
    unlockAchievement: (id: string) => void;
    clearRecentUnlock: () => void;
    dequeueNotification: () => Achievement | null;

    isUnlocked: (id: string) => boolean;
    getUnlockedIds: () => string[];
    getProgress: () => { unlocked: number; total: number; points: number };
}

// O(1) lookup Set — maintained alongside the unlocked array.
let _unlockedSet = new Set<string>();

const initialState: AchievementState = {
    unlockedAchievements: [],
    recentUnlock: null,
    notificationQueue: [],
    totalPoints: 0,
};

export const useAchievementStore = create<AchievementStore>()(
    persist(
        (set, get) => ({
            state: initialState,

            checkAchievements: (progress, game, event) => {
                const newlyUnlocked: Achievement[] = [];

                for (const condition of achievementConditions) {
                    if (_unlockedSet.has(condition.achievementId)) continue;

                    if (condition.check(progress, game, event)) {
                        const achievement = getAchievementById(condition.achievementId);
                        if (achievement) {
                            newlyUnlocked.push(achievement);
                            get().unlockAchievement(condition.achievementId);
                        }
                    }
                }

                return newlyUnlocked;
            },

            unlockAchievement: (id) => {
                const achievement = getAchievementById(id);
                if (!achievement) return;

                set((state) => {
                    if (_unlockedSet.has(id)) return state;

                    const newUnlocked: UnlockedAchievement = {
                        id,
                        unlockedAt: Date.now(),
                    };

                    const newUnlockedAchievements = [...state.state.unlockedAchievements, newUnlocked];
                    _unlockedSet.add(id);

                    return {
                        state: {
                            ...state.state,
                            unlockedAchievements: newUnlockedAchievements,
                            recentUnlock: achievement,
                            notificationQueue: [...state.state.notificationQueue, achievement],
                            totalPoints: getTotalAchievementPoints(newUnlockedAchievements.map(a => a.id)),
                        },
                    };
                });
            },

            clearRecentUnlock: () => {
                set((state) => ({
                    state: {
                        ...state.state,
                        recentUnlock: null,
                    },
                }));
            },

            dequeueNotification: () => {
                const { state } = get();
                if (state.notificationQueue.length === 0) return null;
                const [next, ...rest] = state.notificationQueue;
                set({ state: { ...state, notificationQueue: rest } });
                return next;
            },

            isUnlocked: (id) => _unlockedSet.has(id),

            getUnlockedIds: () => {
                return get().state.unlockedAchievements.map(a => a.id);
            },

            getProgress: () => {
                const { state } = get();
                const visibleAchievements = achievements.filter(a => !a.hidden);
                return {
                    unlocked: state.unlockedAchievements.length,
                    total: visibleAchievements.length,
                    points: state.totalPoints,
                };
            },
        }),
        {
            name: 'typing-achievements',
            skipHydration: true,
            onRehydrateStorage: () => (state) => {
                if (state?.state?.unlockedAchievements) {
                    _unlockedSet = new Set(state.state.unlockedAchievements.map(a => a.id));
                }
            },
        }
    )
);
