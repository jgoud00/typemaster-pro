'use client';

import { useState, useRef, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link'; // Added for Hub links
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Clock, Zap, Brain, Rocket, Infinity as InfinityIcon, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingController } from '@/hooks/use-typing-controller';
import { useTypingStore } from '@/stores/typing-store';
import { useConfetti } from '@/hooks/use-confetti';
import { generateSpeedTestText, getRandomQuote, getRandomParagraph } from '@/lib/practice-texts';
import { PracticeMode, SpeedTestDuration, PerformanceRecord } from '@/types';
import toast from 'react-hot-toast';

import { ResultChart, WeaknessAnalysis } from '@/components/practice/result-chart';
import { RiskMeter } from '@/components/RiskMeter';
import { cn } from '@/lib/utils'; // Ensure cn is imported

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
                        title="Smart Practice"
                        description="AI-driven exercises targeting your specific weak keys."
                        href="/practice/smart"
                        icon={<Brain className="w-8 h-8" />}
                        color="from-purple-500/20 to-pink-500/20 border-purple-500/30"
                    />
                    <PracticeHubCard
                        title="Infinite Flow"
                        description="Zen mode for endless, distraction-free typing."
                        href="/practice/infinite"
                        icon={<InfinityIcon className="w-8 h-8" />}
                        color="from-indigo-500/20 to-violet-500/20 border-indigo-500/30"
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
function StandardPracticeInterface({ initialMode }: { initialMode: PracticeMode }) {
    const router = useRouter();
    const [mode, setMode] = useState<PracticeMode>(initialMode);
    const [duration, setDuration] = useState<SpeedTestDuration>(60);
    const [customText, setCustomText] = useState('');
    const [text, setText] = useState(() => getTextForMode(initialMode, 60));
    const [isComplete, setIsComplete] = useState(false);
    const [result, setResult] = useState<PerformanceRecord | null>(null);

    // Performance History Tracking
    const [history, setHistory] = useState<{ timestamp: number; wpm: number; errors: number; }[]>([]);
    const { fireLessonComplete } = useConfetti();
    const completionHandledRef = useRef(false);

    const handleComplete = (record: PerformanceRecord) => {
        if (completionHandledRef.current) return;
        completionHandledRef.current = true;

        setIsComplete(true);
        setResult(record);
        fireLessonComplete();
        toast.dismiss();
        toast.success(`Test complete! ${record.wpm} WPM with ${record.accuracy}% accuracy`, {
            id: 'speed-test-complete',
            duration: 5000,
        });
    };

    const {
        reset,
        isPaused,
        hasStarted,
        isComplete: controllerIsComplete
    } = useTypingController({
        text,
        mode,
        timeLimitSeconds: mode === 'speed-test' ? duration : undefined,
        onComplete: handleComplete,
    });

    // We can get it from store directly in the effect.

    // Correction: page.tsx NEEDS frequent updates for ghostIndex (targetWpm) and history chart.
    // If we want to optimize, we must move ghostIndex calculation and history tracking into separate components 
    // or accept that page will still re-render for those features.

    // To get elapsedTime for history, we need to import useTypingStore.

    const { getWpm, getElapsedTime, state } = useTypingStore();
    // derived state for this component (history tracking)
    const wpm = getWpm();
    const elapsedTime = getElapsedTime();
    const errorIndices = state.errorIndices;


    // Track history every second
    useEffect(() => {
        if (!hasStarted || isPaused || isComplete) return;

        const interval = setInterval(() => {
            setHistory(prev => [...prev, {
                timestamp: elapsedTime,
                wpm,
                errors: errorIndices.length
            }]);
        }, 1000);

        return () => clearInterval(interval);
    }, [hasStarted, isPaused, isComplete, elapsedTime, wpm, errorIndices.length]);

    const handleStartTest = (newMode: PracticeMode, newDuration?: SpeedTestDuration) => {
        setMode(newMode);
        if (newDuration) setDuration(newDuration);
        setText(getTextForMode(newMode, newDuration || duration, customText));
        setIsComplete(false);
        setResult(null);
        setHistory([]);
        // Update URL to match mode without full reload if possible, or just keep internal state
        // Keeping internal state is smoother for Tabs
    };

    const handleReset = () => {
        reset();
        setIsComplete(false);
        setResult(null);
        setHistory([]);
        completionHandledRef.current = false;
        toast.dismiss();
    };

    const [targetWpm, setTargetWpm] = useState<number>(0);

    // Ghost Racer Logic: (Target WPM * 5 chars/word) / 60 seconds = chars/second
    const ghostIndex = targetWpm > 0 ? (targetWpm * 5 / 60) * elapsedTime : undefined;

    // Calculate error breakdown
    const errorBreakdown = new Map<string, number>();
    errorIndices.forEach(idx => {
        const char = text[idx]?.toLowerCase();
        if (char) errorBreakdown.set(char, (errorBreakdown.get(char) || 0) + 1);
    });

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
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
                        {/* Target Speed Control */}
                        <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Ghost Racer</span>
                            <input
                                type="number"
                                min="0"
                                max="200"
                                value={targetWpm || ''}
                                onChange={(e) => setTargetWpm(Number(e.target.value))}
                                placeholder="Off"
                                className="w-12 bg-transparent border-none text-sm font-bold text-center focus:ring-0 p-0"
                            />
                            <span className="text-xs text-muted-foreground">WPM</span>
                        </div>

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
                                            value={customText}
                                            onChange={(e) => setCustomText(e.target.value)}
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

                        {/* Stats */}
                        <TypingStats
                            remainingTime={mode === 'speed-test' ? (duration - elapsedTime) : null}
                            targetWpm={targetWpm > 0 ? targetWpm : undefined}
                        />

                        {/* Typing area */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="mb-4">
                                <RiskMeter />
                            </div>
                            <TypingArea
                                ghostIndex={ghostIndex}
                            />
                        </motion.div>

                        {/* Virtual keyboard */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <VirtualKeyboard />
                        </motion.div>
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
            return generateSpeedTestText(duration);
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
