import { useCallback, useEffect, useRef, useMemo } from 'react';
import { predictNextChars } from '@/lib/algorithms/next-word-predictor';
import { useWeaknessDetectorWorker } from '@/hooks/use-weakness-detector-worker';
import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';
import { typingBus } from '@/lib/events/typing-bus';
import { initializeTypingListeners } from '@/lib/events/typing-listeners';
import { antiCheatCollector, analyzeSession } from '@/lib/anti-cheat';
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

    // Initialize — only reset store when text is a genuinely new session
    const prevTextRef = useRef('');
    useEffect(() => {
        // If new text starts with old text, it's an append — update store text without resetting progress
        if (prevTextRef.current && text.startsWith(prevTextRef.current) && text !== prevTextRef.current) {
            // Just update the text in store without resetting state
            const store = useTypingStore.getState();
            useTypingStore.setState({
                state: { ...store.state, text },
                activeKey: store.state.currentIndex < text.length ? text[store.state.currentIndex] : null,
            });
        } else {
            setText(text);
            completionStateRef.current = { completed: false, reason: null };
        }
        prevTextRef.current = text;
        return () => {
            reset();
        };
    }, [text, setText, reset]);

    // Anti-cheat: Block paste, drop, and autofill
    useEffect(() => {
        const blockPaste = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
            e.preventDefault();
            antiCheatCollector.recordPasteAttempt();
        };
        const blockDrop = (e: DragEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
            e.preventDefault();
            antiCheatCollector.recordDropAttempt();
        };
        window.addEventListener('paste', blockPaste);
        window.addEventListener('drop', blockDrop);
        return () => {
            window.removeEventListener('paste', blockPaste);
            window.removeEventListener('drop', blockDrop);
        };
    }, []);

    // Bug #6: Pause on tab switch
    useEffect(() => {
        const handler = () => {
            const s = useTypingStore.getState();
            if (document.hidden && s.state.startTime && !s.state.isComplete && !s.state.isPaused) {
                useTypingStore.getState().pause();
            } else if (!document.hidden && s.state.isPaused) {
                useTypingStore.getState().resume();
            }
        };
        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }, []);

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

            // Fix: Timing determinism + Anti-cheat (isTrusted + Jitter)
            const s = useTypingStore.getState();
            if (s.state.isComplete || s.state.isPaused || document.hidden || !e.isTrusted) return;
            if (timeLimitSeconds && s.state.startTime) {
                const pauseAdj = s.state.pausedMs + (s.state.pauseStart ? Date.now() - s.state.pauseStart : 0);
                if ((Date.now() - s.state.startTime - pauseAdj) / 1000 >= timeLimitSeconds) return;
            }
            
            const lastKey = s.state.keystrokes[s.state.keystrokes.length - 1];
            if (lastKey) {
                const delta = Date.now() - lastKey.timestamp;
                if (delta < 10) return; // Block <10ms keys
            }

            if (e.key.length === 1) {
                e.preventDefault();

                // Anti-cheat: record keystroke timing + trust
                antiCheatCollector.recordKeystroke(Date.now(), e.isTrusted);

                // 1. Process local state
                const keystroke = handleKeystroke(e.key);
                
                // 2. Dispatch to decoupled systems — Bug #5: read fresh state from store
                if (keystroke) {
                    const freshState = useTypingStore.getState();
                    const freshIndex = freshState.state.currentIndex;
                    const freshText = freshState.state.text;

                    updateKey(e.key, keystroke.isCorrect, keystroke.hesitationMs, {
                        timestamp: keystroke.timestamp,
                        sessionPosition: freshText.length > 0 ? freshIndex / freshText.length : 0,
                        recentErrors: 0,
                    }).catch(console.error);

                    typingBus.emit('KEYSTROKE_REGISTERED', {
                        key: e.key,
                        expectedChar: keystroke.expected,
                        isCorrect: keystroke.isCorrect,
                        timestamp: keystroke.timestamp,
                        delayFromLastKey: keystroke.hesitationMs,
                        wpm: freshState.getWpm(),
                        accuracy: freshState.getAccuracy(),
                        textLength: freshText.length,
                        currentIndex: freshIndex
                    });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeystroke, timeLimitSeconds]);

    // Bug #10: Read all values from store directly to avoid stale closures
    // Bug #13: Read maxCombo from game store
    const completeSession = useCallback((reason: 'text' | 'time') => {
        if (completionStateRef.current.completed) return;

        completionStateRef.current = { completed: true, reason };

        const store = useTypingStore.getState();
        const wpm = store.getWpm();
        const accuracy = store.getAccuracy();
        const duration = store.getElapsedTime();
        const freshIndex = store.state.currentIndex;
        const freshErrors = store.state.errorIndices.length;
        const maxCombo = useGameStore.getState().game.maxCombo;

        // Anti-cheat: analyze session integrity
        const integrity = analyzeSession(antiCheatCollector, wpm, accuracy);

        const record: PerformanceRecord = {
            id: crypto.randomUUID(),
            lessonId,
            mode,
            wpm,
            accuracy,
            duration,
            totalChars: freshIndex,
            errors: freshErrors,
            maxCombo,
            score: 0,
            timestamp: Date.now(),
            cheatScore: integrity.cheatScore,
            valid: integrity.valid,
            integrityHash: integrity.hash,
        };

        if (integrity.flags.length > 0) {
            console.warn('[Anti-Cheat]', integrity.flags.map(f => f.reason).join('; '));
        }

        typingBus.emit('TYPING_COMPLETED', { wpm, accuracy, totalErrors: freshErrors, valid: integrity.valid });
        onComplete?.(record);
    }, [lessonId, mode, onComplete]);

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
    }, [startTime, isComplete, timeLimitSeconds, getElapsedTime, completeSession]);

    // Text completion check
    useEffect(() => {
        if (isComplete && !completionStateRef.current.completed) {
            completeSession('text');
        }
    }, [isComplete, completeSession]);

    const handleReset = useCallback(() => {
        reset();
        antiCheatCollector.reset();
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
