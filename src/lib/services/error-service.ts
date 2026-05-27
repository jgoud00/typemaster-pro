/**
 * Error Service — Centralized error handling & telemetry
 *
 * Categories: network, auth, storage, validation, runtime
 * Tracks error frequency per category for diagnostics.
 * Provides graceful degradation strategies.
 */

export type ErrorCategory = 'network' | 'auth' | 'storage' | 'validation' | 'runtime';
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AppError {
    category: ErrorCategory;
    severity: ErrorSeverity;
    message: string;
    code?: string;
    timestamp: number;
    context?: Record<string, unknown>;
    originalError?: unknown;
}

interface ErrorTelemetry {
    counts: Record<ErrorCategory, number>;
    recentErrors: AppError[];
    lastErrorAt: Record<ErrorCategory, number>;
}

const MAX_RECENT_ERRORS = 50;

const telemetry: ErrorTelemetry = {
    counts: { network: 0, auth: 0, storage: 0, validation: 0, runtime: 0 },
    recentErrors: [],
    lastErrorAt: { network: 0, auth: 0, storage: 0, validation: 0, runtime: 0 },
};

const listeners: Set<(error: AppError) => void> = new Set();

export function categorizeError(error: unknown): ErrorCategory {
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network'))) {
        return 'network';
    }
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        return 'storage';
    }
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('unauthorized') || msg.includes('401') || msg.includes('403')) return 'auth';
        if (msg.includes('indexeddb') || msg.includes('storage') || msg.includes('quota')) return 'storage';
        if (msg.includes('invalid') || msg.includes('validation')) return 'validation';
    }
    return 'runtime';
}

export function severityFromCategory(category: ErrorCategory): ErrorSeverity {
    switch (category) {
        case 'network': return 'medium';
        case 'auth': return 'high';
        case 'storage': return 'medium';
        case 'validation': return 'low';
        case 'runtime': return 'high';
    }
}

export function reportError(
    error: unknown,
    context?: Record<string, unknown>,
    categoryOverride?: ErrorCategory
): AppError {
    const category = categoryOverride ?? categorizeError(error);
    const appError: AppError = {
        category,
        severity: severityFromCategory(category),
        message: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
        context,
        originalError: error,
    };

    telemetry.counts[category]++;
    telemetry.lastErrorAt[category] = Date.now();
    telemetry.recentErrors.push(appError);
    if (telemetry.recentErrors.length > MAX_RECENT_ERRORS) {
        telemetry.recentErrors.shift();
    }

    if (process.env.NODE_ENV === 'development') {
        console.error(`[ErrorService:${category}]`, appError.message, context);
    }

    for (const listener of listeners) {
        try { listener(appError); } catch { /* listener error — ignore */ }
    }

    return appError;
}

export function onError(listener: (error: AppError) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getTelemetry(): Readonly<ErrorTelemetry> {
    return telemetry;
}

export function getErrorRate(category: ErrorCategory, windowMs = 60_000): number {
    const cutoff = Date.now() - windowMs;
    return telemetry.recentErrors.filter(
        e => e.category === category && e.timestamp > cutoff
    ).length;
}

/**
 * Graceful degradation: returns fallback value on error.
 */
export async function withFallback<T>(
    fn: () => Promise<T>,
    fallback: T,
    context?: Record<string, unknown>
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        reportError(error, context);
        return fallback;
    }
}
