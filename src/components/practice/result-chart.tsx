'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceRecord } from '@/types';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { motion } from 'framer-motion';

interface ResultChartProps {
    data: { timestamp: number; wpm: number; errors: number }[];
}

export function ResultChart({ data }: Pick<ResultChartProps, 'data'>) {
    if (!data || data.length === 0) return null;

    return (
        <Card className="col-span-1 md:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Performance Trend</span>
                    <div className="flex gap-4 text-sm font-normal">
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-400" />
                            Speed (WPM)
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            Errors
                        </span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis
                                dataKey="timestamp"
                                stroke="#ffffff50"
                                fontSize={12}
                                tickFormatter={(val, index) => `${index * 5}s`}
                            />
                            <YAxis
                                stroke="#ffffff50"
                                fontSize={12}
                                domain={[0, 'auto']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(23, 23, 23, 0.9)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="wpm"
                                stroke="#60a5fa"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorWpm)"
                            />
                            <Line
                                type="monotone"
                                dataKey="errors"
                                stroke="#f87171"
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

interface WeaknessAnalysisProps {
    errorBreakdown: Map<string, number>;
}

export function WeaknessAnalysis({ errorBreakdown }: WeaknessAnalysisProps) {
    const sortedErrors = Array.from(errorBreakdown.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (sortedErrors.length === 0) return null;

    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
                <CardTitle>Key Weaknesses</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedErrors.map(([char, count], index) => (
                        <motion.div
                            key={char}
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 text-red-400 font-mono text-lg font-bold border border-red-500/30">
                                {char === ' ' ? '␣' : char}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">Missed {count} times</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-red-500/50"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (count / 5) * 100)}%` }} // Scale relative to 5 errors? Just visual
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
