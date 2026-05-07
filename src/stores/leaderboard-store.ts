'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getGlobalLeaderboard, type GlobalLeaderboardEntry } from '@/lib/supabase/leaderboard';

export interface LeaderboardEntry {
    username: string;
    wpm: number;
    accuracy: number;
    flowScore: number;
    date: number;
}

interface LeaderboardStore {
    // Local entries (for anonymous / offline users)
    entries: LeaderboardEntry[];
    addEntry: (entry: LeaderboardEntry) => void;
    getTop: (n?: number) => LeaderboardEntry[];
    clear: () => void;

    // Global entries (from Supabase)
    globalEntries: GlobalLeaderboardEntry[];
    globalLoading: boolean;
    fetchGlobalLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardStore>()(
    persist(
        (set, get) => ({
            entries: [],
            globalEntries: [],
            globalLoading: false,

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

            fetchGlobalLeaderboard: async () => {
                set({ globalLoading: true });
                try {
                    const data = await getGlobalLeaderboard(20);
                    set({ globalEntries: data, globalLoading: false });
                } catch (e) {
                    console.error('[Leaderboard] Failed to fetch global:', e);
                    set({ globalLoading: false });
                }
            },
        }),
        { 
            name: 'aloo-leaderboard',
            skipHydration: false,
            partialize: (state) => ({
                entries: state.entries,
                // Don't persist global entries — always fetch fresh
            }),
        }
    )
);
