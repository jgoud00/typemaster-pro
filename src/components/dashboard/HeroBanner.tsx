'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, BookOpen, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Lesson } from '@/types';
import { useGameStore } from '@/stores/game-store';
import { useProgressStore } from '@/stores/progress-store';

interface HeroBannerProps {
    completedCount: number;
    totalLessons: number;
    overallProgress: number;
    nextLesson: Lesson | undefined;
    nextLessonCategory: { icon: string; name: string } | null | undefined;
}

export function HeroBanner({
    completedCount,
    totalLessons,
    overallProgress,
    nextLesson,
    nextLessonCategory,
}: HeroBannerProps) {
    const { game } = useGameStore();
    const { progress } = useProgressStore();
    const streak = game.dailyStreak ?? 0;
    const hasPersonalBests = !!(progress.personalBests?.wpm || progress.personalBests?.accuracy);
    const isNewUser = completedCount === 0 && !hasPersonalBests;

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative w-full"
        >
            {/* Ambient glows */}
            <div className="absolute -inset-8 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-1/2 h-48 bg-blue-500/8 blur-[80px] rounded-full" />
                <div className="absolute top-4 right-1/4 w-1/3 h-32 bg-purple-500/6 blur-[60px] rounded-full" />
            </div>

            <div className="relative rounded-3xl overflow-hidden glass-strong glass-shimmer">
                {/* Top accent gradient line */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                {/* Bottom inner shadow */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                <div className="p-7 md:p-10">
                    {isNewUser ? (
                        /* ── Welcome hero for new users ── */
                        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-14">
                            <div className="flex-1 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide bg-blue-500/10 border border-blue-500/25 text-blue-400"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Welcome to Aloo Type
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                                    <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.08] text-white">
                                        Type faster.{' '}
                                        <span className="bg-gradient-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                                            Think clearer.
                                        </span>
                                    </h1>
                                    <p className="text-base text-zinc-400 mt-4 max-w-md leading-relaxed">
                                        73 lessons from home row to 100 WPM. Adaptive AI, real-time feedback, and zero fluff.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-3 flex-wrap"
                                >
                                    <Link href="/lessons/home-1-fj">
                                        <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                                            <Button
                                                size="lg"
                                                className="h-12 px-8 font-bold bg-white text-black hover:bg-zinc-100 transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.12)] rounded-xl"
                                            >
                                                <Play className="w-4 h-4 mr-2 fill-current" />
                                                Start Learning
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    <Link href="/practice">
                                        <Button variant="ghost" size="lg" className="h-12 text-zinc-400 hover:text-white rounded-xl">
                                            Jump into Practice
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Right: teaser course overview */}
                            <motion.div
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25 }}
                                className="w-full md:w-72 shrink-0"
                            >
                                <div className="rounded-2xl glass-subtle p-5 space-y-3 border border-white/[0.07]">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 pb-1">
                                        Your course
                                    </div>
                                    {[
                                        { label: 'Home Row Mastery', desc: '12 lessons', emoji: '⌨️', color: 'border-blue-500/30' },
                                        { label: 'Top & Bottom Rows', desc: '20 lessons', emoji: '🎯', color: 'border-emerald-500/30' },
                                        { label: 'Speed & Numbers', desc: '25 lessons', emoji: '⚡', color: 'border-orange-500/30' },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, x: 8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.06 }}
                                            className={cn(
                                                'flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border',
                                                item.color
                                            )}
                                        >
                                            <span className="text-xl">{item.emoji}</span>
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-zinc-200 truncate">{item.label}</div>
                                                <div className="text-[10px] text-zinc-500">{item.desc}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div className="text-[10px] text-zinc-600 text-center pt-1">
                                        + 16 more milestone lessons
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* ── Returning user: resume progress UI ── */
                        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">

                            {/* LEFT — Identity + CTA */}
                            <div className="flex-1 space-y-5">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border",
                                        streak > 0
                                            ? "bg-orange-500/10 border-orange-500/25 text-orange-400"
                                            : "bg-white/[0.04] border-white/[0.08] text-zinc-500"
                                    )}>
                                        🔥 {streak > 0 ? `${streak}-Day Streak` : 'Start your streak today'}
                                    </div>
                                    {completedCount > 0 && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/25 text-blue-400">
                                            <Zap className="w-3 h-3" />
                                            {completedCount} lessons done
                                        </div>
                                    )}
                                </div>

                                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white">
                                    {nextLesson ? (
                                        <>
                                            Up next:{' '}
                                            <span className="bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                                                {nextLesson.title}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            All lessons{' '}
                                            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                                complete!
                                            </span>
                                        </>
                                    )}
                                </h1>
                                <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
                                    {nextLesson
                                        ? nextLesson.description
                                        : "Time to perfect your speed in the practice arena."}
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    {nextLesson ? (
                                        <Link href={`/lessons/${nextLesson.id}`}>
                                            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                                                <Button
                                                    size="lg"
                                                    className="h-12 px-8 font-bold bg-white text-black hover:bg-zinc-100 shadow-[0_0_30px_rgba(255,255,255,0.10)] rounded-xl"
                                                >
                                                    <Play className="w-4 h-4 mr-2 fill-current" />
                                                    Resume Journey
                                                </Button>
                                            </motion.div>
                                        </Link>
                                    ) : (
                                        <Link href="/practice">
                                            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                                                <Button size="lg" className="h-12 px-8 font-bold bg-white text-black hover:bg-zinc-100 rounded-xl">
                                                    <Zap className="w-4 h-4 mr-2" /> Practice Now
                                                </Button>
                                            </motion.div>
                                        </Link>
                                    )}
                                    <Link href="/lessons">
                                        <Button variant="ghost" size="lg" className="h-12 text-zinc-400 hover:text-white rounded-xl">
                                            Curriculum
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* RIGHT — Progress Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="w-full md:w-72 shrink-0"
                            >
                                <div className="rounded-2xl glass-subtle p-5 space-y-4 border border-white/[0.07]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                                            <BookOpen className="w-4 h-4 text-blue-400" />
                                            Course Progress
                                        </div>
                                        <span className="text-2xl font-black font-mono text-white">
                                            {Math.round(overallProgress)}%
                                        </span>
                                    </div>

                                    <div className="relative h-2 rounded-full overflow-hidden bg-white/[0.06]">
                                        <motion.div
                                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${overallProgress}%` }}
                                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs text-zinc-500">
                                        <span>{completedCount} done</span>
                                        <span>{totalLessons - completedCount} remaining</span>
                                    </div>

                                    {nextLesson && (
                                        <Link href={`/lessons/${nextLesson.id}`}>
                                            <motion.div
                                                whileHover={{ x: 2, backgroundColor: 'rgba(59,130,246,0.07)' }}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/25 transition-all group cursor-pointer mt-1"
                                            >
                                                <div className="w-9 h-9 rounded-lg glass-glow-primary flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                                                    {nextLessonCategory?.icon || '📝'}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-0.5">Up Next</div>
                                                    <div className="text-sm font-semibold text-zinc-200 truncate">{nextLesson.title}</div>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0 opacity-0 group-hover:opacity-100 group-hover:text-blue-400 transition-all" />
                                            </motion.div>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}
