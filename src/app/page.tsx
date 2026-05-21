'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy, TrendingUp, Flame, Clock, Target,
  Zap, Rocket, BookOpen, ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { lessons, lessonCategories, getLessonsByCategory } from '@/lib/lessons';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { cn } from '@/lib/utils';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useSupabaseUser } from '@/hooks/use-supabase-user';
import type { User } from '@supabase/supabase-js';

// ─── Landing Page (logged-out) ────────────────────────────────────────────────

const DEMO_SENTENCE = 'the quick brown fox jumps over the lazy dog';

function LandingPage() {
  const [cursorIdx, setCursorIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const advance = () => {
      setCursorIdx(prev => {
        if (prev >= DEMO_SENTENCE.length) {
          timerRef.current = setTimeout(() => setCursorIdx(0), 1500);
          return prev;
        }
        timerRef.current = setTimeout(advance, 120);
        return prev + 1;
      });
    };
    timerRef.current = setTimeout(advance, 120);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);



  const features = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      iconColor: 'var(--color-primary)',
      title: '73 Structured Lessons',
      desc: 'Home row to advanced symbols. Every key, every finger.',
    },
    {
      icon: <Target className="w-5 h-5" />,
      iconColor: 'var(--color-success)',
      title: 'Real-time Weakness Detection',
      desc: 'The app tracks your slowest keys and drills them automatically.',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      iconColor: 'var(--color-warning)',
      title: 'Speed Modes',
      desc: 'Speed tests, burst intervals, and free practice. You choose the pace.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl w-full mx-auto space-y-6"
        >
          {/* Pill badge */}
          <div className="flex justify-center">
            <span
              className="text-xs px-4 py-1.5 rounded-full border font-medium"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                color: 'var(--color-primary)',
              }}
            >
              73 lessons · AI-powered · Free
            </span>
          </div>

          {/* Typing demo */}
          <div
            className="font-mono text-2xl tracking-wider px-6 py-5 rounded-xl border mx-auto text-left overflow-hidden"
            style={{
              background: 'var(--color-surface-elevated)',
              borderColor: 'var(--color-border-subtle)',
              maxWidth: '600px',
            }}
          >
            {DEMO_SENTENCE.split('').map((char, i) => {
              let style: React.CSSProperties = {};
              let className = '';
              if (i < cursorIdx) {
                style = { color: 'var(--color-content-primary)' };
              } else if (i === cursorIdx) {
                className = 'bg-primary text-black rounded-sm';
                style = { color: '#000' };
              } else {
                style = { color: 'var(--color-content-muted)' };
              }
              return (
                <span key={i} className={className} style={style}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Headline */}
          <div>
            <h1 className="font-display font-black leading-none tracking-tight">
              <span
                className="block text-5xl md:text-7xl"
                style={{ color: 'var(--color-content-primary)' }}
              >
                Type faster.
              </span>
              <span
                className="block text-5xl md:text-7xl"
                style={{ color: 'var(--color-content-muted)' }}
              >
                Think clearer.
              </span>
            </h1>
            <p
              className="text-lg max-w-md mx-auto mt-4"
              style={{ color: 'var(--color-content-secondary)' }}
            >
              From home row to 100 WPM. Structured lessons, real-time feedback, zero fluff.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap mt-8">
            <Link
              href="/login"
              className="font-bold px-8 py-3 rounded-xl transition-all bg-primary text-black hover:opacity-90 shadow-lg"
              style={{ boxShadow: '0 8px 24px color-mix(in srgb, var(--color-primary) 25%, transparent)' }}
            >
              Start for free
            </Link>
            <a
              href="#features"
              className="px-8 py-3 rounded-xl border transition-all"
              style={{
                borderColor: 'var(--color-border-subtle)',
                color: 'var(--color-content-secondary)',
              }}
            >
              See how it works
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="px-4 py-20 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6"
            >
              <div
                className="w-10 h-10 p-2.5 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `color-mix(in srgb, ${f.iconColor} 10%, transparent)`,
                  color: f.iconColor,
                }}
              >
                {f.icon}
              </div>
              <h3
                className="font-display text-lg font-bold mb-2"
                style={{ color: 'var(--color-content-primary)' }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-content-muted)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────── */}
      <footer
        className="text-center py-20 px-4 border-t"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2
            className="font-display text-3xl font-bold"
            style={{ color: 'var(--color-content-primary)' }}
          >
            Ready to start?
          </h2>
          <Link
            href="/login"
            className="inline-block font-bold px-8 py-3 rounded-xl transition-all bg-primary text-black hover:opacity-90 shadow-lg"
            style={{ boxShadow: '0 8px 24px color-mix(in srgb, var(--color-primary) 25%, transparent)' }}
          >
            Create free account
          </Link>
        </motion.div>
      </footer>
    </div>
  );
}

// ─── Dashboard (logged-in) ────────────────────────────────────────────────────

