'use client';
import { useState } from 'react';
import { ArrowRight, Keyboard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { updateProfile } from '@/lib/supabase/profiles';
import { useUserStore } from '@/stores/user-store';
export function AuthModal({ onClose }: { onClose: () => void }) {
  const [returnFocus] = useState<HTMLElement | null>(() =>
    typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const client = createClient();
      if (tab === 'signin') {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        if (!username.trim()) throw new Error('Please enter a display name.');
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: { data: { username: username.trim() } },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage('Check your email to confirm your account, then sign in.');
          return;
        }
        if (data.user) await updateProfile(data.user.id, { username: username.trim() });
      }
      await useUserStore.getState().loadProfile();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocus?.focus();
        }}
        className="max-w-md bg-card p-7"
      >
        <DialogHeader>
          <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Keyboard size={22} />
          </span>
          <DialogTitle className="text-2xl tracking-tight">
            {tab === 'signin' ? 'Your workspace is waiting.' : 'Make progress your own.'}
          </DialogTitle>
          <DialogDescription className="pt-2 leading-6">
            {tab === 'signin'
              ? 'Sign in to keep your learning journey together.'
              : 'Create an account to sync your progress across devices.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-background p-1">
          {(['signin', 'signup'] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tab === t}
              onClick={() => {
                setTab(t);
                setError(null);
                setMessage(null);
              }}
              className={`rounded-lg py-2 text-xs font-medium ${tab === t ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
            >
              {t === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="space-y-4">
          {tab === 'signup' && (
            <div className="space-y-2">
              <label htmlFor="auth-name" className="text-xs font-medium">
                Display name
              </label>
              <Input
                id="auth-name"
                autoComplete="nickname"
                required
                maxLength={40}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="How should we call you?"
              />
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="auth-email" className="text-xs font-medium">
              Email address
            </label>
            <Input
              id="auth-email"
              autoComplete="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="auth-password" className="text-xs font-medium">
              Password
            </label>
            <PasswordInput
              id="auth-password"
              autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-xs leading-5 text-red-300"
            >
              {error}
            </p>
          )}
          {message && (
            <p
              role="status"
              className="rounded-lg bg-emerald-400/10 p-3 text-xs leading-5 text-emerald-300"
            >
              {message}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {tab === 'signin' ? 'Sign in' : 'Create account'}
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
        <p className="text-center text-[11px] leading-5 text-muted-foreground">
          Prefer to explore first? Your guest progress stays on this device.
        </p>
      </DialogContent>
    </Dialog>
  );
}
