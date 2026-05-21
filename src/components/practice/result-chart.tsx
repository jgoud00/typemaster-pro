'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

interface ResultChartProps {
    data: { timestamp: number; wpm: number; errors: number }[];
    wpm?: number;
    accuracy?: number;
    elapsedTime?: number;
    maxCombo?: number;
    isNewPersonalBest?: boolean;
}

// Animated count-up hook
function useCountUp(target: number, durationMs = 800) {
    const [value, setValue] = useState(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const start = performance.now();
        const tick = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setValue(Math.round(target * eased));
            if (progress < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [target, durationMs]);

    return value;
}

// Circular SVG ring for accuracy
function AccuracyRing({ accuracy }: { accuracy: number }) {
    const radius = 28;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOffset(circumference * (1 - accuracy / 100));
        }, 100);
        return () => clearTimeout(timer);
    }, [accuracy, circumference]);

    return (
        <div className="relative flex items-center justify-center">
            <svg width={72} height={72} viewBox="0 0 72 72">
                {/* Track */}
                <circle
                    cx={36} cy={36} r={radius}
                    fill="none"
                    stroke="var(--color-border-subtle)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress */}
                <circle
                    cx={36} cy={36} r={radius}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 36 36)"
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
                />
            </svg>
            <span
                className="absolute text-sm font-bold font-mono"
                style={{ color: 'var(--color-content-primary)' }}
            >
                {accuracy}%
            </span>
        </div>
    );
}

export function ResultChart({
    data,
    wpm = 0,
    accuracy = 100,
    elapsedTime = 0,
    maxCombo = 0,
    isNewPersonalBest = false,
}: Readonly<ResultChartProps>) {
    const animatedWpm = useCountUp(wpm, 800);

    if (!data || data.length === 0) return null;

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
    };

    return (
        <div className="flex flex-col gap-6">
            {/* ── Score Hero ───────────────────────────────────────────────── */}
            <div
                className="rounded-2xl p-6 flex flex-col items-center gap-4"
                style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border-subtle)' }}
            >
                {/* Personal best banner */}
                <AnimatePresence>
                    {isNewPersonalBest && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm"
                            style={{
                                background: 'color-mix(in srgb, var(--color-warning) 15%, transparent)',
                                border: '1px solid color-mix(in srgb, var(--color-warning) 40%, transparent)',
                                color: 'var(--color-warning)',
                            }}
                        >
                            🏆 New Personal Best!
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* WPM + Accuracy Ring */}
                <div className="flex items-center justify-center gap-10">
                    {/* Animated WPM */}
                    <div className="flex flex-col items-center gap-1">
                        <motion.span
                            className="font-display font-bold leading-none tabular-nums"
                            style={{ fontSize: '4rem', color: 'var(--color-content-primary)' }}
                        >
                            {animatedWpm}
                        </motion.span>
                        <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-content-muted)' }}>
                            WPM
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="h-16 w-px" style={{ background: 'var(--color-border-subtle)' }} />

                    {/* Accuracy ring */}
                    <div className="flex flex-col items-center gap-1">
                        <AccuracyRing accuracy={accuracy} />
                        <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-content-muted)' }}>
                            Accuracy
                        </span>
                    </div>
                </div>

                {/* Stats pill row */}
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {[
                        { label: 'Speed', value: `${wpm} WPM` },
                        { label: 'Accuracy', value: `${accuracy}%` },
                        { label: 'Time', value: formatTime(elapsedTime) },
                        { label: 'Best Combo', value: `×${maxCombo}` },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border-subtle)',
                            }}
                        >
                            <span style={{ color: 'var(--color-content-muted)' }}>{label}</span>
                            <span className="font-mono font-bold" style={{ color: 'var(--color-content-primary)' }}>
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Performance Chart ─────────────────────────────────────────── */}
            <div
                className="rounded-2xl p-4"
                style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border-subtle)' }}
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-semibold text-base" style={{ color: 'var(--color-content-primary)' }}>
                        Performance Trend
                    </span>
                    <div className="flex gap-4 text-xs" style={{ color: 'var(--color-content-muted)' }}>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'var(--color-primary)' }} />
                            Speed (WPM)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'var(--color-error)' }} />
                            Errors
                        </span>
                    </div>
                </div>

                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-error)" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="var(--color-error)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                            <XAxis
                                dataKey="timestamp"
                                stroke="var(--color-content-muted)"
                                fontSize={11}
                                tickFormatter={(_val, index) => `${index * 5}s`}
                                tick={{ fill: 'var(--color-content-muted)' }}
                            />
                            <YAxis
                                stroke="var(--color-content-muted)"
                                fontSize={11}
                                domain={[0, 'auto']}
                                tick={{ fill: 'var(--color-content-muted)' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border-subtle)',
                                    borderRadius: '10px',
                                    color: 'var(--color-content-primary)',
                                    fontSize: '12px',
                                }}
                                itemStyle={{ color: 'var(--color-content-primary)' }}
                                labelStyle={{ color: 'var(--color-content-secondary)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="wpm"
                                stroke="var(--color-primary)"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorWpm)"
                            />
                            <Line
                                type="monotone"
                                dataKey="errors"
                                stroke="var(--color-error)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

interface WeaknessAnalysisProps {
    errorBreakdown: Map<string, number>;
}

export function WeaknessAnalysis({ errorBreakdown }: Readonly<WeaknessAnalysisProps>) {
    const sortedErrors = Array.from(errorBreakdown.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (sortedErrors.length === 0) return null;

    return (
        <div
            className="rounded-2xl p-5"
            style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border-subtle)' }}
        >
            <h3
                className="font-display font-semibold text-base mb-4"
                style={{ color: 'var(--color-content-primary)' }}
            >
                Key Weaknesses
            </h3>
            <div className="space-y-3">
                {sortedErrors.map(([char, count], index) => (
                    <motion.div
                        key={char}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.25 }}
                        className="flex items-center gap-4 border-l-2 rounded-r-lg px-4 py-2"
                        style={{
                            borderColor: 'var(--color-error)',
                            background: 'color-mix(in srgb, var(--color-surface-elevated) 90%, var(--color-error) 10%)',
                        }}
                    >
                        <div
                            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg font-mono text-lg font-bold"
                            style={{
                                background: 'color-mix(in srgb, var(--color-error) 20%, transparent)',
                                color: 'var(--color-error)',
                                border: '1px solid color-mix(in srgb, var(--color-error) 30%, transparent)',
                            }}
                        >
                            {char === ' ' ? '␣' : char}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1.5">
                                <span style={{ color: 'var(--color-content-muted)' }}>Missed {count} times</span>
                            </div>
                            <div
                                className="h-1.5 rounded-full overflow-hidden"
                                style={{ background: 'var(--color-surface)' }}
                            >
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: 'color-mix(in srgb, var(--color-error) 60%, transparent)' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (count / 5) * 100)}%` }}
                                    transition={{ delay: index * 0.08 + 0.1, duration: 0.4, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
