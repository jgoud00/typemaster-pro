'use client';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PageHeader } from '@/components/ui/page-header';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  RotateCcw,
  AlertTriangle,
  Zap,
  Target,
  Clock,
  Flame,
  ChevronDown,
  Activity,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PerformanceSection = dynamic(() => import('@/components/stats/PerformanceSection'), {
  loading: () => <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-xl" />,
  ssr: false,
});
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { clearFromDB } from '@/lib/storage/db';
import { AICoach } from '@/components/stats/AICoach';
import { ngramAnalyzer, type NgramReport } from '@/lib/ngram-analyzer';

const KeyboardHeatmap = dynamic(
  () => import('@/components/stats/KeyboardHeatmap').then((mod) => mod.KeyboardHeatmap),
  { ssr: false },
);

type Timeframe = '7D' | '30D' | 'All';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
}

function SummaryCard({ label, value, icon, accentColor }: SummaryCardProps) {
  return (
    <div className="relative rounded-2xl p-5 overflow-hidden bg-card border border-border shadow-sm transition-all duration-200 hover:border-border">
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
            {label}
          </p>
          <p className="text-2xl md:text-3xl font-black font-mono text-foreground leading-none truncate">
            {value}
          </p>
        </div>
        <div
          className="mt-0.5 shrink-0 p-2 rounded-xl"
          style={{ color: accentColor, background: `color-mix(in srgb, ${accentColor} 10%, transparent)` }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const router = useRouter();
  const { progress, resetProgress } = useProgressStore();
  const game = useGameStore((s) => s.game);
  const resetSession = useGameStore((s) => s.resetSession);
  const { keyStats, clearSession } = useAnalyticsStore();

  const [showResetModal, setShowResetModal] = useState(false);
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');
  const [chartNow, setChartNow] = useState(0);
  useEffect(() => {
    setChartNow(Date.now());
  }, [progress.records]);
  const [dangerOpen, setDangerOpen] = useState(false);
  const [ngramReport, setNgramReport] = useState<NgramReport | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNgramReport(ngramAnalyzer.getReport(5));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleResetStats = async () => {
    resetProgress();
    resetSession();
    clearSession();
    setShowResetModal(false);
    if (globalThis.window !== undefined) {
      globalThis.localStorage.removeItem('ngram-analytics');
      await clearFromDB('analytics-store');
    }
    router.refresh();
  };

  const totalTimeSeconds = progress.totalPracticeTime || 0;
  const totalKeystrokes = progress.totalKeystrokes || 0;
  const hasPracticeData = totalTimeSeconds > 0;

  const wpmData =
    progress.records
      ?.filter(
        (record) =>
          timeframe === 'All' ||
          record.timestamp >= chartNow - (timeframe === '7D' ? 7 : 30) * 86400000,
      )
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((record, i) => ({
        session: i + 1,
        wpm: record.wpm,
        accuracy: record.accuracy,
        date: new Date(record.timestamp).toLocaleDateString(),
      })) || [];

  const HEATMAP_LEGEND = [
    { color: 'var(--color-success)', label: 'Fast' },
    { color: '#84CC16', label: '' },
    { color: 'var(--color-warning)', label: '' },
    { color: '#F97316', label: '' },
    { color: 'var(--color-error)', label: 'Slow' },
  ];

  return (
    <div className="min-h-full ">
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="bg-card">
          <span className="flex size-11 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
            <AlertTriangle size={22} />
          </span>
          <DialogTitle>Reset your statistics?</DialogTitle>
          <DialogDescription className="leading-7">
            This clears your recorded lesson progress, personal bests, practice history, and key
            analytics on this device. Export your progress in Settings first if you want to keep a
            copy.
          </DialogDescription>
          <p className="text-xs text-red-300">This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowResetModal(false)}>
              Keep my progress
            </Button>
            <Button variant="destructive" onClick={handleResetStats}>
              Reset statistics
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="analytics-page container mx-auto px-4 py-8 space-y-8 max-w-6xl">
        <PageHeader
          title="Your typing, measured."
          description="Understand your pace, accuracy, and the keys that need a little more practice."
          badge={
            <span className="text-[10px] tracking-[.18em] text-muted-foreground">
              PERFORMANCE & INSIGHTS
            </span>
          }
        />
        {/* ── ZONE 1: Summary Row ── */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              label="Best WPM"
              value={hasPracticeData ? progress.personalBests?.wpm || 0 : '-'}
              icon={<Zap className="w-5 h-5" />}
              accentColor="var(--color-primary)"
            />
            <SummaryCard
              label="Best Accuracy"
              value={hasPracticeData ? `${progress.personalBests?.accuracy || 0}%` : '-'}
              icon={<Target className="w-5 h-5" />}
              accentColor="var(--primary)"
            />
            <SummaryCard
              label="Total Practice"
              value={hasPracticeData ? formatTime(totalTimeSeconds) : '-'}
              icon={<Clock className="w-5 h-5" />}
              accentColor="var(--primary)"
            />
            <SummaryCard
              label="Daily Streak"
              value={hasPracticeData ? `${game.dailyStreak ?? 0}d` : '-'}
              icon={<Flame className="w-5 h-5" />}
              accentColor="var(--primary)"
            />
          </div>
        </section>

        {/* ── ZONE 1.5: AI Coach ── */}
        <section>
          <AICoach hasData={hasPracticeData} />
        </section>

        {/* ── ZONE 2: Charts ── */}
        <section>
          <div className="relative rounded-2xl bg-card border border-border shadow-sm p-6 space-y-5 overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-display text-base font-bold text-foreground">Performance Over Time</h2>
              {/* Timeframe toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border">
                {(['7D', '30D', 'All'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    aria-pressed={timeframe === tf}
                    className={cn(
                      'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150',
                      timeframe === tf
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <PerformanceSection
              wpmData={wpmData}
              hasPracticeData={hasPracticeData}
              totalTimeSeconds={totalTimeSeconds}
              totalKeystrokes={totalKeystrokes}
              sessionsCount={progress.records?.length || 0}
              completedLessonsCount={progress.completedLessons?.length || 0}
            />
          </div>
        </section>

        {/* ── ZONE 3: Keyboard Heatmap ── */}
        <section>
          <div className="relative rounded-2xl bg-card border border-border shadow-sm p-6 space-y-4 overflow-hidden">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">Key Accuracy Heatmap</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Keys colored by your error rate — red = most errors
              </p>
            </div>

            <div className="flex justify-center overflow-x-auto py-2">
              <KeyboardHeatmap />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
              {HEATMAP_LEGEND.map(({ color, label }, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-sm inline-block shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {label && <span className="text-xs text-(--color-content-muted)">{label}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ZONE 4: Transition Analysis ── */}
        <section>
          <div className="relative rounded-2xl glass-glow p-6 space-y-4 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Transition Analysis</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Slowest and most error-prone character pairs from your typing history
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Slowest Bigrams */}
              <div className="rounded-xl glass-subtle border border-border p-4 space-y-3">
                <h3 className="text-sm font-bold text-foreground">Slowest Bigrams</h3>
                {ngramReport && ngramReport.slowestBigrams.length > 0 ? (
                  (() => {
                    const max = ngramReport.slowestBigrams[0].avgTime;
                    return ngramReport.slowestBigrams.slice(0, 5).map((b, i) => (
                      <div key={b.ngram} className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground w-4 shrink-0 tabular-nums">
                          {i + 1}
                        </span>
                        <span className="font-mono text-sm font-bold bg-muted/60 border border-border rounded px-2 py-0.5 text-foreground tracking-widest w-10 text-center shrink-0">
                          {b.ngram}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary/70 transition-all duration-500"
                              style={{ width: `${Math.round((b.avgTime / max) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground shrink-0 tabular-nums w-14 text-right">
                          {Math.round(b.avgTime)}ms
                        </span>
                      </div>
                    ));
                  })()
                ) : (
                  <p className="text-xs text-muted-foreground py-2">Type more to generate data</p>
                )}
              </div>

              {/* Error-Prone Bigrams */}
              <div className="rounded-xl glass-subtle border border-border p-4 space-y-3">
                <h3 className="text-sm font-bold text-foreground">Error-Prone Bigrams</h3>
                {ngramReport && ngramReport.errorProneBigrams.length > 0 ? (
                  ngramReport.errorProneBigrams.slice(0, 5).map((b, i) => (
                    <div key={b.ngram} className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground w-4 shrink-0 tabular-nums">
                        {i + 1}
                      </span>
                      <span className="font-mono text-sm font-bold bg-muted/60 border border-border rounded px-2 py-0.5 text-foreground tracking-widest w-10 text-center shrink-0">
                        {b.ngram}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-rose-500/70 transition-all duration-500"
                            style={{ width: `${Math.round(b.errorRate * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground shrink-0 tabular-nums w-14 text-right">
                        {Math.round(b.errorRate * 100)}%
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-2">
                    No error patterns detected yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Danger Zone ── */}
        <section className="flex justify-end">
          <div className="w-full max-w-sm">
            <button
              onClick={() => setDangerOpen((o) => !o)}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-(--color-content-muted) hover:text-(--color-content-secondary) transition-colors"
            >
              <span>Danger Zone</span>
              <motion.span
                animate={{ rotate: dangerOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.span>
            </button>
            <AnimatePresence>
              {dangerOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      className="text-(--color-error) hover:bg-(--color-error)/10 hover:text-(--color-error)"
                      onClick={() => setShowResetModal(true)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset All Statistics
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
