import { get, set, del } from 'idb-keyval';

/**
 * Write batching — coalesces multiple saveToDB calls within 100ms
 * into a single IDB transaction.
 */
const pendingWrites = new Map<string, unknown>();
let batchTimer: ReturnType<typeof setTimeout> | null = null;
const BATCH_DELAY_MS = 100;

async function flushBatch(): Promise<void> {
    const entries = [...pendingWrites.entries()];
    pendingWrites.clear();
    batchTimer = null;
    for (const [key, data] of entries) {
        try {
            await set(key, data);
        } catch (e) {
            console.error(`[Storage] Failed to save ${key} to IndexedDB:`, e);
        }
    }
}

/**
 * Saves data to IndexedDB asynchronously with write batching.
 */
export async function saveToDB<T>(key: string, data: T): Promise<void> {
    pendingWrites.set(key, data);
    if (!batchTimer) {
        batchTimer = setTimeout(flushBatch, BATCH_DELAY_MS);
    }
}

/**
 * Saves data immediately, bypassing the batch queue.
 */
export async function saveToDBImmediate<T>(key: string, data: T): Promise<void> {
    try {
        await set(key, data);
    } catch (e) {
        console.error(`[Storage] Failed to save ${key} to IndexedDB:`, e);
    }
}

/**
 * Loads data from IndexedDB, automatically falling back to and migrating
 * legacy localStorage data if it exists.
 */
export async function loadFromDB<T>(key: string): Promise<T | null> {
    try {
        const dbData = await get<T>(key);
        if (dbData !== undefined) return dbData;

        const isMainThread = typeof globalThis.window !== 'undefined' && typeof globalThis.document !== 'undefined';
        const safeStorage = (globalThis as Record<string, unknown>).localStorage as Storage | undefined;

        if (isMainThread && safeStorage) {
            const localData = safeStorage.getItem(key);
            if (localData) {
                console.log(`[Storage] Migrating '${key}' from localStorage to IndexedDB...`);
                try {
                    const parsed = JSON.parse(localData) as T;
                    await set(key, parsed);
                    safeStorage.removeItem(key);
                    return parsed;
                } catch (e) {
                    console.error(`[Storage] Failed to parse legacy localStorage for ${key}`, e);
                }
            }
        }
    } catch (e: unknown) {
        if (e && (e as Error).name !== 'ReferenceError') {
            console.error(`[Storage] Failed to load ${key} from storage:`, e);
        }
    }
    return null;
}

/**
 * Clears a specific key from IndexedDB.
 */
export async function clearFromDB(key: string): Promise<void> {
    try {
        await del(key);
    } catch (e: unknown) {
        if (e && (e as Error).name !== 'ReferenceError') {
            console.error(`[Storage] Failed to delete ${key}`, e);
        }
    }
}

/**
 * Verifies if the browser supports and allows IndexedDB access.
 */
export async function checkStorageHealth(): Promise<boolean> {
    try {
        await set('__health_check__', Date.now());
        const result = await get('__health_check__');
        await del('__health_check__');
        return !!result;
    } catch (e) {
        console.warn('[Storage] Health check failed:', e);
        return false;
    }
}

/**
 * Check storage quota usage. Returns percentage used (0-100).
 */
export async function getStorageUsage(): Promise<{ used: number; total: number; percentage: number } | null> {
    try {
        if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return null;
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage ?? 0;
        const total = estimate.quota ?? 0;
        return {
            used,
            total,
            percentage: total > 0 ? Math.round((used / total) * 100) : 0,
        };
    } catch {
        return null;
    }
}
