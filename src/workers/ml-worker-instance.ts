import * as Comlink from 'comlink';
import type { MLWorkerAPI } from './ml-worker';

let worker: Worker | null = null;
let proxy: Comlink.Remote<MLWorkerAPI> | null = null;

export function getMLProxy(): Comlink.Remote<MLWorkerAPI> | null {
    if (typeof window === 'undefined') return null;

    if (!proxy) {
        try {
            // In Next.js, we use this syntax for workers
            worker = new Worker(new URL('./ml-worker.ts', import.meta.url));
            proxy = Comlink.wrap<MLWorkerAPI>(worker);
        } catch (error) {
            console.error('Failed to initialize ML Worker:', error);
            return null;
        }
    }
    return proxy;
}
