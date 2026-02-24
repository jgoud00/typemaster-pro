'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, BookOpen, Trophy, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lesson } from '@/types';

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
    return (
        <section className="relative w-full mb-12">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full opacity-50" />

            <Card className="relative overflow-hidden border-primary/20 bg-linear-to-r from-background via-primary/5 to-purple-500/5 backdrop-blur-3xl">
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-16">

                    {/* Left Content */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                                <Trophy className="w-4 h-4" />
                                <span>Keep the streak alive!</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                                Master the Art of <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-400">Typing</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                {nextLesson
                                    ? `Continue your journey with "${nextLesson.title}". You're making great progress!`
                                    : "You've completed all lessons! Time to perfect your speed in the arena."}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center justify-center md:justify-start gap-4"
                        >
                            {nextLesson ? (
                                <Link href={`/lessons/${nextLesson.id}`}>
                                    <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                        <Play className="w-5 h-5 mr-2 fill-current" />
                                        Resume Journey
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/practice">
                                    <Button size="lg" className="h-12 px-8 text-base">
                                        <Star className="w-5 h-5 mr-2" />
                                        Practice Mode
                                    </Button>
                                </Link>
                            )}
                            <Link href="/lessons">
                                <Button variant="outline" size="lg" className="h-12 border-primary/20 hover:bg-primary/5">
                                    View Curriculum
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Content: Progress Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full md:w-[380px] shrink-0"
                    >
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    Course Progress
                                </h3>
                                <span className="text-2xl font-bold font-mono">{Math.round(overallProgress)}%</span>
                            </div>

                            <Progress value={overallProgress} className="h-3 mb-4 bg-white/5" indicatorClassName="bg-linear-to-r from-primary to-purple-500" />

                            <div className="flex justify-between text-sm text-muted-foreground mb-6">
                                <span>{completedCount} Lessons Done</span>
                                <span>{totalLessons - completedCount} Remaining</span>
                            </div>

                            {nextLesson && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-primary/20 transition-colors group cursor-default">
                                    <div className="text-xs text-primary font-medium mb-1 uppercase tracking-wider">Up Next</div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                                            {nextLessonCategory?.icon || '📝'}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-medium truncate">{nextLesson.title}</div>
                                            <div className="text-xs text-muted-foreground truncate opacity-80">{nextLesson.description}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </Card>
        </section>
    );
}
