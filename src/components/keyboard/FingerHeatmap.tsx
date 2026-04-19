'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWeaknessDetectorWorker } from '@/hooks/use-weakness-detector-worker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- Types & Constants ---

type Finger = 
    | 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'thumb'
    | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';

const FINGER_GROUPS: Record<Finger, string[]> = {
    'left-pinky': ['~', '1', 'Q', 'A', 'Z'],
    'left-ring': ['2', 'W', 'S', 'X'],
    'left-middle': ['3', 'E', 'D', 'C'],
    'left-index': ['4', '5', 'R', 'F', 'V', 'T', 'G', 'B'],
    'thumb': [' '],
    'right-index': ['6', '7', 'Y', 'H', 'N', 'U', 'J', 'M'],
    'right-middle': ['8', 'I', 'K', ','],
    'right-ring': ['9', 'O', 'L', '.'],
    'right-pinky': ['0', '-', '=', 'P', ';', '/', '\\', ']', '[', "'"]
};

const FINGER_LABELS: Record<Finger, string> = {
    'left-pinky': 'L-Pinky', 'left-ring': 'L-Ring', 'left-middle': 'L-Middle', 'left-index': 'L-Index', 'thumb': 'Thumb',
    'right-index': 'R-Index', 'right-middle': 'R-Middle', 'right-ring': 'R-Ring', 'right-pinky': 'R-Pinky'
};

const FINGER_ORDER: Finger[] = [
    'left-pinky', 'left-ring', 'left-middle', 'left-index',
    'thumb',
    'right-index', 'right-middle', 'right-ring', 'right-pinky'
];

// --- Sub-components ---

const HandGraphic = ({ side, loads }: { side: 'left' | 'right', loads: Record<Finger, number> }) => {
    const isLeft = side === 'left';
    
    // Finger indices for the hand SVG
    const fingers: { finger: Finger; cx: number; cy: number; h: number }[] = isLeft 
        ? [
            { finger: 'left-pinky', cx: 20, cy: 50, h: 40 },
            { finger: 'left-ring', cx: 40, cy: 35, h: 55 },
            { finger: 'left-middle', cx: 60, cy: 30, h: 60 },
            { finger: 'left-index', cx: 80, cy: 40, h: 50 },
            { finger: 'thumb', cx: 105, cy: 75, h: 35 },
          ]
        : [
            { finger: 'right-pinky', cx: 80, cy: 50, h: 40 },
            { finger: 'right-ring', cx: 60, cy: 35, h: 55 },
            { finger: 'right-middle', cx: 40, cy: 30, h: 60 },
            { finger: 'right-index', cx: 20, cy: 40, h: 50 },
            { finger: 'thumb', cx: -5, cy: 75, h: 35 },
          ];

    return (
        <div className="flex flex-col items-center">
            <svg width="120" height="150" viewBox="0 0 120 150" className="overflow-visible">
                {/* Palm Base */}
                <path
                    d={isLeft 
                        ? "M15,90 Q15,130 55,135 Q100,130 100,90 L100,70 L15,70 Z" 
                        : "M105,90 Q105,130 65,135 Q20,130 20,90 L20,70 L105,70 Z"}
                    className="fill-muted-foreground/10 stroke-muted-foreground/30"
                    strokeWidth="2"
                />

                {/* Finger Heat Points */}
                {fingers.map((f) => {
                    const load = loads[f.finger] || 0;
                    // Color transition from blue (cold) to red (hot)
                    const color = load < 0.3 ? 'rgb(59, 130, 246)' : load < 0.7 ? 'rgb(245, 158, 11)' : 'rgb(239, 68, 68)';
                    const opacity = 0.2 + load * 0.8;

                    return (
                        <g key={f.finger}>
                            {/* Finger Bar */}
                            <motion.rect
                                x={f.cx - 8}
                                y={f.cy}
                                width="16"
                                height={f.h}
                                rx="8"
                                animate={{ fill: color, opacity }}
                                className="transition-all duration-1000"
                            />
                            {/* Heat Glow */}
                            <circle
                                cx={f.cx}
                                cy={f.cy}
                                r={12 + load * 10}
                                fill={color}
                                fillOpacity={load * 0.3}
                                className="blur-md pointer-events-none"
                            />
                        </g>
                    );
                })}
            </svg>
            <span className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{isLeft ? 'Left Hand' : 'Right Hand'}</span>
        </div>
    );
};

export function FingerHeatmap() {
    const [loads, setLoads] = useState<Record<Finger, number>>({} as any);
    const { analyzeAllKeys } = useWeaknessDetectorWorker();

    useEffect(() => {
        const fetchLoads = async () => {
            try {
                const results = await analyzeAllKeys();
                const fingerAgg: Record<Finger, { sum: number, count: number }> = {} as any;
                
                // Group key results by finger
                results.forEach(res => {
                    const keyChar = res.key.toUpperCase();
                    const finger = Object.entries(FINGER_GROUPS).find(([_, keys]) => keys.includes(keyChar))?.[0] as Finger;
                    
                    if (finger) {
                        if (!fingerAgg[finger]) fingerAgg[finger] = { sum: 0, count: 0 };
                        fingerAgg[finger].sum += res.fingerLoad || 0;
                        fingerAgg[finger].count++;
                    }
                });

                const finalLoads: any = {};
                FINGER_ORDER.forEach(f => {
                    finalLoads[f] = fingerAgg[f] ? fingerAgg[f].sum / fingerAgg[f].count : 0;
                });
                setLoads(finalLoads);
            } catch (err) {
                console.error('Heatmap failed to fetch:', err);
            }
        };

        fetchLoads();
        const interval = setInterval(fetchLoads, 2000);
        return () => clearInterval(interval);
    }, [analyzeAllKeys]);

    return (
        <Card className="bg-black/20 border-white/10 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Biometric Finger Fatigue Heatmap
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex justify-around items-end py-4">
                    <HandGraphic side="left" loads={loads} />
                    <HandGraphic side="right" loads={loads} />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground mb-1">
                        <span>Finger Activity Distribution</span>
                        <span>Strain Level</span>
                    </div>
                    {FINGER_ORDER.map(f => {
                        const load = loads[f] || 0;
                        const color = load < 0.3 ? 'bg-blue-500' : load < 0.7 ? 'bg-amber-500' : 'bg-red-500';
                        
                        return (
                            <div key={f} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-medium px-1">
                                    <span>{FINGER_LABELS[f]}</span>
                                    <span className={load > 0.7 ? "text-red-400 animate-pulse" : ""}>
                                        {Math.round(load * 100)}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${load * 100}%` }}
                                        className={`h-full ${color} transition-all duration-1000`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
