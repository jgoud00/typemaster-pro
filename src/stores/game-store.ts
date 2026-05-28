'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, COMBO_THRESHOLDS } from '@/types';

interface GameStore {
    game: GameState;

    // Combo
    incrementCombo: () => void;
    breakCombo: () => void;
    getComboLevel: () => number;

    // Score
    addScore: (points: number, multiplierOverride?: number) => void;

    // XP & Level
    addXP: (xp: number) => void;
    getLevel: () => number;
    getLevelProgress: () => number;

    // Perfect streak
    incrementPerfectStreak: () => void;
    breakPerfectStreak: () => void;

    // Reset
    resetSession: () => void;
    trackDailyProgress: () => void;
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
    lastWeeklyReset: 0,
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            game: initialGame,

            incrementCombo: () => {
                set(s => {
                    const newCombo = s.game.combo + 1;
                    const thresholdObj = [...COMBO_THRESHOLDS].reverse().find(t => newCombo >= t.threshold);
                    const multiplier = thresholdObj ? thresholdObj.multiplier : 1;
                    return {
                        game: {
                            ...s.game,
                            combo: newCombo,
                            maxCombo: Math.max(s.game.maxCombo, newCombo),
                            comboMultiplier: multiplier,
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
                return COMBO_THRESHOLDS.filter(t => combo >= t.threshold).length;
            },

            addScore: (points: number, multiplierOverride?: number) => {
                set(s => {
                    const multiplier = multiplierOverride ?? s.game.comboMultiplier;
                    const scoreToAdd = Math.round(points * multiplier);
                    return {
                        game: {
                            ...s.game,
                            score: s.game.score + scoreToAdd,
                            todayScore: s.game.todayScore + scoreToAdd,
                            weeklyScore: s.game.weeklyScore + scoreToAdd,
                        },
                    };
                });
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

            resetSession: () => {
                set(s => ({
                    game: {
                        ...s.game,
                        score: 0,
                        combo: 0,
                        maxCombo: 0,
                        comboMultiplier: 1,
                        perfectStreak: 0,
                    },
                }));
            },

            trackDailyProgress: () => {
                const today = new Date().toISOString().split('T')[0];
                set(s => {
                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    const isConsecutive = s.game.lastSessionDate === yesterday;
                    const isToday = s.game.lastSessionDate === today;
                    return {
                        game: {
                            ...s.game,
                            dailyStreak: isToday ? s.game.dailyStreak : (isConsecutive ? s.game.dailyStreak + 1 : 1),
                            sessionsToday: isToday ? s.game.sessionsToday + 1 : 1,
                            lastSessionDate: today,
                        },
                    };
                });
            },

            resetDaily: () => {
                set(s => {
                    const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
                    const isNewWeek = s.game.lastWeeklyReset !== currentWeek;
                    return {
                        game: { 
                            ...s.game, 
                            todayScore: 0, 
                            sessionsToday: 0,
                            weeklyScore: isNewWeek ? 0 : s.game.weeklyScore,
                            lastWeeklyReset: currentWeek,
                        },
                    };
                });
            },
        }),
        {
            name: 'typing-game',
            skipHydration: true,
        }
    )
);
