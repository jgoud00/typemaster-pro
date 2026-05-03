import { Remote } from 'comlink';
import type { MLWorkerAPI } from './ml.worker';

let mlProxy: Remote<MLWorkerAPI> | null = null;

/**
 * Singleton instance to store the ML Worker proxy outside of state management.
 * This prevents serialization issues and circular dependencies.
 */
export const getMLProxy = () => mlProxy;

export const setMLProxy = (proxy: Remote<MLWorkerAPI> | null) => {
    mlProxy = proxy;
};
