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
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { cn } from '@/lib/utils';

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

    // Generate mock chart data from records (in real app, this would come from stored history)
    const wpmData = progress.records?.slice(-30).map((record, i) => ({
        session: i + 1,
        wpm: record.wpm,
        accuracy: record.accuracy,
        date: new Date(record.timestamp).toLocaleDateString(),
    })) || [];

    // If no records, create sample progression data
    const chartData = wpmData.length > 0 ? wpmData : [
        { session: 1, wpm: 25, accuracy: 85, date: 'Start' },
        { session: 2, wpm: 28, accuracy: 87, date: '' },
        { session: 3, wpm: 30, accuracy: 88, date: '' },
        { session: 4, wpm: 32, accuracy: 90, date: '' },
        { session: 5, wpm: 35, accuracy: 91, date: 'Now' },
    ];

    // Practice distribution data (mock - would track in real app)
    const practiceDistribution = [
        { mode: 'Lessons', hours: Math.round(totalTimeSeconds * 0.4 / 3600 * 10) / 10, fill: '#3b82f6' },
        { mode: 'Free Practice', hours: Math.round(totalTimeSeconds * 0.25 / 3600 * 10) / 10, fill: '#22c55e' },
        { mode: 'Speed Tests', hours: Math.round(totalTimeSeconds * 0.2 / 3600 * 10) / 10, fill: '#f59e0b' },
        { mode: 'Speed Training', hours: Math.round(totalTimeSeconds * 0.15 / 3600 * 10) / 10, fill: '#8b5cf6' },
    ];

    // Get key stats for heatmap
    const getKeyStats = (key: string) => {
        const stat = keyStats[key];
        if (!stat || stat.totalAttempts < 5) {
            return null;
        }
        const accuracy = ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100;
        return {
            key,
            presses: stat.totalAttempts,
            errors: stat.errors,
            accuracy: Math.round(accuracy * 10) / 10,
            hesitation: Math.round(stat.averageSpeed),
        };
    };

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
            <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-40">
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
                </section>

                {/* Performance Charts */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Performance Trends</h2>
                    <Tabs defaultValue="wpm" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="wpm" className="gap-2">
                                <TrendingUp className="w-4 h-4" />
                                WPM Progress
                            </TabsTrigger>
                            <TabsTrigger value="accuracy" className="gap-2">
                                <Target className="w-4 h-4" />
                                Accuracy
                            </TabsTrigger>
                            <TabsTrigger value="distribution" className="gap-2">
                                <Activity className="w-4 h-4" />
                                Practice Time
                            </TabsTrigger>
                        </TabsList>

                        {/* WPM Progress Chart */}
                        <TabsContent value="wpm">
                            <Card>
                                <CardHeader>
                                    <CardTitle>WPM Progress</CardTitle>
                                    <CardDescription>Your typing speed over recent sessions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="wpmGradient" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#3b82f6" />
                                                        <stop offset="100%" stopColor="#22c55e" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                                <XAxis
                                                    dataKey="session"
                                                    tick={{ fontSize: 12 }}
                                                    className="text-muted-foreground"
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{ fontSize: 12 }}
                                                    className="text-muted-foreground"
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--card))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '8px',
                                                    }}
                                                    formatter={(value) => [`${value} WPM`, 'Speed']}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="wpm"
                                                    stroke="url(#wpmGradient)"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                                                    activeDot={{ r: 6, fill: '#22c55e' }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Accuracy Trends Chart */}
                        <TabsContent value="accuracy">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Accuracy Trends</CardTitle>
                                    <CardDescription>Your typing accuracy over recent sessions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                                                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                                <XAxis
                                                    dataKey="session"
                                                    tick={{ fontSize: 12 }}
                                                    className="text-muted-foreground"
                                                />
                                                <YAxis
                                                    domain={[60, 100]}
                                                    tick={{ fontSize: 12 }}
                                                    className="text-muted-foreground"
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--card))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '8px',
                                                    }}
                                                    formatter={(value) => [`${value}%`, 'Accuracy']}
                                                />
                                                <ReferenceLine
                                                    y={95}
                                                    stroke="#f59e0b"
                                                    strokeDasharray="5 5"
                                                    label={{ value: 'Target 95%', fill: '#f59e0b', fontSize: 12 }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="accuracy"
                                                    stroke="#22c55e"
                                                    strokeWidth={2}
                                                    fill="url(#accuracyGradient)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Practice Distribution Chart */}
                        <TabsContent value="distribution">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Practice Distribution</CardTitle>
                                    <CardDescription>Time spent in each practice mode</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={practiceDistribution} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                                <YAxis
                                                    type="category"
                                                    dataKey="mode"
                                                    tick={{ fontSize: 12 }}
                                                    width={100}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--card))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '8px',
                                                    }}
                                                    formatter={(value) => [`${value} hours`, 'Time']}
                                                />
                                                <Bar
                                                    dataKey="hours"
                                                    radius={[0, 4, 4, 0]}
                                                    fill="#3b82f6"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>

                {/* Keyboard Heatmap */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Keyboard Accuracy Heatmap</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Per-Key Performance</CardTitle>
                            <CardDescription>
                                Hover over keys to see detailed statistics. Colors indicate accuracy level.
                            </CardDescription>
                            <div className="flex gap-4 mt-2">
                                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                                    95%+ Mastered
                                </Badge>
                                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                                    85-95% Good
                                </Badge>
                                <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                                    70-85% Needs Work
                                </Badge>
                                <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50">
                                    &lt;70% Problem
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center gap-2 py-4">
                                {KEYBOARD_ROWS.map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className="flex gap-1"
                                        style={{ marginLeft: rowIndex * 20 }}
                                    >
                                        {row.map((key) => {
                                            const stats = getKeyStats(key);
                                            const accuracy = stats?.accuracy ?? null;
                                            const colorClass = getAccuracyColor(accuracy);

                                            return (
                                                <motion.div
                                                    key={key}
                                                    className={cn(
                                                        "relative w-12 h-12 rounded-lg border-2 flex items-center justify-center",
                                                        "font-mono text-lg font-bold cursor-pointer transition-all",
                                                        colorClass,
                                                        hoveredKey === key && "scale-110 z-10 shadow-lg"
                                                    )}
                                                    onMouseEnter={() => setHoveredKey(key)}
                                                    onMouseLeave={() => setHoveredKey(null)}
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {key.toUpperCase()}

                                                    {/* Tooltip on hover */}
                                                    {hoveredKey === key && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="absolute -top-24 left-1/2 -translate-x-1/2 z-20
                                         bg-popover border rounded-lg shadow-xl p-3 min-w-[140px]"
                                                        >
                                                            <div className="text-center space-y-1">
                                                                <div className="text-xl font-bold">{key.toUpperCase()}</div>
                                                                {stats ? (
                                                                    <>
                                                                        <div className="text-sm">
                                                                            <span className="text-muted-foreground">Presses:</span>{' '}
                                                                            {stats.presses}
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            <span className="text-muted-foreground">Errors:</span>{' '}
                                                                            {stats.errors}
                                                                        </div>
                                                                        <div className="text-sm font-semibold">
                                                                            <span className="text-muted-foreground">Accuracy:</span>{' '}
                                                                            {stats.accuracy}%
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            Avg: {stats.hesitation}ms
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        Not enough data
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Arrow */}
                                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                                            w-4 h-4 bg-popover border-b border-r 
                                            rotate-45 -z-10" />
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ))}

                                {/* Spacebar */}
                                <div className="flex gap-1 mt-1">
                                    <div className={cn(
                                        "w-64 h-12 rounded-lg border-2 flex items-center justify-center",
                                        "font-mono text-sm text-muted-foreground bg-muted/50"
                                    )}>
                                        SPACE
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Problem Keys Summary */}
                {Object.keys(keyStats).length > 0 && (
                    <section>
                        <Card>
                            <CardHeader>
                                <CardTitle>Keys to Focus On</CardTitle>
                                <CardDescription>
                                    These keys have the lowest accuracy and need more practice
                                </CardDescription>
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
                                                    "text-lg px-4 py-2",
                                                    getAccuracyColor(accuracy)
                                                )}
                                            >
                                                {key.toUpperCase()}: {accuracy.toFixed(0)}%
                                            </Badge>
                                        ))
                                    }
                                    {Object.keys(keyStats).length === 0 && (
                                        <p className="text-muted-foreground">
                                            Start practicing to see key analysis!
                                        </p>
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
