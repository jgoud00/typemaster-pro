'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Timer, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingController } from '@/hooks/use-typing-controller';
import { useTypingStore } from '@/stores/typing-store';
import { soundEngine } from '@/lib/sound-engine';
import { useConfetti } from '@/hooks/use-confetti';
import toast from 'react-hot-toast';
import { PerformanceRecord } from '@/types';
import { generateRandomText, generateSpeedTestText, getRandomParagraph } from '@/lib/practice-texts';
import { TIMERS } from '@/lib/config/constants';

// ============= Parent Speed Training Page =============

export default function SpeedTrainingPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('burst');
    const [sharedText, setSharedText] = useState(() => getRandomParagraph());

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6 text-primary" />
                        <h1 className="text-xl font-bold">Speed Training</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                        <TabsTrigger value="burst" className="gap-2">
                            <Zap className="w-4 h-4" />
                            Burst
                        </TabsTrigger>
                        <TabsTrigger value="metronome" className="gap-2">
                            <Timer className="w-4 h-4" />
                            Metronome
                        </TabsTrigger>
                        <TabsTrigger value="sprint" className="gap-2">
                            <Activity className="w-4 h-4" />
                            Sprint
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="burst">
                        <BurstMode />
                    </TabsContent>

                    <TabsContent value="metronome">
                        <MetronomeMode text={sharedText} onTextChange={setSharedText} />
                    </TabsContent>

                    <TabsContent value="sprint">
                        <SprintMode text={sharedText} onTextChange={setSharedText} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

// ============= Burst Mode =============

function getBurstText(level: number): string {
    const wordCount = 10 + level * 5;
    return generateRandomText(wordCount);
}

