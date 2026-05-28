'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    RotateCcw,
    AlertTriangle,
    Zap,
    Target,
    Clock,
    Flame,
    ChevronDown,
    Activity,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { cn } from '@/lib/utils';

const PerformanceSection = dynamic(() => import('@/components/stats/PerformanceSection'), {
    loading: () => <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-xl" />,
    ssr: false,
});
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { AICoach } from '@/components/stats/AICoach';

const KeyboardHeatmap = dynamic(
    () => import('@/components/stats/KeyboardHeatmap').then(mod => mod.KeyboardHeatmap),
    { ssr: false }
);

type Timeframe = '7D' | '30D' | 'All';

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

interface SummaryCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    accentColor: string;
}

function SummaryCard({ label, value, icon, accentColor }: SummaryCardProps) {
    return (
        <div
            className="relative rounded-2xl p-5 overflow-hidden glass-subtle border border-white/[0.06] transition-all duration-300 hover:border-white/[0.12]"
            style={{
                boxShadow: `0 0 30px ${accentColor}12, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
        >
            {/* Glowing top accent */}
            <div
                className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}90, transparent)` }}
            />
            {/* Ambient corner glow */}
            <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)` }}
            />

            <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-bold mb-2">{label}</p>
                    <p className="text-3xl font-black font-mono text-white leading-none truncate">{value}</p>
                </div>
                <div className="mt-0.5 shrink-0 p-2 rounded-xl" style={{ color: accentColor, background: `${accentColor}15` }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function StatsPage() {
    const router = useRouter();
    const { progress, resetProgress } = useProgressStore();
    const game = useGameStore(s => s.game);
    const resetSession = useGameStore(s => s.resetSession);
    const { keyStats, clearSession } = useAnalyticsStore();

    const [showResetModal, setShowResetModal] = useState(false);
    const [timeframe, setTimeframe] = useState<Timeframe>('30D');
    const [dangerOpen, setDangerOpen] = useState(false);

    const handleResetStats = () => {
        resetProgress();
        resetSession();
        clearSession();
        setShowResetModal(false);
        if (globalThis.window !== undefined) {
            globalThis.localStorage.removeItem('ngram-analytics');
            globalThis.localStorage.removeItem('analytics-store');
        }
        router.refresh();
    };

    const totalTimeSeconds = progress.totalPracticeTime || 0;
    const totalKeystrokes = progress.totalKeystrokes || 0;
    const hasPracticeData = totalTimeSeconds > 0;

    const wpmData = progress.records?.slice(-30).map((record, i) => ({
        session: i + 1,
        wpm: record.wpm,
        accuracy: record.accuracy,
        date: new Date(record.timestamp).toLocaleDateString(),
    })) || [];

    const HEATMAP_LEGEND = [
        { color: 'var(--color-success)', label: 'Fast' },
        { color: '#84CC16', label: '' },
        { color: 'var(--color-warning)', label: '' },
        { color: '#F97316', label: '' },
        { color: 'var(--color-error)', label: 'Slow' },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        role="button"
                        tabIndex={0}
                        aria-label="Close modal"
                        onClick={() => setShowResetModal(false)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowResetModal(false); }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 glass-card rounded-xl p-6 max-w-md mx-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-red-500/20">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Reset All Statistics?</h3>
                        </div>
                        <p className="text-zinc-400 mb-4">
                            This will permanently delete all your progress, including:
                        </p>
                        <ul className="text-sm text-zinc-500 mb-6 space-y-1.5">
                            <li>• Completed lessons and scores</li>
                            <li>• Personal best records (WPM, accuracy, combo)</li>
                            <li>• Practice time and keystroke history</li>
                            <li>• Daily streak and achievements</li>
                        </ul>
                        <p className="text-sm text-red-500 mb-6 font-medium">
                            ⚠️ This action cannot be undone!
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowResetModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleResetStats}>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset Everything
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            <SiteHeader />

            <main className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
                {/* ── ZONE 1: Summary Row ── */}
                <section>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <SummaryCard
                            label="Best WPM"
                            value={hasPracticeData ? (progress.personalBests?.wpm || 0) : '-'}
                            icon={<Zap className="w-5 h-5" />}
                            accentColor="var(--color-primary)"
                        />
                        <SummaryCard
                            label="Best Accuracy"
                            value={hasPracticeData ? `${progress.personalBests?.accuracy || 0}%` : '-'}
                            icon={<Target className="w-5 h-5" />}
                            accentColor="var(--color-success)"
                        />
                        <SummaryCard
                            label="Total Practice"
                            value={hasPracticeData ? formatTime(totalTimeSeconds) : '-'}
                            icon={<Clock className="w-5 h-5" />}
                            accentColor="#EAB308"
                        />
                        <SummaryCard
                            label="Daily Streak"
                            value={hasPracticeData ? `${game.dailyStreak ?? 0}d` : '-'}
                            icon={<Flame className="w-5 h-5" />}
                            accentColor="#F97316"
                        />
                    </div>
                </section>

                {/* ── ZONE 1.5: AI Coach ── */}
                <section>
                    <AICoach hasData={hasPracticeData} />
                </section>

                {/* ── ZONE 2: Charts ── */}
                <section>
                    <div className="relative rounded-2xl glass-glow p-6 space-y-5 overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="font-display text-lg font-bold text-white">
                                Performance Over Time
                            </h2>
                            {/* Timeframe toggle */}
                            <div className="flex items-center gap-1 p-1 rounded-xl glass-subtle border border-white/[0.07]">
                                {(['7D', '30D', 'All'] as Timeframe[]).map((tf) => (
                                    <button
                                        key={tf}
                                        onClick={() => setTimeframe(tf)}
                                        className={cn(
                                            'px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150',
                                            timeframe === tf
                                                ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'text-zinc-500 hover:text-zinc-300'
                                        )}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <PerformanceSection
                            wpmData={wpmData}
                            hasPracticeData={hasPracticeData}
                            totalTimeSeconds={totalTimeSeconds}
                            totalKeystrokes={totalKeystrokes}
                            sessionsCount={progress.records?.length || 0}
                            completedLessonsCount={progress.completedLessons?.length || 0}
                        />
                    </div>
                </section>

                {/* ── ZONE 3: Keyboard Heatmap ── */}
                <section>
                    <div className="relative rounded-2xl glass-glow p-6 space-y-4 overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div>
                            <h2 className="font-display text-lg font-bold text-white">
                                Key Accuracy Heatmap
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Keys colored by your error rate — red = most errors
                            </p>
                        </div>

                        <div className="flex justify-center overflow-x-auto py-2">
                            <KeyboardHeatmap />
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                            {HEATMAP_LEGEND.map(({ color, label }, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <span
                                        className="w-4 h-4 rounded-sm inline-block shrink-0"
                                        style={{ backgroundColor: color }}
                                    />
                                    {label && (
                                        <span className="text-xs text-(--color-content-muted)">{label}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Danger Zone ── */}
                <section className="flex justify-end">
                    <div className="w-full max-w-sm">
                        <button
                            onClick={() => setDangerOpen(o => !o)}
                            className="flex items-center gap-2 text-xs uppercase tracking-widest text-(--color-content-muted) hover:text-(--color-content-secondary) transition-colors"
                        >
                            <span>Danger Zone</span>
                            <motion.span animate={{ rotate: dangerOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown className="w-3.5 h-3.5" />
                            </motion.span>
                        </button>
                        <AnimatePresence>
                            {dangerOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-3 flex justify-end">
                                        <Button
                                            variant="ghost"
                                            className="text-(--color-error) hover:bg-(--color-error)/10 hover:text-(--color-error)"
                                            onClick={() => setShowResetModal(true)}
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Reset All Statistics
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    );
}
