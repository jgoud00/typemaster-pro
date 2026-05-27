'use client';

import { motion } from 'framer-motion';
import { Lesson, LessonScore } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Lock, Play } from 'lucide-react';
import Link from 'next/link';
import { getPreviousLesson } from '@/lib/lessons';

interface LessonCardProps {
    lesson: Lesson;
    score?: LessonScore;
    isLocked: boolean;
    isCompleted: boolean;
    isCurrent: boolean;
    index: number;
}

function DifficultyDots({ level }: { level: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3].map((dot) => (
                <div
                    key={dot}
                    className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        dot <= level
                            ? 'bg-(--color-primary)'
                            : 'bg-(--color-border-subtle)'
                    )}
                />
            ))}
        </div>
    );
}

function LessonCard({ lesson, score, isLocked, isCompleted, isCurrent, index }: LessonCardProps) {
    const difficulty = Math.min(3, Math.max(1, Math.ceil((index + 1) / 3)));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index % 10) * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full relative"
        >
            <Link href={isLocked ? '#' : `/lessons/${lesson.id}`} tabIndex={isLocked ? -1 : 0} className="block group">
                <div className="relative z-10 w-full max-w-sm mx-auto">
                    {/* Floating Pulse for Current Lesson */}
                    {isCurrent && (
                        <div className="absolute -inset-4 rounded-3xl bg-blue-500/20 blur-xl animate-pulse pointer-events-none" />
                    )}

                    <div
                        className={cn(
                            'relative p-5 rounded-2xl border transition-all duration-300',
                            isCompleted ? 'glass-card border-blue-500/30 bg-blue-900/10 hover:bg-blue-900/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' :
                            isCurrent ? 'glass-glow-primary border-blue-400 bg-black/60 shadow-[0_0_30px_rgba(59,130,246,0.2)]' :
                            isLocked ? 'glass-subtle opacity-50 grayscale cursor-not-allowed hover:opacity-50 hover:-translate-y-0' :
                            'glass-card hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl'
                        )}
                    >
                        {/* Status Icon */}
                        <div className="absolute -top-3 -right-3 z-20">
                            {isCompleted ? (
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            ) : isCurrent ? (
                                <div className="w-8 h-8 rounded-full bg-blue-400 text-black flex items-center justify-center shadow-lg shadow-blue-400/50">
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                </div>
                            ) : isLocked ? (
                                <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center border border-white/10 shadow-lg">
                                    <Lock className="w-4 h-4" />
                                </div>
                            ) : null}
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <span className={cn(
                                "text-xs font-mono font-bold px-2 py-0.5 rounded-full border",
                                isCompleted ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                                isCurrent ? "bg-blue-400/20 text-blue-300 border-blue-400/30" :
                                "bg-white/5 text-zinc-400 border-white/10"
                            )}>
                                Lvl {index + 1}
                            </span>
                            <DifficultyDots level={difficulty} />
                        </div>

                        <h4 className={cn(
                            'font-display font-bold text-lg mb-1 truncate',
                            isCompleted ? 'text-white' : 
                            isCurrent ? 'text-white' : 'text-zinc-200'
                        )}>
                            {lesson.title}
                        </h4>
                        
                        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                            {lesson.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                            {score ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-blue-400">{score.bestWpm} WPM</span>
                                    <span className="text-xs font-medium text-blue-400/60">{score.bestAccuracy}% Acc</span>
                                </div>
                            ) : (
                                <span className="text-xs font-mono text-zinc-500">
                                    Goal: {lesson.targetWpm} WPM / {lesson.targetAccuracy}% Acc
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

interface LessonPathProps {
    lessons: Lesson[];
    completedLessonIds: string[];
    lessonScores: Record<string, LessonScore>;
    categoryName?: string;
    categoryIcon?: string;
    categoryLessonCount?: number;
    globalStartIndex?: number;
    showHeader?: boolean;
}

export function LessonPath({
    lessons,
    completedLessonIds,
    lessonScores,
    categoryName,
    categoryIcon,
    categoryLessonCount,
    globalStartIndex = 0,
    showHeader = false,
}: LessonPathProps) {
    const completedCount = lessons.filter(l => completedLessonIds.includes(l.id)).length;

    // Find the first lesson that's not completed and not locked → "current"
    const firstCurrentIndex = lessons.findIndex((lesson, i) => {
        const isCompleted = completedLessonIds.includes(lesson.id);
        const previousGlobalLesson = getPreviousLesson(lesson.id);
        const isLocked = previousGlobalLesson ? !completedLessonIds.includes(previousGlobalLesson.id) : false;
        return !isCompleted && !isLocked;
    });

    return (
        <div className="relative py-12">
            {showHeader && categoryName && (
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center justify-center gap-3 mb-4 px-6 py-2 rounded-full glass-strong border-white/10">
                        <span className="text-2xl">{categoryIcon}</span>
                        <h3 className="font-display text-2xl font-bold text-white">
                            {categoryName}
                        </h3>
                    </div>
                    <p className="text-zinc-400">{categoryLessonCount ?? lessons.length} modules to master</p>
                </div>
            )}

            {/* The Central Path Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-purple-500/20 to-transparent -translate-x-1/2 rounded-full hidden md:block" />
            <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-purple-500/20 to-transparent -translate-x-1/2 rounded-full md:hidden" />

            <div className="space-y-16 relative">
                {lessons.map((lesson, index) => {
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const previousGlobalLesson = getPreviousLesson(lesson.id);
                    const isLocked = previousGlobalLesson ? !completedLessonIds.includes(previousGlobalLesson.id) : false;
                    const isCurrent = index === firstCurrentIndex;
                    
                    const isLeft = index % 2 === 0;

                    return (
                        <div key={lesson.id} className={cn(
                            "relative flex items-center md:w-1/2",
                            isLeft ? "md:mr-auto md:pr-12 md:justify-end pl-16 md:pl-0" : "md:ml-auto md:pl-12 md:justify-start pl-16 md:pl-12"
                        )}>
                            {/* Branch Connector Line */}
                            <div className={cn(
                                "absolute top-1/2 -translate-y-1/2 w-8 h-[2px] hidden md:block transition-colors duration-500",
                                isLeft ? "right-0 translate-x-full" : "left-0 -translate-x-full",
                                isCompleted ? "bg-blue-500/50" : "bg-white/10"
                            )} />
                            <div className={cn(
                                "absolute left-8 top-1/2 -translate-y-1/2 w-8 h-[2px] md:hidden transition-colors duration-500",
                                isCompleted ? "bg-blue-500/50" : "bg-white/10"
                            )} />

                            {/* Node Dot */}
                            <div className={cn(
                                "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 hidden md:block",
                                isLeft ? "right-[-8px] translate-x-full" : "left-[-8px] -translate-x-full",
                                isCompleted ? "bg-blue-500 border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : 
                                isCurrent ? "bg-blue-400 border-white shadow-[0_0_20px_rgba(96,165,250,0.8)] animate-pulse" : 
                                "bg-zinc-900 border-white/20"
                            )} />
                            <div className={cn(
                                "absolute left-[24px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 md:hidden",
                                isCompleted ? "bg-blue-500 border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : 
                                isCurrent ? "bg-blue-400 border-white shadow-[0_0_20px_rgba(96,165,250,0.8)] animate-pulse" : 
                                "bg-zinc-900 border-white/20"
                            )} />

                            <div className="w-full">
                                <LessonCard
                                    lesson={lesson}
                                    score={lessonScores[lesson.id]}
                                    isLocked={isLocked}
                                    isCompleted={isCompleted}
                                    isCurrent={isCurrent}
                                    index={globalStartIndex + index}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Kept for backwards compatibility — not used in the new lessons page layout
export function LessonNode({ lesson, score, isLocked, isCompleted, index }: {
    lesson: Lesson; score?: LessonScore; isLocked: boolean; isCompleted: boolean; index: number;
}) {
    const previousGlobalLesson = getPreviousLesson(lesson.id);
    const isCurrent = !isCompleted && !isLocked && !previousGlobalLesson;

    return (
        <LessonCard
            lesson={lesson}
            score={score}
            isLocked={isLocked}
            isCompleted={isCompleted}
            isCurrent={isCurrent}
            index={index}
        />
    );
}
