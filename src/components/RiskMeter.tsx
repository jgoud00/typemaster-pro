'use client';

import React, { useEffect, useState } from 'react';
import { useTypingStore } from '@/stores/typing-store';

export function RiskMeter() {
    const riskLevel = useTypingStore(s => s.state.riskLevel);
    // Smooth visual transition
    const [displayRisk, setDisplayRisk] = useState(0);

    useEffect(() => {
        // Animate towards the target risk
        const timer = requestAnimationFrame(() => {
            setDisplayRisk(prev => prev + (riskLevel - prev) * 0.1);
        });
        return () => cancelAnimationFrame(timer);
    }, [riskLevel]);

    // Determine color based on risk
    const getColor = (risk: number) => {
        if (risk < 0.3) return 'bg-emerald-500'; // Safe
        if (risk < 0.7) return 'bg-yellow-500';  // Caution
        return 'bg-rose-500';                    // Danger
    };

    const widthPercent = Math.min(100, Math.max(0, displayRisk * 100));

    return (
        <div className="w-full max-w-md mx-auto mb-4" aria-label={`Risk Level: ${Math.round(displayRisk * 100)}%`}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                <span>Safe</span>
                <span>Caution</span>
                <span>Danger</span>
            </div>
            <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden relative">
                {/* Background Zones (Optional) */}
                <div className="absolute inset-0 flex opacity-20">
                    <div className="w-[30%] bg-emerald-500/20" />
                    <div className="w-[40%] bg-yellow-500/20" />
                    <div className="w-[30%] bg-rose-500/20" />
                </div>

                {/* Active Bar */}
                <div
                    className={`h-full transition-all duration-300 ease-out ${getColor(displayRisk)}`}
                    style={{ width: `${widthPercent}%` }}
                />

                {/* Pulse Effect at High Risk */}
                {displayRisk > 0.7 && (
                    <div className="absolute inset-0 bg-rose-500/20 animate-pulse" />
                )}
            </div>

            {/* Contextual Message */}
            <div className="mt-1 text-center h-5">
                {displayRisk > 0.8 && (
                    <span className="text-xs text-rose-500 font-bold animate-pulse">Slow Down! High Error Risk</span>
                )}
            </div>
        </div>
    );
}
