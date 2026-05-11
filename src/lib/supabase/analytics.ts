import { createClient } from './client';
import { AnalyticsPayload } from '@/types/analytics';

/**
 * Fetch the user's remote analytics from Supabase.
 */
export async function fetchAnalytics(userId: string): Promise<AnalyticsPayload | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_analytics')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[Sync] Failed to fetch analytics:', error.message);
    return null;
  }
  if (!data) return null;

  return data.data as AnalyticsPayload;
}

/**
 * Upsert the user's analytics to Supabase.
 */
export async function pushAnalytics(userId: string, payload: AnalyticsPayload): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('user_analytics')
    .upsert({
      user_id: userId,
      data: payload,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('[Sync] Failed to push analytics:', error.message);
    return false;
  }
  return true;
}
