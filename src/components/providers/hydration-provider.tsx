'use client';

import React, { useEffect, useState } from 'react';
import { useProgressStore } from '@/stores/progress-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useUserStore } from '@/stores/user-store';
import { useLeaderboardStore } from '@/stores/leaderboard-store';
import { useGameStore } from '@/stores/game-store';
import { useDiagnosticStore } from '@/stores/diagnostic-store';
import { useAchievementStore } from '@/stores/achievement-store';

/**
 * HydrationProvider — Ensures all persistent Zustand stores are hydrated
 * before rendering the application. This prevents "all-zeros" state
 * bugs and hydration mismatches.
 */
export function HydrationProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const hydrateAll = async () => {
            try {
                await Promise.all([
                    useProgressStore.persist.rehydrate(),
                    useSettingsStore.persist.rehydrate(),
                    useUserStore.persist.rehydrate(),
                    useLeaderboardStore.persist.rehydrate(),
                    useGameStore.persist.rehydrate(),
                    useDiagnosticStore.persist.rehydrate(),
                    useAchievementStore.persist.rehydrate(),
                ]);
            } catch (e) {
                console.error('Hydration error:', e);
            } finally {
                if (!cancelled) setHydrated(true);
            }
        };

        hydrateAll();
        return () => { cancelled = true; };
    }, []);

    if (!hydrated) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Initializing Aloo Type...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
