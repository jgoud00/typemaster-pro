'use client';

import { motion } from 'framer-motion';
import { Lesson, LessonScore } from '@/types';
import { cn } from '@/lib/utils';
import { Star, Lock, Play, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getPreviousLesson } from '@/lib/lessons';

// Full standard QWERTY layout for the mini preview
const KEYBOARD_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

interface MiniKeyboardPreviewProps {
    activeKeys: string[];
    className?: string; // Add className prop
}

function MiniKeyboardPreview({ activeKeys, className }: MiniKeyboardPreviewProps) { // Accept className
    const activeSet = new Set(activeKeys.map(k => k.toLowerCase()));

    return (
        <div className={cn("flex flex-col gap-0.5 w-full max-w-[120px]", className)}> {/* Use className */}
            {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-0.5">
                    {row.map((key) => {
                        const isActive = activeSet.has(key);
                        return (
                            <div
                                key={key}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-[1px] transition-colors",
                                    isActive ? "bg-primary shadow-[0_0_4px_rgba(var(--primary),0.5)]" : "bg-muted-foreground/20"
                                )}
                            />
                        );
                    })}
                </div>
            ))}
            {/* Space bar */}
            <div className="flex justify-center mt-0.5">
                <div className={cn(
                    "w-12 h-1.5 rounded-[1px] transition-colors",
                    activeSet.has(' ') ? "bg-primary shadow-[0_0_4px_rgba(var(--primary),0.5)]" : "bg-muted-foreground/20"
                )} />
            </div>
        </div>
    );
}

interface LessonNodeProps {
    lesson: Lesson;
    score?: LessonScore;
    isLocked: boolean;
    isCompleted: boolean;
    index: number;
}

export function LessonNode({ lesson, score, isLocked, isCompleted, index }: LessonNodeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative z-10"
        >
            <Link href={isLocked ? '#' : `/lessons/${lesson.id}`}>
                <div className={cn(
                    "group relative w-64 p-4 rounded-xl border transition-all duration-300",
                    isLocked
                        ? "bg-muted/10 border-white/5 opacity-50 cursor-not-allowed grayscale"
                        : "bg-card/40 border-white/10 hover:border-primary/50 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5 cursor-pointer backdrop-blur-md",
                    isCompleted && "border-green-500/30 bg-green-500/5"
                )}>
                    {/* Status Badge */}
                    <div className="absolute -top-3 -right-3">
                        {isCompleted ? (
                            <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg shadow-green-500/20">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        ) : isLocked ? (
                            <div className="bg-muted-foreground/20 p-1.5 rounded-full backdrop-blur-md border border-white/10">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg shadow-primary/20 animate-pulse">
                                <Play className="w-4 h-4 fill-current" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        {/* Header */}
                        <div>
                            <h3 className={cn("font-bold truncate pr-4", isCompleted ? "text-green-400" : "text-foreground")}>
                                {lesson.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">{lesson.description}</p>
                        </div>

                        {/* Keyboard Preview */}
                        <div className="bg-background/30 p-2 rounded-lg border border-white/5">
                            <MiniKeyboardPreview activeKeys={lesson.keys} />
                        </div>

                        {/* Stats / Goals */}
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3].map((star) => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            "w-3 h-3 transition-colors",
                                            score && star <= score.stars
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-muted-foreground/20"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className={cn(
                                "font-mono opacity-80",
                                score ? "text-primary" : "text-muted-foreground"
                            )}>
                                {score ? `${score.bestWpm} WPM` : `Goal: ${lesson.targetWpm} WPM`}
                            </span>
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
}

export function LessonPath({ lessons, completedLessonIds, lessonScores }: LessonPathProps) {
    return (
        <div className="relative flex flex-col items-center py-8 space-y-8 max-w-3xl mx-auto">
            {/* Center Line */}
            <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-linear-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2 hidden md:block" />

            {lessons.map((lesson, index) => {
                const isCompleted = completedLessonIds.includes(lesson.id);

                // Unlock logic: 
                // A lesson is locked if the PREVIOUS global lesson is not completed.
                // Except the very first lesson of the entire curriculum (which has no previous).
                const previousGlobalLesson = getPreviousLesson(lesson.id);
                const isLocked = previousGlobalLesson ? !completedLessonIds.includes(previousGlobalLesson.id) : false;

                // Alternating layout for timeline feel
                const isLeft = index % 2 === 0;

                return (
                    <div key={lesson.id} className={cn(
                        "relative flex w-full md:justify-between items-center group",
                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    )}>
                        {/* Desktop: Empty space for alternating layout */}
                        <div className="hidden md:block w-5/12" />

                        {/* Connector Dot */}
                        <div className={cn(
                            "absolute left-[50%] -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background z-20 transition-colors hidden md:block",
                            isCompleted ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                : isLocked ? "bg-muted-foreground/30"
                                    : "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] animate-pulse"
                        )} />

                        {/* Node Container */}
                        <div className={cn(
                            "w-full md:w-5/12 flex",
                            isLeft ? "md:justify-end pr-0 md:pr-8" : "md:justify-start pl-0 md:pl-8",
                            "justify-center" // Center on mobile
                        )}>
                            <LessonNode
                                lesson={lesson}
                                score={lessonScores[lesson.id]}
                                isLocked={isLocked}
                                isCompleted={isCompleted}
                                index={index}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
