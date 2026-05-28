'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

type AuthHandler = (user: User | null) => void;

const handlers = new Set<AuthHandler>();
let sharedUser: User | null = null;
let initialized = false;
let authSubscription: { unsubscribe: () => void } | null = null;

/**
 * Shared Supabase auth listener — initialises once, broadcasts to all subscribers.
 * Prevents each provider from independently calling supabase.auth.getUser()
 * on mount, which caused duplicate concurrent sync operations.
 */
export function useSupabaseUser(onUserChange: AuthHandler) {
    const handlerRef = useRef(onUserChange);
    handlerRef.current = onUserChange;

    const stableHandler = useCallback((user: User | null) => {
        handlerRef.current(user);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        handlers.add(stableHandler);

        if (!initialized) {
            initialized = true;
            const supabase = createClient();

            supabase.auth.getUser().then(({ data: { user } }) => {
                sharedUser = user;
                handlers.forEach(h => h(user));
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                sharedUser = session?.user ?? null;
                handlers.forEach(h => h(sharedUser));
            });
            authSubscription = subscription;
        } else {
            // Already initialized — call immediately with cached user
            stableHandler(sharedUser);
        }

        return () => {
            handlers.delete(stableHandler);
            if (handlers.size === 0) {
                authSubscription?.unsubscribe();
                authSubscription = null;
                initialized = false;
                sharedUser = null;
            }
        };
    }, [stableHandler]);
}
