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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
        >
            <Link href={isLocked ? '#' : `/lessons/${lesson.id}`} tabIndex={isLocked ? -1 : 0}>
                <div className="relative group">
                    {/* Pulse ring for current lesson */}
                    {isCurrent && (
                        <div className="absolute inset-[-3px] rounded-xl ring-2 ring-primary/30 animate-pulse pointer-events-none" />
                    )}

                    {/* Completion badge */}
                    {isCompleted && (
                        <div className="absolute top-2.5 right-2.5 z-10 text-(--color-success)">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    )}
                    {isLocked && (
                        <div className="absolute top-2.5 right-2.5 z-10 text-(--color-content-muted)">
                            <Lock className="w-3.5 h-3.5" />
                        </div>
                    )}
                    {isCurrent && !isCompleted && (
                        <div className="absolute top-2.5 right-2.5 z-10 text-(--color-primary)">
                            <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                    )}

                    <div
                        className={cn(
                            'p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none',
                            isCompleted && 'bg-success/10 border-success/30 hover:border-success/50',
                            isCurrent && !isCompleted && 'bg-primary/10 border-2 border-(--color-primary) hover:bg-primary/15',
                            isLocked && 'bg-(--color-surface-elevated) border-(--color-border-subtle) opacity-60 cursor-not-allowed',
                            !isCompleted && !isCurrent && !isLocked && 'bg-(--color-surface-elevated) border-(--color-border-subtle) hover:border-primary/40 hover:bg-(--color-surface-elevated)/80'
                        )}
                    >
                        <p
                            className={cn(
                                'font-semibold text-sm truncate pr-5',
                                isCompleted ? 'text-(--color-success)' : 'text-(--color-content-primary)'
                            )}
                        >
                            {lesson.title}
                        </p>
                        <p className="text-xs text-(--color-content-muted) line-clamp-2 mt-1 leading-relaxed">
                            {lesson.description}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                            <DifficultyDots level={difficulty} />
                            {score ? (
                                <span className="text-xs font-mono text-(--color-primary)">
                                    {score.bestWpm} WPM
                                </span>
                            ) : (
                                <span className="text-xs font-mono text-(--color-content-muted)">
                                    Goal: {lesson.targetWpm}
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
        <div className="space-y-4">
            {showHeader && categoryName && (
                <div className="mb-5">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{categoryIcon}</span>
                        <h3 className="font-display text-xl font-bold text-(--color-content-primary)">
                            {categoryName}
                        </h3>
                        <span className="bg-primary/10 text-(--color-primary) text-xs px-2 py-0.5 rounded-full">
                            {categoryLessonCount ?? lessons.length} lessons
                        </span>
                    </div>
                    <div className="border-b border-(--color-border-subtle)" />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lessons.map((lesson, index) => {
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const previousGlobalLesson = getPreviousLesson(lesson.id);
                    const isLocked = previousGlobalLesson ? !completedLessonIds.includes(previousGlobalLesson.id) : false;
                    const isCurrent = index === firstCurrentIndex;

                    return (
                        <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            score={lessonScores[lesson.id]}
                            isLocked={isLocked}
                            isCompleted={isCompleted}
                            isCurrent={isCurrent}
                            index={globalStartIndex + index}
                        />
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
