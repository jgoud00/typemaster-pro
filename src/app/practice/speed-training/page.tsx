'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { useConfetti } from '@/hooks/use-confetti';
import { useSound } from '@/hooks/use-sound';
import { getRandomParagraph } from '@/lib/practice-texts';
import { PerformanceRecord } from '@/types';
import toast from 'react-hot-toast';

type TrainingMode = 'metronome' | 'sprint';

export default function SpeedTrainingPage() {
    const router = useRouter();
    const [mode, setMode] = useState<TrainingMode>('metronome');
    const [text, setText] = useState(() => getRandomParagraph());

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="font-semibold">Speed Training</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-6">
                {/* Mode Selection */}
                <Tabs value={mode} onValueChange={(v) => setMode(v as TrainingMode)}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="metronome">🎵 Metronome Mode</TabsTrigger>
                        <TabsTrigger value="sprint">⚡ Sprint Mode</TabsTrigger>
                    </TabsList>

                    <TabsContent value="metronome" className="mt-6">
                        <MetronomeMode text={text} onTextChange={setText} />
                    </TabsContent>

                    <TabsContent value="sprint" className="mt-6">
                        <SprintMode text={text} onTextChange={setText} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

// ============= Metronome Mode =============

function MetronomeMode({ text, onTextChange }: { text: string; onTextChange: (t: string) => void }) {
    const [bpm, setBpm] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [beat, setBeat] = useState(false);
    const beatRef = useRef<NodeJS.Timeout | null>(null);
    const completionHandledRef = useRef(false);
    const { play } = useSound();
    const { fireLessonComplete } = useConfetti();

    const handleComplete = useCallback((record: PerformanceRecord) => {
        if (completionHandledRef.current) return;
        completionHandledRef.current = true;
        setIsActive(false);
        fireLessonComplete();
        toast.dismiss();
        toast.success(`Great job! ${record.wpm} WPM at ${record.accuracy}% accuracy`, {
            id: 'metronome-complete',
        });
    }, [fireLessonComplete]);

    const {
        currentIndex,
        errorIndices,
        activeKey,
        wpm,
        accuracy,
        combo,
        multiplier,
        elapsedTime,
        reset,
    } = useTypingEngine({
        text,
        mode: 'free',
        onComplete: handleComplete,
    });

    // Metronome beat
    useEffect(() => {
        if (isActive) {
            const interval = 60000 / bpm;
            beatRef.current = setInterval(() => {
                setBeat(true);
                play('keystroke');
                setTimeout(() => setBeat(false), 100);
            }, interval);
        } else {
            if (beatRef.current) clearInterval(beatRef.current);
        }

        return () => {
            if (beatRef.current) clearInterval(beatRef.current);
        };
    }, [isActive, bpm, play]);

    const handleReset = () => {
        reset();
        setIsActive(false);
        completionHandledRef.current = false;
        toast.dismiss();
        onTextChange(getRandomParagraph());
    };

    // Target: type one character per beat
    const targetCharsPerMinute = bpm;
    const actualCharsPerMinute = wpm * 5; // Approximate

    return (
        <div className="space-y-6">
            {/* Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🎵 Metronome Training
                    </CardTitle>
                    <CardDescription>
                        Match your typing rhythm to the beat. Build consistent speed and muscle memory.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* BPM Control */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Tempo</span>
                            <span className="text-sm text-muted-foreground">{bpm} BPM</span>
                        </div>
                        <Slider
                            value={[bpm]}
                            onValueChange={([v]) => setBpm(v)}
                            min={30}
                            max={120}
                            step={5}
                            disabled={isActive}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Slow (30)</span>
                            <span>Fast (120)</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2">
                        <Button
                            size="lg"
                            onClick={() => setIsActive(!isActive)}
                            className="flex-1"
                        >
                            {isActive ? (
                                <>
                                    <Pause className="w-5 h-5 mr-2" /> Stop
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5 mr-2" /> Start Metronome
                                </>
                            )}
                        </Button>
                        <Button variant="outline" size="lg" onClick={handleReset}>
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Beat Indicator */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <motion.div
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${beat ? 'bg-primary' : 'bg-muted'
                                }`}
                            animate={{ scale: beat ? 1.2 : 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                        >
                            <Volume2 className={`w-8 h-8 ${beat ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats */}
            <TypingStats
                wpm={wpm}
                accuracy={accuracy}
                combo={combo}
                multiplier={multiplier}
                elapsedTime={elapsedTime}
            />

            {/* Typing Area */}
            <TypingArea
                text={text}
                currentIndex={currentIndex}
                errorIndices={errorIndices}
            />

            {/* Keyboard */}
            <VirtualKeyboard activeKey={activeKey} />
        </div>
    );
}

// ============= Sprint Mode =============

function SprintMode({ text, onTextChange }: { text: string; onTextChange: (t: string) => void }) {
    const [sprintDuration, setSprintDuration] = useState(15);
    const [restDuration, setRestDuration] = useState(5);
    const [totalSprints, setTotalSprints] = useState(5);
    const [currentSprint, setCurrentSprint] = useState(0);
    const [phase, setPhase] = useState<'idle' | 'sprint' | 'rest' | 'complete'>('idle');
    const [countdown, setCountdown] = useState(0);
    const [sprintResults, setSprintResults] = useState<number[]>([]);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);
    const { play } = useSound();
    const { fireLessonComplete } = useConfetti();

    const handleComplete = useCallback((record: PerformanceRecord) => {
        setSprintResults(prev => [...prev, record.wpm]);
        play('complete');

        if (currentSprint + 1 >= totalSprints) {
            setPhase('complete');
            fireLessonComplete();
        } else {
            setPhase('rest');
            setCountdown(restDuration);
        }
    }, [currentSprint, totalSprints, restDuration, play, fireLessonComplete]);

    const {
        currentIndex,
        errorIndices,
        activeKey,
        wpm,
        accuracy,
        combo,
        multiplier,
        elapsedTime,
        remainingTime,
        reset,
    } = useTypingEngine({
        text,
        mode: 'speed-test',
        timeLimitSeconds: phase === 'sprint' ? sprintDuration : undefined,
        onComplete: handleComplete,
    });

    // Countdown timer for rest periods
    useEffect(() => {
        if (phase === 'rest' && countdown > 0) {
            countdownRef.current = setTimeout(() => {
                setCountdown(c => c - 1);
            }, 1000);
        } else if (phase === 'rest' && countdown === 0) {
            // Start next sprint
            setCurrentSprint(prev => prev + 1);
            setPhase('sprint');
            onTextChange(getRandomParagraph());
            reset();
        }

        return () => {
            if (countdownRef.current) clearTimeout(countdownRef.current);
        };
    }, [phase, countdown, reset, onTextChange]);

    const startTraining = () => {
        setCurrentSprint(0);
        setSprintResults([]);
        setPhase('sprint');
        onTextChange(getRandomParagraph());
        reset();
    };

    const stopTraining = () => {
        setPhase('idle');
        setCurrentSprint(0);
        setSprintResults([]);
        reset();
    };

    const avgWpm = sprintResults.length > 0
        ? Math.round(sprintResults.reduce((a, b) => a + b, 0) / sprintResults.length)
        : 0;
    const peakWpm = Math.max(0, ...sprintResults);

    return (
        <div className="space-y-6">
            {/* Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        ⚡ Sprint Training
                    </CardTitle>
                    <CardDescription>
                        Short bursts of intense typing with rest periods. Perfect for building speed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {phase === 'idle' && (
                        <>
                            {/* Sprint Duration */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Sprint Duration</span>
                                    <span className="text-sm text-muted-foreground">{sprintDuration}s</span>
                                </div>
                                <Slider
                                    value={[sprintDuration]}
                                    onValueChange={([v]) => setSprintDuration(v)}
                                    min={10}
                                    max={60}
                                    step={5}
                                />
                            </div>

                            {/* Rest Duration */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Rest Duration</span>
                                    <span className="text-sm text-muted-foreground">{restDuration}s</span>
                                </div>
                                <Slider
                                    value={[restDuration]}
                                    onValueChange={([v]) => setRestDuration(v)}
                                    min={3}
                                    max={30}
                                    step={1}
                                />
                            </div>

                            {/* Total Sprints */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Number of Sprints</span>
                                    <span className="text-sm text-muted-foreground">{totalSprints}</span>
                                </div>
                                <Slider
                                    value={[totalSprints]}
                                    onValueChange={([v]) => setTotalSprints(v)}
                                    min={3}
                                    max={10}
                                    step={1}
                                />
                            </div>

                            <Button size="lg" onClick={startTraining} className="w-full">
                                <Play className="w-5 h-5 mr-2" /> Start Sprint Training
                            </Button>
                        </>
                    )}

                    {phase === 'sprint' && (
                        <div className="text-center space-y-4">
                            <div className="text-lg font-semibold">
                                Sprint {currentSprint + 1} of {totalSprints}
                            </div>
                            <motion.div
                                className="text-6xl font-bold text-primary"
                                key={remainingTime}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                            >
                                {remainingTime}s
                            </motion.div>
                            <div className="text-sm text-muted-foreground">Type as fast as you can!</div>
                            <Button variant="destructive" onClick={stopTraining}>
                                Stop Training
                            </Button>
                        </div>
                    )}

                    {phase === 'rest' && (
                        <motion.div
                            className="text-center space-y-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="text-lg font-semibold text-green-500">
                                Rest Period
                            </div>
                            <div className="text-6xl font-bold text-muted-foreground">
                                {countdown}s
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Next sprint starting soon...
                            </div>
                        </motion.div>
                    )}

                    {phase === 'complete' && (
                        <motion.div
                            className="text-center space-y-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="text-2xl font-bold text-primary">🎉 Training Complete!</div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-3xl font-bold">{avgWpm}</div>
                                    <div className="text-sm text-muted-foreground">Average WPM</div>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-3xl font-bold text-primary">{peakWpm}</div>
                                    <div className="text-sm text-muted-foreground">Peak WPM</div>
                                </div>
                            </div>

                            {/* Sprint Results */}
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Sprint Results</div>
                                <div className="flex justify-center gap-2 flex-wrap">
                                    {sprintResults.map((wpm, i) => (
                                        <div
                                            key={i}
                                            className="px-3 py-1 bg-muted rounded-full text-sm"
                                        >
                                            #{i + 1}: {wpm} WPM
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 justify-center">
                                <Button onClick={startTraining}>
                                    <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                                </Button>
                                <Button variant="outline" onClick={stopTraining}>
                                    Change Settings
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            {/* Typing UI (only during sprint) */}
            {phase === 'sprint' && (
                <>
                    <TypingStats
                        wpm={wpm}
                        accuracy={accuracy}
                        combo={combo}
                        multiplier={multiplier}
                        elapsedTime={elapsedTime}
                        remainingTime={remainingTime}
                    />
                    <TypingArea
                        text={text}
                        currentIndex={currentIndex}
                        errorIndices={errorIndices}
                    />
                    <VirtualKeyboard activeKey={activeKey} />
                </>
            )}
        </div>
    );
}
