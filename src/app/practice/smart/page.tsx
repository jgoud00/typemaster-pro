'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingController } from '@/hooks/use-typing-controller';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { generateWeaknessTargetedText, generateAdaptiveText } from '@/lib/practice-texts';
import { ngramAnalyzer } from '@/lib/ngram-analyzer';
import { PerformanceRecord } from '@/types';
import { ArrowRight, RotateCcw, Brain, TrendingDown } from 'lucide-react';

function buildText(problemKeys: string[]): string {
    if (problemKeys.length === 0) return generateAdaptiveText(50, 'medium');
    return generateWeaknessTargetedText(problemKeys, 50);
}

export default function SmartPracticePage() {
    const router = useRouter();

    // Read weak keys synchronously — store is already hydrated from IDB by AnalyticsSyncProvider
    const [problemKeys] = useState<string[]>(() =>
        useAnalyticsStore.getState().getProblematicKeys(80)
    );

    const [text, setText] = useState(() => buildText(problemKeys));
    const [isComplete, setIsComplete] = useState(false);
    const [result, setResult] = useState<PerformanceRecord | null>(null);
    const [slowBigrams, setSlowBigrams] = useState<{ ngram: string; avgTime: number }[]>([]);

    const { reset } = useTypingController({
        text,
        mode: 'free',
        onComplete: (record) => {
            setResult(record);
            setIsComplete(true);
            // Read ngram report on completion — IDB will have loaded by now
            const report = ngramAnalyzer.getReport(3);
            setSlowBigrams(report.slowestBigrams.slice(0, 3).map(b => ({ ngram: b.ngram, avgTime: b.avgTime })));
        },
    });

    const handleRestart = () => {
        const freshKeys = useAnalyticsStore.getState().getProblematicKeys(80);
        setText(buildText(freshKeys));
        reset();
        setIsComplete(false);
        setResult(null);
        setSlowBigrams([]);
    };

    const targetBanner = problemKeys.length > 0
        ? `Targeting: ${problemKeys.slice(0, 8).join(', ')}`
        : 'No weak keys yet — practicing balanced text';

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex flex-col">
            <SiteHeader />

            <main className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center py-12">
                {isComplete && result ? (
                    <div className="glass-card rounded-2xl p-8 max-w-md w-full space-y-8 border border-white/[0.08]">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-5 h-5 text-blue-400" />
                                <h2 className="text-2xl font-bold font-display text-white">Smart Session Done</h2>
                            </div>
                            <p className="text-sm text-(--color-content-muted)">
                                {problemKeys.length > 0
                                    ? `Focused on: ${problemKeys.slice(0, 6).join(', ')}`
                                    : 'Balanced practice session complete'}
                            </p>
                        </div>

                        <div className="flex justify-center gap-12 py-2">
                            <div className="text-center">
                                <div className="text-[10px] uppercase tracking-widest text-(--color-content-muted) font-bold mb-2">WPM</div>
                                <div className="text-5xl font-black text-white font-mono">{result.wpm}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] uppercase tracking-widest text-(--color-content-muted) font-bold mb-2">Accuracy</div>
                                <div className="text-5xl font-black text-white font-mono">{result.accuracy}%</div>
                            </div>
                        </div>

                        {slowBigrams.length > 0 && (
                            <div className="rounded-xl glass-subtle border border-white/[0.06] p-4 space-y-2.5">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Slowest Transitions</span>
                                </div>
                                {(() => {
                                    const max = slowBigrams[0].avgTime;
                                    return slowBigrams.map((b, i) => (
                                        <div key={b.ngram} className="flex items-center gap-3">
                                            <span className="font-mono text-sm font-bold bg-white/[0.07] border border-white/[0.1] rounded px-2 py-0.5 text-white tracking-widest w-10 text-center shrink-0">
                                                {b.ngram}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-amber-400/70"
                                                        style={{ width: `${Math.round((b.avgTime / max) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono text-zinc-400 shrink-0 tabular-nums w-14 text-right">
                                                {Math.round(b.avgTime)}ms
                                            </span>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => router.push('/practice?mode=free')}
                                className="w-full h-12 text-base font-bold group"
                                style={{ background: 'var(--color-primary)', color: '#000' }}
                            >
                                Start Real Practice
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleRestart}
                                className="w-full h-12 text-sm border-white/[0.1] text-zinc-300 hover:bg-white/[0.05]"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Another Smart Session
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-5xl">
                        <div className="mb-10 text-center">
                            <div className="inline-flex items-center gap-2 mb-3">
                                <Brain className="w-5 h-5 text-blue-400" />
                                <h1 className="text-2xl font-bold text-white font-display">Smart Practice</h1>
                            </div>
                            <p className="text-(--color-content-muted) text-sm mb-4">Adaptive text targeting your weakest keys.</p>

                            {/* Targeting banner */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle border border-white/[0.08] text-xs text-zinc-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
                                {targetBanner}
                            </div>
                        </div>

                        <TypingStats totalWords={50} />
                        <TypingArea />
                    </div>
                )}
            </main>
        </div>
    );
}
