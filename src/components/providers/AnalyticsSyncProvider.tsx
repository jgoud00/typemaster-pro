'use client';

import { useEffect } from 'react';
import { useAnalyticsStore } from '@/stores/analytics-store';

/**
 * AnalyticsSyncProvider — initializes device ID for local analytics.
 * Supabase sync disabled until auth is re-enabled.
 */
export function AnalyticsSyncProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    useAnalyticsStore.getState().initDeviceId();
  }, []);

  return <>{children}</>;
}
