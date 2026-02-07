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
    totalPoints: number;
}

interface AchievementStore {
    state: AchievementState;

    // Actions
    checkAchievements: (
        progress: UserProgress,
        game: GameState,
        event?: AchievementEvent
    ) => Achievement[];
    unlockAchievement: (id: string) => void;
    clearRecentUnlock: () => void;

    // Getters
    isUnlocked: (id: string) => boolean;
    getUnlockedIds: () => string[];
    getProgress: () => { unlocked: number; total: number; points: number };
}

const initialState: AchievementState = {
    unlockedAchievements: [],
    recentUnlock: null,
    totalPoints: 0,
};

export const useAchievementStore = create<AchievementStore>()(
    persist(
        (set, get) => ({
            state: initialState,

            checkAchievements: (progress, game, event) => {
                const { state } = get();
                const unlockedIds = new Set(state.unlockedAchievements.map(a => a.id));
                const newlyUnlocked: Achievement[] = [];

                for (const condition of achievementConditions) {
                    // Skip if already unlocked
                    if (unlockedIds.has(condition.achievementId)) continue;

                    // Check if condition is met
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
                    // Check if already unlocked
                    if (state.state.unlockedAchievements.some(a => a.id === id)) {
                        return state;
                    }

                    const newUnlocked: UnlockedAchievement = {
                        id,
                        unlockedAt: Date.now(),
                    };

                    const newUnlockedAchievements = [...state.state.unlockedAchievements, newUnlocked];

                    return {
                        state: {
                            ...state.state,
                            unlockedAchievements: newUnlockedAchievements,
                            recentUnlock: achievement,
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

            isUnlocked: (id) => {
                return get().state.unlockedAchievements.some(a => a.id === id);
            },

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
        }
    )
);
