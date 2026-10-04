'use client';
import { PageHeader } from '@/components/ui/page-header';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Calendar, Lock, Play, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgressStore } from '@/stores/progress-store';

const DAILY_QUOTES = [
  'The only way to do great work is to love what you do.',
  "Life is what happens when you're busy making other plans.",
  'The future belongs to those who believe in the beauty of their dreams.',
  'It does not matter how slowly you go as long as you do not stop.',
  "In the end, it's not the years in your life that count. It's the life in your years.",
  "You miss 100% of the shots you don't take.",
  "Whether you think you can or you think you can't, you're right.",
];

const WEEKLY_TEXTS = [
  'Typing is not just about speed; it is an art of synchronization between your mind and your fingers. When you reach that state of flow, words seem to appear on the screen before you even consciously think about spelling them. It requires patience, persistent practice, and the willingness to learn from your mistakes. Every error is an opportunity to refine your muscle memory and build a stronger foundation for future speed and accuracy.',
  'The digital age has transformed the keyboard into our primary tool for communication and creation. Mastering this interface empowers you to translate your thoughts into reality with unprecedented efficiency. By focusing on fundamental techniques rather than rushing, you develop a rhythm that minimizes fatigue and maximizes output. Over time, the keyboard becomes an extension of your own body, allowing your ideas to flow freely and uninterrupted into the digital realm.',
  'Consistency is the true secret to mastering any complex skill, and touch typing is no exception. While it may be tempting to chase high bursts of speed, maintaining a steady, accurate pace ultimately yields better results. This week, focus on your posture, hand positioning, and the fluidity of your keystrokes. Remember that building muscle memory is a marathon, not a sprint, and every correct sequence you type reinforces the neural pathways needed for mastery.',
];

function getStartOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay() || 7;
  if (day !== 1) d.setHours(-24 * (day - 1));
  return d;
}

function getISOWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getFullYear(), week: weekNo };
}

function getDeterministicIndex(seed: string, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % max;
}

export default function ChallengesPage() {
  const router = useRouter();
  const records = useProgressStore((s) => s.progress.records);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const {
    dailySeed,
    weeklySeed,
    dailyQuote,
    weeklyText,
    dailyRecords,
    weeklyRecords,
    uniqueDaysCompletedThisWeek,
    weeklyUnlocked,
  } = useMemo(() => {
    if (!now)
      return {
        dailySeed: '',
        weeklySeed: '',
        dailyQuote: '',
        weeklyText: '',
        dailyRecords: [],
        weeklyRecords: [],
        uniqueDaysCompletedThisWeek: 0,
        weeklyUnlocked: false,
      };

    const today = getStartOfDay(now);
    const thisWeek = getStartOfWeek(now);
    const isoWeek = getISOWeek(now);

    const dSeed = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const wSeed = `${isoWeek.year}-W${isoWeek.week}`;

    const dQuote = DAILY_QUOTES[getDeterministicIndex(dSeed, DAILY_QUOTES.length)];
    const wText = WEEKLY_TEXTS[getDeterministicIndex(wSeed, WEEKLY_TEXTS.length)];

    const speedTestRecords = records.filter((r) => r.mode === 'speed-test');
    const dRecords = speedTestRecords.filter((r) => r.timestamp >= today.getTime());
    const wRecords = speedTestRecords.filter((r) => r.timestamp >= thisWeek.getTime());

    const uniqueDays = new Set(
      wRecords.map((r) => {
        const d = new Date(r.timestamp);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }),
    );
    const completedDays = uniqueDays.size;

    return {
      dailySeed: dSeed,
      weeklySeed: wSeed,
      dailyQuote: dQuote,
      weeklyText: wText,
      dailyRecords: dRecords,
      weeklyRecords: wRecords,
      uniqueDaysCompletedThisWeek: completedDays,
      weeklyUnlocked: completedDays >= 3,
    };
  }, [now, records]);

  if (!now) return <div className="min-h-full bg-zinc-950 text-foreground font-sans"></div>;

  const dailyBest =
    dailyRecords.length > 0
      ? dailyRecords.reduce((best, curr) => (curr.wpm > best.wpm ? curr : best), dailyRecords[0])
      : null;
  const weeklyBest =
    weeklyRecords.length > 0
      ? weeklyRecords.reduce((best, curr) => (curr.wpm > best.wpm ? curr : best), weeklyRecords[0])
      : null;

  return (
    <div className="min-h-full bg-background text-foreground font-sans selection:bg-primary/30">
      <main className="challenge-page container mx-auto px-4 py-12 max-w-5xl">
        <PageHeader
          className="mb-8"
          title="The daily pursuit."
          description="A fresh daily test. A weekly goal. A reason to keep coming back."
          badge={
            <span className="text-[10px] tracking-[.18em] text-muted-foreground">
              BUILD YOUR MOMENTUM
            </span>
          }
        />

        <div className="challenge-events grid md:grid-cols-2 gap-6">
          {/* Daily Challenge Card */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-7 relative overflow-hidden bg-card border border-border shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Daily Challenge
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25">
                    Medium
                  </span>
                </h2>
                <span className="text-xs font-mono text-muted-foreground">{dailySeed}</span>
              </div>

              <p className="text-foreground mb-6 italic border-l-2 border-primary/40 pl-4 py-1 text-sm line-clamp-3">
                "{dailyQuote}"
              </p>

              <div className="flex items-center gap-4 mb-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  <span>{dailyQuote.split(' ').length} words</span>
                </div>
                {dailyBest && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Trophy className="w-4 h-4" />
                    <span>
                      Best: {Math.round(dailyBest.wpm)} WPM ({Math.round(dailyBest.accuracy)}%)
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => router.push('/practice?mode=speed-test&challenge=daily')}
                className="w-full h-11 bg-primary hover:bg-brand-hover text-primary-foreground font-bold rounded-xl"
              >
                {dailyBest ? 'Try Again' : 'Start Daily Challenge'}
                <Play className="w-4 h-4 ml-2 fill-current" />
              </Button>
            </div>
          </motion.div>

          {/* Weekly Challenge Card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl p-7 relative overflow-hidden bg-card border border-border shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Weekly Challenge
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-400 border border-orange-500/25">
                    Hard
                  </span>
                </h2>
                <span className="text-xs font-mono text-muted-foreground">{weeklySeed}</span>
              </div>

              {weeklyUnlocked ? (
                <>
                  <p className="text-foreground mb-6 text-sm leading-relaxed line-clamp-3">
                    {weeklyText}
                  </p>

                  <div className="flex items-center gap-4 mb-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      <span>{weeklyText.split(' ').length} words</span>
                    </div>
                    {weeklyBest && (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Trophy className="w-4 h-4" />
                        <span>
                          Best: {Math.round(weeklyBest.wpm)} WPM ({Math.round(weeklyBest.accuracy)}
                          %)
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => router.push('/practice?mode=speed-test&challenge=weekly')}
                    className="w-full h-11 bg-primary hover:bg-brand-hover text-primary-foreground font-bold rounded-xl"
                  >
                    {weeklyBest ? 'Try Again' : 'Start Weekly Challenge'}
                    <Play className="w-4 h-4 ml-2 fill-current" />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 rounded-xl bg-muted/60 border border-border flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-center text-muted-foreground text-xs mb-5 max-w-xs">
                    Complete {3 - uniqueDaysCompletedThisWeek} more daily challenges this week to
                    unlock the weekly challenge.
                  </p>

                  <div className="w-full space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-mono text-foreground">
                        {uniqueDaysCompletedThisWeek} / 3 Days
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(uniqueDaysCompletedThisWeek / 3) * 100}%` }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
