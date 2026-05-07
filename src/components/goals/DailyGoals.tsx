'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useProgressStore } from '@/stores/progress-store';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface DailyGoal {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly target: number;
    readonly current: number;
    readonly icon: string;
    readonly points: number;
    readonly unit?: string;
}

export function DailyGoals() {
    const {
        todayPracticeTime,
        todayLessonsCompleted,
        todayBestAccuracy,
        checkAndResetDaily
    } = useProgressStore();

    useEffect(() => {
        checkAndResetDaily();
    }, [checkAndResetDaily]);

    const goals: DailyGoal[] = [
        {
            id: 'practice-time',
            title: 'Practice 15 min',
            description: 'Build habits',
            target: 15,
            current: Math.floor(todayPracticeTime / 60),
            icon: '⏱️',
            points: 50,
            unit: 'min',
        },
        {
            id: 'complete-lesson',
            title: 'Complete 1 Lesson',
            description: 'Keep learning',
            target: 1,
            current: todayLessonsCompleted,
            icon: '📚',
            points: 100,
        },
        {
            id: 'accuracy-goal',
            title: '95% Accuracy',
            description: 'Precision matters',
            target: 95,
            current: todayBestAccuracy,
            icon: '🎯',
            points: 75,
            unit: '%',
        },
    ];

    const totalPossiblePoints = goals.reduce((sum, g) => sum + g.points, 0);
    const earnedPoints = goals.reduce((sum, goal) => {
        return sum + (goal.current >= goal.target ? goal.points : 0);
    }, 0);
    const allComplete = goals.every(g => g.current >= g.target);

    return (
        <Card className={cn(
            "p-5 border transition-all",
            allComplete
                ? "border-green-500/30 bg-green-500/5"
                : "border-white/8"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <h3 className="font-bold text-base">Daily Goals</h3>
                </div>
                <div className={cn(
                    "text-sm font-black font-mono",
                    earnedPoints === totalPossiblePoints ? "text-yellow-400" : "text-muted-foreground"
                )}>
                    {earnedPoints}
                    <span className="text-xs font-normal text-muted-foreground"> / {totalPossiblePoints} pts</span>
                </div>
            </div>

            {/* Goals */}
            <div className="space-y-3">
                {goals.map((goal) => {
                    const isComplete = goal.current >= goal.target;
                    const progressPercent = Math.min((goal.current / goal.target) * 100, 100);

                    return (
                        <div key={goal.id} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base leading-none">{goal.icon}</span>
                                    <span className={cn(
                                        "text-sm font-semibold",
                                        isComplete ? "text-green-400" : "text-foreground"
                                    )}>
                                        {goal.title}
                                    </span>
                                    {isComplete && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {goal.current}{goal.unit || ''}/{goal.target}{goal.unit || ''}
                                </span>
                            </div>
                            <Progress
                                value={progressPercent}
                                className={cn(
                                    "h-1.5",
                                    isComplete ? "[&>div]:bg-green-500" : ""
                                )}
                            />
                        </div>
                    );
                })}
            </div>

            {/* All complete banner */}
            {allComplete && (
                <div className="mt-4 text-center text-sm font-semibold text-green-400">
                    🎉 All goals complete! Come back tomorrow.
                </div>
            )}
        </Card>
    );
}
