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
 * Submit a typing session result and update the leaderboard.
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

  // 1. Insert the typing session
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

  // 2. Update leaderboard entry (upsert with best values)
  const { data: currentLeaderboard } = await supabase
    .from('leaderboard')
    .select('best_wpm, best_accuracy, total_sessions, total_practice_time')
    .eq('user_id', userId)
    .single();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('user_id', userId)
    .single();

  const newBestWpm = Math.max(currentLeaderboard?.best_wpm || 0, session.wpm);
  const newBestAccuracy = Math.max(currentLeaderboard?.best_accuracy || 0, session.accuracy);
  const newTotalSessions = (currentLeaderboard?.total_sessions || 0) + 1;
  const newTotalTime = (currentLeaderboard?.total_practice_time || 0) + session.duration;

  const { error: leaderboardError } = await supabase
    .from('leaderboard')
    .upsert({
      user_id: userId,
      username: profile?.username || null,
      best_wpm: newBestWpm,
      best_accuracy: newBestAccuracy,
      total_sessions: newTotalSessions,
      total_practice_time: newTotalTime,
    }, { onConflict: 'user_id' });

  if (leaderboardError) {
    console.error('[Leaderboard] Failed to update leaderboard:', leaderboardError.message);
    return false;
  }

  return true;
}
