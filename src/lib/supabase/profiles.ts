import { createClient } from '@/lib/supabase/client';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch a user's profile from Supabase.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[Profiles] Failed to fetch profile:', error.message);
    return null;
  }
  return data;
}

/**
 * Update a user's profile (username, avatar_url).
 */
export async function updateProfile(
  userId: string,
  updates: { username?: string; avatar_url?: string }
): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('[Profiles] Failed to update profile:', error.message);
    return null;
  }
  return data;
}

/**
 * Check if a username is available.
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('[Profiles] Username check failed:', error.message);
    return false;
  }
  return data === null;
}
