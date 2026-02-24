'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useChallengeStore } from '@/stores/challenge-store';

function getEndOfWeekDays(): number {
    const now = new Date();
    const dayOfWeek = now.getDay();
    // Days until Sunday (end of week)
    return 7 - dayOfWeek;
}

export function WeeklyChallenges() {
    const { challenges, checkWeeklyReset } = useChallengeStore();

    useEffect(() => {
        checkWeeklyReset();
    }, [checkWeeklyReset]);

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

                    // Logic to display current/target differently based on type if needed
                    // For now, simple fraction is fine

                    return (
                        <Card
                            key={challenge.id}
                            className={cn(
                                "p-5 transition-all hover:shadow-lg",
                                challenge.isCompleted && "ring-2 ring-green-500/50 bg-green-500/5"
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
                                        {challenge.current}/{challenge.target} {challenge.type === 'endurance' ? 'mins' : ''}
                                    </span>
                                </div>
                                <Progress
                                    value={progressPercent}
                                    className={cn("h-2", challenge.isCompleted && "[&>div]:bg-green-500")}
                                />
                            </div>

                            <div className="text-xs text-muted-foreground">
                                <span className="font-medium text-yellow-500">🎁 Reward:</span>{' '}
                                {challenge.reward}
                            </div>

                            {challenge.isCompleted && (
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
