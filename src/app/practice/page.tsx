'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { useConfetti } from '@/hooks/use-confetti';
import { generateSpeedTestText, getRandomQuote, getRandomParagraph } from '@/lib/practice-texts';
import { PracticeMode, SpeedTestDuration, PerformanceRecord } from '@/types';
import toast from 'react-hot-toast';

function PracticeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialMode = (searchParams.get('mode') as PracticeMode) || 'free';

    const [mode, setMode] = useState<PracticeMode>(initialMode);
    const [duration, setDuration] = useState<SpeedTestDuration>(60);
    const [customText, setCustomText] = useState('');
    const [text, setText] = useState(() => getTextForMode(initialMode, 60));
    const [isComplete, setIsComplete] = useState(false);
    const [result, setResult] = useState<PerformanceRecord | null>(null);

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
        mode,
        timeLimitSeconds: mode === 'speed-test' ? duration : undefined,
        onComplete: handleComplete,
    });

    const handleStartTest = (newMode: PracticeMode, newDuration?: SpeedTestDuration) => {
        setMode(newMode);
        if (newDuration) setDuration(newDuration);
        setText(getTextForMode(newMode, newDuration || duration, customText));
        setIsComplete(false);
        setResult(null);
    };

    const handleReset = () => {
        reset();
        setIsComplete(false);
        setResult(null);
        completionHandledRef.current = false;
        toast.dismiss();
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="font-semibold">Practice Mode</h1>
                    </div>

                    <Button variant="ghost" size="icon" onClick={handleReset}>
                        <RotateCcw className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-6">
                {/* Mode Selection */}
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
                    wpm={wpm}
                    accuracy={accuracy}
                    combo={combo}
                    multiplier={multiplier}
                    elapsedTime={elapsedTime}
                    remainingTime={mode === 'speed-test' ? remainingTime : null}
                />

                {/* Typing area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <TypingArea
                        text={text}
                        currentIndex={currentIndex}
                        errorIndices={errorIndices}
                    />
                </motion.div>

                {/* Virtual keyboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <VirtualKeyboard activeKey={activeKey} />
                </motion.div>

                {/* Results */}
                {isComplete && result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card className="bg-linear-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
                            <CardContent className="p-6 text-center">
                                <h3 className="text-2xl font-bold mb-4">Test Complete!</h3>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <div className="text-3xl font-bold text-blue-400">{result.wpm}</div>
                                        <div className="text-sm text-muted-foreground">WPM</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-green-400">{result.accuracy}%</div>
                                        <div className="text-sm text-muted-foreground">Accuracy</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-orange-400">{result.maxCombo}</div>
                                        <div className="text-sm text-muted-foreground">Max Combo</div>
                                    </div>
                                </div>
                                <Button onClick={handleReset}>Try Again</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </main>
        </div>
    );
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
