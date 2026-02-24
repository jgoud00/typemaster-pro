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
// ... imports
import { useTypingController } from '@/hooks/use-typing-controller';
import { useTypingStore } from '@/stores/typing-store';
import { useSound } from '@/hooks/use-sound';
import { useConfetti } from '@/hooks/use-confetti';
import toast from 'react-hot-toast';
import { PerformanceRecord } from '@/types';

// ... SpeedTrainingPage component (remains mostly same, just imports)

// ============= Burst Mode =============

// ... getBurstText helper

export default function BurstMode() {
    const [phase, setPhase] = useState<'idle' | 'playing' | 'gameover'>('idle');
    const [startWpm, setStartWpm] = useState(40);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentWpmGoal, setCurrentWpmGoal] = useState(40);
    const [text, setText] = useState('');
    const [levelDuration, setLevelDuration] = useState(0);
    const { play } = useSound();
    const { fireLessonComplete } = useConfetti();
    const { getElapsedTime } = useTypingStore();

    // Force re-render for timer
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        if (phase === 'playing') {
            const interval = setInterval(() => setNow(Date.now()), 100);
            return () => clearInterval(interval);
        }
    }, [phase]);

    // ... startLevel, startGame, handleFail callbacks
    const startLevel = (level: number, wpm: number) => {
        console.log(`Starting level ${level} with target ${wpm} WPM`);
        setPhase('playing');
        setStartWpm(wpm);
        // Logic to generate text for level would go here
        setText("The quick brown fox jumps over the lazy dog. ".repeat(level));
    };

    const handleFail = useCallback(() => {
        setPhase('gameover');
        play('error');
        toast.error("Level failed! Try again.");
    }, [play]);

    const handleComplete = useCallback((record: PerformanceRecord) => {
        // ... (logic)
        const isTextComplete = record.totalChars >= text.length;
        const metWpm = record.wpm >= currentWpmGoal;

        if (isTextComplete && metWpm) {
            play('complete');
            const nextLevel = currentLevel + 1;
            const nextWpm = currentWpmGoal + 5;

            setCurrentLevel(nextLevel);
            setCurrentWpmGoal(nextWpm);

            toast.success(`Level ${currentLevel} cleared! Speed up!`);
            startLevel(nextLevel, nextWpm);
        } else {
            handleFail();
        }
    }, [currentLevel, currentWpmGoal, play, handleFail, startLevel, text.length]);

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
                    <CardTitle>Burst Mode</CardTitle>
                    <CardDescription>Reach the target WPM to advance to the next level.</CardDescription>
                </CardHeader>
                <CardContent>

                    {phase === 'playing' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <div className="text-xl font-bold">Level {currentLevel}</div>
                                <div className="text-4xl font-black text-orange-600 font-mono">
                                    {remainingTime.toFixed(1)}s
                                </div>
                                <div className="text-xl font-bold">Target: {currentWpmGoal} WPM</div>
                            </div>

                            <TypingArea
                                className="text-2xl"
                            />

                            <VirtualKeyboard />
                        </div>
                    )}

                    {/* ... gameover and idle states ... */}
                </CardContent>
            </Card >
        </div >
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
        reset,
    } = useTypingController({
        text,
        mode: 'free',
        onComplete: handleComplete,
    });

    // ... metronome logic

    // ... render
    return (
        <div className="space-y-6">
            {/* ... */}
            <TypingStats />
            <TypingArea />
            <VirtualKeyboard />
        </div>
    );
}

// ============= Sprint Mode =============

function SprintMode({ text, onTextChange }: { text: string; onTextChange: (t: string) => void }) {
    // ... state
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
    const { getElapsedTime } = useTypingStore();

    // Force update for timer
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        if (phase === 'sprint') {
            const interval = setInterval(() => setNow(Date.now()), 100);
            return () => clearInterval(interval);
        }
    }, [phase]);

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
        reset,
    } = useTypingController({
        text,
        mode: 'speed-test',
        timeLimitSeconds: phase === 'sprint' ? sprintDuration : undefined,
        onComplete: handleComplete,
    });

    const elapsedTime = getElapsedTime();
    const remainingTime = phase === 'sprint' ? Math.max(0, sprintDuration - elapsedTime) : 0;

    // ... countdown timer for rest

    const getRandomParagraph = () => "The quick brown fox jumps over the lazy dog.";

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
            {/* ... settings ... */}

            {phase === 'sprint' && (
                <div className="text-center space-y-4">
                    <div className="text-lg font-semibold">
                        Sprint {currentSprint + 1} of {totalSprints}
                    </div>
                    <motion.div
                        className="text-6xl font-bold text-primary"
                        key={remainingTime} // Key change might cause flicker if remainingTime updates often? 
                        // Actually simple text update is better.
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                    >
                        {remainingTime.toFixed(1)}s
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Type as fast as you can!</div>
                    <Button variant="destructive" onClick={stopTraining}>
                        Stop Training
                    </Button>
                </div>
            )}

            {/* ... rest and complete UI ... */}

            {/* Typing UI (only during sprint) */}
            {phase === 'sprint' && (
                <>
                    <TypingStats
                        remainingTime={remainingTime}
                    />
                    <TypingArea />
                    <VirtualKeyboard />
                </>
            )}
        </div>
    );
}
