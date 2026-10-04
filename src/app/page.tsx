'use client';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  Keyboard,
  Rocket,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { lessons } from '@/lib/lessons';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useUserStore } from '@/stores/user-store';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
const modes = [
  {
    title: 'Speed test',
    description: 'A fresh benchmark. Race the clock and find your current pace.',
    href: '/practice?mode=speed-test',
    icon: Zap,
    color: 'text-primary bg-primary/10',
    tag: 'TIMED PRACTICE',
  },
  {
    title: 'Smart practice',
    description: 'Give your weaker keys the attention they deserve.',
    href: '/practice/smart',
    icon: Target,
    color: 'text-primary bg-primary/10',
    tag: 'PERSONALIZED',
  },
  {
    title: 'Speed training',
    description: 'Short, focused bursts to build speed and consistency.',
    href: '/practice/speed-training',
    icon: Rocket,
    color: 'text-violet-300 bg-violet-400/10',
    tag: 'BUILD MOMENTUM',
  },
];
export default function HomePage() {
  const progress = useProgressStore((s) => s.progress);
  const streak = useGameStore((s) => s.game.dailyStreak);
  const username = useUserStore((s) => s.username);
  const completed = progress.completedLessons.length;
  const nextLesson = lessons.find((l) => !progress.completedLessons.includes(l.id));
  const percentage = Math.min(100, Math.round((completed / lessons.length) * 100));
  const records = [...progress.records].sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);
  const minutes = Math.floor(progress.totalPracticeTime / 60);
  return (
    <main className="container mx-auto studio-home">
      <div className="studio-intro"><span><span className="studio-status-dot" /> YOUR PERSONAL TYPING STUDIO</span><span>{username ? `Welcome back, ${username}` : 'A little practice. A lot of possibility.'}</span></div>
      <HeroBanner
        completedCount={completed}
        totalLessons={lessons.length}
        overallProgress={percentage}
        nextLesson={nextLesson}
        nextLessonCategory={null}
      />
      <section aria-label="Your performance" className="studio-metrics grid grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Personal best"
          value={progress.personalBests.wpm || '—'}
          icon={<TrendingUp size={17} />}
          subtext="Words per minute"
        />
        <MetricCard
          label="Best accuracy"
          value={progress.personalBests.accuracy ? `${progress.personalBests.accuracy}%` : '—'}
          icon={<Target size={17} />}
          subtext="Your most precise session"
        />
        <MetricCard
          label="Practice time"
          value={minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`}
          icon={<Clock size={17} />}
          subtext="Total focused practice"
        />
        <MetricCard
          label="Current streak"
          value={`${streak || 0} days`}
          icon={<Flame size={17} />}
          subtext="Keep the habit going"
        />
      </section>
      <section>
        <div className="section-heading">
          <h2>Choose your next move</h2>
          <Link href="/practice">
            Explore modes <ArrowRight size={14} />
          </Link>
        </div>
        <div className="studio-modes grid md:grid-cols-3">
          {modes.map(({ title, description, href, icon: Icon, color, tag }, index) => (
            <Link href={href} className="mode-card group" key={title}>
              <div className="flex items-start justify-between">
                <span className={`mode-card-icon ${color}`}>
                  <Icon size={20} />
                </span>
                <span className="studio-mode-number">0{index + 1}</span>
              </div>
              <p className="mb-2 text-[9px] font-semibold tracking-[.16em] text-muted-foreground">
                {tag}
              </p>
              <h3 className="mb-2 text-base font-semibold">{title}</h3>
              <p className="text-xs leading-6 text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="section-heading">
            <h2>The long game</h2>
            <Link href="/lessons">
              Curriculum <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {completed}
                <span className="text-base font-normal text-muted-foreground">
                  {' '}
                  / {lessons.length} lessons
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                A strong foundation, one lesson at a time.
              </p>
            </div>
            <span className="text-sm font-mono text-primary">{percentage}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Course completion"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 overflow-hidden rounded-full bg-accent"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
          </div>
          <Link
            href={nextLesson ? `/lessons/${nextLesson.id}` : '/lessons'}
            className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-background/50 p-4"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[10px] text-muted-foreground">
                {nextLesson ? 'UP NEXT' : 'ALL LESSONS COMPLETE'}
              </p>
              <p className="text-sm font-medium">
                {nextLesson?.title || 'Revisit your favorite lesson'}
              </p>
            </div>
            <ArrowRight size={17} className="text-primary" />
          </Link>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="section-heading">
            <h2>Recent sessions</h2>
            <Link href="/stats">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {records.length ? (
            <div className="divide-y divide-border">
              {records.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <Keyboard size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium capitalize">
                        {r.mode.replaceAll('-', ' ')}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(r.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">
                      {r.wpm} <span className="text-[10px] text-muted-foreground">WPM</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">{r.accuracy}% accuracy</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-accent">
                <Keyboard size={19} className="text-muted-foreground" />
              </span>
              <p className="text-sm font-medium">No sessions yet.</p>
              <p className="mb-4 mt-1 text-xs text-muted-foreground">
                Complete a session to see your progress.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/practice">
                  Start practicing <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
