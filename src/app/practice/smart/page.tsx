'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingController } from '@/hooks/use-typing-controller';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { assessAdaptiveKeys, generateProgressiveText, LETTER_ORDER, MASTERY_ATTEMPTS, MASTERY_ACCURACY, TARGET_WPM } from '@/lib/adaptive-practice';
import { useAdaptiveStore } from '@/stores/adaptive-store';
import { ngramAnalyzer } from '@/lib/ngram-analyzer';
import { PerformanceRecord } from '@/types';
import { ArrowRight, RotateCcw, Brain, TrendingDown } from 'lucide-react';

function FocusKeyProgress({ keyName }: { keyName: string }) {
  const stat = useAnalyticsStore(state => state.keyStats[keyName]);
  const attempts = stat?.totalAttempts || 0;
  const accuracy = attempts ? Math.max(0, 100 * (1 - stat.errors / attempts)) : 0;
  const keyWpm = stat?.averageSpeed ? 12000 / stat.averageSpeed : 0;
  const readiness = Math.round(100 * Math.min(1, attempts / MASTERY_ATTEMPTS) * Math.min(1, accuracy / MASTERY_ACCURACY) * Math.min(1, keyWpm / TARGET_WPM));
  return <section aria-label="Focus key readiness" className="mx-auto mt-5 max-w-xl rounded-xl border border-border bg-card p-4 text-left">
    <div className="flex items-center justify-between text-xs"><span>Focus key <strong className="font-mono uppercase text-primary">{keyName}</strong></span><span className="text-muted-foreground">{readiness}% ready</span></div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Key readiness" aria-valuenow={readiness} aria-valuemin={0} aria-valuemax={100}><div className="h-full bg-primary" style={{width:`${readiness}%`}} /></div>
    <div className="mt-3 flex flex-wrap justify-between gap-2 text-[11px] text-muted-foreground"><span>{attempts} / {MASTERY_ATTEMPTS} attempts</span><span>{attempts ? `${Math.round(accuracy)}%` : '-'} accuracy</span><span>{Math.round(keyWpm)} key WPM</span></div>
  </section>;
}

function nextPlan() {
  return assessAdaptiveKeys(useAnalyticsStore.getState().keyStats, useAdaptiveStore.getState().unlockedCount);
}

export default function SmartPracticePage() {
  const router = useRouter();

  const [plan, setPlan] = useState(nextPlan);
  const [text, setText] = useState(() => generateProgressiveText(plan.letters, plan.focusKey));
  useEffect(() => { useAdaptiveStore.getState().unlockThrough(plan.unlockedCount); }, [plan.unlockedCount]);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<PerformanceRecord | null>(null);
  const [slowBigrams, setSlowBigrams] = useState<{ ngram: string; avgTime: number }[]>([]);

  const { reset } = useTypingController({
    text,
    mode: 'free',
    stopOnError: true,
    onComplete: (record) => {
      setResult(record);
      setIsComplete(true);
      // Read ngram report on completion — IDB will have loaded by now
      const report = ngramAnalyzer.getReport(3);
      setSlowBigrams(
        report.slowestBigrams.slice(0, 3).map((b) => ({ ngram: b.ngram, avgTime: b.avgTime })),
      );
    },
  });

  const handleRestart = () => {
    const freshPlan = nextPlan();
    setPlan(freshPlan);
    setText(generateProgressiveText(freshPlan.letters, freshPlan.focusKey));
    reset();
    setIsComplete(false);
    setResult(null);
    setSlowBigrams([]);
  };

  const targetBanner = `Focus key: ${plan.focusKey.toUpperCase()} / ${plan.unlockedCount} of 26 letters unlocked`;

  return (
    <div className="min-h-full  flex flex-col">
      <main className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center py-12">
        {isComplete && result ? (
          <div className="glass-card rounded-2xl p-8 max-w-md w-full space-y-8 border border-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-blue-400" />
                <h2 className="text-2xl font-bold font-display text-foreground">Smart Session Done</h2>
              </div>
              <p className="text-sm text-(--color-content-muted)">
                {`Focused on ${plan.focusKey.toUpperCase()} with ${plan.unlockedCount} unlocked letters`}
              </p>
            </div>

            <div className="flex justify-center gap-12 py-2">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-(--color-content-muted) font-bold mb-2">
                  WPM
                </div>
                <div className="text-5xl font-black text-foreground font-mono">{result.wpm}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-(--color-content-muted) font-bold mb-2">
                  Accuracy
                </div>
                <div className="text-5xl font-black text-foreground font-mono">{result.accuracy}%</div>
              </div>
            </div>

            {slowBigrams.length > 0 && (
              <div className="rounded-xl glass-subtle border border-border p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 mb-3">
                  <TrendingDown className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Slowest Transitions
                  </span>
                </div>
                {(() => {
                  const max = slowBigrams[0].avgTime;
                  return slowBigrams.map((b, i) => (
                    <div key={b.ngram} className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold bg-muted/60 border border-border rounded px-2 py-0.5 text-foreground tracking-widest w-10 text-center shrink-0">
                        {b.ngram}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/70"
                            style={{ width: `${Math.round((b.avgTime / max) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground shrink-0 tabular-nums w-14 text-right">
                        {Math.round(b.avgTime)}ms
                      </span>
                    </div>
                  ));
                })()}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push('/practice?mode=free')}
                className="w-full h-12 text-base font-bold group"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Start Real Practice
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={handleRestart}
                className="w-full h-12 text-sm border-border text-foreground hover:bg-muted/60"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Another Smart Session
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-blue-400" />
                <h1 className="text-2xl font-bold text-foreground font-display">Smart Practice</h1>
              </div>
              <p className="text-(--color-content-muted) text-sm mb-4">
                Build confidence with a few letters, then unlock the next one.
              </p>

              {/* Targeting banner */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle border border-border text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
                {targetBanner}
              </div>
            </div>

            <div className="mb-6 max-w-3xl mx-auto">
              <div className="flex flex-wrap justify-center gap-2" aria-label="Adaptive letter progression">
                {[...LETTER_ORDER].map((key,index) => <span key={key} className={`grid size-8 place-items-center rounded border font-mono text-sm ${key === plan.focusKey ? 'bg-primary text-primary-foreground border-primary' : index < plan.unlockedCount ? 'bg-card border-border text-foreground' : 'border-border text-muted-foreground'}`} aria-label={`${key}: ${index < plan.unlockedCount ? 'unlocked' : 'locked'}`}>{key}</span>)}
              </div>
              <p className="mt-3 text-center text-xs leading-6 text-muted-foreground">Unlock another letter after {MASTERY_ATTEMPTS} attempts per active key, {MASTERY_ACCURACY}% accuracy, and {TARGET_WPM} WPM per key. Mistakes stay on the current letter until corrected.</p>
            </div>
            <FocusKeyProgress keyName={plan.focusKey} />
            <div className="h-5" />
            <TypingStats totalWords={40} />
            <TypingArea />
          </div>
        )}
      </main>
    </div>
  );
}
