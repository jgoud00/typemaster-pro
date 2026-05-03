'use client';

import { useMLWorker } from '@/hooks/useMLWorker';
import React from 'react';

/**
 * WorkerProvider — Simple component to initialize the ML Worker
 * at the root of the application.
 */
export function WorkerProvider({ children }: { children: React.ReactNode }) {
    // Initialize the worker once on mount
    useMLWorker();
    
    return <>{children}</>;
}
