'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Comlink from 'comlink';
import { getMLProxy } from '@/workers/ml-worker-instance';
import type { MLWorkerAPI } from '@/workers/ml.worker';

const WorkerContext = createContext<Comlink.Remote<MLWorkerAPI> | null>(null);

export function WorkerProvider({ children }: { children: React.ReactNode }) {
    const [proxy, setProxy] = useState<Comlink.Remote<MLWorkerAPI> | null>(null);

    useEffect(() => {
        const p = getMLProxy();
        if (p) {
            setProxy(p);
        }
    }, []);

    return (
        <WorkerContext.Provider value={proxy}>
            {children}
        </WorkerContext.Provider>
    );
}

export const useMLWorker = () => useContext(WorkerContext);
