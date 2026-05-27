/**
 * Session Aggregator — Efficient pre-computed session statistics
 *
 * Lazily computes daily/weekly/monthly aggregations from PerformanceRecord arrays.
 * Uses a dirty flag to avoid recomputation when no new records are added.
 */

import type { PerformanceRecord } from '@/types';

export interface AggregatedStats {
    totalSessions: number;
    totalPracticeTime: number;
    averageWpm: number;
    averageAccuracy: number;
    bestWpm: number;
    bestAccuracy: number;
    totalErrors: number;
    totalChars: number;
}

export interface DailyStats extends AggregatedStats {
    date: string;  // ISO date string (YYYY-MM-DD)
}

export interface PeriodStats {
    daily: DailyStats[];
    weekly: AggregatedStats[];
    allTime: AggregatedStats;
}

function dateKey(timestamp: number): string {
    return new Date(timestamp).toISOString().split('T')[0];
}

function weekKey(timestamp: number): string {
    const d = new Date(timestamp);
    const startOfYear = new Date(d.getFullYear(), 0, 1).getTime();
    const week = Math.ceil(((timestamp - startOfYear) / 86400000 + 1) / 7);
    return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function aggregateRecords(records: PerformanceRecord[]): AggregatedStats {
    if (records.length === 0) {
        return {
            totalSessions: 0, totalPracticeTime: 0, averageWpm: 0,
            averageAccuracy: 0, bestWpm: 0, bestAccuracy: 0, totalErrors: 0, totalChars: 0,
        };
    }

    const totalWpm = records.reduce((s, r) => s + r.wpm, 0);
    const totalAcc = records.reduce((s, r) => s + r.accuracy, 0);

    return {
        totalSessions: records.length,
        totalPracticeTime: records.reduce((s, r) => s + r.duration, 0),
        averageWpm: Math.round(totalWpm / records.length),
        averageAccuracy: Math.round(totalAcc / records.length),
        bestWpm: Math.max(...records.map(r => r.wpm)),
        bestAccuracy: Math.max(...records.map(r => r.accuracy)),
        totalErrors: records.reduce((s, r) => s + r.errors, 0),
        totalChars: records.reduce((s, r) => s + r.totalChars, 0),
    };
}

export class SessionAggregator {
    private cache: PeriodStats | null = null;
    private lastRecordCount = -1;

    /**
     * Get aggregated stats. Returns cached result if records haven't changed.
     */
    aggregate(records: PerformanceRecord[]): PeriodStats {
        if (this.cache && records.length === this.lastRecordCount) {
            return this.cache;
        }

        const valid = records.filter(r => r.wpm > 0);

        // Daily aggregation
        const dailyMap = new Map<string, PerformanceRecord[]>();
        for (const r of valid) {
            const key = dateKey(r.timestamp);
            const group = dailyMap.get(key);
            if (group) group.push(r);
            else dailyMap.set(key, [r]);
        }

        const daily: DailyStats[] = [...dailyMap.entries()]
            .map(([date, recs]) => ({ date, ...aggregateRecords(recs) }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Weekly aggregation
        const weeklyMap = new Map<string, PerformanceRecord[]>();
        for (const r of valid) {
            const key = weekKey(r.timestamp);
            const group = weeklyMap.get(key);
            if (group) group.push(r);
            else weeklyMap.set(key, [r]);
        }

        const weekly = [...weeklyMap.values()]
            .map(aggregateRecords)
            .sort((a, b) => b.totalSessions - a.totalSessions);

        const allTime = aggregateRecords(valid);

        this.cache = { daily, weekly, allTime };
        this.lastRecordCount = records.length;

        return this.cache;
    }

    /**
     * Get stats for the last N days.
     */
    getRecentDays(records: PerformanceRecord[], days: number): DailyStats[] {
        const stats = this.aggregate(records);
        const cutoff = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
        return stats.daily.filter(d => d.date >= cutoff);
    }

    invalidate(): void {
        this.cache = null;
        this.lastRecordCount = -1;
    }
}

export const sessionAggregator = new SessionAggregator();
