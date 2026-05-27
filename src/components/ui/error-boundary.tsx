'use client';

import React from 'react';
import { reportError, categorizeError, type ErrorCategory } from '@/lib/services/error-service';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, category: ErrorCategory) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    category: ErrorCategory;
    retryCount: number;
}

const MAX_RETRIES = 3;

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, category: 'runtime', retryCount: 0 };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error, category: categorizeError(error) };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        const category = categorizeError(error);
        reportError(error, {
            componentStack: errorInfo.componentStack ?? undefined,
            retryCount: this.state.retryCount,
        }, category);
        this.props.onError?.(error, category);
    }

    private handleRetry = () => {
        this.setState(prev => ({
            hasError: false,
            error: null,
            retryCount: prev.retryCount + 1,
        }));
    };

    private handleReload = () => {
        this.setState({ hasError: false, error: null, retryCount: 0 });
        globalThis.window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            const canRetry = this.state.retryCount < MAX_RETRIES;
            const { category } = this.state;

            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
                    <div className="max-w-md p-6 bg-card border rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">
                            {category === 'network' ? 'Connection Problem' :
                             category === 'storage' ? 'Storage Error' :
                             'Something went wrong'}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {category === 'network'
                                ? 'Please check your internet connection and try again.'
                                : category === 'storage'
                                ? 'Browser storage is unavailable. Your data is safe in memory.'
                                : 'An unexpected error occurred. Your typing session data has been preserved.'}
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="bg-muted p-4 rounded text-xs font-mono text-left mb-6 overflow-auto max-h-48">
                                {this.state.error?.message || 'Unknown error'}
                            </div>
                        )}
                        <div className="flex gap-3 justify-center">
                            {canRetry && (
                                <button
                                    onClick={this.handleRetry}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                                >
                                    Try Again ({MAX_RETRIES - this.state.retryCount} left)
                                </button>
                            )}
                            <button
                                onClick={this.handleReload}
                                className="px-4 py-2 bg-muted text-foreground rounded hover:bg-muted/80 transition-colors"
                            >
                                Reload
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
