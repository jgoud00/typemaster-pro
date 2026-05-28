'use client';

import { useState, useRef, Suspense, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link'; // Added for Hub links
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Clock, Zap, Rocket, Keyboard, Trophy, Target, Feather, PenTool, Skull } from 'lucide-react';
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
import { useProgressStore } from '@/stores/progress-store';
import { useLeaderboardStore } from '@/stores/leaderboard-store';
import { useSettingsStore } from '@/stores/settings-store';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { ComboPopup, StreakBreakPopup } from '@/components/gamification/combo-popup';
import { LiveFlowGraph } from '@/components/typing/live-flow-graph';
import { generateAdaptiveText, getRandomQuote, getRandomParagraph, generateWeaknessTargetedText, generateRandomText } from '@/lib/practice-texts';
import { PracticeMode, SpeedTestDuration, PerformanceRecord } from '@/types';
import toast from 'react-hot-toast';

import { ResultChart, WeaknessAnalysis } from '@/components/practice/result-chart';
import { cn } from '@/lib/utils';
import { API_ROUTES, TIMERS } from '@/lib/config/constants';

import { SiteHeader } from '@/components/layout/SiteHeader';

// --- Practice Hub Component ---
function PracticeHub() {
    return (
        <div className="min-h-screen relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <SiteHeader />

            <main className="container mx-auto px-4 py-16 space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-strong border-blue-500/30 text-blue-400 text-sm font-medium mb-4"
                    >
                        <Zap className="w-4 h-4" />
                        <span>Training Grounds</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white"
                    >
                        Choose Your Challenge
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg"
                    >
                        Select a mode to hone your typing skills. From timed sprints to relaxing zen sessions.
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                >
                    <PracticeHubCard
                        title="Free Practice"
                        description="Relaxed typing with random paragraphs. Great for warm-ups and general practice."
                        href="/practice?mode=free"
                        icon={<Keyboard className="w-8 h-8" />}
                        color="from-blue-500/10 to-cyan-500/5 border-blue-500/20"
                        accentColor="text-cyan-400"
                        glowColor="rgba(56, 189, 248, 0.5)"
                    />
                    <PracticeHubCard
                        title="Speed Test"
                        description="Test your WPM in timed 60s, 2m, or 5m dashes to rank on the leaderboard."
                        href="/practice?mode=speed-test"
                        icon={<Clock className="w-8 h-8" />}
                        color="from-yellow-500/10 to-orange-500/5 border-yellow-500/20"
                        accentColor="text-yellow-400"
                        glowColor="rgba(250, 204, 21, 0.5)"
                    />
                    <PracticeHubCard
                        title="Sudden Death"
                        description="Accuracy is everything. Make 3 mistakes and it's game over."
                        href="/practice?mode=sudden-death"
                        icon={<Skull className="w-8 h-8" />}
                        color="from-red-500/10 to-rose-500/5 border-red-500/20"
                        accentColor="text-rose-400"
                        glowColor="rgba(244, 63, 94, 0.5)"
                    />

                </motion.div>
            </main>
        </div>
    );
}

