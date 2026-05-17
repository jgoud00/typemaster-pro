'use client';

import { useState, useRef, Suspense, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link'; // Added for Hub links
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Clock, Zap, Rocket, Keyboard, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingController } from '@/hooks/use-typing-controller';
import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { useConfetti } from '@/hooks/use-confetti';
import { useUserStore } from '@/stores/user-store';
import { useLeaderboardStore } from '@/stores/leaderboard-store';
import { useSettingsStore } from '@/stores/settings-store';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { ComboPopup, StreakBreakPopup } from '@/components/gamification/combo-popup';
import { LiveFlowGraph } from '@/components/typing/live-flow-graph';
import { generateAdaptiveText, getRandomQuote, getRandomParagraph } from '@/lib/practice-texts';
import { PracticeMode, SpeedTestDuration, PerformanceRecord } from '@/types';
import toast from 'react-hot-toast';

import { ResultChart, WeaknessAnalysis } from '@/components/practice/result-chart';
import { cn } from '@/lib/utils';
import { API_ROUTES, TIMERS } from '@/lib/config/constants';
import { createClient } from '@/lib/supabase/client';
import { submitSessionToSupabase } from '@/lib/supabase/leaderboard';

// --- Practice Hub Component ---
function PracticeHub() {
    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="font-semibold text-lg">Practice Modes</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight">Choose Your Challenge</h2>
                    <p className="text-muted-foreground text-lg">
                        Select a mode to hone your typing skills. From speed tests to AI-powered adaptive training.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PracticeHubCard
                        title="Free Practice"
                        description="Relaxed typing with random paragraphs. Great for warm-ups."
                        href="/practice?mode=free"
                        icon={<Keyboard className="w-8 h-8" />}
                        color="from-blue-500/20 to-cyan-500/20 border-blue-500/30"
                    />
                    <PracticeHubCard
                        title="Speed Test"
                        description="Test your WPM in timed 60s, 2m, or 5m dashes."
                        href="/practice?mode=speed-test"
                        icon={<Clock className="w-8 h-8" />}
                        color="from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
                    />
                    <PracticeHubCard
                        title="Burst Mode"
                        description="High-intensity intervals. Type fast or game over."
                        href="/practice/speed-training"
                        icon={<Rocket className="w-8 h-8" />}
                        color="from-red-500/20 to-rose-500/20 border-red-500/30"
                    />
                </div>
            </main>
        </div>
    );
}

function PracticeHubCard({ title, description, href, icon, color }: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <Link href={href}>
            <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
            >
                <Card className={cn(
                    "h-full border transition-all duration-300 hover:shadow-xl bg-linear-to-br backdrop-blur-sm",
                    color,
                    "hover:border-white/20 hover:bg-white/5"
                )}>
                    <CardHeader>
                        <div className="mb-4 p-3 w-fit rounded-xl bg-background/30 backdrop-blur-md border border-white/10">
                            {icon}
                        </div>
                        <CardTitle className="text-xl">{title}</CardTitle>
                        <CardDescription className="text-base mt-2">{description}</CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>
        </Link>
    );
}

// --- Standard Typing Interface (Refactored) ---
function calculateFlowScore(wpms: number[], accuracy: number) {
    if (wpms.length === 0) return 100;
    const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
    const consistency = Math.max(0, 100 - Math.sqrt(variance) * 2);
    const stability = Math.max(0, 100 - ((Math.max(...wpms) - Math.min(...wpms)) * 1.5));
    const accScore = Math.min(100, accuracy < 95 ? accuracy - (95 - accuracy) * 2 : accuracy);
    return Math.min(100, Math.max(0, Math.round((consistency * 0.4) + (stability * 0.3) + (accScore * 0.3))));
}

