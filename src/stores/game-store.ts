'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, COMBO_THRESHOLDS } from '@/types';

interface GameStore {
    game: GameState;

    // Actions
    incrementCombo: () => void;
    breakCombo: () => void;
    addScore: (points: number) => void;
    checkDailyStreak: () => void;
    resetGame: () => void;

    // Getters
    getMultiplier: () => number;
    getComboLevel: () => number;  // 0-4
    getMultiplierForCombo: (combo: number) => number;
}

const initialGameState: GameState = {
    combo: 0,
    maxCombo: 0,
    multiplier: 1,
    perfectStreak: 0,
    dailyStreak: 0,
    score: 0,
    todayScore: 0,
    lastPlayedDate: null,
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            game: initialGameState,

            incrementCombo: () => {
                set(state => {
                    const newCombo = state.game.combo + 1;
                    const newMultiplier = get().getMultiplierForCombo(newCombo);

                    return {
                        game: {
                            ...state.game,
                            combo: newCombo,
                            maxCombo: Math.max(newCombo, state.game.maxCombo),
                            multiplier: newMultiplier,
                        },
                    };
                });
            },

            breakCombo: () => {
                set(state => ({
                    game: {
                        ...state.game,
                        combo: 0,
                        multiplier: 1,
                    },
                }));
            },

            addScore: (points: number) => {
                const { multiplier } = get().game;
                const finalPoints = Math.round(points * multiplier);

                set(state => ({
                    game: {
                        ...state.game,
                        score: state.game.score + finalPoints,
                        todayScore: state.game.todayScore + finalPoints,
                    },
                }));
            },

            checkDailyStreak: () => {
                const today = new Date().toDateString();
                const { lastPlayedDate, dailyStreak } = get().game;

                if (lastPlayedDate === today) return;

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const wasYesterday = lastPlayedDate === yesterday.toDateString();

                set(state => ({
                    game: {
                        ...state.game,
                        dailyStreak: wasYesterday ? dailyStreak + 1 : 1,
                        lastPlayedDate: today,
                        todayScore: lastPlayedDate === today ? state.game.todayScore : 0,
                    },
                }));
            },

            resetGame: () => {
                set(state => ({
                    game: {
                        ...state.game,
                        combo: 0,
                        multiplier: 1,
                    },
                }));
            },

            getMultiplier: () => {
                return get().game.multiplier;
            },

            getComboLevel: () => {
                const { combo } = get().game;
                if (combo >= COMBO_THRESHOLDS.LEVEL_4.combo) return 4;
                if (combo >= COMBO_THRESHOLDS.LEVEL_3.combo) return 3;
                if (combo >= COMBO_THRESHOLDS.LEVEL_2.combo) return 2;
                if (combo >= COMBO_THRESHOLDS.LEVEL_1.combo) return 1;
                return 0;
            },

            // Helper function
            getMultiplierForCombo: (combo: number): number => {
                if (combo >= COMBO_THRESHOLDS.LEVEL_4.combo) return COMBO_THRESHOLDS.LEVEL_4.multiplier;
                if (combo >= COMBO_THRESHOLDS.LEVEL_3.combo) return COMBO_THRESHOLDS.LEVEL_3.multiplier;
                if (combo >= COMBO_THRESHOLDS.LEVEL_2.combo) return COMBO_THRESHOLDS.LEVEL_2.multiplier;
                if (combo >= COMBO_THRESHOLDS.LEVEL_1.combo) return COMBO_THRESHOLDS.LEVEL_1.multiplier;
                return 1;
            },
        }),
        {
            name: 'typing-game',
        }
    )
);