function PracticeHubCard({ title, description, href, icon, color, accentColor, glowColor }: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: string;
    accentColor: string;
    glowColor: string;
}) {
    return (
        <Link href={href} className="block group h-full">
            <div className={cn(
                "relative h-full rounded-2xl p-6 glass-card border transition-all duration-500 overflow-hidden",
                color,
                "hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-2xl"
            )}>
                {/* Hover Glow */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`
                    }}
                />
                
                <div className="relative z-10">
                    <div className={cn("mb-6 p-4 w-fit rounded-xl bg-black/40 backdrop-blur-md border border-white/5", accentColor)}>
                        {icon}
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                        {title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed text-sm">
                        {description}
                    </p>
                </div>
                
                {/* Bottom decorative line */}
                <div className={cn("absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-current to-transparent", accentColor)} />
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
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-white">
                        <Trophy className="w-4 h-4 text-yellow-500" />
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
                                tab === 'local' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                            )}
                        >
                            Local
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {globalLoading && tab === 'global' ? (
                    <div className="text-xs text-zinc-500 text-center py-8 animate-pulse">
                        Loading global leaderboard...
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-xs text-zinc-500 text-center py-8">
                        {tab === 'global' ? 'No global scores yet. Be the first!' : 'No scores yet. Start typing!'}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {entries.slice(0, 10).map((entry, i) => (
                            <div key={`${entry.username}-${i}`} className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={cn(
                                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                                        i === 0 ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" :
                                        i === 1 ? "bg-zinc-300/20 text-zinc-300 border border-zinc-300/30" :
                                        i === 2 ? "bg-orange-600/20 text-orange-500 border border-orange-600/30" :
                                        "bg-zinc-800/50 text-zinc-500 border border-zinc-700/50"
                                    )}>
                                        {i + 1}
                                    </div>
                                    <span className={cn(
                                        "text-sm font-medium truncate",
                                        i < 3 ? "text-white" : "text-zinc-300"
                                    )}>{entry.username}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className={cn(
                                        "font-bold",
                                        i === 0 ? "text-yellow-500" : "text-blue-400"
                                    )}>
                                        <span className="font-black text-sm">{entry.wpm}</span> <span className="text-[10px] text-zinc-500">WPM</span>
                                    </span>
                                    <span className="text-zinc-500 font-medium">{entry.accuracy}%</span>
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
    const [wordCount, setWordCount] = useState<number>(25);
    const [customText, setCustomText] = useState('');
    const [text, setText] = useState(() => getTextForMode(initialMode, 60, '', 25));
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
        errorLimit: mode === 'sudden-death' ? 3 : undefined,
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
        if (mode === 'free' || mode === 'custom') return; // Do not dynamically extend for fixed-length modes
        const remainingChars = text.length - currentIndex;
        if (remainingChars < 100) {
            setText(prev => prev + ' ' + generateAdaptiveText(20, difficulty));
        }
    }, [currentIndex, text.length, difficulty, hasStarted, isComplete, mode]);

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

    const handleStartTest = async (newMode: PracticeMode, newDuration?: SpeedTestDuration, newWordCount?: number) => {
        // Fix 8: Block empty input and sanitize text
        setMode(newMode);
        if (newDuration) setDuration(newDuration);
        if (newWordCount) setWordCount(newWordCount);
        const rawText = getTextForMode(newMode, newDuration || duration, customText, newWordCount || wordCount);
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
     
    }, [isComplete, text]);

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header - Focus Mode (Hidden when typing) */}
            <header className={cn(
                "border-b border-zinc-800/80 bg-black/50 backdrop-blur-xl sticky top-0 z-40 transition-all duration-700",
                hasStarted && !isComplete ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"
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
                        {/* Mode Configuration */
                        <div className={cn(
                            "transition-all duration-700 max-w-2xl mx-auto w-full",
                            hasStarted && !isComplete ? "opacity-0 h-0 overflow-hidden pointer-events-none translate-y-[-20px]" : "opacity-100 mb-8"
                        )}>
                            {mode === 'speed-test' && (
                                <Card className="glass-card">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-white">
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
                                                            ? 'bg-yellow-500 hover:bg-yellow-600 text-black border-transparent' 
                                                            : 'border-white/10 hover:bg-white/5 text-zinc-300'
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
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <Target className="w-5 h-5 text-blue-400" />
                                            Word Count
                                        </CardTitle>
                                        <CardDescription className="text-zinc-400">Choose how many words to type</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-3">
                                            {[10, 25, 50, 100].map((w) => (
                                                <Button
                                                    key={w}
                                                    variant={wordCount === w ? 'default' : 'outline'}
                                                    className={cn(
                                                        wordCount === w 
                                                            ? 'bg-blue-500 hover:bg-blue-600 text-white border-transparent' 
                                                            : 'border-white/10 hover:bg-white/5 text-zinc-300'
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
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <PenTool className="w-5 h-5 text-zinc-300" />
                                            Custom Text
                                        </CardTitle>
                                        <CardDescription className="text-zinc-400">Paste your own text to practice</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <textarea
                                            className="w-full h-32 p-4 rounded-xl border border-white/10 bg-black/40 text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-600"
                                            placeholder="Paste your text here..."
                                            maxLength={5000}
                                            value={customText}
                                            onChange={(e) => setCustomText(
                                                e.target.value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').replace(/[\u200B-\u200F\uFEFF]/g, '')
                                            )}
                                        />
                                        <Button
                                            className="w-full bg-white text-black hover:bg-zinc-200"
                                            onClick={() => handleStartTest('custom')}
                                            disabled={!customText.trim()}
                                        >
                                            Start Practice
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>}

                    {/* Main Focus Area - Centered */}
                    <div className={cn("flex flex-col items-center justify-center max-w-5xl mx-auto w-full transition-all duration-700", hasStarted ? "min-h-[90vh]" : "min-h-[60vh]")}>
                        {mode !== 'zen' && (
                            <>
                                {/* Flow Score & Trend Graph */}
                                <div className={cn(
                                    "flex items-center gap-6 mb-8 h-12 transition-opacity duration-1000",
                                    hasStarted ? "opacity-40 hover:opacity-100" : "opacity-20"
                                )}>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-(--color-content-muted) font-black">Flow</span>
                                        <span className={cn(
                                            "text-xl font-black tabular-nums transition-colors duration-500",
                                            {
                                                'text-teal-400': trend === 'rising',
                                                'text-rose-400': trend === 'falling',
                                                'text-(--color-content-muted)': trend === 'stable'
                                            }
                                        )}>
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
                            isNewPersonalBest={(result?.wpm ?? 0) > (useProgressStore.getState().progress.personalBests?.wpm ?? 0)}
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
    // If 'mode' param is present, show standard practice interface.
    // If not, show the Hub.
    const modeParam = searchParams.get('mode') as PracticeMode | null;

    if (!modeParam) {
        return <PracticeHub />;
    }

    return <StandardPracticeInterface initialMode={modeParam} />;
}

function getTextForMode(mode: PracticeMode, duration: number, customText?: string, wordCount: number = 25): string {
    switch (mode) {
        case 'speed-test':
            return generateAdaptiveText(Math.ceil(duration / 60 * 50), 'medium');
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PracticeContent />
        </Suspense>
    );
}
