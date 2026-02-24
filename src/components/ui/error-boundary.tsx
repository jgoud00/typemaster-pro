'use client';

import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
                    <div className="max-w-md p-6 bg-card border rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
                        <p className="text-muted-foreground mb-6">
                            An unexpected error occurred. We've logged this issue and are working to fix it.
                        </p>
                        <div className="bg-muted p-4 rounded text-xs font-mono text-left mb-6 overflow-auto max-h-48">
                            {this.state.error?.message || 'Unknown error'}
                        </div>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
