'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Trophy, Flame, Target, Zap, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
    getDailyChallenges,
    getTimeUntilReset,
    checkChallengeCompletion,
    DailyChallenge
} from '@/lib/daily-challenges';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';

export default function DailyChallengesPage() {
    const router = useRouter();
    const { progress } = useProgressStore();
    const { game } = useGameStore();
    const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
    const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilReset());

    useEffect(() => {
        setChallenges(getDailyChallenges());

        const timer = setInterval(() => {
            setTimeUntilReset(getTimeUntilReset());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Calculate today's stats for challenge checking
    const todayStats = {
        maxWpm: progress.personalBests.wpm,
        maxAccuracy: progress.personalBests.accuracy,
        maxCombo: progress.personalBests.combo,
        totalMinutes: Math.floor(progress.totalPracticeTime / 60),
        perfectLessons: progress.records.filter(r => r.accuracy === 100).length,
    };

    const completedChallenges = challenges.filter(c =>
        checkChallengeCompletion(c, todayStats)
    );
    const totalReward = completedChallenges.reduce((sum, c) => sum + c.reward, 0);



    const difficultyColors = {
        easy: 'text-green-500 bg-green-500/10',
        medium: 'text-yellow-500 bg-yellow-500/10',
        hard: 'text-red-500 bg-red-500/10',
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            <h1 className="text-xl font-bold">Daily Challenges</h1>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                            Resets in {timeUntilReset.hours}h {timeUntilReset.minutes}m
                        </span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="bg-linear-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        {completedChallenges.length} / {challenges.length} Completed
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {totalReward > 0
                                            ? `${totalReward} points earned today!`
                                            : 'Complete challenges to earn bonus points!'
                                        }
                                    </p>
                                </div>
                                <div className="w-full md:w-48">
                                    <Progress
                                        value={(completedChallenges.length / challenges.length) * 100}
                                        className="h-3"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Daily Streak */}
                {game.dailyStreak > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                        <Flame className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Daily Streak</div>
                                        <div className="text-sm text-muted-foreground">
                                            Keep practicing every day!
                                        </div>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-orange-500">
                                    {game.dailyStreak} 🔥
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Challenge Cards */}
                <div className="space-y-4">
                    {challenges.map((challenge, index) => {
                        const isCompleted = checkChallengeCompletion(challenge, todayStats);

                        return (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                            >
                                <Card className={cn(
                                    'transition-all',
                                    isCompleted && 'bg-green-500/5 border-green-500/30'
                                )}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div className={cn(
                                                'w-14 h-14 rounded-xl flex items-center justify-center shrink-0',
                                                isCompleted ? 'bg-green-500/20' : 'bg-muted'
                                            )}>
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                                                ) : (
                                                    <span className="text-2xl">{challenge.icon}</span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold">{challenge.title}</h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn('text-xs', difficultyColors[challenge.difficulty])}
                                                    >
                                                        {challenge.difficulty}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {challenge.description}
                                                </p>
                                            </div>

                                            {/* Reward */}
                                            <div className="text-right shrink-0">
                                                <div className={cn(
                                                    'text-xl font-bold',
                                                    isCompleted ? 'text-green-500' : 'text-yellow-500'
                                                )}>
                                                    +{challenge.reward}
                                                </div>
                                                <div className="text-xs text-muted-foreground">points</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Start Practicing CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center"
                >
                    <Link href="/practice?mode=free">
                        <Button size="lg">
                            Start Practicing to Complete Challenges
                        </Button>
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
