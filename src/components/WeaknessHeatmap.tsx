'use client';

import React, { useEffect, useState } from 'react';
import { weaknessDetector } from '@/lib/algorithms';
import { UltimateWeaknessResult } from '@/lib/algorithms/ultimate-weakness-detector';

export function WeaknessHeatmap() {
    const [stats, setStats] = useState<UltimateWeaknessResult[]>([]);

    useEffect(() => {
        // Fetch latest stats from the unified detector
        const results = weaknessDetector.analyzeAllKeys();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setStats(results.sort((a, b) => a.key.localeCompare(b.key)));
    }, []);

    const getColor = (accuracy: number, isWeak: boolean) => {
        if (isWeak) return 'bg-rose-500 text-white border-rose-600';
        if (accuracy >= 0.9) return 'bg-emerald-500 text-white border-emerald-600';
        if (accuracy >= 0.7) return 'bg-yellow-500 text-black border-yellow-600';
        return 'bg-slate-200 text-slate-400 border-slate-300 dark:bg-slate-800 dark:text-slate-600'; // No data / Neutral
    };

    if (stats.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground text-sm">
                No typing data yet. Start a lesson to generate insights!
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 bg-card rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🧠</span> Mastery Heatmap
            </h3>

            <div className="grid grid-cols-10 gap-2 sm:gap-3">
                {stats.map((stat) => (
                    <div
                        key={stat.key}
                        className={`
                            aspect-square flex flex-col items-center justify-center rounded-md border
                            transition-all duration-200 hover:scale-110 cursor-default
                            ${getColor(stat.accuracyEstimate, stat.isWeak)}
                        `}
                        title={`Accuracy: ${Math.round(stat.accuracyEstimate * 100)}%\nConfidence: ${Math.round(stat.confidence * 100)}%`}
                    >
                        <span className="text-sm font-bold uppercase">{stat.key}</span>
                        {/* Tiny bar for confidence */}
                        <div className="w-4 h-0.5 bg-black/20 mt-1 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-black/40"
                                style={{ width: `${stat.confidence * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground px-2">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mastered
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Learning
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Weak
                    </span>
                </div>
                <div>Based on Bayesian Confidence</div>
            </div>
        </div>
    );
}
