'use client';

import { useState, useRef, Suspense, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link'; // Added for Hub links
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  RotateCcw,
  Clock,
  Zap,
  Rocket,
  Keyboard,
  Trophy,
  Target,
  Feather,
  PenTool,
  Skull,
  Flame,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingController } from '@/hooks/use-typing-controller';
import { useTypingStore, getKeystrokeBuffer } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { useConfetti } from '@/hooks/use-confetti';
import { useUserStore } from '@/stores/user-store';
import { useProgressStore } from '@/stores/progress-store';
import { useLeaderboardStore } from '@/stores/leaderboard-store';
import { useSettingsStore } from '@/stores/settings-store';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { ComboPopup, StreakBreakPopup } from '@/components/gamification/combo-popup';
import { LiveFlowGraph } from '@/components/typing/live-flow-graph';
import {
  generateAdaptiveText,
  getRandomQuote,
  getRandomParagraph,
  generateWeaknessTargetedText,
  generateRandomText,
} from '@/lib/practice-texts';
import { PracticeMode, SpeedTestDuration, PerformanceRecord } from '@/types';
import toast from 'react-hot-toast';

import { ResultChart, WeaknessAnalysis } from '@/components/practice/result-chart';
import { cn } from '@/lib/utils';
import { API_ROUTES, TIMERS } from '@/lib/config/constants';

import { PageHeader } from '@/components/ui/page-header';
import { triggerSync } from '@/components/providers/sync-provider';

// --- Practice Hub Component ---
function PracticeHub() {
  return (
    <div className="min-h-full relative">
      <main className="practice-hub-page container mx-auto px-4 py-12 space-y-10">
        <PageHeader
          badge={
            <span className="text-[10px] tracking-[.18em] text-muted-foreground">
              THE PRACTICE STUDIO
            </span>
          }
          title="Find your flow."
          description="Find your rhythm, sharpen your accuracy, or set a new personal best. Pick the mode that fits your day."
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="practice-mode-grid grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <PracticeHubCard
            title="Smart Practice"
            description="Focus on the keys and transitions that need your attention."
            href="/practice/smart"
            icon={<Target className="w-6 h-6" />}
            accentColor="text-teal-300"
          />
          <PracticeHubCard
            title="Quick Warmup"
            description="Ease into your session with a short, relaxed keyboard warmup."
            href="/practice/warmup"
            icon={<Feather className="w-6 h-6" />}
            accentColor="text-primary"
          />
          <PracticeHubCard
            title="Speed Training"
            description="Build momentum with burst, metronome, and sprint exercises."
            href="/practice/speed-training"
            icon={<Rocket className="w-6 h-6" />}
            accentColor="text-violet-300"
          />
          <PracticeHubCard
            title="Free Practice"
            description="Relaxed typing with natural paragraphs. Great for warm-ups and general accuracy."
            href="/practice?mode=free"
            icon={<Keyboard className="w-6 h-6" />}
            accentColor="text-primary"
          />
          <PracticeHubCard
            title="Speed Test"
            description="Test your peak WPM in timed 60s, 2m, or 5m dashes with leaderboard ranking."
            href="/practice?mode=speed-test"
            icon={<Clock className="w-6 h-6" />}
            accentColor="text-primary"
          />
          <PracticeHubCard
            title="Sudden Death"
            description="High stakes challenge. 3 mistakes and your run terminates immediately."
            href="/practice?mode=sudden-death"
            icon={<Flame className="w-6 h-6" />}
            accentColor="text-red-400"
          />
          <PracticeHubCard
            title="Zen Mode"
            description="Endless flow typing without timers, metrics, or score pressure."
            href="/practice?mode=zen"
            icon={<Zap className="w-6 h-6" />}
            accentColor="text-emerald-400"
          />
          <PracticeHubCard
            title="Custom Text"
            description="Paste your own text, code snippets, or quotes to practice specifically."
            href="/practice?mode=custom"
            icon={<FileText className="w-6 h-6" />}
            accentColor="text-indigo-400"
          />
        </motion.div>
      </main>
    </div>
  );
}

function PracticeHubCard({
  title,
  description,
  href,
  icon,
  accentColor,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  accentColor: string;
}) {
  return (
    <Link
      href={href}
      className="block group h-full focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
    >
      <div className="mode-card">
        {href === '/practice/smart' && <div className="practice-key-study" aria-hidden="true"><span>e</span><span>n</span><span>i</span><div className="practice-key-trace" /></div>}
        <div className="relative z-10">
          <div
            className={cn(
              'mb-4 p-3 w-fit rounded-xl bg-muted/60 border border-border',
              accentColor,
            )}
          >
            {icon}
          </div>
          <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-foreground transition-colors mb-1.5">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-xs">{description}</p>
        </div>
      </div>
    </Link>
  );
}

