'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { fetchAnalytics, pushAnalytics } from '@/lib/supabase/analytics';
import { useSupabaseUser } from '@/hooks/use-supabase-user';
import type { User } from '@supabase/supabase-js';

const SYNC_DEBOUNCE_MS = 60_000;

export function AnalyticsSyncProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const userRef = useRef<User | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);

  // Initialise stable deviceId once on client — deferred from module eval to prevent SSR divergence
  useEffect(() => {
    useAnalyticsStore.getState().initDeviceId();
  }, []);

  const performSync = useCallback(async (userId: string) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      const store = useAnalyticsStore.getState();
      store.setSyncStatus(true, null);

      // Pull remote
      const remote = await fetchAnalytics(userId);
      if (remote) {
        store.mergeRemoteData(remote);
      }

      // Push local
      const payload = store.getAnalyticsPayload();
      await pushAnalytics(userId, payload);
      
      store.markSynced();
      console.log('[AnalyticsSync] Sync completed');
    } catch (e) {
      console.error('[AnalyticsSync] Sync failed:', e);
      useAnalyticsStore.getState().setSyncStatus(false, (e as Error).message);
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  useSupabaseUser(useCallback((user: User | null) => {
    userRef.current = user;
    if (user) {
      performSync(user.id);
    }
  }, [performSync]));

  useEffect(() => {
    const interval = setInterval(() => {
      if (userRef.current && !isSyncingRef.current) {
        performSync(userRef.current.id);
      }
    }, SYNC_DEBOUNCE_MS);

    return () => {
      clearInterval(interval);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [performSync]);

  return <>{children}</>;
}
