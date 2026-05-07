import { createClient } from '@/lib/supabase/client';
import { UserProgress } from '@/types';

/**
 * Fetch the user's remote progress from Supabase.
 */
export async function fetchProgress(userId: string): Promise<{ data: UserProgress; vectorClock: Record<string, number> } | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_progress')
    .select('data, vector_clock')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[Sync] Failed to fetch progress:', error.message);
    return null;
  }
  if (!data) return null;

  return {
    data: data.data as UserProgress,
    vectorClock: (data.vector_clock || {}) as Record<string, number>,
  };
}

/**
 * Upsert the user's progress to Supabase.
 */
export async function pushProgress(userId: string, progress: UserProgress): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      data: progress,
      vector_clock: progress.vectorClock || {},
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('[Sync] Failed to push progress:', error.message);
    return false;
  }
  return true;
}

/**
 * Merge local and remote progress using vector clocks.
 * Strategy: take the higher value for personal bests, union for arrays.
 */
export function mergeProgress(local: UserProgress, remote: UserProgress): UserProgress {
  // Compare vector clocks to decide winner for conflicting fields
  const localTotal = Object.values(local.vectorClock || {}).reduce((a, b) => a + b, 0);
  const remoteTotal = Object.values(remote.vectorClock || {}).reduce((a, b) => a + b, 0);

  // Union completed lessons
  const completedLessons = [...new Set([...local.completedLessons, ...remote.completedLessons])];

  // Merge lesson scores (keep best)
  const lessonScores = { ...remote.lessonScores };
  for (const [id, localScore] of Object.entries(local.lessonScores)) {
    const remoteScore = lessonScores[id];
    if (!remoteScore) {
      lessonScores[id] = localScore;
    } else {
      lessonScores[id] = {
        bestWpm: Math.max(localScore.bestWpm, remoteScore.bestWpm),
        bestAccuracy: Math.max(localScore.bestAccuracy, remoteScore.bestAccuracy),
        completedAt: Math.max(localScore.completedAt, remoteScore.completedAt),
        attempts: Math.max(localScore.attempts, remoteScore.attempts),
        stars: Math.max(localScore.stars, remoteScore.stars),
      };
    }
  }

  // Merge records — keep the most recent 100, deduplicated by id
  const allRecords = [...local.records, ...remote.records];
  const seen = new Set<string>();
  const records = allRecords
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(r => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    })
    .slice(0, 100);

  // Merge personal bests (take max)
  const personalBests = {
    wpm: Math.max(local.personalBests.wpm, remote.personalBests.wpm),
    accuracy: Math.max(local.personalBests.accuracy, remote.personalBests.accuracy),
    combo: Math.max(local.personalBests.combo, remote.personalBests.combo),
  };

  // Merge vector clocks
  const mergedClock: Record<string, number> = { ...(remote.vectorClock || {}) };
  for (const [device, count] of Object.entries(local.vectorClock || {})) {
    mergedClock[device] = Math.max(mergedClock[device] || 0, count);
  }

  // Union achievements
  const unlockedAchievements = [...new Set([
    ...local.unlockedAchievements,
    ...remote.unlockedAchievements,
  ])];

  // Winner of scalar fields is the one with higher total clock
  const winner = localTotal >= remoteTotal ? local : remote;

  return {
    completedLessons,
    lessonScores,
    records,
    totalPracticeTime: Math.max(local.totalPracticeTime, remote.totalPracticeTime),
    totalKeystrokes: Math.max(local.totalKeystrokes, remote.totalKeystrokes),
    personalBests,
    unlockedAchievements,
    deviceId: winner.deviceId || local.deviceId,
    vectorClock: mergedClock,
    integrityHash: winner.integrityHash,
  };
}

/**
 * Sync achievements to Supabase (upsert each).
 */
export async function syncAchievements(userId: string, achievementIds: string[]): Promise<void> {
  if (achievementIds.length === 0) return;

  const supabase = createClient();
  const rows = achievementIds.map(id => ({
    user_id: userId,
    achievement_id: id,
  }));

  const { error } = await supabase
    .from('user_achievements')
    .upsert(rows, { onConflict: 'user_id,achievement_id', ignoreDuplicates: true });

  if (error) {
    console.error('[Sync] Failed to sync achievements:', error.message);
  }
}

/**
 * Fetch achievements from Supabase.
 */
export async function fetchAchievements(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  if (error) {
    console.error('[Sync] Failed to fetch achievements:', error.message);
    return [];
  }
  return (data || []).map(row => row.achievement_id);
}
