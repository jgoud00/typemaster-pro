'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fetchProgress, pushProgress, mergeProgress, fetchAchievements, syncAchievements } from '@/lib/supabase/sync';
import { fetchAnalytics, pushAnalytics } from '@/lib/supabase/analytics';
import { useProgressStore } from '@/stores/progress-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { useAchievementStore } from '@/stores/achievement-store';

const SYNC_INTERVAL_MS = 60_000;

async function getUserId(): Promise<string | null> {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id ?? null;
    } catch {
        return null;
    }
}

async function pullRemote(userId: string) {
    // Progress
    try {
        const remote = await fetchProgress(userId);
        if (remote?.data) {
            const local = useProgressStore.getState().progress;
            const merged = mergeProgress(local, remote.data);
            useProgressStore.getState().adoptRemoteState(merged);
        }
    } catch (e) { console.error('[Sync] progress pull failed:', e); }

    // Analytics
    try {
        const remoteAnalytics = await fetchAnalytics(userId);
        if (remoteAnalytics) {
            useAnalyticsStore.getState().mergeRemoteData(remoteAnalytics);
        }
    } catch (e) { console.error('[Sync] analytics pull failed:', e); }

    // Achievements
    try {
        const remoteIds = await fetchAchievements(userId);
        const localIds = new Set(useAchievementStore.getState().getUnlockedIds());
        for (const id of remoteIds) {
            if (!localIds.has(id)) {
                useAchievementStore.getState().unlockAchievement(id);
            }
        }
    } catch (e) { console.error('[Sync] achievements pull failed:', e); }
}

async function pushLocal(userId: string) {
    try {
        await pushProgress(userId, useProgressStore.getState().progress);
    } catch (e) { console.error('[Sync] progress push failed:', e); }

    try {
        await pushAnalytics(userId, useAnalyticsStore.getState().getAnalyticsPayload());
    } catch (e) { console.error('[Sync] analytics push failed:', e); }

    try {
        await syncAchievements(userId, useAchievementStore.getState().getUnlockedIds());
    } catch (e) { console.error('[Sync] achievements push failed:', e); }
}

// Exported so practice/page.tsx can trigger an immediate push after session complete
export async function triggerSync() {
    const userId = await getUserId();
    if (userId) pushLocal(userId); // fire-and-forget
}

export function SyncProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const userIdRef = useRef<string | null>(null);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        (async () => {
            const userId = await getUserId();
            if (!userId) return;
            userIdRef.current = userId;

            // Pull first, then start periodic push
            await pullRemote(userId);

            intervalId = setInterval(() => {
                if (userIdRef.current) pushLocal(userIdRef.current);
            }, SYNC_INTERVAL_MS);
        })();

        return () => {
            clearInterval(intervalId);
            // Push on unmount (page close / nav away)
            if (userIdRef.current) pushLocal(userIdRef.current);
        };
    }, []);

    return <>{children}</>;
}
