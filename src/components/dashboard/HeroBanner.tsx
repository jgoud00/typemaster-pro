'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, BookOpen, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Lesson } from '@/types';
import { useGameStore } from '@/stores/game-store';

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
    const streak = game.dailyStreak ?? 0;

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full"
        >
            {/* Ambient glow */}
            <div className="absolute -inset-4 bg-primary/10 blur-[80px] rounded-full -z-10 opacity-60" />

            <div className="relative rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl overflow-hidden">
                {/* Top accent line */}
                <div className="h-[2px] w-full bg-linear-to-r from-transparent via-primary to-transparent opacity-70" />

                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">

                        {/* LEFT — Identity + CTA */}
                        <div className="flex-1 space-y-4">
                            {/* Streak pill */}
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide",
                                    streak > 0
                                        ? "bg-orange-500/15 border border-orange-500/30 text-orange-400"
                                        : "bg-white/5 border border-white/10 text-muted-foreground"
                                )}>
                                    🔥 {streak > 0 ? `${streak}-Day Streak` : 'Start your streak today'}
                                </div>
                                {completedCount > 0 && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 border border-primary/20 text-primary">
                                        <Zap className="w-3 h-3" />
                                        {completedCount} lessons done
                                    </div>
                                )}
                            </div>

                            {/* Headline */}
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                                    {nextLesson ? (
                                        <>
                                            Up next:{' '}
                                            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-400">
                                                {nextLesson.title}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            All lessons{' '}
                                            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500">
                                                complete!
                                            </span>
                                        </>
                                    )}
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                    {nextLesson
                                        ? nextLesson.description
                                        : "Time to perfect your speed in the practice arena."}
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex items-center gap-3">
                                {nextLesson ? (
                                    <Link href={`/lessons/${nextLesson.id}`}>
                                        <Button
                                            size="lg"
                                            className="h-11 px-7 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all duration-200"
                                        >
                                            <Play className="w-4 h-4 mr-2 fill-current" />
                                            Resume Journey
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/practice">
                                        <Button size="lg" className="h-11 px-7 font-bold">
                                            <Zap className="w-4 h-4 mr-2" /> Practice Now
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/lessons">
                                    <Button variant="ghost" size="lg" className="h-11 text-muted-foreground hover:text-foreground">
                                        Curriculum
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT — Progress Card */}
                        <div className="w-full md:w-72 shrink-0">
                            <div className="rounded-xl border border-white/8 bg-white/4 p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                        Course Progress
                                    </div>
                                    <span className="text-2xl font-black font-mono text-primary">
                                        {Math.round(overallProgress)}%
                                    </span>
                                </div>

                                <Progress
                                    value={overallProgress}
                                    className="h-2 bg-white/5"
                                    indicatorClassName="bg-linear-to-r from-primary to-purple-500"
                                />

                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{completedCount} done</span>
                                    <span>{totalLessons - completedCount} remaining</span>
                                </div>

                                {nextLesson && (
                                    <Link href={`/lessons/${nextLesson.id}`}>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/8 hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer mt-1">
                                            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                                                {nextLessonCategory?.icon || '📝'}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-0.5">Up Next</div>
                                                <div className="text-sm font-semibold truncate">{nextLesson.title}</div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </motion.section>
    );
}
