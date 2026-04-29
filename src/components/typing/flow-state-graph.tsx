import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

interface FlowStateGraphProps {
    data: number[]; // WPM samples
    flowScore?: number;
    maxLength?: number;
}

export const FlowStateGraph = memo(function FlowStateGraph({ data, flowScore = 0, maxLength = 20 }: FlowStateGraphProps) {
    const samples = useMemo(() => {
        let smoothed = data.slice(-maxLength);
        // Window 3 moving average for smoothing
        return smoothed.map((v, i, a) => {
            if (i < 2) return v;
            return (a[i-2] + a[i-1] + v) / 3;
        });
    }, [data, maxLength]);

    const { path, isRising, lastPoint, maxPoint } = useMemo(() => {
        if (samples.length === 0) return { path: '', isRising: true, lastPoint: {x:0, y:0}, maxPoint: {x:0, y:0} };
        if (samples.length === 1) {
            const p = { x: 50, y: 20, wpm: samples[0] };
            return { path: `M 0,20 L 100,20`, isRising: true, lastPoint: p, maxPoint: p };
        }
        
        const maxWpm = Math.max(...samples, 50);
        const minWpm = Math.max(0, Math.min(...samples) - 10);
        const range = maxWpm - minWpm || 1;
        
        const points = samples.map((wpm, i) => {
            const x = (i / (maxLength - 1)) * 100;
            const y = 40 - ((wpm - minWpm) / range) * 40;
            return { x, y, wpm };
        });

        // Reduce jitter by ignoring < 1 WPM changes for trend direction
        const last = points[points.length - 1];
        const prev = points[points.length - 2];
        const isRising = (last.wpm - prev.wpm) > -1;

        // Detect peak WPM point
        let maxPoint = points[0];
        points.forEach(p => { if (p.wpm > maxPoint.wpm) maxPoint = p; });

        return { 
            path: points.length > 0 ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` : '', 
            isRising, 
            lastPoint: last,
            maxPoint
        };
    }, [samples, maxLength]);

    if (samples.length < 1) return null;

    // Task 3: Adaptive color system based on flowScore
    const strokeColor = flowScore >= 80 ? "var(--color-primary)" : 
                        flowScore >= 60 ? "var(--color-secondary)" : 
                        "var(--color-destructive)";

    // Task 2: Graph + Score sync (Opacity mapped to flow score)
    const containerOpacity = Math.max(0.2, flowScore / 100);
    const flowLabel = flowScore >= 80 ? "Flow" : flowScore >= 60 ? "Stable" : "Unstable";

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-12 flex flex-col items-center pointer-events-none mix-blend-screen transition-opacity duration-300" style={{ opacity: containerOpacity }}>
            {/* Task 6: Flow state indicator */}
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1" style={{ color: strokeColor }}>
                {flowLabel}
            </span>
            <div className="w-full h-8 relative">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="fadeTail" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0" />
                        <stop offset="50%" stopColor={strokeColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity="1" />
                    </linearGradient>
                </defs>
                {/* Baseline reference */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 2" />
                
                <motion.path
                    d={path}
                    fill="none"
                    stroke="url(#fadeTail)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ d: path }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    style={{ filter: flowScore >= 80 ? `drop-shadow(0 0 4px ${strokeColor})` : 'none' }}
                />
                
                {/* Task 5: Peak detection highlight */}
                <motion.circle
                    cx={maxPoint.x ?? 0}
                    cy={maxPoint.y ?? 0}
                    r="1.5"
                    fill="white"
                    opacity="0.5"
                />

                {/* Current point marker */}
                <motion.circle
                    cx={lastPoint.x ?? 0}
                    cy={lastPoint.y ?? 0}
                    r="2"
                    fill={strokeColor}
                    animate={{ cx: lastPoint.x ?? 0, cy: lastPoint.y ?? 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className={flowScore >= 80 ? "animate-pulse" : ""}
                />
            </svg>
            </div>
        </div>
    );
});
