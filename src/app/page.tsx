'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy, TrendingUp, Flame, Clock, Target,
  Zap, Rocket, BookOpen, ChevronRight,
} from 'lucide-react';
import { lessons, lessonCategories, getLessonsByCategory } from '@/lib/lessons';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { cn } from '@/lib/utils';

import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { SiteHeader } from '@/components/layout/SiteHeader';

export default function HomePage() {
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
      value: progress.personalBests.wpm || null,
      color: 'text-blue-400',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      accent: 'from-blue-500/15 to-transparent',
      border: 'border-blue-500/15',
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: 'Best Accuracy',
      value: progress.personalBests.accuracy ? `${progress.personalBests.accuracy}%` : null,
      color: 'text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      accent: 'from-emerald-500/15 to-transparent',
      border: 'border-emerald-500/15',
    },
    {
      icon: <Flame className="w-4 h-4" />,
      label: 'Best Combo',
      value: progress.personalBests.combo || null,
      color: 'text-orange-400',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]',
      accent: 'from-orange-500/15 to-transparent',
      border: 'border-orange-500/15',
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Practice Time',
      value: formatTime(progress.totalPracticeTime) !== '0m' ? formatTime(progress.totalPracticeTime) : null,
      color: 'text-purple-400',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      accent: 'from-purple-500/15 to-transparent',
      border: 'border-purple-500/15',
    },
  ];

  const practiceModes = [
    {
      title: 'Speed Test',
      description: 'Timed WPM challenges',
      href: '/practice?mode=speed-test',
      icon: <Zap className="w-5 h-5" />,
      accent: 'text-yellow-400',
      glow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]',
      border: 'hover:border-yellow-500/30',
      bg: 'hover:bg-gradient-to-br hover:from-yellow-500/[0.08] hover:to-transparent',
    },
    {
      title: 'Burst Mode',
      description: 'High-intensity intervals',
      href: '/practice/speed-training',
      icon: <Rocket className="w-5 h-5" />,
      accent: 'text-red-400',
      glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]',
      border: 'hover:border-red-500/30',
      bg: 'hover:bg-gradient-to-br hover:from-red-500/[0.08] hover:to-transparent',
    },
    {
      title: 'Free Practice',
      description: 'No time pressure',
      href: '/practice?mode=free',
      icon: <BookOpen className="w-5 h-5" />,
      accent: 'text-blue-400',
      glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
      border: 'hover:border-blue-500/30',
      bg: 'hover:bg-gradient-to-br hover:from-blue-500/[0.08] hover:to-transparent',
    },
    {
      title: 'Lessons',
      description: '73 progressive exercises',
      href: '/lessons',
      icon: <Trophy className="w-5 h-5" />,
      accent: 'text-purple-400',
      glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
      border: 'hover:border-purple-500/30',
      bg: 'hover:bg-gradient-to-br hover:from-purple-500/[0.08] hover:to-transparent',
    },
  ];

  return (
    <div className="min-h-screen">
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

        {/* Practice Modes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white tracking-tight">Practice Modes</h2>
            <Link
              href="/practice"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
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
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={mode.href} className="block h-full group">
                  <div className={cn(
                    'relative h-full rounded-2xl p-5 cursor-pointer transition-all duration-300',
                    'glass-subtle border border-white/[0.06]',
                    mode.glow,
                    mode.border,
                    mode.bg,
                    'overflow-hidden'
                  )}>
                    {/* Top highlight line */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className={cn("mb-3", mode.accent)}>{mode.icon}</div>
                    <h3 className="font-bold text-sm leading-tight text-white group-hover:text-white/90 transition-colors">{mode.title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{mode.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.08 }}
              >
                <div className={cn(
                  'relative rounded-2xl p-4 transition-all duration-200 overflow-hidden',
                  'glass-subtle border border-white/[0.06]',
                  stat.value && stat.glow,
                  stat.value && stat.border,
                )}>
                  {/* Accent gradient */}
                  {stat.value && (
                    <div className={cn('absolute inset-0 bg-gradient-to-br opacity-70 pointer-events-none', stat.accent)} />
                  )}
                  <div className={cn("mb-2 relative z-10", stat.color)}>{stat.icon}</div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium relative z-10">
                    {stat.label}
                  </p>
                  {!stat.value ? (
                    <div className="mt-1.5 relative z-10">
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-black font-mono text-zinc-700">—</span>
                        <span className="text-xs text-zinc-700 mb-0.5">No data yet</span>
                      </div>
                    </div>
                  ) : (
                    <p className={cn("text-2xl font-black font-mono mt-1 relative z-10", stat.color)}>
                      {stat.value}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
