'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useProgressStore } from '@/stores/progress-store';
import { useUserStore } from '@/stores/user-store';
import { useSettingsStore } from '@/stores/settings-store';
import { fetchProgress, pushProgress, mergeProgress, syncAchievements, fetchAchievements } from '@/lib/supabase/sync';
import { fetchSettings, pushSettings } from '../../lib/supabase/settings';
import { useSupabaseUser } from '@/hooks/use-supabase-user';
import type { User } from '@supabase/supabase-js';

const SYNC_DEBOUNCE_MS = 30_000; // Sync every 30 seconds of changes

/**
 * SyncProvider — handles bidirectional sync between local Zustand stores and Supabase.
 * 
 * Runs sync on:
 * - Auth state change (login/logout)
 * - Page unload (beforeunload)
 * - Debounced interval while changes accumulate
 */
export function SyncProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const userRef = useRef<User | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);
  const lastSyncRef = useRef(0);

  /**
   * Full sync: pull remote → merge → push merged state
   */
  const performSync = useCallback(async (userId: string) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      // --- Progress Sync ---
      const localProgress = useProgressStore.getState().progress;
      const remote = await fetchProgress(userId);

      if (remote) {
        const merged = mergeProgress(localProgress, remote.data);
        // Only update local if different
        const localStr = JSON.stringify(localProgress);
        const mergedStr = JSON.stringify(merged);
        if (localStr !== mergedStr) {
          useProgressStore.getState().adoptRemoteState(merged);
        }
        await pushProgress(userId, merged);
      } else {
        // No remote data — push local as initial
        await pushProgress(userId, localProgress);
      }

      // --- Achievements Sync ---
      const localAchievements = useProgressStore.getState().progress.unlockedAchievements;
      const remoteAchievements = await fetchAchievements(userId);
      const mergedAchievements = [...new Set([...localAchievements, ...remoteAchievements])];
      
      if (mergedAchievements.length > localAchievements.length) {
        // Remote had achievements we don't have locally
        const currentProgress = useProgressStore.getState().progress;
        useProgressStore.getState().adoptRemoteState({
          ...currentProgress,
          unlockedAchievements: mergedAchievements,
        });
      }
      await syncAchievements(userId, mergedAchievements);

      // --- Settings Sync ---
      const localSettings = useSettingsStore.getState().settings;
      const remoteSettings = await fetchSettings(userId);
      if (remoteSettings) {
        // Remote wins for settings (last-write-wins)
        useSettingsStore.getState().adoptRemoteSettings(remoteSettings);
      }
      await pushSettings(userId, localSettings);

      lastSyncRef.current = Date.now();
      console.log('[Sync] Sync completed successfully');
    } catch (e) {
      console.error('[Sync] Sync failed:', e);
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  /**
   * Schedule a debounced sync
   */
  const scheduleSync = useCallback(() => {
    if (!userRef.current) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(() => {
      if (userRef.current) {
        performSync(userRef.current.id);
      }
    }, SYNC_DEBOUNCE_MS);
  }, [performSync]);

  // Shared auth listener — one getUser() call across all providers
  useSupabaseUser(useCallback((user: User | null) => {
    const prev = userRef.current;
    userRef.current = user;

    if (user && !prev) {
      // Newly signed in
      useUserStore.getState().loadProfile();
      performSync(user.id);
    } else if (user && prev && user.id !== prev.id) {
      // Account switch
      useUserStore.getState().loadProfile();
      performSync(user.id);
    } else if (!user && prev) {
      // Signed out
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    }
  }, [performSync]));

  useEffect(() => {
    // Periodic sync — every 60s while user is authenticated
    const syncIntervalRef = setInterval(() => {
      if (userRef.current && Date.now() - lastSyncRef.current > 55_000) {
        performSync(userRef.current.id);
      }
    }, 60_000);

    // Sync on page unload
    const handleBeforeUnload = () => {
      if (userRef.current && Date.now() - lastSyncRef.current > 5000) {
        pushProgress(userRef.current.id, useProgressStore.getState().progress).catch(() => {});
      }
    };

    globalThis.window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(syncIntervalRef);
      globalThis.window.removeEventListener('beforeunload', handleBeforeUnload);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [performSync]);

  return <>{children}</>;
}
