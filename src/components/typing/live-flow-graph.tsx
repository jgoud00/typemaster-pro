'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface HistoryPoint {
    timestamp: number;
    wpm: number;
    errors: number;
}

// Pre-computed color maps — no object allocation inside render.
const TREND_STROKE: Record<string, string> = {
    rising: 'stroke-teal-400',
    falling: 'stroke-rose-400',
    stable: 'stroke-gray-500',
};
const TREND_FILL: Record<string, string> = {
    rising: 'fill-teal-400/10',
    falling: 'fill-rose-400/10',
    stable: 'fill-gray-500/5',
};

export function LiveFlowGraph({
    history,
    trend,
}: Readonly<{
    history: HistoryPoint[];
    trend: 'rising' | 'falling' | 'stable';
}>) {
    // Smoothed WPM values — moving average window=3.
    const smoothedData = useMemo(() => {
        const out = new Array<number>(history.length);
        for (let i = 0; i < history.length; i++) {
            if (i < 2) { out[i] = history[i].wpm; continue; }
            out[i] = (history[i - 2].wpm + history[i - 1].wpm + history[i].wpm) / 3;
        }
        return out;
    }, [history]);

    const width = 200;
    const height = 40;
    const lastIdx = smoothedData.length - 1;

    // Memoize expensive SVG string construction.
    const { linePoints, areaPoints, lastY } = useMemo(() => {
        if (smoothedData.length < 2) {
            return { linePoints: '', areaPoints: '', lastY: 0 };
        }
        let maxWpm = 100;
        for (let i = 0; i < smoothedData.length; i++) {
            if (smoothedData[i] > maxWpm) maxWpm = smoothedData[i];
        }
        const pts: string[] = new Array(smoothedData.length);
        for (let i = 0; i < smoothedData.length; i++) {
            const x = (i / lastIdx) * width;
            const y = height - (smoothedData[i] / maxWpm) * height;
            pts[i] = `${x},${y}`;
        }
        const line = pts.join(' ');
        const lY = height - ((smoothedData[lastIdx] ?? 0) / maxWpm) * height;
        return {
            linePoints: line,
            areaPoints: `${line} ${width},${height} 0,${height}`,
            lastY: lY,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smoothedData]);

    if (smoothedData.length < 2) return null;

    const strokeClass = TREND_STROKE[trend] ?? TREND_STROKE.stable;
    const fillClass = TREND_FILL[trend] ?? TREND_FILL.stable;

    return (
        // opacity-50 on the container collapses repaint to a single composite layer.
        <div className="relative h-10 w-[200px] opacity-50">
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible"
                aria-hidden="true"
            >
                {/* Area fill — plain polyline, no Framer subscription. */}
                <polyline
                    fill="none"
                    points={areaPoints}
                    className={fillClass}
                />

                {/* Line — plain polyline. */}
                <polyline
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={linePoints}
                    className={strokeClass}
                />

                {/* Current point indicator. */}
                <circle
                    cx={width}
                    cy={lastY}
                    r="3"
                    className={cn(strokeClass, 'fill-background')}
                    strokeWidth="2"
                />
            </svg>
        </div>
    );
}
