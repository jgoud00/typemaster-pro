import { useEffect, useCallback } from 'react';
import type { UltimateWeaknessResult } from '@/lib/algorithms/ultimate-weakness-detector';

// Singleton worker management for cross-component sharing without race conditions
let sharedWorker: Worker | null = null;
let refCount = 0;
let messageCounter = 0;
const resolvers = new Map<string, { resolve: Function, reject: Function }>();

const getWorker = () => {
    if (!sharedWorker && typeof window !== 'undefined') {
        sharedWorker = new Worker(new URL('../lib/algorithms/ultimate-weakness-detector.worker.ts', import.meta.url));
        
        sharedWorker.onmessage = (e: MessageEvent<WorkerResponse>) => {
            const { messageId, success, payload, error } = e.data;
            const handler = resolvers.get(messageId);
            if (handler) {
                if (success) handler.resolve(payload);
                else handler.reject(new Error(error));
                resolvers.delete(messageId);
            }
        };
        
        // Auto-load on initialization
        sendMessage({ type: 'LOAD' }).catch(console.error);
    }
    return sharedWorker;
};

interface WorkerMessage {
    type: 'LOAD' | 'UPDATE_KEY' | 'ANALYZE_ALL' | 'ANALYZE_KEY' | 'SAVE';
    payload?: any;
    messageId?: string;
}

interface WorkerResponse {
    messageId: string;
    success: boolean;
    payload?: any;
    error?: string;
}

const sendMessage = <T = any>(message: WorkerMessage): Promise<T> => {
    return new Promise((resolve, reject) => {
        const worker = getWorker();
        if (!worker) return reject(new Error('Worker not available'));
        
        const messageId = (++messageCounter).toString();
        resolvers.set(messageId, { resolve, reject });
        worker.postMessage({ ...message, messageId });
    });
};

export function useWeaknessDetectorWorker() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        // Spawns the worker on mount
        getWorker();
        refCount++;
        
        return () => {
            refCount--;
            // Terminate worker on final unmount
            if (refCount === 0 && sharedWorker) {
                sharedWorker.terminate();
                sharedWorker = null;
                resolvers.clear();
            }
        };
    }, []);

    const updateKey = useCallback(async (
        key: string,
        isCorrect: boolean,
        speed: number,
        context: { timestamp: number; sessionPosition: number; recentErrors: number; adjacentKey?: string; }
    ): Promise<void> => {
        return sendMessage({
            type: 'UPDATE_KEY',
            payload: { key, isCorrect, speed, context }
        });
    }, []);

    const analyzeAllKeys = useCallback(async (): Promise<UltimateWeaknessResult[]> => {
        return sendMessage({ type: 'ANALYZE_ALL' });
    }, []);

    const analyzeKey = useCallback(async (key: string): Promise<UltimateWeaknessResult> => {
        return sendMessage({ type: 'ANALYZE_KEY', payload: key });
    }, []);

    const saveNow = useCallback(async (): Promise<void> => {
        return sendMessage({ type: 'SAVE' });
    }, []);

    return {
        updateKey,
        analyzeAllKeys,
        analyzeKey,
        saveNow
    };
}
