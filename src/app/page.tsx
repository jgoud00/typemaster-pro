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
