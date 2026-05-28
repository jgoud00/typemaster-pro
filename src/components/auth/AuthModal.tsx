'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { updateProfile } from '@/lib/supabase/profiles';
import { useUserStore } from '@/stores/user-store';

interface AuthModalProps {
    onClose: () => void;
}

type Tab = 'signin' | 'signup';

export function AuthModal({ onClose }: AuthModalProps) {
    const [tab, setTab] = useState<Tab>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) { setError(authError.message); return; }
            await useUserStore.getState().loadProfile();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!username.trim()) { setError('Username is required'); return; }
        setLoading(true);
        setError(null);
        try {
            const supabase = createClient();
            const { data, error: authError } = await supabase.auth.signUp({ email, password });
            if (authError) { setError(authError.message); return; }
            if (data.user) {
                await updateProfile(data.user.id, { username: username.trim() });
            }
            await useUserStore.getState().loadProfile();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tab === 'signin') handleSignIn();
        else handleSignUp();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="relative z-10 w-full max-w-sm mx-4 glass-card rounded-2xl p-6 border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Tabs */}
                    <div className="flex gap-1 p-1 rounded-xl glass-subtle mb-6">
                        {(['signin', 'signup'] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setError(null); }}
                                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                                    tab === t
                                        ? 'bg-white/[0.1] text-white'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {t === 'signin' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {tab === 'signup' && (
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        )}
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                            required
                            minLength={6}
                        />

                        {error && (
                            <p className="text-sm text-rose-400 py-1">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-10 font-bold"
                            disabled={loading}
                            style={{ background: 'var(--color-primary)', color: '#000' }}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : tab === 'signin' ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>

                    <button
                        onClick={onClose}
                        className="w-full mt-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        Continue as guest
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
