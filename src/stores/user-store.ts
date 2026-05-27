'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import { getProfile, updateProfile } from '@/lib/supabase/profiles';
import { sanitizeUsername, isValidUrl } from '@/lib/security/input-sanitizer';

interface UserStore {
    username: string;
    avatarUrl: string | null;
    profileLoaded: boolean;
    setUsername: (name: string) => void;
    setAvatarUrl: (url: string | null) => void;
    loadProfile: () => Promise<void>;
    syncUsername: (name: string) => Promise<void>;
}

// Rate-limit profile loads — prevent auth-check storms during rapid navigation
let lastProfileLoad = 0;
const PROFILE_LOAD_COOLDOWN_MS = 5_000;

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            username: '',
            avatarUrl: null,
            profileLoaded: false,

            setUsername: (name: string) => set({ username: sanitizeUsername(name) }),
            setAvatarUrl: (url: string | null) => set({ avatarUrl: url && isValidUrl(url) ? url : null }),

            /**
             * Load profile from Supabase if authenticated.
             * Falls back to local state for anonymous users.
             */
            loadProfile: async () => {
                const now = Date.now();
                if (now - lastProfileLoad < PROFILE_LOAD_COOLDOWN_MS) return;
                lastProfileLoad = now;
                try {
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) {
                        set({ profileLoaded: true });
                        return;
                    }

                    const profile = await getProfile(user.id);
                    if (profile) {
                        set({
                            username: profile.username || get().username || '',
                            avatarUrl: profile.avatar_url,
                            profileLoaded: true,
                        });
                    } else {
                        set({ profileLoaded: true });
                    }
                } catch (e) {
                    console.error('[UserStore] Failed to load profile:', e);
                    set({ profileLoaded: true });
                }
            },

            /**
             * Update username both locally and in Supabase.
             */
            syncUsername: async (name: string) => {
                const trimmed = sanitizeUsername(name);
                set({ username: trimmed });

                try {
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        await updateProfile(user.id, { username: trimmed });
                    }
                } catch (e) {
                    console.error('[UserStore] Failed to sync username:', e);
                }
            },
        }),
        { 
            name: 'aloo-user',
            skipHydration: true 
        }
    )
);
