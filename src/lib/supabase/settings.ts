import { createClient } from '@/lib/supabase/client';
import type { SettingsState } from '@/stores/settings-store';

/**
 * Fetch user settings from Supabase.
 */
export async function fetchSettings(userId: string): Promise<SettingsState | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_settings')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[Settings] Failed to fetch settings:', error.message);
    return null;
  }
  if (!data) return null;
  return data.data as SettingsState;
}

/**
 * Push user settings to Supabase.
 */
export async function pushSettings(userId: string, settings: SettingsState): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      data: settings,
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('[Settings] Failed to push settings:', error.message);
    return false;
  }
  return true;
}
