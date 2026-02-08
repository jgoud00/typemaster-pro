'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Timer, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { diagnosticAnalyzer } from '@/lib/algorithms/diagnostic-analyzer';
import { useDiagnosticStore } from '@/stores/diagnostic-store';

// Test text - diverse content to capture different key patterns
const TEST_TEXT = `The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The five boxing wizards jump quickly. Sphinx of black quartz, judge my vow. Two driven jocks help fax my big quiz. The jay, pig, fox, zebra and wolves quaintly amaze. Crazy Frederick bought many very exquisite opal jewels.`;

const TEST_DURATION = 60; // seconds

interface KeystrokeData {
    key: string;
    expectedKey: string;
    correct: boolean;
    timestamp: number;
    isBackspace: boolean;
}

type DiagnosticPhase = 'intro' | 'test' | 'analyzing';

export default function DiagnosticPage() {
    const router = useRouter();
    const { setDiagnosticResult, hasTakenDiagnostic } = useDiagnosticStore();

    const [phase, setPhase] = useState<DiagnosticPhase>('intro');
    const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [keystrokes, setKeystrokes] = useState<KeystrokeData[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [typedText, setTypedText] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    // Redirect if already taken
    useEffect(() => {
        if (hasTakenDiagnostic) {
            router.push('/');
        }
    }, [hasTakenDiagnostic, router]);

    // Timer countdown
    useEffect(() => {
        if (phase !== 'test' || !startTime) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = Math.max(0, TEST_DURATION - elapsed);
            setTimeRemaining(remaining);

            if (remaining === 0) {
                finishTest();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [phase, startTime]);

    const startTest = useCallback(() => {
        setPhase('test');
        setStartTime(Date.now());
        setTimeRemaining(TEST_DURATION);
        setCurrentIndex(0);
        setKeystrokes([]);
        setTypedText('');

        // Focus input after state update
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const finishTest = useCallback(() => {
        setPhase('analyzing');

        // Analyze results
        const duration = startTime ? Date.now() - startTime : TEST_DURATION * 1000;
        const result = diagnosticAnalyzer.analyze(keystrokes, duration);

        // Save to store
        setDiagnosticResult(result);

        // Navigate to results after short delay
        setTimeout(() => {
            router.push('/diagnostic/results');
        }, 2000);
    }, [keystrokes, startTime, setDiagnosticResult, router]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (phase !== 'test') return;

        const timestamp = Date.now();
        const expectedKey = TEST_TEXT[currentIndex];

        // Handle backspace
        if (e.key === 'Backspace') {
            setKeystrokes(prev => [...prev, {
                key: 'Backspace',
                expectedKey: '',
                correct: false,
                timestamp,
                isBackspace: true,
            }]);

            if (currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
                setTypedText(prev => prev.slice(0, -1));
            }
            return;
        }

        // Ignore modifier keys
        if (e.key.length !== 1) return;

        const isCorrect = e.key === expectedKey;

        setKeystrokes(prev => [...prev, {
            key: e.key,
            expectedKey,
            correct: isCorrect,
            timestamp,
            isBackspace: false,
        }]);

        setTypedText(prev => prev + e.key);
        setCurrentIndex(prev => prev + 1);

        // Check if completed text
        if (currentIndex >= TEST_TEXT.length - 1) {
            finishTest();
        }
    }, [phase, currentIndex, finishTest]);

    // Intro screen
    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full text-center space-y-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-24 h-24 mx-auto bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                    >
                        <Keyboard className="w-12 h-12 text-white" />
                    </motion.div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">Let&apos;s See How You Type</h1>
                        <p className="text-xl text-muted-foreground">
                            Type the text below for 60 seconds.
                        </p>
                        <p className="text-lg text-muted-foreground/70">
                            Don&apos;t worry about mistakes — just type naturally.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button
                            size="lg"
                            onClick={startTest}
                            className="gap-2 text-lg px-8 py-6"
                        >
                            Start Typing Test
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground/50">
                        This helps us personalize your learning path
                    </p>
                </motion.div>
            </div>
        );
    }

    // Analyzing screen
    if (phase === 'analyzing') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-6"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 mx-auto border-4 border-primary/30 border-t-primary rounded-full"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">Analyzing Your Typing...</h2>
                        <p className="text-muted-foreground mt-2">
                            Identifying patterns and creating your personalized path
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Test screen
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Timer bar */}
            <div className="fixed top-0 left-0 right-0 bg-card border-b z-50">
                <div className="container mx-auto p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Timer className="w-5 h-5 text-primary" />
                        <span className="text-2xl font-mono font-bold">
                            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="flex-1 max-w-md mx-8">
                        <Progress value={(1 - timeRemaining / TEST_DURATION) * 100} className="h-2" />
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {currentIndex} / {TEST_TEXT.length} characters
                    </div>
                </div>
            </div>

            {/* Main typing area */}
            <div className="flex-1 flex items-center justify-center pt-20 px-4">
                <div className="max-w-4xl w-full">
                    {/* Text display */}
                    <div
                        className="relative bg-card rounded-xl p-8 border text-xl leading-relaxed font-mono cursor-text"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {TEST_TEXT.split('').map((char, index) => {
                            let className = 'transition-colors duration-100 ';

                            if (index < currentIndex) {
                                // Already typed
                                const wasCorrect = keystrokes.find(
                                    (ks, i) => !ks.isBackspace &&
                                        keystrokes.slice(0, i + 1).filter(k => !k.isBackspace).length === index + 1
                                )?.correct;

                                className += wasCorrect
                                    ? 'text-green-500'
                                    : 'text-red-500 bg-red-500/20';
                            } else if (index === currentIndex) {
                                // Current character (cursor position)
                                className += 'bg-primary text-primary-foreground animate-pulse';
                            } else {
                                // Upcoming
                                className += 'text-muted-foreground';
                            }

                            return (
                                <span key={index} className={className}>
                                    {char}
                                </span>
                            );
                        })}

                        {/* Hidden input for capturing keystrokes */}
                        <input
                            ref={inputRef}
                            type="text"
                            className="absolute opacity-0 pointer-events-none"
                            onKeyDown={handleKeyDown}
                            autoFocus
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck={false}
                        />
                    </div>

                    <p className="text-center text-muted-foreground mt-6">
                        Click on the text if keyboard stops responding
                    </p>
                </div>
            </div>
        </div>
    );
}
