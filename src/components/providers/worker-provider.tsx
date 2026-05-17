'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import * as Comlink from 'comlink';
import { getMLProxy, terminateMLWorker } from '@/workers/ml-worker-instance';
import type { MLWorkerAPI } from '@/workers/ml-worker';

type MLProxyRef = Comlink.Remote<MLWorkerAPI> | null;

const WorkerContext = createContext<MLProxyRef>(null);

export function WorkerProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    // Use ref so the proxy value never triggers a re-render on its own.
    const proxyRef = useRef<MLProxyRef>(null);
    // A single state boolean only to trigger first-mount context propagation.
    const [ready, setReady] = React.useState(false);

    useEffect(() => {
        // Defer past React Strict Mode double-invoke and HMR settle window.
        const id = setTimeout(() => {
            if (proxyRef.current) return; // already initialized in this effect cycle
            const p = getMLProxy();
            proxyRef.current = p;
            if (p) setReady(true);
        }, 0);

        return () => {
            clearTimeout(id);
            // Only terminate if this effect truly "owns" the instance.
            // The singleton's own HMR guard handles HMR teardown;
            // here we only clean up when the provider unmounts for real.
            if (proxyRef.current) {
                terminateMLWorker();
                proxyRef.current = null;
            }
        };
        // empty dep-array: mount once per provider lifetime
    }, []);

    return (
        <WorkerContext.Provider value={ready ? proxyRef.current : null}>
            {children}
        </WorkerContext.Provider>
    );
}

export const useMLWorker = (): MLProxyRef => useContext(WorkerContext);