// --- Standard Typing Interface (Refactored) ---
function calculateFlowScore(wpms: number[], accuracy: number) {
  if (wpms.length === 0) return 100;
  const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
  const consistency = Math.max(0, 100 - Math.sqrt(variance) * 2);
  const stability = Math.max(0, 100 - (Math.max(...wpms) - Math.min(...wpms)) * 1.5);
  const accScore = Math.min(100, accuracy < 95 ? accuracy - (95 - accuracy) * 2 : accuracy);
  return Math.min(
    100,
    Math.max(0, Math.round(consistency * 0.4 + stability * 0.3 + accScore * 0.3)),
  );
}

function Leaderboard() {
  const globalEntries = useLeaderboardStore((s) => s.globalEntries);
  const globalLoading = useLeaderboardStore((s) => s.globalLoading);

  useEffect(() => {
    useLeaderboardStore.getState().fetchGlobalLeaderboard();
  }, []);

  const entries = globalEntries.map((e) => ({
    username: e.username || 'Anonymous',
    wpm: e.best_wpm,
    accuracy: e.best_accuracy,
  }));

  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {globalLoading ? (
          <div className="text-xs text-muted-foreground text-center py-8 animate-pulse">
            Loading global leaderboard...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-8">
            No global scores yet. Be the first!
          </div>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 10).map((entry, i) => (
              <div
                key={`${entry.username}-${i}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0',
                      i === 0
                        ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                        : i === 1
                          ? 'bg-zinc-300/20 text-foreground border border-zinc-300/30'
                          : i === 2
                            ? 'bg-orange-600/20 text-orange-500 border border-orange-600/30'
                            : 'bg-zinc-800/50 text-muted-foreground border border-zinc-700/50',
                    )}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium truncate',
                      i < 3 ? 'text-foreground' : 'text-foreground',
                    )}
                  >
                    {entry.username}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className={cn('font-bold', i === 0 ? 'text-yellow-500' : 'text-primary')}>
                    <span className="font-black text-sm">{entry.wpm}</span>{' '}
                    <span className="text-[10px] text-muted-foreground">WPM</span>
                  </span>
                  <span className="text-muted-foreground font-medium">{entry.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StandardPracticeInterface({
  initialMode,
  challengeParam,
}: {
  initialMode: PracticeMode;
  challengeParam?: string | null;
}) {
  const router = useRouter();
  const settings = useSettingsStore((s) => s.settings);
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [duration, setDuration] = useState<SpeedTestDuration>(60);
  const [wordCount, setWordCount] = useState<number>(25);
  const [customText, setCustomText] = useState('');
  const [text, setText] = useState(() => getTextForMode(initialMode, 60, '', 25, challengeParam));
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<PerformanceRecord | null>(null);
  const [sessionData, setSessionData] = useState<{ sessionId: string; token: string } | null>(null);
  const sessionDataRef = useRef(sessionData);

  useEffect(() => {
    sessionDataRef.current = sessionData;
  }, [sessionData]);

  // Performance History Tracking
  const [history, setHistory] = useState<{ timestamp: number; wpm: number; errors: number }[]>([]);
  const { fireLessonComplete } = useConfetti();
  const completionHandledRef = useRef(false);
  const historyRef = useRef<{ timestamp: number; wpm: number; errors: number }[]>([]);

  // Sync historyRef
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const handleComplete = useCallback(
    async (record: PerformanceRecord) => {
      if (completionHandledRef.current) return;
      completionHandledRef.current = true;

      // Fire-and-forget sync to Supabase for authenticated users
      triggerSync();

      setResult(record);
      setIsComplete(true);
      fireLessonComplete();
      toast.dismiss();

      // Submit to hardened API
      const sd = sessionDataRef.current;
      if (sd && record.wpm > 0) {
        const loadingToast = toast.loading('Verifying performance...');
        try {
          const mappedKeystrokes = getKeystrokeBuffer().map((k) => ({
            t: k.timestamp,
            correct: k.isCorrect,
          }));
          const res = await fetch(API_ROUTES.SUBMIT_SCORE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sid: sd.sessionId,
              token: sd.token,
              score: {
                wpm: record.wpm,
                accuracy: record.accuracy,
                durationMs: record.duration * 1000,
              },
              keystrokes: mappedKeystrokes,
              mode: mode,
            }),
          });

          if (!res.ok) throw new Error(await res.text());
          await res.json();

          // Keep local net metrics; the server currently derives gross keystroke metrics.
          // Its response establishes leaderboard acceptance, not a replacement for local scoring.
          toast.success('Leaderboard submission accepted.', { id: loadingToast });
        } catch (e: any) {
          toast.error('Leaderboard verification unavailable. Your local result is saved.', { id: loadingToast });
        }
      } else {
        setResult(record);
      }
    },
    [fireLessonComplete],
  );

  const {
    reset,
    isPaused,
    hasStarted,
    currentIndex,
    isComplete: controllerIsComplete,
  } = useTypingController({
    text,
    mode,
    timeLimitSeconds: mode === 'speed-test' ? duration : undefined,
    errorLimit: mode === 'sudden-death' ? 3 : undefined,
    onComplete: handleComplete,
  });

  // FIX: Read store imperatively inside interval — zero reactive subscriptions.
  // This prevents StandardPracticeInterface from re-rendering on every keystroke.
  const { flowScore, trend } = useMemo(() => {
    if (history.length < 2) return { flowScore: 0, trend: 'stable' as const };
    const wpms = history.map((h) => Math.min(250, h.wpm));
    const getSmoothed = (arr: number[], idx: number) => {
      if (idx < 2) return arr[idx];
      return (arr[idx - 2] + arr[idx - 1] + arr[idx]) / 3;
    };
    const currentSmoothed = getSmoothed(wpms, wpms.length - 1);
    const prevSmoothed = getSmoothed(wpms, wpms.length - 2);
    let detectedTrend: 'rising' | 'falling' | 'stable' = 'stable';
    if (currentSmoothed > prevSmoothed + 0.5) detectedTrend = 'rising';
    else if (currentSmoothed < prevSmoothed - 0.5) detectedTrend = 'falling';
    const lastAccuracy =
      history.at(-1)?.wpm != null ? useTypingStore.getState().getAccuracy() : 100;
    return { flowScore: calculateFlowScore(wpms, lastAccuracy), trend: detectedTrend };
  }, [history]);

  // Adaptive difficulty (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (flowScore > 80) setDifficulty('hard');
      else if (flowScore < 60) setDifficulty('easy');
      else setDifficulty('medium');
    }, TIMERS.DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [flowScore]);

  // Dynamic text extension — reads currentIndex from store imperatively to avoid subscription
  useEffect(() => {
    if (!hasStarted || isComplete) return;
    if (mode === 'free' || mode === 'custom') return; // Do not dynamically extend for fixed-length modes
    const remainingChars = text.length - currentIndex;
    if (remainingChars < 100) {
      setText((prev) => prev + ' ' + generateAdaptiveText(20, difficulty));
    }
  }, [currentIndex, text.length, difficulty, hasStarted, isComplete, mode]);

  // History tracking: getState() inside interval — no reactive deps on wpm/elapsedTime/errorIndices
  useEffect(() => {
    if (!hasStarted || isPaused || isComplete) return;
    const interval = setInterval(() => {
      const s = useTypingStore.getState();
      setHistory((prev) => [
        ...prev,
        {
          timestamp: s.getElapsedTime(),
          wpm: s.getWpm(),
          errors: s.totalCount - s.correctCount,
        },
      ]);
    }, TIMERS.POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [hasStarted, isPaused, isComplete]);

  const handleStartTest = async (
    newMode: PracticeMode,
    newDuration?: SpeedTestDuration,
    newWordCount?: number,
  ) => {
    // Fix 8: Block empty input and sanitize text
    reset();
    setMode(newMode);
    if (newDuration) setDuration(newDuration);
    if (newWordCount) setWordCount(newWordCount);
    const rawText = getTextForMode(
      newMode,
      newDuration || duration,
      customText,
      newWordCount || wordCount,
    );
    setText(rawText.replace(/\s+/g, ' ').replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim());
    setIsComplete(false);
    setResult(null);
    setHistory([]);
    completionHandledRef.current = false;
    useGameStore.getState().resetSession();
    useAnalyticsStore.getState().clearSession();

    // Fetch new session for verification
    try {
      const res = await fetch(API_ROUTES.SESSION);
      if (res.ok) setSessionData(await res.json());
    } catch (e) {
      console.error('Session fetch failed');
    }
  };

  const getInitialText = useCallback(() => {
    return getTextForMode(mode, duration, customText, wordCount, challengeParam);
  }, [mode, duration, customText, wordCount, challengeParam]);

  const handleReset = () => {
    // Generate new text when restarting (unless it's a custom fixed text)
    const rawText = getTextForMode(mode, duration, customText, wordCount, challengeParam);
    setText(rawText.replace(/\s+/g, ' ').replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim());
    reset();
    setIsComplete(false);
    setResult(null);
    setHistory([]);
    useGameStore.getState().resetSession();
    useAnalyticsStore.getState().clearSession();
    completionHandledRef.current = false;
    toast.dismiss();
  };

  // Task 9: Escape to restart (Ref-based to avoid stale closure)
  const handleResetRef = useRef(handleReset);
  useEffect(() => {
    handleResetRef.current = handleReset;
  }, [handleReset]);
  useEffect(() => {
    let tabPressedAt = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!useSettingsStore.getState().settings.quickRestart || e.repeat) return;
      const target = e.target as HTMLElement;
      if (target.closest('[role="dialog"]') || (target.matches('input,textarea,select') && target.dataset.typingShim === undefined)) return;
      if (e.key === 'Tab') { tabPressedAt = Date.now(); return; }
      const tabEnter = e.key === 'Enter' && tabPressedAt > 0 && Date.now() - tabPressedAt < 1500;
      if (e.key === 'Escape' || tabEnter) {
        e.preventDefault();
        handleResetRef.current();
        tabPressedAt = 0;
        requestAnimationFrame(() => document.querySelector<HTMLInputElement>('[data-typing-shim]')?.focus());
      }
    };
    globalThis.window.addEventListener('keydown', handleKeyDown);
    return () => globalThis.window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Error breakdown computed imperatively — only needed at results time
  const errorBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    if (!isComplete) return map;
    const errorIndices = useTypingStore.getState().state.errorIndices;
    errorIndices.forEach((idx) => {
      const char = text[idx]?.toLowerCase();
      if (char) map.set(char, (map.get(char) || 0) + 1);
    });
    return map;
  }, [isComplete, text]);

  return (
    <div className="min-h-full ">
      {/* Header - Focus Mode (Hidden when typing) */}
      <header
        className={cn(
          'border-b border-border bg-background/80 transition-all duration-300',
          hasStarted && !isComplete
            ? 'opacity-0 -translate-y-full pointer-events-none'
            : 'opacity-100 translate-y-0',
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/practice">
              <Button variant="ghost" size="icon" aria-label="Back to practice modes">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-semibold">
              {mode === 'speed-test'
                ? 'Speed Test'
                : mode === 'custom'
                  ? 'Custom Text'
                  : 'Free Practice'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Restart practice" onClick={handleReset}>
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {!isComplete ? (
          <>
            {
              /* Mode Configuration */
              <div
                className={cn(
                  'transition-all duration-700 max-w-2xl mx-auto w-full',
                  hasStarted && !isComplete
                    ? 'opacity-0 h-0 overflow-hidden pointer-events-none translate-y-[-20px]'
                    : 'opacity-100 mb-8',
                )}
              >
                {mode === 'speed-test' && (
                  <Card className="glass-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        Speed Test Duration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        {([60, 120, 300] as SpeedTestDuration[]).map((d) => (
                          <Button
                            key={d}
                            variant={duration === d ? 'default' : 'outline'}
                            className={cn(
                              duration === d
                                ? 'bg-primary hover:bg-brand-hover text-primary-foreground border-transparent'
                                : 'border-white/10 hover:bg-white/5 text-foreground',
                            )}
                            onClick={() => handleStartTest('speed-test', d)}
                          >
                            {d / 60} min
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {mode === 'free' && (
                  <Card className="glass-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Target className="w-5 h-5 text-primary" />
                        Word Count
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Choose how many words to type
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        {[10, 25, 50, 100].map((w) => (
                          <Button
                            key={w}
                            variant={wordCount === w ? 'default' : 'outline'}
                            className={cn(
                              wordCount === w
                                ? 'bg-primary hover:bg-amber-600 text-black border-transparent'
                                : 'border-white/10 hover:bg-white/5 text-foreground',
                            )}
                            onClick={() => handleStartTest('free', undefined, w)}
                          >
                            {w} words
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {mode === 'custom' && (
                  <Card className="glass-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <PenTool className="w-5 h-5 text-foreground" />
                        Custom Text
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Paste your own text to practice
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <textarea
                        aria-label="Custom practice text"
                        className="w-full h-32 p-4 rounded-xl border border-white/10 bg-black/40 text-foreground resize-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 focus:ring-2 focus:ring-white/20 transition-all placeholder:text-muted-foreground"
                        placeholder="Paste your text here..."
                        maxLength={5000}
                        value={customText}
                        onChange={(e) =>
                          setCustomText(
                            e.target.value
                              .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
                              .replace(/[\u200B-\u200F\uFEFF]/g, ''),
                          )
                        }
                      />
                      <Button
                        className="w-full"
                        onClick={() => handleStartTest('custom')}
                        disabled={!customText.trim()}
                      >
                        Start Practice
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            }

            {/* Main Focus Area - Centered */}
            <div
              className={cn(
                'flex flex-col items-center justify-center max-w-5xl mx-auto w-full transition-all duration-700',
                hasStarted ? 'min-h-[90vh]' : 'min-h-[60vh]',
              )}
            >
              {mode !== 'zen' && (
                <>
                  {/* Flow Score & Trend Graph */}
                  <div
                    className={cn(
                      'flex items-center gap-6 mb-8 h-12 transition-opacity duration-1000',
                      hasStarted ? 'opacity-40 hover:opacity-100' : 'opacity-20',
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-(--color-content-muted) font-black">
                        Flow
                      </span>
                      <span
                        className={cn(
                          'text-xl font-black tabular-nums transition-colors duration-500',
                          {
                            'text-teal-400': trend === 'rising',
                            'text-rose-400': trend === 'falling',
                            'text-(--color-content-muted)': trend === 'stable',
                          },
                        )}
                      >
                        {flowScore}
                      </span>
                    </div>
                    <LiveFlowGraph history={history} trend={trend} />
                  </div>

                  {/* Stats - Minimal */}
                  <TypingStats totalWords={mode === 'free' ? wordCount : undefined} />
                </>
              )}

              {/* Typing area */}
              <TypingArea />

              {/* Virtual keyboard removed for Practice section */}

              {/* Combo popup */}
              {mode !== 'zen' && <ComboPopup />}
              {mode !== 'zen' && <StreakBreakPopup />}
            </div>
          </>
        ) : (
          /* Results View */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <ResultChart
              data={history}
              wpm={result?.wpm ?? 0}
              accuracy={result?.accuracy ?? 100}
              elapsedTime={result?.duration ?? 0}
              maxCombo={result?.maxCombo ?? 0}
              isNewPersonalBest={
                (result?.wpm ?? 0) > (useProgressStore.getState().progress.personalBests?.wpm ?? 0)
              }
            />

            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={handleReset} className="min-w-[150px]">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/stats')}>
                View Full Stats
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeaknessAnalysis errorBreakdown={errorBreakdown} />
              <Leaderboard />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode') as PracticeMode | null;
  const challengeParam = searchParams.get('challenge') as string | null;

  if (!modeParam) {
    return <PracticeHub />;
  }

  return (
    <StandardPracticeInterface initialMode={modeParam || 'free'} challengeParam={challengeParam} />
  );
}

function getTextForMode(
  mode: PracticeMode,
  duration: number,
  customText?: string,
  wordCount: number = 25,
  challenge?: string | null,
): string {
  switch (mode) {
    case 'speed-test':
      if (challenge === 'daily') {
        const today = new Date();
        const seedStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++)
          hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
        return getRandomQuote(undefined, Math.abs(hash));
      } else if (challenge === 'weekly') {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
        const seedStr = `${d.getFullYear()}-W${weekNo}`;
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++)
          hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
        return getRandomParagraph(undefined, Math.abs(hash));
      }
      return generateAdaptiveText(Math.ceil((duration / 60) * 50), 'medium');
    case 'sudden-death':
      return generateAdaptiveText(200, 'hard'); // Long, hard text for sudden death
    case 'zen':
      return generateAdaptiveText(100, 'easy'); // Easy, flowing text for zen
    case 'custom':
      return customText?.trim() || getRandomQuote();
    case 'free':
    default:
      const problemKeys = useAnalyticsStore.getState().getProblematicKeys();
      if (problemKeys && problemKeys.length > 0) {
        return generateWeaknessTargetedText(problemKeys, wordCount);
      }
      return generateRandomText(wordCount);
  }
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={<div className="min-h-full flex items-center justify-center">Loading...</div>}
    >
      <PracticeContent />
    </Suspense>
  );
}
