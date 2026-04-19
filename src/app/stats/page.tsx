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
    BrainCircuit,
    Download,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PersonalRecordsDashboard } from '@/components/stats/PersonalRecordsDashboard';
import { FatigueCurveGraph } from '@/components/analytics/FatigueCurveGraph';
import { generateProgressPDF } from '@/lib/pdf-export';
import { generateWeeklySummary } from '@/lib/algorithms/ai-summary-generator';
import { FingerHeatmap } from '@/components/keyboard/FingerHeatmap';

// Lazy load Recharts components
const PerformanceSection = dynamic(() => import('@/components/stats/PerformanceSection'), {
    loading: () => <div className="h-[400px] w-full bg-muted/10 animate-pulse rounded-xl" />,
    ssr: false, // Charts are client-only
});
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
const KeyboardHeatmap = dynamic(() => import('@/components/stats/KeyboardHeatmap').then(mod => mod.KeyboardHeatmap), { ssr: false });
const FingerFatigueDashboard = dynamic(() => import('@/components/analytics/FingerFatigueDashboard').then(mod => mod.FingerFatigueDashboard), { ssr: false });
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
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="text-purple-500 hover:text-purple-600 bg-purple-500/10 hover:bg-purple-500/20"
                            onClick={() => router.push('/stats/ai-visualizer')}
                        >
                            <BrainCircuit className="w-4 h-4 mr-2" />
                            AI Mind Visualizer
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30"
                            onClick={() => setShowResetModal(true)}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Stats
                        </Button>
                        <Button
                            onClick={() => generateProgressPDF()}
                            variant="secondary"
                            size="sm"
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* AI Summary Card */}
                <section>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="bg-primary/5 border-primary/20 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <BrainCircuit className="w-5 h-5 text-primary" /> 
                                    AI Weekly Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    {generateWeeklySummary()}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </section>
                {/* Overview Dashboards */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Personal Best Records</h2>
                    <PersonalRecordsDashboard />
                </section>



                {/* Finger Fatigue & Health */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Physiological & Biometric Insights</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FingerHeatmap />
                        <Card className="bg-black/20 border-white/10 shadow-2xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary" />
                                    Session Fatigue Curve
                                </CardTitle>
                                <CardDescription>Tracking WPM and Accuracy decay over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FatigueCurveGraph />
                            </CardContent>
                        </Card>
                    </div>
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
