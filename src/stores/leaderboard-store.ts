/**
 * Leaderboard Store — Client-side State & Cache
 *
 * Owns: local leaderboard entries (anonymous/offline), global cache,
 * loading state, cache invalidation, percentile, and skill tiers.
 *
 * Does NOT own: Supabase I/O — all remote operations are delegated
 * to `lib/supabase/leaderboard.ts`.
 */
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

export type SkillTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

const CACHE_TTL_MS = 60_000;

interface LeaderboardStore {
    entries: LeaderboardEntry[];
    addEntry: (entry: LeaderboardEntry) => void;
    getTop: (n?: number) => LeaderboardEntry[];
    clear: () => void;

    globalEntries: GlobalLeaderboardEntry[];
    globalLoading: boolean;
    lastFetchedAt: number;
    previousRank: number | null;
    fetchGlobalLeaderboard: (force?: boolean) => Promise<void>;

    // Computed helpers
    getUserPercentile: (userWpm: number) => number;
    getSkillTier: (userWpm: number) => SkillTier;
    getRankDelta: (currentRank: number) => number | null;
}

function calculateTier(percentile: number): SkillTier {
    if (percentile >= 95) return 'diamond';
    if (percentile >= 80) return 'platinum';
    if (percentile >= 60) return 'gold';
    if (percentile >= 35) return 'silver';
    return 'bronze';
}

export const useLeaderboardStore = create<LeaderboardStore>()(
    persist(
        (set, get) => ({
            entries: [],
            globalEntries: [],
            globalLoading: false,
            lastFetchedAt: 0,
            previousRank: null,

            addEntry: (entry: LeaderboardEntry) => {
                set(state => {
                    const next = [...state.entries, entry]
                        .sort((a, b) => b.wpm - a.wpm)
                        .slice(0, 10);
                    return { entries: next };
                });
            },

            getTop: (n = 10) => get().entries.slice(0, n),

            clear: () => set({ entries: [] }),

            fetchGlobalLeaderboard: async (force = false) => {
                const { lastFetchedAt, globalLoading } = get();
                // Skip if still loading or cache is fresh
                if (globalLoading) return;
                if (!force && Date.now() - lastFetchedAt < CACHE_TTL_MS) return;

                set({ globalLoading: true });
                try {
                    const data = await getGlobalLeaderboard(20);
                    set({
                        globalEntries: data,
                        globalLoading: false,
                        lastFetchedAt: Date.now(),
                    });
                } catch (e) {
                    console.error('[Leaderboard] Failed to fetch global:', e);
                    set({ globalLoading: false });
                }
            },

            getUserPercentile: (userWpm: number) => {
                const { globalEntries } = get();
                if (globalEntries.length === 0) return 50;
                const below = globalEntries.filter(e => e.best_wpm < userWpm).length;
                return Math.round((below / globalEntries.length) * 100);
            },

            getSkillTier: (userWpm: number) => {
                return calculateTier(get().getUserPercentile(userWpm));
            },

            getRankDelta: (currentRank: number) => {
                const { previousRank } = get();
                if (previousRank === null) {
                    set({ previousRank: currentRank });
                    return null;
                }
                const delta = previousRank - currentRank; // positive = improved
                set({ previousRank: currentRank });
                return delta;
            },
        }),
        {
            name: 'aloo-leaderboard',
            skipHydration: true,
            partialize: (state) => ({
                entries: state.entries,
                previousRank: state.previousRank,
            }),
        }
    )
);