function BurstMode() {
    const [phase, setPhase] = useState<'idle' | 'playing' | 'gameover'>('idle');
    const [startWpm, setStartWpm] = useState(40);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentWpmGoal, setCurrentWpmGoal] = useState(40);
    const [text, setText] = useState('');
    const [levelDuration] = useState(0);
    const [highestLevel, setHighestLevel] = useState(0);
    const { fireLessonComplete } = useConfetti();
    const { getElapsedTime } = useTypingStore();

    // Refs to avoid stale closures in handleComplete
    const currentLevelRef = useRef(currentLevel);
    const currentWpmGoalRef = useRef(currentWpmGoal);
    const textRef = useRef(text);

    useEffect(() => {
        currentLevelRef.current = currentLevel;
        currentWpmGoalRef.current = currentWpmGoal;
        textRef.current = text;
    }, [currentLevel, currentWpmGoal, text]);



    const startLevel = useCallback((level: number, wpm: number) => {
        setPhase('playing');
        setCurrentWpmGoal(wpm);
        setText(getBurstText(level));
    }, []);

    const startGame = useCallback(() => {
        setCurrentLevel(1);
        setCurrentWpmGoal(startWpm);
        setHighestLevel(0);
        startLevel(1, startWpm);
    }, [startWpm, startLevel]);

    const handleFail = useCallback(() => {
        setPhase('gameover');
        soundEngine.play('error');
        setHighestLevel(prev => Math.max(prev, currentLevelRef.current));
    }, []);

    const handleComplete = useCallback((record: PerformanceRecord) => {
        const lvl = currentLevelRef.current;
        const wpmGoal = currentWpmGoalRef.current;
        const textLen = textRef.current.length;

        const isTextComplete = record.totalChars >= textLen;
        const metWpm = record.wpm >= wpmGoal;

        if (isTextComplete && metWpm) {
            const nextLevel = lvl + 1;
            const nextWpm = wpmGoal + 5;

            setCurrentLevel(nextLevel);
            setCurrentWpmGoal(nextWpm);
            setHighestLevel(prev => Math.max(prev, nextLevel));

            toast.success(`Level ${lvl} cleared! Speed up to ${nextWpm} WPM!`);
            startLevel(nextLevel, nextWpm);
        } else {
            handleFail();
        }
    }, [handleFail, startLevel]);

    const {
        reset,
    } = useTypingController({
        text,
        mode: 'speed-test',
        timeLimitSeconds: levelDuration > 0 ? levelDuration : undefined,
        onComplete: handleComplete,
    });

    const elapsedTime = getElapsedTime();
    const remainingTime = levelDuration > 0 ? Math.max(0, levelDuration - elapsedTime) : 0;

    useEffect(() => {
        if (phase === 'gameover') {
            reset();
        }
    }, [phase, reset]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-500" />
                        Burst Mode
                    </CardTitle>
                    <CardDescription>Reach the target WPM to advance to the next level. Each level gets harder!</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Idle State */}
                    {phase === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8 py-4"
                        >
                            <div className="text-center space-y-2">
                                <div className="text-6xl font-black text-primary">{startWpm}</div>
                                <div className="text-lg text-muted-foreground">Starting WPM Target</div>
                            </div>

                            <div className="max-w-sm mx-auto space-y-2">
                                <label className="text-sm font-medium">Starting Speed</label>
                                <Slider
                                    value={[startWpm]}
                                    onValueChange={([v]) => setStartWpm(v)}
                                    min={20}
                                    max={100}
                                    step={5}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>20 WPM</span>
                                    <span>100 WPM</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <Button size="lg" onClick={startGame} className="gap-2 px-8">
                                    <Play className="w-5 h-5" />
                                    Start Burst Mode
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Playing State */}
                    {phase === 'playing' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <div className="text-center">
                                    <div className="text-3xl font-black text-primary">Lv.{currentLevel}</div>
                                    <div className="text-xs text-muted-foreground">Level</div>
                                </div>
                                {levelDuration > 0 && (
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-orange-600 font-mono">
                                            {remainingTime.toFixed(1)}s
                                        </div>
                                    </div>
                                )}
                                <div className="text-center">
                                    <div className="text-3xl font-black text-orange-500">{currentWpmGoal}</div>
                                    <div className="text-xs text-muted-foreground">Target WPM</div>
                                </div>
                            </div>

                            <TypingArea className="text-2xl" />
                            <VirtualKeyboard />
                        </div>
                    )}

                    {/* Game Over State */}
                    {phase === 'gameover' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 py-8"
                        >
                            <div className="text-5xl">💥</div>
                            <div>
                                <h3 className="text-2xl font-bold">Game Over!</h3>
                                <p className="text-muted-foreground mt-1">
                                    You reached <span className="text-primary font-bold">Level {currentLevel}</span> with a target of{' '}
                                    <span className="text-orange-500 font-bold">{currentWpmGoal} WPM</span>
                                </p>
                            </div>

                            {highestLevel > 1 && (
                                <div className="text-sm text-muted-foreground">
                                    Highest level this session: <span className="font-bold text-foreground">{highestLevel}</span>
                                </div>
                            )}

                            <div className="flex justify-center gap-3">
                                <Button variant="outline" onClick={() => setPhase('idle')}>
                                    Change Settings
                                </Button>
                                <Button onClick={startGame} className="gap-2">
                                    <RotateCcw className="w-4 h-4" />
                                    Try Again
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
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
        reset,
    } = useTypingController({
        text,
        mode: 'free',
        onComplete: handleComplete,
    });

    // Metronome tick logic
    useEffect(() => {
        if (isActive) {
            const intervalMs = (60 / bpm) * 1000;
            beatRef.current = setInterval(() => {
                setBeat(true);
                soundEngine.play('keystroke');
                setTimeout(() => setBeat(false), TIMERS.COUNTDOWN_TICK_MS);
            }, intervalMs);

            return () => {
                if (beatRef.current) clearInterval(beatRef.current);
            };
        } else {
            if (beatRef.current) {
                clearInterval(beatRef.current);
                beatRef.current = null;
            }
        }
    }, [isActive, bpm]);

    const handleStart = () => {
        completionHandledRef.current = false;
        reset();
        setIsActive(true);
    };

    const handleStop = () => {
        setIsActive(false);
    };

    const handleNewText = () => {
        onTextChange(getRandomParagraph());
        reset();
        completionHandledRef.current = false;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-blue-500" />
                        Metronome Mode
                    </CardTitle>
                    <CardDescription>Type in rhythm with the beat to build consistent timing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* BPM Control */}
                    <div className="flex items-center gap-6">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Tempo: {bpm} BPM</label>
                            <Slider
                                value={[bpm]}
                                onValueChange={([v]) => setBpm(v)}
                                min={40}
                                max={200}
                                step={5}
                                disabled={isActive}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Slow (40)</span>
                                <span>Fast (200)</span>
                            </div>
                        </div>

                        {/* Beat Indicator */}
                        <div className="flex flex-col items-center gap-2">
                            <motion.div
                                className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-colors ${
                                    beat
                                        ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50'
                                        : 'bg-muted border-muted-foreground/20'
                                }`}
                                animate={beat ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                transition={{ duration: 0.1 }}
                            >
                                <span className="text-2xl">{beat ? '🎵' : '○'}</span>
                            </motion.div>
                            <span className="text-xs text-muted-foreground">Beat</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-3">
                        {!isActive ? (
                            <>
                                <Button variant="outline" onClick={handleNewText} className="gap-2">
                                    <RotateCcw className="w-4 h-4" />
                                    New Text
                                </Button>
                                <Button onClick={handleStart} className="gap-2">
                                    <Play className="w-4 h-4" />
                                    Start Metronome
                                </Button>
                            </>
                        ) : (
                            <Button variant="destructive" onClick={handleStop} className="gap-2">
                                <Pause className="w-4 h-4" />
                                Stop Metronome
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Typing Area */}
            <TypingStats />
            <TypingArea />
            <VirtualKeyboard />
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
    const { fireLessonComplete } = useConfetti();
    const { getElapsedTime } = useTypingStore();

    // Refs to avoid stale closures
    const currentSprintRef = useRef(currentSprint);
    const totalSprintsRef = useRef(totalSprints);

    useEffect(() => {
        currentSprintRef.current = currentSprint;
        totalSprintsRef.current = totalSprints;
    }, [currentSprint, totalSprints]);

    // Force update for timer
    const [, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (phase === 'sprint') {
            const interval = setInterval(() => setNow(Date.now()), TIMERS.COUNTDOWN_TICK_MS);
            return () => clearInterval(interval);
        }
    }, [phase]);

    const handleComplete = useCallback((record: PerformanceRecord) => {
        const sprint = currentSprintRef.current;
        const total = totalSprintsRef.current;

        setSprintResults(prev => [...prev, record.wpm]);

        if (sprint + 1 >= total) {
            setPhase('complete');
            fireLessonComplete();
        } else {
            setPhase('rest');
            setCountdown(restDuration);
        }
    }, [restDuration, fireLessonComplete]);

    const {
        reset,
    } = useTypingController({
        text,
        mode: 'speed-test',
        timeLimitSeconds: phase === 'sprint' ? sprintDuration : undefined,
        onComplete: handleComplete,
    });

    const elapsedTime = getElapsedTime();
    const remainingTime = phase === 'sprint' ? Math.max(0, sprintDuration - elapsedTime) : 0;

    // Countdown timer for rest phase
    useEffect(() => {
        if (phase === 'rest' && countdown > 0) {
            countdownRef.current = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => {
                if (countdownRef.current) clearTimeout(countdownRef.current);
            };
        } else if (phase === 'rest' && countdown === 0) {
            // Rest over → start next sprint
            const nextSprint = currentSprintRef.current + 1;
            setCurrentSprint(nextSprint);
            setPhase('sprint');
            onTextChange(generateSpeedTestText(sprintDuration, Math.random().toString()));
            reset();
            soundEngine.play('keystroke');
        }
    }, [phase, countdown, sprintDuration, onTextChange, reset]);

    const startTraining = () => {
        setCurrentSprint(0);
        setSprintResults([]);
        setPhase('sprint');
        onTextChange(generateSpeedTestText(sprintDuration, Math.random().toString()));
        reset();
    };

    const stopTraining = () => {
        setPhase('idle');
        setCurrentSprint(0);
        setSprintResults([]);
        if (countdownRef.current) clearTimeout(countdownRef.current);
        reset();
    };

    const avgWpm = sprintResults.length > 0
        ? Math.round(sprintResults.reduce((a, b) => a + b, 0) / sprintResults.length)
        : 0;
    const peakWpm = Math.max(0, ...sprintResults);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-500" />
                        Sprint Mode
                    </CardTitle>
                    <CardDescription>Alternate between intense typing sprints and rest periods.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Idle / Settings */}
                    {phase === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 py-4"
                        >
                            <div className="grid gap-6 max-w-sm mx-auto">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sprint Duration: {sprintDuration}s</label>
                                    <Slider
                                        value={[sprintDuration]}
                                        onValueChange={([v]) => setSprintDuration(v)}
                                        min={10}
                                        max={60}
                                        step={5}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>10s</span>
                                        <span>60s</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rest Duration: {restDuration}s</label>
                                    <Slider
                                        value={[restDuration]}
                                        onValueChange={([v]) => setRestDuration(v)}
                                        min={3}
                                        max={15}
                                        step={1}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>3s</span>
                                        <span>15s</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Total Sprints: {totalSprints}</label>
                                    <Slider
                                        value={[totalSprints]}
                                        onValueChange={([v]) => setTotalSprints(v)}
                                        min={3}
                                        max={10}
                                        step={1}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>3</span>
                                        <span>10</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                Total time: ~{totalSprints * sprintDuration + (totalSprints - 1) * restDuration}s
                                ({Math.round((totalSprints * sprintDuration + (totalSprints - 1) * restDuration) / 60)}min)
                            </div>

                            <div className="text-center">
                                <Button size="lg" onClick={startTraining} className="gap-2 px-8">
                                    <Play className="w-5 h-5" />
                                    Start Sprint Training
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Sprint Phase */}
                    {phase === 'sprint' && (
                        <div className="text-center space-y-4">
                            <div className="text-lg font-semibold">
                                Sprint {currentSprint + 1} of {totalSprints}
                            </div>
                            <div className="text-6xl font-bold text-primary font-mono">
                                {remainingTime.toFixed(1)}s
                            </div>
                            <div className="text-sm text-muted-foreground">Type as fast as you can!</div>
                            <Button variant="destructive" onClick={stopTraining}>
                                Stop Training
                            </Button>
                        </div>
                    )}

                    {/* Rest Phase */}
                    {phase === 'rest' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 py-8"
                        >
                            <div className="text-lg font-semibold text-muted-foreground">Rest Period</div>

                            <motion.div
                                className="relative w-32 h-32 mx-auto"
                                key={countdown}
                            >
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50" cy="50" r="42"
                                        fill="none"
                                        stroke="currentColor"
                                        className="text-muted/30"
                                        strokeWidth="6"
                                    />
                                    <circle
                                        cx="50" cy="50" r="42"
                                        fill="none"
                                        stroke="currentColor"
                                        className="text-green-500"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray={264}
                                        strokeDashoffset={264 * (1 - countdown / restDuration)}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl font-black">{countdown}</span>
                                </div>
                            </motion.div>

                            <div className="text-sm text-muted-foreground">
                                Get ready for Sprint {currentSprint + 2}!
                            </div>

                            {sprintResults.length > 0 && (
                                <div className="text-sm">
                                    Last sprint: <span className="font-bold text-primary">{sprintResults[sprintResults.length - 1]} WPM</span>
                                </div>
                            )}

                            <Button variant="outline" size="sm" onClick={stopTraining}>
                                Stop Training
                            </Button>
                        </motion.div>
                    )}

                    {/* Complete Phase */}
                    {phase === 'complete' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6 py-8"
                        >
                            <div className="text-5xl">🏆</div>
                            <h3 className="text-2xl font-bold">Sprint Training Complete!</h3>

                            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                                <div className="bg-muted/50 rounded-xl p-4">
                                    <div className="text-3xl font-black text-primary">{avgWpm}</div>
                                    <div className="text-xs text-muted-foreground">Avg WPM</div>
                                </div>
                                <div className="bg-muted/50 rounded-xl p-4">
                                    <div className="text-3xl font-black text-orange-500">{peakWpm}</div>
                                    <div className="text-xs text-muted-foreground">Peak WPM</div>
                                </div>
                            </div>

                            {/* Per-sprint results */}
                            <div className="max-w-sm mx-auto space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Sprint Results</h4>
                                <div className="flex items-end justify-center gap-2 h-24">
                                    {sprintResults.map((wpm, i) => {
                                        const maxWpm = Math.max(...sprintResults, 1);
                                        const heightPct = (wpm / maxWpm) * 100;
                                        return (
                                            <div key={i} className="flex flex-col items-center gap-1">
                                                <span className="text-xs font-mono">{wpm}</span>
                                                <motion.div
                                                    className="w-8 bg-primary/80 rounded-t"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${heightPct}%` }}
                                                    transition={{ delay: i * 0.1 }}
                                                />
                                                <span className="text-[10px] text-muted-foreground">S{i + 1}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-center gap-3">
                                <Button variant="outline" onClick={() => setPhase('idle')}>
                                    Change Settings
                                </Button>
                                <Button onClick={startTraining} className="gap-2">
                                    <RotateCcw className="w-4 h-4" />
                                    Go Again
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            {/* Typing UI (only during sprint) */}
            {phase === 'sprint' && (
                <>
                    <TypingStats remainingTime={remainingTime} />
                    <TypingArea />
                    <VirtualKeyboard />
                </>
            )}
        </div>
    );
}
