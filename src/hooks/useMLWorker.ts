'use client';

import { useEffect, useRef } from 'react';
import * as Comlink from 'comlink';
import type { MLWorkerAPI } from '../workers/ml.worker';
import { setMLProxy } from '../workers/ml-worker-instance';

/**
 * Hook to manage ML Worker lifecycle and provide a Comlink proxy.
 */
export function useMLWorker() {
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Initialize worker
        const worker = new Worker(new URL('../workers/ml.worker.ts', import.meta.url), {
            type: 'module',
        });
        
        const proxy = Comlink.wrap<MLWorkerAPI>(worker);
        
        workerRef.current = worker;
        setMLProxy(proxy);

        return () => {
            // Cleanup
            worker.terminate();
            workerRef.current = null;
            setMLProxy(null);
        };
    }, []);

    return null; // Local state removed as per requirements
}
