import * as Comlink from 'comlink';
import type { MLWorkerAPI } from './ml-worker';

interface WorkerInstance {
    worker: Worker;
    proxy: Comlink.Remote<MLWorkerAPI>;
    generation: number;
}

let instance: WorkerInstance | null = null;
let currentGeneration = 0;
let initInProgress = false;

export function getMLProxy(): Comlink.Remote<MLWorkerAPI> | null {
    if (typeof globalThis.window === 'undefined') return null;
    if (initInProgress) return instance?.proxy ?? null;
    if (instance) return instance.proxy;

    initInProgress = true;
    try {
        const worker = new Worker(new URL('./ml-worker.ts', import.meta.url));
        const proxy = Comlink.wrap<MLWorkerAPI>(worker);
        instance = { worker, proxy, generation: ++currentGeneration };
        return proxy;
    } catch (err) {
        console.error('[MLWorker] init failed:', err);
        return null;
    } finally {
        initInProgress = false;
    }
}

export function terminateMLWorker(): void {
    if (!instance) return;
    const { proxy, worker } = instance;
    instance = null;

    try {
        proxy[Comlink.releaseProxy]();
    } catch {
        // proxy may already be stale — swallow
    }
    try {
        worker.terminate();
    } catch {
        // worker may already be dead — swallow
    }
}

/** HMR guard: replaces the running instance without leaking the old one. */
export function replaceMLWorker(): Comlink.Remote<MLWorkerAPI> | null {
    terminateMLWorker();
    return getMLProxy();
}

if (typeof module !== 'undefined' && (module as NodeModule & { hot?: { dispose: (fn: () => void) => void } }).hot) {
    (module as NodeModule & { hot?: { dispose: (fn: () => void) => void } }).hot!.dispose(() => {
        terminateMLWorker();
    });
}
