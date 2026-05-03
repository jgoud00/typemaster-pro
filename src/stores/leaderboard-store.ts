'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LeaderboardEntry {
    username: string;
    wpm: number;
    accuracy: number;
    flowScore: number;
    date: number;
}

interface LeaderboardStore {
    entries: LeaderboardEntry[];
    addEntry: (entry: LeaderboardEntry) => void;
    getTop: (n?: number) => LeaderboardEntry[];
    clear: () => void;
}

export const useLeaderboardStore = create<LeaderboardStore>()(
    persist(
        (set, get) => ({
            entries: [],

            addEntry: (entry: LeaderboardEntry) => {
                set(state => {
                    const next = [...state.entries, entry]
                        .sort((a, b) => b.wpm - a.wpm)
                        .slice(0, 10); // keep top 10
                    return { entries: next };
                });
            },

            getTop: (n = 10) => {
                return get().entries.slice(0, n);
            },

            clear: () => set({ entries: [] }),
        }),
        { 
            name: 'aloo-leaderboard',
            skipHydration: false 
        }
    )
);
