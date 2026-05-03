import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Target, Flame } from 'lucide-react';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';

export const PersonalRecordsDashboard = React.memo(() => {
    const { progress } = useProgressStore();
    const { game } = useGameStore();

    const bestWpm = progress.personalBests?.wpm || 0;
    const bestAccuracy = progress.personalBests?.accuracy || 0;
    const bestStreak = game.maxCombo || 0;

    const weeklyBestWpm = useMemo(() => {
        if (!progress.records) return 0;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const weeklyRecords = progress.records.filter(r => r.timestamp >= oneWeekAgo);
        return weeklyRecords.length > 0 ? Math.max(...weeklyRecords.map(r => r.wpm)) : 0;
    }, [progress.records]);

    const top5Lessons = useMemo(() => {
        if (!progress.records) return [];
        return [...progress.records]
            .sort((a, b) => b.wpm - a.wpm)
            .slice(0, 5);
    }, [progress.records]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="All-Time WPM" value={bestWpm} icon={<Trophy className="text-yellow-500" />} />
                <MetricCard title="Best WPM (7 Days)" value={weeklyBestWpm} icon={<Star className="text-blue-500" />} />
                <MetricCard title="Max Accuracy" value={`${bestAccuracy}%`} icon={<Target className="text-green-500" />} />
                <MetricCard title="Longest Combo" value={bestStreak} icon={<Flame className="text-orange-500" />} />
            </div>

            {top5Lessons.length > 0 && (
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 shadow-xl">
                    <div className="p-4 bg-white/5 border-b border-white/10 font-bold tracking-wide">Top 5 Historic Performances</div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 font-medium border-b border-white/10 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Rank</th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 text-right font-medium">WPM</th>
                                <th className="px-4 py-3 text-right font-medium">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {top5Lessons.map((record, idx) => (
                                <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">#{idx + 1}</td>
                                    <td className="px-4 py-3">{new Date(record.timestamp).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-right font-bold text-primary">{record.wpm}</td>
                                    <td className="px-4 py-3 text-right text-green-400">{record.accuracy}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
});

PersonalRecordsDashboard.displayName = 'PersonalRecordsDashboard';

function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
    return (
        <Card className="bg-linear-to-br from-card/80 to-card border-white/10 hover:border-white/20 transition-all shadow-md">
            <CardContent className="p-5 flex flex-col items-center text-center justify-center h-full gap-3">
                <div className="p-3 rounded-full bg-black/30 shadow-inner">{icon}</div>
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{title}</div>
                    <div className="text-3xl font-bold mt-1 tracking-tight">{value}</div>
                </div>
            </CardContent>
        </Card>
    );
}
