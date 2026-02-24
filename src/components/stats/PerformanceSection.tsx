'use client';

import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import {
    TrendingUp,
    Target,
    Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PerformanceSectionProps {
    wpmData: {
        session: number;
        wpm: number;
        accuracy: number;
        date: string;
    }[];
    hasPracticeData: boolean;
    totalTimeSeconds: number;
    totalKeystrokes: number;
    sessionsCount: number;
    completedLessonsCount: number;
}

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

export default function PerformanceSection({
    wpmData,
    hasPracticeData,
    totalTimeSeconds,
    totalKeystrokes,
    sessionsCount,
    completedLessonsCount,
}: PerformanceSectionProps) {
    const hasChartData = wpmData.length > 0;
    const chartData = wpmData;

    return (
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
                            {hasChartData ? (
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
                            ) : (
                                <div className="h-[300px] flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="text-lg font-medium">No data yet</p>
                                        <p className="text-sm">Complete a practice session to see your progress</p>
                                    </div>
                                </div>
                            )}
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
                            {hasChartData ? (
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
                            ) : (
                                <div className="h-[300px] flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="text-lg font-medium">No data yet</p>
                                        <p className="text-sm">Complete a practice session to see your accuracy trends</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Practice Summary */}
                <TabsContent value="distribution">
                    <Card>
                        <CardHeader>
                            <CardTitle>Practice Summary</CardTitle>
                            <CardDescription>Your practice activity overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hasPracticeData ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 rounded-lg bg-blue-500/10">
                                            <p className="text-2xl font-bold text-blue-400">{formatTime(totalTimeSeconds)}</p>
                                            <p className="text-sm text-muted-foreground">Total Practice</p>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-green-500/10">
                                            <p className="text-2xl font-bold text-green-400">{sessionsCount}</p>
                                            <p className="text-sm text-muted-foreground">Sessions</p>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                                            <p className="text-2xl font-bold text-yellow-400">{completedLessonsCount}</p>
                                            <p className="text-sm text-muted-foreground">Lessons Done</p>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-purple-500/10">
                                            <p className="text-2xl font-bold text-purple-400">{formatNumber(totalKeystrokes)}</p>
                                            <p className="text-sm text-muted-foreground">Keystrokes</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="text-lg font-medium">No practice data yet</p>
                                        <p className="text-sm">Start practicing to see your activity summary</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </section>
    );
}
