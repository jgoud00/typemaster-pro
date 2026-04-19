import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTypingStore } from '@/stores/typing-store';

export const FatigueCurveGraph = React.memo(() => {
    const keystrokes = useTypingStore(s => s.state.keystrokes);
    const startTime = useTypingStore(s => s.state.startTime);

    const data = useMemo(() => {
        if (!startTime || keystrokes.length === 0) return [];

        const buckets = new Map<number, { correct: number, total: number }>();
        const bucketSizeMs = 30000; // 30-sec intervals

        keystrokes.forEach(k => {
            const bucketIndex = Math.floor((k.timestamp - startTime) / bucketSizeMs);
            if (!buckets.has(bucketIndex)) {
                buckets.set(bucketIndex, { correct: 0, total: 0 });
            }
            const b = buckets.get(bucketIndex)!;
            b.total++;
            if (k.isCorrect) b.correct++;
        });

        const sortedIndices = Array.from(buckets.keys()).sort((a, b) => a - b);
        
        return sortedIndices.map(idx => {
            const b = buckets.get(idx)!;
            // WPM = (correct / 5 chars) * (1 min / 0.5 min)
            const wpm = Math.round((b.correct / 5) * (60000 / bucketSizeMs));
            const accuracy = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 100;
            const minuteLabel = ((idx * bucketSizeMs) / 60000).toFixed(1);

            return {
                timeLabel: `${minuteLabel}m`,
                wpm,
                accuracy
            };
        });
    }, [keystrokes, startTime]);

    if (data.length === 0) {
       return <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground border border-white/5 rounded-xl bg-black/10">Type in current session to populate real-time fatigue graph...</div>;
    }

    return (
        <div className="h-[300px] w-full p-4 border border-white/5 rounded-xl bg-black/20">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="timeLabel" stroke="#888" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#8884d8" fontSize={12} domain={['auto', 'auto']} width={40} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" fontSize={12} domain={[0, 100]} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Legend />
                    <Line yAxisId="left" type="basis" dataKey="wpm" name="WPM" stroke="#8884d8" strokeWidth={3} dot={false} isAnimationActive={false} />
                    <Line yAxisId="right" type="basis" dataKey="accuracy" name="Accuracy %" stroke="#82ca9d" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
});

FatigueCurveGraph.displayName = 'FatigueCurveGraph';