function Leaderboard() {
    const localEntries = useLeaderboardStore(s => s.entries).slice(0, 10);
    const globalEntries = useLeaderboardStore(s => s.globalEntries);
    const globalLoading = useLeaderboardStore(s => s.globalLoading);
    const [tab, setTab] = useState<'local' | 'global'>('global');

    useEffect(() => {
        useLeaderboardStore.getState().fetchGlobalLeaderboard();
    }, []);

    const entries = tab === 'global'
        ? globalEntries.map(e => ({ username: e.username || 'Anonymous', wpm: e.best_wpm, accuracy: e.best_accuracy }))
        : localEntries.map(e => ({ username: e.username, wpm: e.wpm, accuracy: e.accuracy }));

    return (
        <Card className="bg-black/20 border-white/10">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        Leaderboard
                    </CardTitle>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setTab('global')}
                            className={cn(
                                "px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider transition-colors",
                                tab === 'global' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white'
                            )}
                        >
                            Global
                        </button>
                        <button
                            onClick={() => setTab('local')}
                            className={cn(
                                "px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider transition-colors",
                                tab === 'local' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white'
                            )}
                        >
                            Local
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {globalLoading && tab === 'global' ? (
                    <div className="text-xs text-muted-foreground text-center py-8 animate-pulse">
                        Loading global leaderboard...
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-8">
                        {tab === 'global' ? 'No global scores yet. Be the first!' : 'No scores yet. Start typing!'}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {entries.slice(0, 10).map((entry, i) => (
                            <div key={`${entry.username}-${i}`} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={cn(
                                        "text-xs font-bold w-4",
                                        ['text-yellow-400', 'text-gray-300', 'text-orange-400'][i] || 'text-gray-500'
                                    )}>{i + 1}</span>
                                    <span className="text-sm font-medium truncate">{entry.username}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="font-bold text-blue-400">{entry.wpm} <span className="text-[10px] text-gray-600">WPM</span></span>
                                    <span className="text-gray-500">{entry.accuracy}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function StandardPracticeInterface({ initialMode }: { initialMode: PracticeMode }) {
    const router = useRouter();
    const settings = useSettingsStore(s => s.settings);
    // Removed granular combo selectors to avoid render cascades.
    // Combo overlays are now self-contained and listen via stores/buses directly.
    const [mode, setMode] = useState<PracticeMode>(initialMode);
    const [duration, setDuration] = useState<SpeedTestDuration>(60);
    const [customText, setCustomText] = useState('');
    const [text, setText] = useState(() => getTextForMode(initialMode, 60));
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [isComplete, setIsComplete] = useState(false);
    const [result, setResult] = useState<PerformanceRecord | null>(null);
    const [sessionData, setSessionData] = useState<{ sessionId: string; token: string } | null>(null);
    const sessionDataRef = useRef(sessionData);

    useEffect(() => {
        sessionDataRef.current = sessionData;
    }, [sessionData]);

    // Performance History Tracking
    const [history, setHistory] = useState<{ timestamp: number; wpm: number; errors: number; }[]>([]);
    const { fireLessonComplete } = useConfetti();
    const completionHandledRef = useRef(false);
    const historyRef = useRef<{ timestamp: number; wpm: number; errors: number; }[]>([]);
    
    // Sync historyRef
    useEffect(() => {
        historyRef.current = history;
    }, [history]);

    const handleComplete = useCallback(async (record: PerformanceRecord) => {
        if (completionHandledRef.current) return;
        completionHandledRef.current = true;

        // Calculate final flow score for leaderboard
        const wpms = historyRef.current.map(h => Math.min(250, h.wpm));
        const finalFlowScore = calculateFlowScore(wpms, record.accuracy);

        // Update leaderboard
        useLeaderboardStore.getState().addEntry({
            username: useUserStore.getState().username || 'Anonymous',
            wpm: record.wpm,
            accuracy: record.accuracy,
            flowScore: finalFlowScore,
            date: Date.now()
        });

        // Submit to global leaderboard if authenticated
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                submitSessionToSupabase(user.id, {
                    wpm: record.wpm,
                    accuracy: record.accuracy,
                    duration: record.duration,
                    mode: mode || 'free',
                    maxCombo: record.maxCombo,
                    score: record.score,
                    totalChars: record.totalChars,
                    errors: record.errors,
                    cheatScore: record.cheatScore,
                    isValid: record.valid,
                }).catch(e => console.error('[Practice] Failed to submit to global leaderboard:', e));

                // Refresh global leaderboard
                useLeaderboardStore.getState().fetchGlobalLeaderboard();
            }
        } catch (e) {
            // Non-blocking
        }

        setIsComplete(true);
        fireLessonComplete();
        toast.dismiss();

        // Task 5: Submit to hardened API
        const sd = sessionDataRef.current;
        if (sd && record.wpm > 0) {
            const loadingToast = toast.loading("Verifying performance...");
            try {
                const res = await fetch(API_ROUTES.SUBMIT_SCORE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sid: sd.sessionId,
                        token: sd.token,
                        score: { wpm: record.wpm, accuracy: record.accuracy, durationMs: record.duration * 1000 },
                        keystrokes: useTypingStore.getState().state.keystrokes.map(k => ({ t: k.timestamp, correct: k.isCorrect })),
                    })
                });
                
                if (!res.ok) throw new Error(await res.text());
                const verified = await res.json();
                
                setResult({ ...record, wpm: verified.wpm, accuracy: verified.accuracy });
                toast.success(`Verified: ${verified.wpm} WPM`, { id: loadingToast });
            } catch (e: any) {
                setResult({ ...record, wpm: 0, accuracy: 0 });
                toast.error(`Verification Failed: ${e.message}`, { id: loadingToast });
            }
        } else {
            setResult(record);
        }
    }, [fireLessonComplete]);

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
        onComplete: handleComplete,
    });


    // FIX: Read store imperatively inside interval — zero reactive subscriptions.
    // This prevents StandardPracticeInterface from re-rendering on every keystroke.
    const { flowScore, trend } = useMemo(() => {
        if (history.length < 2) return { flowScore: 0, trend: 'stable' as const };
        const wpms = history.map(h => Math.min(250, h.wpm));
        const getSmoothed = (arr: number[], idx: number) => {
            if (idx < 2) return arr[idx];
            return (arr[idx-2] + arr[idx-1] + arr[idx]) / 3;
        };
        const currentSmoothed = getSmoothed(wpms, wpms.length - 1);
        const prevSmoothed = getSmoothed(wpms, wpms.length - 2);
        let detectedTrend: 'rising' | 'falling' | 'stable' = 'stable';
        if (currentSmoothed > prevSmoothed + 0.5) detectedTrend = 'rising';
        else if (currentSmoothed < prevSmoothed - 0.5) detectedTrend = 'falling';
        const lastAccuracy = history.at(-1)?.wpm != null
            ? useTypingStore.getState().getAccuracy()
            : 100;
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
        const remainingChars = text.length - currentIndex;
        if (remainingChars < 100) {
            setText(prev => prev + ' ' + generateAdaptiveText(20, difficulty));
        }
    }, [currentIndex, text.length, difficulty, hasStarted, isComplete]);

    // History tracking: getState() inside interval — no reactive deps on wpm/elapsedTime/errorIndices
    useEffect(() => {
        if (!hasStarted || isPaused || isComplete) return;
        const interval = setInterval(() => {
            const s = useTypingStore.getState();
            setHistory(prev => [...prev, {
                timestamp: s.getElapsedTime(),
                wpm: s.getWpm(),
                errors: s.state.errorIndices.length,
            }]);
        }, TIMERS.POLLING_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [hasStarted, isPaused, isComplete]);

    const handleStartTest = async (newMode: PracticeMode, newDuration?: SpeedTestDuration) => {
        // Fix 8: Block empty input and sanitize text
        setMode(newMode);
        if (newDuration) setDuration(newDuration);
        const rawText = getTextForMode(newMode, newDuration || duration, customText);
        setText(rawText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim());
        setIsComplete(false);
        setResult(null);
        setHistory([]);
        completionHandledRef.current = false;
        useGameStore.getState().resetGame();
        useAnalyticsStore.getState().clearSession();

        // Fetch new session for verification
        try {
            const res = await fetch(API_ROUTES.SESSION);
            if (res.ok) setSessionData(await res.json());
        } catch (e) { console.error("Session fetch failed"); }
    };

    const handleReset = () => {
        reset();
        setIsComplete(false);
        setResult(null);
        setHistory([]);
        useGameStore.getState().resetGame();
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
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                handleResetRef.current();
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
        errorIndices.forEach(idx => {
            const char = text[idx]?.toLowerCase();
            if (char) map.set(char, (map.get(char) || 0) + 1);
        });
        return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isComplete, text]);

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header - Focus Mode (Hidden when typing) */}
            <header className={cn(
                "border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 transition-opacity duration-700",
                hasStarted && !isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/practice">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="font-semibold">
                            {mode === 'speed-test' ? 'Speed Test' : mode === 'custom' ? 'Custom Text' : 'Free Practice'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">

                        <Button variant="ghost" size="icon" onClick={handleReset}>
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-6">
                {!isComplete ? (
                    <>
                        {/* Mode Selection Tabs */}
                        <div className={cn(
                            "transition-all duration-700",
                            hasStarted && !isComplete ? "opacity-0 pointer-events-none translate-y-[-20px]" : "opacity-100"
                        )}>
                            <Tabs value={mode} onValueChange={(v) => handleStartTest(v as PracticeMode)}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="speed-test">Speed Test</TabsTrigger>
                                    <TabsTrigger value="free">Free Practice</TabsTrigger>
                                <TabsTrigger value="custom">Custom Text</TabsTrigger>
                            </TabsList>

                            <TabsContent value="speed-test" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            Speed Test
                                        </CardTitle>
                                        <CardDescription>Choose a duration and test your typing speed</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                            {([60, 120, 300] as SpeedTestDuration[]).map((d) => (
                                                <Button
                                                    key={d}
                                                    variant={duration === d ? 'default' : 'outline'}
                                                    onClick={() => handleStartTest('speed-test', d)}
                                                >
                                                    {d / 60} min
                                                </Button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="custom" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Custom Text</CardTitle>
                                        <CardDescription>Paste your own text to practice</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <textarea
                                            className="w-full h-32 p-3 rounded-lg border bg-background resize-none"
                                            placeholder="Paste your text here..."
                                            maxLength={5000}
                                            value={customText}
                                            onChange={(e) => setCustomText(
                                                e.target.value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').replace(/[\u200B-\u200F\uFEFF]/g, '')
                                            )}
                                        />
                                        <Button
                                            onClick={() => handleStartTest('custom')}
                                            disabled={!customText.trim()}
                                        >
                                            Start Practice
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Main Focus Area - Centered */}
                    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-6xl mx-auto w-full">
                        {/* Flow Score & Trend Graph */}
                        <div className={cn(
                            "flex items-center gap-6 mb-8 h-12 transition-opacity duration-1000",
                            hasStarted ? "opacity-40 hover:opacity-100" : "opacity-20"
                        )}>
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-black">Flow</span>
                                <span className={cn(
                                    "text-xl font-black tabular-nums transition-colors duration-500",
                                    {
                                        'text-teal-400': trend === 'rising',
                                        'text-magenta-400': trend === 'falling',
                                        'text-gray-500': trend === 'stable'
                                    }
                                )}>
                                    {flowScore}
                                </span>
                            </div>
                            <LiveFlowGraph history={history} trend={trend} />
                        </div>

                        {/* Stats - Minimal */}
                        <TypingStats />

                        {/* Typing area */}
                        <TypingArea />

                        {/* Virtual keyboard */}
                        {settings.showVirtualKeyboard && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-8 w-full"
                            >
                                <VirtualKeyboard showHeatmap={false} />
                            </motion.div>
                        )}
                        
                        {/* Combo popup */}
                        <ComboPopup />
                        <StreakBreakPopup />
                    </div>
                    </>
                ) : (
                    /* Results View */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <Card className="bg-linear-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
                            <CardContent className="p-8 text-center">
                                <h3 className="text-3xl font-bold mb-6">Test Complete!</h3>
                                <div className="grid grid-cols-3 gap-8 mb-8">
                                    <div>
                                        <div className="text-5xl font-bold text-blue-400 mb-2">{result?.wpm}</div>
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">WPM</div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-bold text-green-400 mb-2">{result?.accuracy}%</div>
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Accuracy</div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-bold text-orange-400 mb-2">{result?.maxCombo}</div>
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Max Combo</div>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Button size="lg" onClick={handleReset} className="min-w-[150px]">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Try Again
                                    </Button>
                                    <Button size="lg" variant="outline" onClick={() => router.push('/stats')}>
                                        View Full Stats
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ResultChart data={history} />
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
    // If 'mode' param is present, show standard practice interface.
    // If not, show the Hub.
    const modeParam = searchParams.get('mode') as PracticeMode | null;

    if (!modeParam) {
        return <PracticeHub />;
    }

    return <StandardPracticeInterface initialMode={modeParam} />;
}

function getTextForMode(mode: PracticeMode, duration: number, customText?: string): string {
    switch (mode) {
        case 'speed-test':
            return generateAdaptiveText(Math.ceil(duration / 60 * 50), 'medium');
        case 'custom':
            return customText?.trim() || getRandomQuote();
        case 'free':
        default:
            return getRandomParagraph();
    }
}

export default function PracticePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PracticeContent />
        </Suspense>
    );
}
