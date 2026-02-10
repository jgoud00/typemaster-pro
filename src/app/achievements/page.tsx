'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Lock, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
    achievements,
    Achievement,
    AchievementCategory,
    getAchievementsByCategory,
} from '@/lib/achievements';
import { useAchievementStore } from '@/stores/achievement-store';

const categories: { id: AchievementCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '🏆' },
    { id: 'quick-win', label: 'Quick Wins', icon: '⚡' },
    { id: 'speed', label: 'Speed', icon: '💨' },
    { id: 'accuracy', label: 'Accuracy', icon: '🎯' },
    { id: 'milestone', label: 'Milestones', icon: '📚' },
    { id: 'streak', label: 'Streaks', icon: '🔥' },
    { id: 'secret', label: 'Secret', icon: '🔮' },
];

export default function AchievementsPage() {
    const router = useRouter();
    const { isUnlocked, getProgress, state } = useAchievementStore();
    const progress = getProgress();

    const renderAchievements = (category: AchievementCategory | 'all') => {
        const filteredAchievements = category === 'all'
            ? achievements
            : getAchievementsByCategory(category);

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map((achievement, index) => (
                    <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        isUnlocked={isUnlocked(achievement.id)}
                        unlockedAt={state.unlockedAchievements.find(a => a.id === achievement.id)?.unlockedAt}
                        index={index}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            <h1 className="text-xl font-bold">Achievements</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Progress Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="bg-linear-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                        <Trophy className="w-8 h-8 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {progress.unlocked} / {progress.total} Achievements
                                        </h2>
                                        <p className="text-muted-foreground">
                                            {progress.points.toLocaleString()} total points earned
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full md:w-64">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Progress</span>
                                        <span className="font-medium">
                                            {Math.round((progress.unlocked / progress.total) * 100)}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={(progress.unlocked / progress.total) * 100}
                                        className="h-3"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Category Tabs */}
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
                        {categories.map((category) => (
                            <TabsTrigger
                                key={category.id}
                                value={category.id}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                <span className="mr-1">{category.icon}</span>
                                {category.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {categories.map((category) => (
                        <TabsContent key={category.id} value={category.id}>
                            {renderAchievements(category.id)}
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    );
}

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    unlockedAt?: number;
    index: number;
}

function AchievementCard({ achievement, isUnlocked, unlockedAt, index }: AchievementCardProps) {
    const isSecret = achievement.hidden && !isUnlocked;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className={cn(
                'h-full transition-all',
                isUnlocked
                    ? 'bg-linear-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/30'
                    : 'opacity-60'
            )}>
                <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                            isUnlocked ? 'bg-yellow-500/20' : 'bg-muted'
                        )}>
                            {isSecret ? (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <span className="text-2xl">{achievement.icon}</span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={cn(
                                    'font-semibold truncate',
                                    !isUnlocked && 'text-muted-foreground'
                                )}>
                                    {isSecret ? '???' : achievement.title}
                                </h3>
                                {isUnlocked && (
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {isSecret ? 'This achievement is hidden' : achievement.description}
                            </p>

                            <div className="flex items-center justify-between mt-3">
                                <Badge variant={isUnlocked ? 'default' : 'secondary'} className="text-xs">
                                    {achievement.points} pts
                                </Badge>
                                {isUnlocked && unlockedAt && (
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(unlockedAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
