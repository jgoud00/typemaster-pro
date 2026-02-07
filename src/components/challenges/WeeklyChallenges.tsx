'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Challenge {
    id: string;
    title: string;
    description: string;
    type: 'speed' | 'accuracy' | 'endurance';
    target: number;
    current: number;
    reward: string;
    difficulty: 'easy' | 'medium' | 'hard';
    daysLeft: number;
}

function getEndOfWeekDays(): number {
    const now = new Date();
    const dayOfWeek = now.getDay();
    // Days until Sunday (end of week)
    return 7 - dayOfWeek;
}

export function WeeklyChallenges() {
    // In a real app, these would come from a store
    const challenges: Challenge[] = [
        {
            id: 'speed-demon',
            title: '⚡ Speed Demon',
            description: 'Achieve 60 WPM or higher in any test',
            type: 'speed',
            target: 60,
            current: 0, // Would be tracked from store
            reward: '200 points + Speed Demon badge',
            difficulty: 'medium',
            daysLeft: getEndOfWeekDays(),
        },
        {
            id: 'perfect-streak',
            title: '🎯 Perfect Streak',
            description: 'Complete 5 lessons with 95%+ accuracy',
            type: 'accuracy',
            target: 5,
            current: 0,
            reward: '300 points + Perfectionist badge',
            difficulty: 'hard',
            daysLeft: getEndOfWeekDays(),
        },
        {
            id: 'marathon',
            title: '🏃 Marathon Typer',
            description: 'Practice for 60 minutes this week',
            type: 'endurance',
            target: 60,
            current: 0,
            reward: '150 points + Dedicated badge',
            difficulty: 'easy',
            daysLeft: getEndOfWeekDays(),
        },
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'medium':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
            case 'hard':
                return 'bg-red-500/10 text-red-500 border-red-500/30';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">🏆 Weekly Challenges</h2>
                <span className="text-sm text-muted-foreground">
                    Resets in {getEndOfWeekDays()} days
                </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {challenges.map((challenge) => {
                    const progressPercent = Math.min(
                        (challenge.current / challenge.target) * 100,
                        100
                    );
                    const isComplete = challenge.current >= challenge.target;

                    return (
                        <Card
                            key={challenge.id}
                            className={cn(
                                "p-5 transition-all hover:shadow-lg",
                                isComplete && "ring-2 ring-green-500/50 bg-green-500/5"
                            )}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-lg">{challenge.title}</h3>
                                <Badge className={getDifficultyColor(challenge.difficulty)}>
                                    {challenge.difficulty}
                                </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">
                                {challenge.description}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span className="font-medium">
                                        {challenge.current}/{challenge.target}
                                    </span>
                                </div>
                                <Progress
                                    value={progressPercent}
                                    className={cn("h-2", isComplete && "[&>div]:bg-green-500")}
                                />
                            </div>

                            <div className="text-xs text-muted-foreground">
                                <span className="font-medium text-yellow-500">🎁 Reward:</span>{' '}
                                {challenge.reward}
                            </div>

                            {isComplete && (
                                <div className="mt-3 text-sm font-medium text-green-500 text-center">
                                    ✓ Challenge Complete!
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
