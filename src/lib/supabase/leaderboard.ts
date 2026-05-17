/**
 * Leaderboard Supabase I/O — Data Access Layer
 *
 * Owns: all Supabase queries for leaderboard and typing sessions
 * (fetch global, get rank, submit session).
 *
 * IMPORTANT: Leaderboard upserts are performed server-side via the
 * `upsert_leaderboard` RPC (DB-side MAX) in `/api/submit-score`.
 * Client code must NOT write to the leaderboard table directly to
 * prevent TOCTOU races and fake score injection.
 *
 * Does NOT own: client-side caching or UI state — that belongs to
 * `stores/leaderboard-store.ts`.
 */
import { createClient } from '@/lib/supabase/client';

export interface GlobalLeaderboardEntry {
  user_id: string;
  username: string | null;
  best_wpm: number;
  best_accuracy: number;
  total_sessions: number;
  total_practice_time: number;
}

/**
 * Fetch the global leaderboard (top N users by best WPM).
 */
export async function getGlobalLeaderboard(limit: number = 20): Promise<GlobalLeaderboardEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('leaderboard')
    .select('user_id, username, best_wpm, best_accuracy, total_sessions, total_practice_time')
    .gt('best_wpm', 0)
    .order('best_wpm', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Leaderboard] Failed to fetch global leaderboard:', error.message);
    return [];
  }
  return data || [];
}

/**
 * Get a specific user's rank on the leaderboard.
 */
export async function getUserRank(userId: string): Promise<number | null> {
  const supabase = createClient();
  
  // Get the user's best WPM
  const { data: userEntry, error: userError } = await supabase
    .from('leaderboard')
    .select('best_wpm')
    .eq('user_id', userId)
    .single();

  if (userError || !userEntry) return null;

  // Count how many users have a higher WPM
  const { count, error: countError } = await supabase
    .from('leaderboard')
    .select('*', { count: 'exact', head: true })
    .gt('best_wpm', userEntry.best_wpm);

  if (countError) return null;
  return (count || 0) + 1;
}

/**
 * Insert a typing session result on the client.
 *
 * Leaderboard upsert is intentionally NOT performed here — it is
 * executed atomically by `/api/submit-score` after server-side
 * validation and cheat detection. This prevents:
 *   - TOCTOU races (read-then-write on client)
 *   - Fake score injection via direct Supabase writes
 *   - Bypassing cheat_score / is_valid checks
 */
export async function submitSessionToSupabase(
  userId: string,
  session: {
    wpm: number;
    accuracy: number;
    duration: number;
    mode: string;
    lessonId?: string;
    maxCombo?: number;
    score?: number;
    totalChars?: number;
    errors?: number;
    cheatScore?: number;
    isValid?: boolean;
  }
): Promise<boolean> {
  const supabase = createClient();

  const { error: sessionError } = await supabase
    .from('typing_sessions')
    .insert({
      user_id: userId,
      wpm: session.wpm,
      accuracy: session.accuracy,
      duration: session.duration,
      mode: session.mode,
      lesson_id: session.lessonId || null,
      max_combo: session.maxCombo || 0,
      score: session.score || 0,
      total_chars: session.totalChars || 0,
      errors: session.errors || 0,
      cheat_score: session.cheatScore || 0,
      is_valid: session.isValid !== false,
    });

  if (sessionError) {
    console.error('[Leaderboard] Failed to submit session:', sessionError.message);
    return false;
  }

  return true;
}
