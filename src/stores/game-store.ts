'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState } from '@/types';

const COMBO_THRESHOLDS = [10, 25, 50, 100, 200] as const;

interface GameStore {
    game: GameState;

    // Combo
    incrementCombo: () => void;
    breakCombo: () => void;
    getComboLevel: () => number;

    // Score
    addScore: (points: number) => void;

    // XP & Level
    addXP: (xp: number) => void;
    getLevel: () => number;
    getLevelProgress: () => number;

    // Perfect streak
    incrementPerfectStreak: () => void;
    breakPerfectStreak: () => void;

    // Reset
    resetGame: () => void;
    resetDaily: () => void;
}

const initialGame: GameState = {
    score: 0,
    combo: 0,
    maxCombo: 0,
    comboMultiplier: 1,
    perfectStreak: 0,
    dailyStreak: 0,
    todayScore: 0,
    weeklyScore: 0,
    totalXP: 0,
    sessionsToday: 0,
    lastSessionDate: '',
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            game: initialGame,

            incrementCombo: () => {
                set(s => {
                    const newCombo = s.game.combo + 1;
                    const level = COMBO_THRESHOLDS.filter(t => newCombo >= t).length;
                    return {
                        game: {
                            ...s.game,
                            combo: newCombo,
                            maxCombo: Math.max(s.game.maxCombo, newCombo),
                            comboMultiplier: 1 + level * 0.25,
                        },
                    };
                });
            },

            breakCombo: () => {
                set(s => ({
                    game: { ...s.game, combo: 0, comboMultiplier: 1 },
                }));
            },

            getComboLevel: () => {
                const combo = get().game.combo;
                return COMBO_THRESHOLDS.filter(t => combo >= t).length;
            },

            addScore: (points: number) => {
                set(s => ({
                    game: {
                        ...s.game,
                        score: s.game.score + Math.round(points * s.game.comboMultiplier),
                        todayScore: s.game.todayScore + Math.round(points * s.game.comboMultiplier),
                        weeklyScore: s.game.weeklyScore + Math.round(points * s.game.comboMultiplier),
                    },
                }));
            },

            addXP: (xp: number) => {
                set(s => ({
                    game: { ...s.game, totalXP: s.game.totalXP + xp },
                }));
            },

            getLevel: () => {
                const xp = get().game.totalXP;
                let level = 1;
                let accumulated = 0;
                while (accumulated + 100 * level * level <= xp) {
                    accumulated += 100 * level * level;
                    level++;
                }
                return level;
            },

            getLevelProgress: () => {
                const xp = get().game.totalXP;
                let level = 1;
                let accumulated = 0;
                while (accumulated + 100 * level * level <= xp) {
                    accumulated += 100 * level * level;
                    level++;
                }
                const needed = 100 * level * level;
                return needed > 0 ? ((xp - accumulated) / needed) * 100 : 0;
            },

            incrementPerfectStreak: () => {
                set(s => ({
                    game: { ...s.game, perfectStreak: s.game.perfectStreak + 1 },
                }));
            },

            breakPerfectStreak: () => {
                set(s => ({
                    game: { ...s.game, perfectStreak: 0 },
                }));
            },

            resetGame: () => {
                const today = new Date().toISOString().split('T')[0];
                set(s => {
                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    const isConsecutive = s.game.lastSessionDate === yesterday;
                    const isToday = s.game.lastSessionDate === today;
                    return {
                        game: {
                            ...s.game,
                            score: 0,
                            combo: 0,
                            maxCombo: 0,
                            comboMultiplier: 1,
                            perfectStreak: 0,
                            dailyStreak: isToday ? s.game.dailyStreak : (isConsecutive ? s.game.dailyStreak + 1 : 1),
                            sessionsToday: isToday ? s.game.sessionsToday + 1 : 1,
                            lastSessionDate: today,
                        },
                    };
                });
            },

            resetDaily: () => {
                set(s => ({
                    game: { ...s.game, todayScore: 0, sessionsToday: 0 },
                }));
            },
        }),
        {
            name: 'typing-game',
            skipHydration: true,
        }
    )
);
