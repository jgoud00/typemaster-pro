'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import { getProfile, updateProfile } from '@/lib/supabase/profiles';

interface UserStore {
    username: string;
    avatarUrl: string | null;
    profileLoaded: boolean;
    setUsername: (name: string) => void;
    setAvatarUrl: (url: string | null) => void;
    loadProfile: () => Promise<void>;
    syncUsername: (name: string) => Promise<void>;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            username: '',
            avatarUrl: null,
            profileLoaded: false,

            setUsername: (name: string) => set({ username: name.trim().slice(0, 20) }),
            setAvatarUrl: (url: string | null) => set({ avatarUrl: url }),

            /**
             * Load profile from Supabase if authenticated.
             * Falls back to local state for anonymous users.
             */
            loadProfile: async () => {
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
                const trimmed = name.trim().slice(0, 20);
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
