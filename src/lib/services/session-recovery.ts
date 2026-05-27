/**
 * Session Recovery — Prevents data loss from accidental navigation
 *
 * Saves typing session state to sessionStorage every 5s during active sessions.
 * On remount, detects incomplete session and enables resume.
 */

const STORAGE_KEY = 'aloo-session-recovery';
const SAVE_INTERVAL_MS = 5_000;
const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

export interface RecoverableSession {
    text: string;
    currentIndex: number;
    errorIndices: number[];
    startTime: number;
    pausedMs: number;
    mode: string;
    lessonId?: string;
    savedAt: number;
}

function getStorage(): Storage | null {
    try {
        return typeof window !== 'undefined' ? window.sessionStorage : null;
    } catch {
        return null;
    }
}

export function saveSession(session: Omit<RecoverableSession, 'savedAt'>): void {
    const storage = getStorage();
    if (!storage) return;
    try {
        const data: RecoverableSession = { ...session, savedAt: Date.now() };
        storage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Storage full or unavailable — silently degrade
    }
}

export function loadSession(): RecoverableSession | null {
    const storage = getStorage();
    if (!storage) return null;
    try {
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as RecoverableSession;
        // Validate structure
        if (
            typeof data.text !== 'string' ||
            typeof data.currentIndex !== 'number' ||
            typeof data.startTime !== 'number' ||
            typeof data.savedAt !== 'number' ||
            !Array.isArray(data.errorIndices)
        ) {
            clearSession();
            return null;
        }
        // Expired check
        if (Date.now() - data.savedAt > MAX_AGE_MS) {
            clearSession();
            return null;
        }
        // Must have actual progress
        if (data.currentIndex < 3) {
            clearSession();
            return null;
        }
        return data;
    } catch {
        clearSession();
        return null;
    }
}

export function clearSession(): void {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.removeItem(STORAGE_KEY);
    } catch {
        // Silently degrade
    }
}

/**
 * Creates an auto-save interval that persists session state.
 * Returns a cleanup function to stop the interval.
 */
export function startAutoSave(
    getState: () => Omit<RecoverableSession, 'savedAt'> | null
): () => void {
    const id = setInterval(() => {
        const state = getState();
        if (state && state.currentIndex > 0) {
            saveSession(state);
        }
    }, SAVE_INTERVAL_MS);

    return () => {
        clearInterval(id);
        clearSession();
    };
}
