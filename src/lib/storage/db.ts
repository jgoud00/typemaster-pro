import { get, set, del } from 'idb-keyval';
import toast from 'react-hot-toast';

/**
 * Saves data to IndexedDB asynchronously, eliminating main-thread blocking.
 */
export async function saveToDB<T>(key: string, data: T): Promise<void> {
    try {
        await set(key, data);
    } catch (e) {
        console.error(`[Storage] Failed to save ${key} to IndexedDB:`, e);
        toast.error('Data persistence failed. Check browser storage permissions.');
    }
}

/**
 * Loads data from IndexedDB, automatically falling back to and migrating 
 * legacy localStorage data if it exists.
 */
export async function loadFromDB<T>(key: string): Promise<T | null> {
    try {
        // 1. Try IndexedDB first
        const dbData = await get<T>(key);
        if (dbData !== undefined) {
            return dbData;
        }

        // 2. Fallback to localStorage migration - ONLY in main browser context
        // We use globalThis.localStorage to prevent ReferenceErrors in Workers
        const isMainThread = typeof globalThis.window !== 'undefined' && typeof globalThis.document !== 'undefined';
        const safeStorage = (globalThis as any).localStorage;
        
        if (isMainThread && safeStorage) {
            const localData = safeStorage.getItem(key);
            if (localData) {
                console.log(`[Storage] Migrating legacy dataset '${key}' from synchronous localStorage to asynchronous IndexedDB...`);
                try {
                    const parsed = JSON.parse(localData) as T;
                    
                    // Save to IDB for future
                    await set(key, parsed);
                    
                    // Clean up localStorage to free the 5MB quota
                    safeStorage.removeItem(key);
                    console.log(`[Storage] Migration of '${key}' fully successful.`);
                    
                    return parsed;
                } catch(e) {
                    console.error(`[Storage] Failed to parse legacy localStorage for ${key}`, e);
                }
            }
        }
    } catch (e: any) {
        // Suppress ReferenceError logging in non-browser environments (workers/SSR)
        if (e && e.name !== 'ReferenceError' && e.message !== 'localStorage is not defined') {
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
    } catch (e: any) {
        if (e && e.name !== 'ReferenceError' && e.message !== 'localStorage is not defined') {
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