export default function HomePage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useSupabaseUser((u) => setUser(u));

  const { progress } = useProgressStore();
  const game = useGameStore(s => s.game);

  const completedCount = progress.completedLessons.length;
  const totalLessons = lessons.length;
  const overallProgress = (completedCount / totalLessons) * 100;

  const nextLesson = lessons.find(l => !progress.completedLessons.includes(l.id));
  const nextLessonCategory = nextLesson
    ? lessonCategories.find(c => getLessonsByCategory(c.id).some(l => l.id === nextLesson.id))
    : null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const stats = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: 'Best WPM',
      value: progress.personalBests.wpm || '—',
      color: 'text-(--color-primary)',
      glow: 'hover:shadow-primary/20',
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: 'Best Accuracy',
      value: progress.personalBests.accuracy ? `${progress.personalBests.accuracy}%` : '—',
      color: 'text-(--color-success)',
      glow: 'hover:shadow-success/20',
    },
    {
      icon: <Flame className="w-4 h-4" />,
      label: 'Best Combo',
      value: progress.personalBests.combo || '—',
      color: 'text-(--color-primary)',
      glow: 'hover:shadow-primary/20',
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Practice Time',
      value: formatTime(progress.totalPracticeTime),
      color: 'text-(--color-content-secondary)',
      glow: 'hover:shadow-white/5',
    },
  ];

  const practiceModes = [
    {
      title: 'Speed Test',
      description: 'Timed challenges',
      href: '/practice?mode=speed-test',
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/30 hover:border-yellow-400/60',
      glow: 'hover:shadow-[0_4px_20px_rgba(245,158,11,0.25)]',
      accent: 'text-(--color-warning)',
    },
    {
      title: 'Burst Mode',
      description: 'High-intensity intervals',
      href: '/practice/speed-training',
      icon: <Rocket className="w-6 h-6" />,
      gradient: 'from-red-500/20 to-pink-500/20',
      border: 'border-red-500/30 hover:border-red-400/60',
      glow: 'hover:shadow-[0_4px_20px_rgba(239,68,68,0.25)]',
      accent: 'text-(--color-error)',
    },
    {
      title: 'Free Practice',
      description: 'No time pressure',
      href: '/practice?mode=free',
      icon: <BookOpen className="w-6 h-6" />,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30 hover:border-cyan-400/60',
      glow: 'hover:shadow-[0_4px_20px_rgba(6,182,212,0.25)]',
      accent: 'text-(--color-primary)',
    },
    {
      title: 'Lessons',
      description: '73 progressive exercises',
      href: '/lessons',
      icon: <Trophy className="w-6 h-6" />,
      gradient: 'from-purple-500/20 to-violet-500/20',
      border: 'border-purple-500/30 hover:border-purple-400/60',
      glow: 'hover:shadow-[0_4px_20px_rgba(168,85,247,0.25)]',
      accent: 'text-(--color-primary)',
    },
  ];

  // Auth loading state — skeleton to prevent white flash
  if (user === undefined) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-(--color-content-muted) font-medium">Loading...</span>
      </div>
    </div>
  );

  // Logged-out → landing page
  if (user === null) return <LandingPage />;

  // Logged-in → dashboard
  return (
    <div className="min-h-screen">
      <WelcomeModal />
      <SiteHeader />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">

        {/* Hero */}
        <HeroBanner
          completedCount={completedCount}
          totalLessons={totalLessons}
          overallProgress={overallProgress}
          nextLesson={nextLesson}
          nextLessonCategory={nextLessonCategory}
        />

        {/* Two-column layout: Practice Modes + Daily Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Practice Modes (Full Width) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-(--color-content-primary)">Practice Modes</h2>
              <Link
                href="/practice"
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {practiceModes.map((mode, i) => (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                >
                  <Link href={mode.href} className="block h-full">
                    <Card className={cn(
                      'cursor-pointer h-full transition-all duration-300 border-2 relative overflow-hidden group',
                      `bg-linear-to-br ${mode.gradient}`,
                      mode.border,
                      mode.glow,
                    )}>
                      {/* Subtly animated shimmer effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-purple-500/5 to-transparent pointer-events-none" />
                      <motion.div
                        className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent z-0"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                      />
                      <CardContent className="p-5 relative z-10">
                        <div className={cn("mb-3", mode.accent)}>{mode.icon}</div>
                        <h3 className="font-bold text-base leading-tight">{mode.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{mode.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Stats Strip — below practice modes */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                  <Card
                    className="bg-(--color-surface-elevated) border border-(--color-border-subtle) transition-all duration-200 hover:bg-white/8 hover:shadow-lg h-full"
                  >
                    <CardContent className="p-4">
                      <div className={cn("mb-2", stat.color)}>{stat.icon}</div>
                      <p className="text-[11px] text-(--color-content-muted) uppercase tracking-wide font-medium">
                        {stat.label}
                      </p>
                      {stat.value === '—' ? (
                        <div className="mt-1">
                          <div className="flex items-end gap-2">
                            <span className="text-xl font-black font-mono text-(--color-content-muted)">—</span>
                            <span className="text-xs text-(--color-content-muted) mb-0.5">No sessions yet</span>
                          </div>
                          <svg className="w-full h-4 mt-2 opacity-30" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <polyline points="0,10 100,10" fill="none" className="stroke-primary" strokeWidth="2" strokeDasharray="4 4" />
                          </svg>
                        </div>
                      ) : (
                        <p className={cn("text-xl font-black font-mono mt-0.5", stat.color)}>
                          {stat.value}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      </main>
    </div>
  );
}
