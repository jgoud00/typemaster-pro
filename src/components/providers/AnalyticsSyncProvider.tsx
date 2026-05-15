'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { fetchAnalytics, pushAnalytics } from '@/lib/supabase/analytics';
import type { User } from '@supabase/supabase-js';

const SYNC_DEBOUNCE_MS = 60_000; // Sync analytics every minute

export function AnalyticsSyncProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const userRef = useRef<User | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);

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

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      userRef.current = user;
      if (user) {
        performSync(user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      userRef.current = user;

      if (event === 'SIGNED_IN' && user) {
        performSync(user.id);
      }
    });

    // Periodic sync
    const interval = setInterval(() => {
      if (userRef.current) {
        performSync(userRef.current.id);
      }
    }, SYNC_DEBOUNCE_MS);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [performSync]);

  return <>{children}</>;
}
