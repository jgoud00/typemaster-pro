'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HistoryPoint {
    timestamp: number;
    wpm: number;
    errors: number;
}

export function LiveFlowGraph({ 
    history, 
    trend 
}: { 
    history: HistoryPoint[]; 
    trend: 'rising' | 'falling' | 'stable' 
}) {
    // Smoothing (Moving average, window=3)
    const smoothedData = useMemo(() => {
        return history.map((point, i) => {
            if (i < 2) return point.wpm;
            return (history[i-2].wpm + history[i-1].wpm + point.wpm) / 3;
        });
    }, [history]);

    if (smoothedData.length < 2) return null;

    const maxWpm = Math.max(...smoothedData, 100);
    const width = 200;
    const height = 40;
    
    const points = smoothedData.map((wpm, i) => {
        const x = (i / (smoothedData.length - 1)) * width;
        const y = height - (wpm / maxWpm) * height;
        return `${x},${y}`;
    }).join(' ');

    const trendColor = {
        rising: 'stroke-teal-400',
        falling: 'stroke-magenta-400',
        stable: 'stroke-gray-500'
    }[trend];

    const trendFill = {
        rising: 'fill-teal-400/10',
        falling: 'fill-magenta-400/10',
        stable: 'fill-gray-500/5'
    }[trend];

    return (
        <div className="relative h-10 w-[200px] opacity-50">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                <defs>
                    <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Area under the curve */}
                <motion.polyline
                    fill="none"
                    points={`${points} ${width},${height} 0,${height}`}
                    className={cn(trendFill, "transition-colors duration-500")}
                    initial={false}
                />

                {/* The line */}
                <motion.polyline
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className={cn(trendColor, "transition-colors duration-500")}
                    initial={false}
                />

                {/* Current point indicator */}
                <motion.circle
                    cx={(smoothedData.length - 1) / (smoothedData.length - 1) * width}
                    cy={height - (smoothedData[smoothedData.length - 1] / maxWpm) * height}
                    r="3"
                    className={cn(trendColor, "fill-background")}
                    strokeWidth="2"
                />
            </svg>
        </div>
    );
}
