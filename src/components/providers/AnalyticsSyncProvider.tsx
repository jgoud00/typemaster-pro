'use client';
import { WorkspaceSkeleton } from '@/components/layout/workspace-skeleton';

import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { loadFromDB } from '@/lib/storage/db';

const ANALYTICS_DB_KEY = 'analytics-store';

export function AnalyticsSyncProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const store = useAnalyticsStore.getState();

    loadFromDB<{
      keyStats: typeof store.keyStats;
      bigramStats: typeof store.bigramStats;
      trigramStats: typeof store.trigramStats;
      fingerStats: typeof store.fingerStats;
      mlResults: typeof store.mlResults;
      deviceId: string;
    }>(ANALYTICS_DB_KEY).then((saved) => {
      if (!saved) return;
      useAnalyticsStore.setState({
        keyStats: saved.keyStats ?? {},
        bigramStats: saved.bigramStats ?? {},
        trigramStats: saved.trigramStats ?? {},
        fingerStats: saved.fingerStats ?? store.fingerStats,
        mlResults: saved.mlResults ?? store.mlResults,
        deviceId: saved.deviceId || store.deviceId,
      });
    }).catch(error => console.error('Could not load practice history:', error)).finally(() => {
      useAnalyticsStore.getState().initDeviceId();
      setReady(true);
    });
  }, []);

  if (!ready) return <WorkspaceSkeleton withNavigation />;
  return <>{children}</>;
}
