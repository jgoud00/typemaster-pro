'use client';

import { useEffect, useState } from 'react';
import { fatigueTracker, type FatigueDashboardData, type Finger, type Hand } from '@/lib/algorithms/fatigue-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function FingerFatigueDashboard() {
    const [data, setData] = useState<FatigueDashboardData | null>(null);

    useEffect(() => {
        // Update data every second
        const updateData = () => {
            setData(fatigueTracker.getDashboardData());
        };

        updateData();
        const interval = setInterval(updateData, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!data) return null;

    const { leftHand, rightHand, overallFatigue, recommendation, shouldTakeBreak } = data;

    return (
        <Card className={cn(
            "transition-all",
            shouldTakeBreak && "border-red-500 bg-red-500/5"
        )}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>🖐️ Finger Fatigue Monitor</span>
                    <Badge
                        variant={overallFatigue > 60 ? "destructive" : overallFatigue > 30 ? "secondary" : "default"}
                    >
                        {overallFatigue.toFixed(0)}% Fatigue
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-8">
                    {/* Left Hand */}
                    <HandDiagram hand="left" fingers={leftHand} />

                    {/* Right Hand */}
                    <HandDiagram hand="right" fingers={rightHand} />
                </div>

                {/* Overall fatigue bar */}
                <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Overall Fatigue</span>
                        <span className={cn(
                            "font-semibold",
                            overallFatigue > 60 && "text-red-500",
                            overallFatigue > 30 && overallFatigue <= 60 && "text-yellow-500",
                            overallFatigue <= 30 && "text-green-500",
                        )}>
                            {overallFatigue.toFixed(0)}%
                        </span>
                    </div>
                    <Progress
                        value={overallFatigue}
                        className={cn(
                            "h-3",
                            overallFatigue > 60 && "[&>div]:bg-red-500",
                            overallFatigue > 30 && overallFatigue <= 60 && "[&>div]:bg-yellow-500",
                            overallFatigue <= 30 && "[&>div]:bg-green-500",
                        )}
                    />
                </div>

                {/* Recommendation */}
                <div className={cn(
                    "mt-4 p-3 rounded-lg text-sm",
                    shouldTakeBreak ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200" : "bg-muted"
                )}>
                    {shouldTakeBreak && <span className="font-semibold">⚠️ </span>}
                    {recommendation}
                </div>
            </CardContent>
        </Card>
    );
}

interface HandDiagramProps {
    hand: Hand;
    fingers: Record<Finger, { fatigueScore: number; keystrokes: number }>;
}

function HandDiagram({ hand, fingers }: HandDiagramProps) {
    const fingerOrder: Finger[] = hand === 'left'
        ? ['thumb', 'index', 'middle', 'ring', 'pinky']
        : ['pinky', 'ring', 'middle', 'index', 'thumb'];

    const fingerLabels: Record<Finger, string> = {
        pinky: '🤙',
        ring: '💍',
        middle: '🖕',
        index: '👆',
        thumb: '👍',
    };

    return (
        <div className="text-center">
            <h3 className="font-semibold mb-3 capitalize">{hand} Hand</h3>

            {/* Hand visualization */}
            <div className="flex justify-center gap-1 mb-4">
                {fingerOrder.map((finger) => {
                    const state = fingers[finger];
                    const fatigue = state?.fatigueScore || 0;
                    const color = fatigue > 60 ? 'bg-red-500' : fatigue > 30 ? 'bg-yellow-500' : 'bg-green-500';
                    const height = finger === 'thumb' ? 'h-12' : finger === 'pinky' ? 'h-14' : finger === 'ring' ? 'h-16' : finger === 'middle' ? 'h-20' : 'h-18';

                    return (
                        <div key={finger} className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-6 rounded-t-full transition-colors",
                                    height,
                                    color
                                )}
                                title={`${finger}: ${fatigue.toFixed(0)}% fatigue, ${state?.keystrokes || 0} keystrokes`}
                            />
                            <span className="text-xs mt-1">{fingerLabels[finger]}</span>
                        </div>
                    );
                })}
            </div>

            {/* Finger details */}
            <div className="space-y-1 text-xs">
                {(['pinky', 'ring', 'middle', 'index'] as Finger[]).map((finger) => {
                    const state = fingers[finger];
                    const fatigue = state?.fatigueScore || 0;

                    return (
                        <div key={finger} className="flex items-center justify-between">
                            <span className="capitalize">{finger}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">{state?.keystrokes || 0} keys</span>
                                <span className={cn(
                                    "font-semibold w-12 text-right",
                                    fatigue > 60 && "text-red-500",
                                    fatigue > 30 && fatigue <= 60 && "text-yellow-500",
                                    fatigue <= 30 && "text-green-500",
                                )}>
                                    {fatigue.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
