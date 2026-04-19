import { useCallback, useEffect, useRef, useMemo } from 'react';
import { predictNextChars } from '@/lib/algorithms/next-word-predictor';
import { useWeaknessDetectorWorker } from '@/hooks/use-weakness-detector-worker';
import { useTypingStore } from '@/stores/typing-store';
import { typingBus } from '@/lib/events/typing-bus';
import { initializeTypingListeners } from '@/lib/events/typing-listeners';
import { PracticeMode, PerformanceRecord } from '@/types';

// Run once safely
if (typeof window !== 'undefined') {
    initializeTypingListeners();
}

interface UseTypingControllerOptions {
    text: string;
    mode: PracticeMode;
    lessonId?: string;
    timeLimitSeconds?: number;
    onComplete?: (record: PerformanceRecord) => void;
    onComboMilestone?: (combo: number, level: number) => void;
}

interface CompletionState {
    completed: boolean;
    reason: 'text' | 'time' | null;
}

export function useTypingController({
    text,
    mode,
    lessonId,
    timeLimitSeconds,
    onComplete,
    onComboMilestone,
}: UseTypingControllerOptions) {
    const setText = useTypingStore(s => s.setText);
    const reset = useTypingStore(s => s.reset);
    const getWpm = useTypingStore(s => s.getWpm);
    const getAccuracy = useTypingStore(s => s.getAccuracy);
    const getElapsedTime = useTypingStore(s => s.getElapsedTime);
    const handleKeystroke = useTypingStore(s => s.handleKeystroke);

    const isComplete = useTypingStore(s => s.state.isComplete);
    const startTime = useTypingStore(s => s.state.startTime);
    const isPaused = useTypingStore(s => s.state.isPaused);
    const currentIndex = useTypingStore(s => s.state.currentIndex);
    const errorIndices = useTypingStore(s => s.state.errorIndices);
    const keystrokes = useTypingStore(s => s.state.keystrokes);
    const currentText = useTypingStore(s => s.state.text);
    const activeKey = useTypingStore(s => s.activeKey);

    const completionStateRef = useRef<CompletionState>({ completed: false, reason: null });
    const rafIdRef = useRef<number>(0);
    const { updateKey } = useWeaknessDetectorWorker();

    // Link milestone events
    useEffect(() => {
        if (!onComboMilestone) return;
        const handler = (data: { combo: number }) => onComboMilestone(data.combo, Math.floor(data.combo / 50));
        typingBus.on('COMBO_ACHIEVED', handler);
        return () => typingBus.off('COMBO_ACHIEVED', handler);
    }, [onComboMilestone]);

    // Initialize
    useEffect(() => {
        setText(text);
        completionStateRef.current = { completed: false, reason: null };
        return () => {
            reset();
        };
    }, [text, setText, reset]);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            if (['Escape', 'Tab', 'CapsLock', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
            if (e.key.startsWith('F') && e.key.length > 1) return;
            if (e.key === 'Backspace' || e.key === 'Delete') return;

            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
            if (document.activeElement?.closest('[role="dialog"]')) return;

            if (e.key.length === 1) {
                e.preventDefault();

                // 1. Process local state
                const keystroke = handleKeystroke(e.key);
                
                // 2. Dispatch to decoupled systems
                if (keystroke) {
                    // Update Machine Learning on background thread
                    updateKey(e.key, keystroke.isCorrect, keystroke.hesitationMs, {
                        timestamp: keystroke.timestamp,
                        sessionPosition: currentText.length > 0 ? currentIndex / currentText.length : 0,
                        recentErrors: 0,
                    }).catch(console.error);

                    typingBus.emit('KEYSTROKE_REGISTERED', {
                        key: e.key,
                        expectedChar: currentText[currentIndex] || '',
                        isCorrect: keystroke.isCorrect,
                        timestamp: keystroke.timestamp,
                        delayFromLastKey: keystroke.hesitationMs,
                        wpm: getWpm(),
                        accuracy: getAccuracy(),
                        textLength: currentText.length,
                        currentIndex: currentIndex
                    });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeystroke, currentText, currentIndex, getWpm, getAccuracy]);

    // Time limit check
    useEffect(() => {
        if (!timeLimitSeconds || !startTime || isComplete) return;
        if (completionStateRef.current.completed) return;
        const checkTimeLimit = () => {
            if (completionStateRef.current.completed) return;
            const elapsed = getElapsedTime();
            if (elapsed >= timeLimitSeconds) {
                completeSession('time');
                return;
            }
            rafIdRef.current = requestAnimationFrame(checkTimeLimit);
        };
        rafIdRef.current = requestAnimationFrame(checkTimeLimit);
        return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current); };
    }, [startTime, isComplete, timeLimitSeconds, getElapsedTime]);

    // Text completion check
    useEffect(() => {
        if (isComplete && !completionStateRef.current.completed) {
            completeSession('text');
        }
    }, [isComplete]);

    const completeSession = useCallback((reason: 'text' | 'time') => {
        if (completionStateRef.current.completed) return;

        completionStateRef.current = { completed: true, reason };

        const wpm = getWpm();
        const accuracy = getAccuracy();
        const duration = getElapsedTime();

        const record: PerformanceRecord = {
            id: crypto.randomUUID(),
            lessonId,
            mode,
            wpm,
            accuracy,
            duration,
            totalChars: currentIndex,
            errors: errorIndices.length,
            maxCombo: 0, // Calculated dynamically by Gamification Engine when rendering
            score: 0,    // Calculated dynamically by Gamification Engine when rendering
            timestamp: Date.now(),
        };

        typingBus.emit('TYPING_COMPLETED', { wpm, accuracy, totalErrors: errorIndices.length });
        onComplete?.(record);
    }, [getWpm, getAccuracy, getElapsedTime, currentIndex, errorIndices.length, lessonId, mode, onComplete]);

    const handleReset = useCallback(() => {
        reset();
        completionStateRef.current = { completed: false, reason: null };
    }, [reset]);

    // Evaluate predictions for the upcoming characters
    const predictedMistakeIndices = useMemo(() => {
        if (!currentText || currentIndex >= currentText.length || currentIndex === 0) return [];
        
        // Grab context (up to 2 previous characters)
        const start = Math.max(0, currentIndex - 2);
        const context = currentText.substring(start, currentIndex);
        
        const predictedChars = predictNextChars(context, 2); // Get top 2 predictions
        
        const indices: number[] = [];
        // Look ahead briefly to pre-highlight future mistakes
        const lookAhead = Math.min(3, currentText.length - currentIndex);
        for (let i = 0; i < lookAhead; i++) {
            const upcomingChar = currentText[currentIndex + i]?.toLowerCase();
            if (upcomingChar && predictedChars.includes(upcomingChar)) {
                indices.push(currentIndex + i);
            }
        }
        return indices;
    }, [currentText, currentIndex]);

    return {
        reset: handleReset,
        isComplete,
        isPaused,
        hasStarted: startTime !== null,
        text: currentText,
        currentIndex,
        errorIndices,
        predictedMistakeIndices,
        keystrokes,
        activeKey,
    };
}
