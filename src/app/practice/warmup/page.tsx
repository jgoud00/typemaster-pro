'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { warmupGenerator, type WarmupRoutine, type WarmupExercise } from '@/lib/algorithms/warmup-generator';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { TypingArea } from '@/components/typing/typing-area';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WarmupRoutinePage() {
    const router = useRouter();
    const [routine, setRoutine] = useState<WarmupRoutine | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(-1);
    const [isTyping, setIsTyping] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<number[]>([]);
    const completionHandledRef = useRef(false);

    // Generate routine on mount
    useEffect(() => {
        setRoutine(warmupGenerator.generateRoutine());
    }, []);

    const currentExercise = routine?.exercises[currentExerciseIndex] || null;

    const handleComplete = useCallback(() => {
        if (completionHandledRef.current) return;
        completionHandledRef.current = true;

        setCompletedExercises(prev => [...prev, currentExerciseIndex]);
        setIsTyping(false);

        // Auto-advance to next exercise after brief delay
        setTimeout(() => {
            if (routine && currentExerciseIndex < routine.exercises.length - 1) {
                startExercise(currentExerciseIndex + 1);
            }
        }, 1500);
    }, [currentExerciseIndex, routine]);

    const {
        currentIndex,
        errorIndices,
        activeKey,
        wpm,
        accuracy,
        reset,
    } = useTypingEngine({
        text: currentExercise?.text || '',
        mode: 'free',
        onComplete: handleComplete,
    });

    const startExercise = (index: number) => {
        setCurrentExerciseIndex(index);
        setIsTyping(true);
        completionHandledRef.current = false;
        reset();
    };

    const regenerateRoutine = () => {
        setRoutine(warmupGenerator.generateRoutine());
        setCurrentExerciseIndex(-1);
        setCompletedExercises([]);
        setIsTyping(false);
    };

    const totalProgress = routine
        ? (completedExercises.length / routine.exercises.length) * 100
        : 0;

    const isComplete = routine && completedExercises.length === routine.exercises.length;

    if (!routine) return null;

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">🔥 Warm-up Routine</h1>
                            <p className="text-sm text-muted-foreground">2-minute personalized warm-up</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={regenerateRoutine}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        New Routine
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-6">
                {/* Overall Progress */}
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Warm-up Progress</span>
                            <span className="text-sm text-muted-foreground">
                                {completedExercises.length}/{routine.exercises.length} exercises
                            </span>
                        </div>
                        <Progress value={totalProgress} className="h-2" />
                    </CardContent>
                </Card>

                {/* Focus Areas */}
                {routine.focusAreas.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Today&apos;s focus:</span>
                        {routine.focusAreas.map(key => (
                            <Badge key={key} variant="secondary">{key.toUpperCase()}</Badge>
                        ))}
                    </div>
                )}

                {!isTyping ? (
                    <>
                        {/* Exercise List */}
                        <div className="grid gap-3">
                            {routine.exercises.map((exercise, index) => (
                                <ExerciseCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    index={index}
                                    isCompleted={completedExercises.includes(index)}
                                    isCurrent={index === currentExerciseIndex}
                                    onStart={() => startExercise(index)}
                                />
                            ))}
                        </div>

                        {/* Start Button */}
                        {!isComplete && (
                            <div className="flex justify-center pt-4">
                                <Button size="lg" onClick={() => startExercise(completedExercises.length)}>
                                    <Play className="w-5 h-5 mr-2" />
                                    {completedExercises.length === 0 ? 'Start Warm-up' : 'Continue'}
                                </Button>
                            </div>
                        )}

                        {/* Completion Message */}
                        {isComplete && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="text-6xl mb-4">🎉</div>
                                <h2 className="text-2xl font-bold mb-2">Warm-up Complete!</h2>
                                <p className="text-muted-foreground mb-4">
                                    You&apos;re ready to start practicing. Your fingers are warmed up!
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Button onClick={() => router.push('/practice')}>
                                        Start Practice
                                    </Button>
                                    <Button variant="outline" onClick={regenerateRoutine}>
                                        Another Warm-up
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </>
                ) : (
                    /* Typing UI */
                    currentExercise && (
                        <>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <Badge className={cn(
                                                currentExercise.type === 'home_row' && 'bg-blue-500',
                                                currentExercise.type === 'weak_keys' && 'bg-red-500',
                                                currentExercise.type === 'finger_stretch' && 'bg-purple-500',
                                                currentExercise.type === 'speed_burst' && 'bg-orange-500',
                                                currentExercise.type === 'accuracy_focus' && 'bg-green-500',
                                            )}>
                                                {currentExercise.type.replace('_', ' ')}
                                            </Badge>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {currentExercise.instructions}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold">{wpm}</div>
                                            <div className="text-xs text-muted-foreground">WPM</div>
                                        </div>
                                    </div>

                                    {currentExercise.targetKeys.length > 0 && (
                                        <div className="flex gap-1 mt-2">
                                            {currentExercise.targetKeys.slice(0, 5).map(k => (
                                                <Badge key={k} variant="outline" className="text-xs">
                                                    {k.toUpperCase()}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <TypingArea
                                text={currentExercise.text}
                                currentIndex={currentIndex}
                                errorIndices={errorIndices}
                            />

                            <VirtualKeyboard activeKey={activeKey} />

                            <div className="flex justify-center">
                                <Button variant="outline" onClick={() => setIsTyping(false)}>
                                    Skip Exercise
                                </Button>
                            </div>
                        </>
                    )
                )}
            </main>
        </div>
    );
}

interface ExerciseCardProps {
    exercise: WarmupExercise;
    index: number;
    isCompleted: boolean;
    isCurrent: boolean;
    onStart: () => void;
}

function ExerciseCard({ exercise, index, isCompleted, isCurrent, onStart }: ExerciseCardProps) {
    const typeIcons: Record<string, string> = {
        home_row: '🏠',
        weak_keys: '🎯',
        finger_stretch: '🤸',
        speed_burst: '⚡',
        accuracy_focus: '🔍',
    };

    const typeColors: Record<string, string> = {
        home_row: 'border-blue-500/30 bg-blue-500/5',
        weak_keys: 'border-red-500/30 bg-red-500/5',
        finger_stretch: 'border-purple-500/30 bg-purple-500/5',
        speed_burst: 'border-orange-500/30 bg-orange-500/5',
        accuracy_focus: 'border-green-500/30 bg-green-500/5',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className={cn(
                "transition-all cursor-pointer hover:shadow-md",
                typeColors[exercise.type],
                isCompleted && "opacity-50",
                isCurrent && "ring-2 ring-primary",
            )}
                onClick={onStart}
            >
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="text-3xl">
                            {isCompleted ? '✅' : typeIcons[exercise.type]}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold capitalize">
                                    {exercise.type.replace('_', ' ')}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                    {exercise.duration}s
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                    {exercise.difficulty}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
                        </div>
                        {!isCompleted && (
                            <Button size="sm" variant="ghost">
                                <Play className="w-4 h-4" />
                            </Button>
                        )}
                        {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
