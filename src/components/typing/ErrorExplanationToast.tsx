'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { errorExplanationEngine, type ErrorExplanation } from '@/lib/algorithms/error-explanation-engine';
import { cn } from '@/lib/utils';

interface ErrorExplanationToastProps {
    expected: string;
    actual: string;
    previousChars: string;
    recentErrors: number;
    currentWpm: number;
    sessionDuration: number;
    onDismiss?: () => void;
}

export function ErrorExplanationToast({
    expected,
    actual,
    previousChars,
    recentErrors,
    currentWpm,
    sessionDuration,
    onDismiss,
}: ErrorExplanationToastProps) {
    const [explanation, setExplanation] = useState<ErrorExplanation | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show for significant errors (not space, backspace, etc.)
        if (expected.length === 1 && actual.length === 1 && expected !== actual) {
            // Record the error
            errorExplanationEngine.recordError(expected, actual);

            // Get explanation
            const exp = errorExplanationEngine.analyzeError({
                expected,
                actual,
                previousChars,
                recentErrors,
                timeSinceLastError: 0,
                currentWpm,
                sessionDuration,
            });

            setExplanation(exp);
            setIsVisible(true);

            // Auto-dismiss after 4 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                onDismiss?.();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [expected, actual, previousChars, recentErrors, currentWpm, sessionDuration, onDismiss]);

    if (!explanation) return null;

    const severityColors = {
        low: 'bg-blue-500/10 border-blue-500/30',
        medium: 'bg-yellow-500/10 border-yellow-500/30',
        high: 'bg-red-500/10 border-red-500/30',
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className={cn(
                        "fixed bottom-24 right-4 z-50 max-w-sm p-4 rounded-lg border shadow-lg backdrop-blur-sm",
                        severityColors[explanation.severity]
                    )}
                >
                    <div className="flex gap-3">
                        <span className="text-2xl">{explanation.icon}</span>
                        <div className="flex-1">
                            <h4 className="font-semibold">{explanation.title}</h4>
                            <p className="text-sm text-muted-foreground">{explanation.explanation}</p>
                            <p className="text-sm text-primary mt-1">💡 {explanation.suggestion}</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                onDismiss?.();
                            }}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Inline error explanation (shown near the error)
 */
interface InlineErrorHintProps {
    explanation: ErrorExplanation;
}

export function InlineErrorHint({ explanation }: InlineErrorHintProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-full left-0 mt-1 p-2 bg-popover border rounded-md shadow-lg text-xs z-50 whitespace-nowrap"
        >
            <div className="flex items-center gap-1">
                <span>{explanation.icon}</span>
                <span className="font-medium">{explanation.title}</span>
            </div>
            <p className="text-muted-foreground mt-0.5">{explanation.suggestion}</p>
        </motion.div>
    );
}

/**
 * Hook to manage error explanations
 */
export function useErrorExplanation() {
    const [lastError, setLastError] = useState<{
        expected: string;
        actual: string;
        timestamp: number;
    } | null>(null);

    const recordError = (expected: string, actual: string) => {
        setLastError({
            expected,
            actual,
            timestamp: Date.now(),
        });
        errorExplanationEngine.recordError(expected, actual);
    };

    const getExplanation = (context: {
        previousChars: string;
        recentErrors: number;
        currentWpm: number;
        sessionDuration: number;
    }): ErrorExplanation | null => {
        if (!lastError) return null;

        return errorExplanationEngine.analyzeError({
            expected: lastError.expected,
            actual: lastError.actual,
            ...context,
            timeSinceLastError: Date.now() - lastError.timestamp,
        });
    };

    const clearError = () => setLastError(null);

    return {
        lastError,
        recordError,
        getExplanation,
        clearError,
    };
}
