import { get, set, del } from 'idb-keyval';

/**
 * Saves data to IndexedDB asynchronously, eliminating main-thread blocking.
 */
export async function saveToDB<T>(key: string, data: T): Promise<void> {
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
        // 1. Try IndexedDB first
        const dbData = await get<T>(key);
        if (dbData !== undefined) {
            return dbData;
        }

        // 2. Fallback to localStorage migration
        if (typeof window !== 'undefined') {
            const localData = localStorage.getItem(key);
            if (localData) {
                console.log(`[Storage] Migrating legacy dataset '${key}' from synchronous localStorage to asynchronous IndexedDB...`);
                try {
                    const parsed = JSON.parse(localData) as T;
                    
                    // Save to IDB for future
                    await set(key, parsed);
                    
                    // Clean up localStorage to free the 5MB quota
                    localStorage.removeItem(key);
                    console.log(`[Storage] Migration of '${key}' fully successful.`);
                    
                    return parsed;
                } catch(e) {
                    console.error(`[Storage] Failed to parse legacy localStorage for ${key}`, e);
                }
            }
        }
    } catch (e) {
        console.error(`[Storage] Failed to load ${key} from storage:`, e);
    }
    return null;
}

/**
 * Clears a specific key from IndexedDB.
 */
export async function clearFromDB(key: string): Promise<void> {
    try {
        await del(key);
    } catch (e) {
        console.error(`[Storage] Failed to delete ${key}`, e);
    }
}
