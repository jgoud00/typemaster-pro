'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    Keyboard,
    Trophy,
    Flame,
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

// Lazy load Recharts components
const PerformanceSection = dynamic(() => import('@/components/stats/PerformanceSection'), {
    loading: () => <div className="h-[400px] w-full bg-muted/10 animate-pulse rounded-xl" />,
    ssr: false, // Charts are client-only
});
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { KeyboardHeatmap } from '@/components/stats/KeyboardHeatmap';
import { FingerFatigueDashboard } from '@/components/analytics/FingerFatigueDashboard';
import { cn } from '@/lib/utils';
import { mean, median, standardDeviation, consistencyScore } from '@/lib/algorithms/statistics';

// Format large numbers with commas
function formatNumber(num: number): string {
    return num.toLocaleString();
}

// Format time from seconds to hours and minutes
function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Keyboard layout for heatmap
const KEYBOARD_ROWS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

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
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [showResetModal, setShowResetModal] = useState(false);

    const handleResetStats = () => {
        resetProgress();
        resetGame();
        clearSession();
        setShowResetModal(false);
        // Clear localStorage for analytics
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ngram-analytics');
            localStorage.removeItem('analytics-store');
        }
        router.refresh();
    };

    // Calculate stats
    const totalTimeSeconds = progress.totalPracticeTime || 0;
    const totalKeystrokes = progress.totalKeystrokes || 0;
    const personalBestWpm = progress.personalBests?.wpm || 0;
    const personalBestAccuracy = progress.personalBests?.accuracy || 0;
    const currentStreak = game.dailyStreak || 0;

    // Generate chart data from actual records
    const wpmData = progress.records?.slice(-30).map((record, i) => ({
        session: i + 1,
        wpm: record.wpm,
        accuracy: record.accuracy,
        date: new Date(record.timestamp).toLocaleDateString(),
    })) || [];

    // Use real data only - no fabricated fallback data
    const chartData = wpmData;
    const hasChartData = chartData.length > 0;

    // Practice data check - only show when there's actual data
    const hasPracticeData = totalTimeSeconds > 0;

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
                            <li className="flex items-center gap-2">• Keyboard accuracy heatmap data</li>
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
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Overview Cards */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Practice Time */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 }}
                        >
                            <Card className="bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Practice Time</p>
                                            <p className="text-3xl font-bold mt-1">{formatTime(totalTimeSeconds)}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-blue-500/20">
                                            <Clock className="w-6 h-6 text-blue-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Total Keystrokes */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="bg-green-500/10 border-green-500/20 hover:border-green-500/40 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Keystrokes</p>
                                            <p className="text-3xl font-bold mt-1">{formatNumber(totalKeystrokes)}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-green-500/20">
                                            <Keyboard className="w-6 h-6 text-green-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Personal Best WPM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Best WPM</p>
                                            <p className="text-3xl font-bold mt-1">{personalBestWpm}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {personalBestAccuracy}% accuracy
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-yellow-500/20">
                                            <Trophy className="w-6 h-6 text-yellow-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Current Streak */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className={cn(
                                "border-orange-500/20 hover:border-orange-500/40 transition-colors",
                                currentStreak > 3 ? "bg-orange-500/15" : "bg-orange-500/10"
                            )}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Current Streak</p>
                                            <p className="text-3xl font-bold mt-1">
                                                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
                                                {currentStreak > 3 && ' 🔥'}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-orange-500/20">
                                            <Flame className="w-6 h-6 text-orange-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Advanced Analytics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* Consistency Score */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Consistency Score</p>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <p className="text-3xl font-bold">
                                                    {wpmData.length > 5 ? consistencyScore(wpmData.map(d => d.wpm)) : 'N/A'}
                                                </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Based on WPM variance (SD: {wpmData.length > 5 ? standardDeviation(wpmData.map(d => d.wpm)).toFixed(1) : 0})
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-purple-500/20">
                                            <Activity className="w-6 h-6 text-purple-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Recent Performance Median */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="bg-pink-500/10 border-pink-500/20 hover:border-pink-500/40 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Median Performance</p>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <p className="text-3xl font-bold">
                                                    {wpmData.length > 0 ? median(wpmData.map(d => d.wpm)).toFixed(0) : 0} <span className="text-sm font-normal text-muted-foreground">WPM</span>
                                                </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Excludes outliers (Mean: {wpmData.length > 0 ? mean(wpmData.map(d => d.wpm)).toFixed(1) : 0})
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-pink-500/20">
                                            <BarChart3 className="w-6 h-6 text-pink-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* Finger Fatigue & Health */}
                <section>
                    <FingerFatigueDashboard />
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
                                    <Button size="sm" variant="outline" className="border-red-500/30 hover:bg-red-500/10 text-red-400" onClick={() => router.push('/practice/smart')}>
                                        <Target className="w-4 h-4 mr-2" />
                                        Train Weak Keys
                                    </Button>
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
