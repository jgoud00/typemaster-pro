'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useProgressStore } from '@/stores/progress-store';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

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

    // Check and reset daily on mount
    useEffect(() => {
        checkAndResetDaily();
    }, [checkAndResetDaily]);

    const goals: DailyGoal[] = [
        {
            id: 'practice-time',
            title: 'Practice 15 Minutes',
            description: 'Build consistent habits',
            target: 15,
            current: Math.floor(todayPracticeTime / 60), // Convert seconds to minutes
            icon: '⏱️',
            points: 50,
            unit: 'min',
        },
        {
            id: 'complete-lesson',
            title: 'Complete 1 Lesson',
            description: 'Keep learning every day',
            target: 1,
            current: todayLessonsCompleted,
            icon: '📚',
            points: 100,
        },
        {
            id: 'accuracy-goal',
            title: 'Achieve 95% Accuracy',
            description: 'Precision matters',
            target: 95,
            current: todayBestAccuracy,
            icon: '🎯',
            points: 75,
            unit: '%',
        },
    ];

    const calculateTodayPoints = (): number => {
        return goals.reduce((sum, goal) => {
            return sum + (goal.current >= goal.target ? goal.points : 0);
        }, 0);
    };

    const totalPossiblePoints = goals.reduce((sum, g) => sum + g.points, 0);
    const earnedPoints = calculateTodayPoints();
    const allComplete = goals.every(g => g.current >= g.target);

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">📅 Daily Goals</h3>
                {allComplete && (
                    <span className="text-sm font-medium text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                        ✓ All Complete!
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {goals.map((goal) => {
                    const isComplete = goal.current >= goal.target;
                    const progressPercent = Math.min((goal.current / goal.target) * 100, 100);

                    return (
                        <div key={goal.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{goal.icon}</span>
                                    <div>
                                        <div className={cn(
                                            "font-semibold",
                                            isComplete && "text-green-500"
                                        )}>
                                            {goal.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {goal.description}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm font-semibold">
                                    {goal.current}{goal.unit || ''}/{goal.target}{goal.unit || ''}
                                </div>
                            </div>

                            <Progress
                                value={progressPercent}
                                className={cn("h-2", isComplete && "[&>div]:bg-green-500")}
                            />

                            {isComplete && (
                                <div className="text-sm text-green-500 flex items-center gap-1">
                                    ✓ Complete! +{goal.points} points
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Today&apos;s Points</span>
                    <span className="text-lg font-bold text-yellow-500">
                        {earnedPoints} / {totalPossiblePoints}
                    </span>
                </div>
            </div>
        </Card>
    );
}
