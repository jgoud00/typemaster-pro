'use client';
import { WorkspaceSkeleton } from '@/components/layout/workspace-skeleton';

import React, { useEffect, useState } from 'react';
import { useAdaptiveStore } from '@/stores/adaptive-store';
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
          useAdaptiveStore.persist.rehydrate(),
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
    return () => {
      cancelled = true;
    };
  }, []);

  if (!hydrated) return <WorkspaceSkeleton withNavigation />;

  return <>{children}</>;
}
