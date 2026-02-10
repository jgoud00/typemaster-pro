'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { ComboPopup } from '@/components/gamification/combo-popup';
import { LessonComplete } from '@/components/gamification/lesson-complete';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { useConfetti } from '@/hooks/use-confetti';
import { getLessonById, getNextLesson } from '@/lib/lessons';
import { PerformanceRecord } from '@/types';
import { useProgressStore } from '@/stores/progress-store';

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params.id as string;

    const lesson = getLessonById(lessonId);
    const nextLesson = lesson ? getNextLesson(lessonId) : undefined;

    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    const [completedRecord, setCompletedRecord] = useState<PerformanceRecord | null>(null);
    const [comboPopup, setComboPopup] = useState({ show: false, combo: 0, level: 0 });

    const { progress } = useProgressStore();
    const { fireComboMilestone, fireLessonComplete, fireStars } = useConfetti();

    const currentExercise = lesson?.exercises[exerciseIndex];
    const text = currentExercise?.text || '';

    const handleComplete = useCallback((record: PerformanceRecord) => {
        setCompletedRecord(record);
        setShowComplete(true);
        fireLessonComplete();

        // Calculate stars
        let stars = 0;
        if (record.accuracy >= 95 && record.wpm >= 40) stars = 3;
        else if (record.accuracy >= 90 && record.wpm >= 30) stars = 2;
        else if (record.accuracy >= 80) stars = 1;

        if (stars > 0) {
            setTimeout(() => fireStars(stars), 500);
        }
    }, [fireLessonComplete, fireStars]);

    const handleComboMilestone = useCallback((combo: number, level: number) => {
        setComboPopup({ show: true, combo, level });
        fireComboMilestone(level);

        setTimeout(() => {
            setComboPopup(prev => ({ ...prev, show: false }));
        }, 1500);
    }, [fireComboMilestone]);

    const {
        currentIndex,
        errorIndices,
        activeKey,
        wpm,
        accuracy,
        combo,
        multiplier,
        elapsedTime,
        hasStarted,
        reset,
    } = useTypingEngine({
        text,
        mode: 'lesson',
        lessonId,
        onComplete: handleComplete,
        onComboMilestone: handleComboMilestone,
    });

    const handleRestart = () => {
        setShowComplete(false);
        setCompletedRecord(null);
        reset();
    };

    const handleNext = () => {
        if (exerciseIndex < (lesson?.exercises.length || 1) - 1) {
            setExerciseIndex(prev => prev + 1);
            setShowComplete(false);
            setCompletedRecord(null);
        } else if (nextLesson) {
            router.push(`/lessons/${nextLesson.id}`);
        } else {
            router.push('/');
        }
    };

    const handleHome = () => {
        router.push('/');
    };

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
                    <Button onClick={() => router.push('/')}>Go Home</Button>
                </div>
            </div>
        );
    }

    // Check if this is a personal best
    const previousBest = progress.lessonScores[lessonId]?.bestWpm || 0;
    const isPersonalBest = completedRecord ? completedRecord.wpm > previousBest : false;

    // Calculate stars for completion modal
    const stars = completedRecord
        ? (completedRecord.accuracy >= 95 && completedRecord.wpm >= 40 ? 3
            : completedRecord.accuracy >= 90 && completedRecord.wpm >= 30 ? 2
                : completedRecord.accuracy >= 80 ? 1 : 0)
        : 0;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="font-semibold">{lesson.title}</h1>
                            <p className="text-sm text-muted-foreground">
                                Exercise {exerciseIndex + 1} of {lesson.exercises.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowHeatmap(!showHeatmap)}
                            title={showHeatmap ? 'Hide heatmap' : 'Show heatmap'}
                        >
                            {showHeatmap ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleRestart}>
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8 space-y-6">
                {/* Stats */}
                <TypingStats
                    wpm={wpm}
                    accuracy={accuracy}
                    combo={combo}
                    multiplier={multiplier}
                    elapsedTime={elapsedTime}
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

                {/* Instructions */}
                {!hasStarted && (
                    <motion.p
                        className="text-center text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Start typing to begin...
                    </motion.p>
                )}

                {/* Virtual keyboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <VirtualKeyboard
                        activeKey={activeKey}
                        showHeatmap={showHeatmap}
                    />
                </motion.div>
            </main>

            {/* Combo popup */}
            <ComboPopup
                combo={comboPopup.combo}
                show={comboPopup.show}
                level={comboPopup.level}
            />

            {/* Lesson complete modal */}
            {showComplete && completedRecord && (
                <LessonComplete
                    record={completedRecord}
                    stars={stars}
                    isPersonalBest={isPersonalBest}
                    onRestart={handleRestart}
                    onNext={handleNext}
                    onHome={handleHome}
                />
            )}
        </div>
    );
}
