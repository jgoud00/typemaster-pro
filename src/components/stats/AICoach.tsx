'use client';
import Link from 'next/link';
import { ArrowUpRight, Coffee, Target } from 'lucide-react';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { Button } from '@/components/ui/button';
export function AICoach({ hasData = true }: { hasData?: boolean }) {
  const { mlResults, getProblematicKeys, getAverageHesitation } = useAnalyticsStore();
  const keys = getProblematicKeys(85).slice(0, 6);
  const hesitation = getAverageHesitation();
  const elevated = mlResults.errorPrediction > 0.7;
  return (
    <section className="rounded-2xl border border-primary/20 bg-card p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Target size={20} />
        </span>
        <div className="flex-1">
          <p className="mb-1 text-[10px] font-semibold tracking-[.15em] text-primary">
            YOUR PRACTICE INSIGHTS
          </p>
          <h2 className="text-base font-semibold">
            {!hasData
              ? 'Get to know your typing.'
              : keys.length
                ? 'A little attention goes a long way.'
                : 'Keep building your rhythm.'}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            {!hasData
              ? 'Complete a practice session to see which keys feel natural and which could use a little extra attention.'
              : keys.length
                ? 'These keys have lower accuracy in your recorded practice. A short targeted session is a useful next step.'
                : 'Your recorded key accuracy is looking consistent. Try a new passage or revisit a lesson to keep developing your skills.'}
          </p>
          {keys.length > 0 && hasData && (
            <div className="mt-4 flex flex-wrap gap-2">
              {keys.map((key) => (
                <kbd
                  key={key}
                  className="flex min-w-8 items-center justify-center rounded-md border border-border border-b-2 bg-background px-2 py-1 font-mono text-xs text-primary"
                >
                  {key === ' ' ? 'space' : key.toUpperCase()}
                </kbd>
              ))}
            </div>
          )}
          {elevated && hasData && (
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Coffee size={14} />
              Errors may be increasing. Consider a short break.
            </p>
          )}
          {hesitation > 300 && hasData && (
            <p className="mt-3 text-xs text-muted-foreground">
              Average pause between keys: {Math.round(hesitation)} ms. Try a slower pace with steady
              accuracy.
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={hasData ? '/practice/smart' : '/practice'}>
            {hasData ? 'Targeted practice' : 'Start a session'}
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
