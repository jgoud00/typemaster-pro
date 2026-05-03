'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Trophy,
    TrendingUp,
    Target,
    BarChart3,
    Activity,
    RotateCcw,
    AlertTriangle,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PersonalRecordsDashboard } from '@/components/stats/PersonalRecordsDashboard';

// Lazy load Recharts components
const PerformanceSection = dynamic(() => import('@/components/stats/PerformanceSection'), {
    loading: () => <div className="h-[400px] w-full bg-muted/10 animate-pulse rounded-xl" />,
    ssr: false,
});
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
const KeyboardHeatmap = dynamic(() => import('@/components/stats/KeyboardHeatmap').then(mod => mod.KeyboardHeatmap), { ssr: false });
import { cn } from '@/lib/utils';

// Get color based on accuracy
function getAccuracyColor(accuracy: number | null): string {
    if (accuracy === null) return 'bg-muted/50 text-muted-foreground';
    if (accuracy >= 95) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (accuracy >= 85) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    if (accuracy >= 70) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
}

export default function StatsPage() {
    const router = useRouter();
    const { progress, resetProgress } = useProgressStore();
    const { game, resetGame } = useGameStore();
    const { keyStats, clearSession } = useAnalyticsStore();
    const [showResetModal, setShowResetModal] = useState(false);

    const handleResetStats = () => {
        resetProgress();
        resetGame();
        clearSession();
        setShowResetModal(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ngram-analytics');
            localStorage.removeItem('analytics-store');
        }
        router.refresh();
    };

    // Calculate stats
    const totalTimeSeconds = progress.totalPracticeTime || 0;
    const totalKeystrokes = progress.totalKeystrokes || 0;
    const hasPracticeData = totalTimeSeconds > 0;

    // Generate chart data from actual records
    const wpmData = progress.records?.slice(-30).map((record, i) => ({
        session: i + 1,
        wpm: record.wpm,
        accuracy: record.accuracy,
        date: new Date(record.timestamp).toLocaleDateString(),
    })) || [];

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowResetModal(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 bg-card border rounded-xl p-6 max-w-md mx-4 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-red-500/20">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold">Reset All Statistics?</h3>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            This will permanently delete all your progress, including:
                        </p>
                        <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                            <li className="flex items-center gap-2">• Completed lessons and scores</li>
                            <li className="flex items-center gap-2">• Personal best records (WPM, accuracy, combo)</li>
                            <li className="flex items-center gap-2">• Practice time and keystroke history</li>
                            <li className="flex items-center gap-2">• Daily streak and achievements</li>
                        </ul>
                        <p className="text-sm text-red-400 mb-6 font-medium">
                            ⚠️ This action cannot be undone!
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowResetModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleResetStats}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset Everything
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-primary" />
                            <h1 className="text-xl font-bold">Statistics</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30"
                            onClick={() => setShowResetModal(true)}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Stats
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Overview Dashboards */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Personal Best Records</h2>
                    <PersonalRecordsDashboard />
                </section>

                {/* Performance Charts */}
                <PerformanceSection
                    wpmData={wpmData}
                    hasPracticeData={hasPracticeData}
                    totalTimeSeconds={totalTimeSeconds}
                    totalKeystrokes={totalKeystrokes}
                    sessionsCount={progress.records?.length || 0}
                    completedLessonsCount={progress.completedLessons?.length || 0}
                />

                {/* Keyboard Heatmap */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Keyboard Accuracy Heatmap</h2>
                    <Card className="overflow-hidden bg-black/20 border-white/10">
                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-purple-500/5 pointer-events-none" />
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Per-Key Performance</CardTitle>
                                    <CardDescription>
                                        Visual representation of your typing accuracy.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" /> Mastered</div>
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" /> Good</div>
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" /> Problem</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 flex justify-center overflow-x-auto">
                            <KeyboardHeatmap />
                        </CardContent>
                    </Card>
                </section>

                {/* Problem Keys Summary */}
                {Object.keys(keyStats).length > 0 && (
                    <section>
                        <Card className="border-red-500/20 bg-red-500/5">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                            Needs Improvement
                                        </CardTitle>
                                        <CardDescription>
                                            Keys with lowest accuracy (min. 5 attempts)
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(keyStats)
                                        .filter(([, stat]) => stat.totalAttempts >= 5)
                                        .map(([key, stat]) => ({
                                            key,
                                            accuracy: ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100
                                        }))
                                        .filter(k => k.accuracy < 90)
                                        .sort((a, b) => a.accuracy - b.accuracy)
                                        .slice(0, 8)
                                        .map(({ key, accuracy }) => (
                                            <Badge
                                                key={key}
                                                variant="outline"
                                                className={cn(
                                                    "text-base px-3 py-1.5",
                                                    getAccuracyColor(accuracy)
                                                )}
                                            >
                                                {key.toUpperCase()}: {accuracy.toFixed(0)}%
                                            </Badge>
                                        ))
                                    }
                                    {Object.keys(keyStats).length > 0 && Object.entries(keyStats).filter(([, s]) => s.totalAttempts >= 5 && (((s.totalAttempts - s.errors) / s.totalAttempts) * 100) < 90).length === 0 && (
                                        <div className="flex items-center gap-2 text-green-400">
                                            <Trophy className="w-5 h-5" />
                                            <span>No weak keys found! You are doing great.</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}
            </main>
        </div>
    );
}
