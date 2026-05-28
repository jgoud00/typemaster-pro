/**
 * Session Recovery — Prevents data loss from accidental navigation
 *
 * Saves typing session state to localStorage immediately and syncs to backend.
 * On remount, detects incomplete session and enables resume.
 */

const STORAGE_KEY = 'aloo-session-recovery';

// Use a debouncer for backend sync so we don't bombard the server on every fast keystroke
let backendSyncTimeout: NodeJS.Timeout | null = null;
const BACKEND_SYNC_DEBOUNCE_MS = 2000;

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
        return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
        return null;
    }
}

async function syncToBackend(session: RecoverableSession) {
    try {
        await fetch('/api/session/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session)
        });
    } catch {
        // Silently degrade
    }
}

export function saveSession(session: Omit<RecoverableSession, 'savedAt'>, immediateSync: boolean = false): void {
    const storage = getStorage();
    const data: RecoverableSession = { ...session, savedAt: Date.now() };

    if (storage) {
        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
            // Storage full or unavailable
        }
    }

    // Backend sync
    if (immediateSync) {
        if (backendSyncTimeout) clearTimeout(backendSyncTimeout);
        // Using keepalive allows the request to outlive the page if it's closing
        fetch('/api/session/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            keepalive: true
        }).catch(() => {});
    } else {
        if (backendSyncTimeout) clearTimeout(backendSyncTimeout);
        backendSyncTimeout = setTimeout(() => {
            syncToBackend(data);
        }, BACKEND_SYNC_DEBOUNCE_MS);
    }
}

export async function loadSession(): Promise<RecoverableSession | null> {
    // Attempt local storage first for speed
    let localData: RecoverableSession | null = null;
    const storage = getStorage();
    if (storage) {
        try {
            const raw = storage.getItem(STORAGE_KEY);
            if (raw) {
                localData = JSON.parse(raw) as RecoverableSession;
            }
        } catch {}
    }

    // Concurrently try backend to see if it has a newer session (from another device)
    let backendData: RecoverableSession | null = null;
    try {
        const res = await fetch('/api/session/progress');
        if (res.ok) {
            const data = await res.json();
            if (data && data.savedAt) {
                backendData = data as RecoverableSession;
            }
        }
    } catch {}

    let newestData = backendData && localData
        ? (backendData.savedAt > localData.savedAt ? backendData : localData)
        : (backendData || localData);

    if (!newestData) return null;

    // Must have actual progress (at least 1 key typed)
    if (newestData.currentIndex < 1) {
        clearSession();
        return null;
    }

    return newestData;
}

export function clearSession(): void {
    const storage = getStorage();
    if (storage) {
        try {
            storage.removeItem(STORAGE_KEY);
        } catch {}
    }
    
    // Clear on backend
    try {
        if (backendSyncTimeout) clearTimeout(backendSyncTimeout);
        fetch('/api/session/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'clear' }),
            keepalive: true
        }).catch(() => {});
    } catch {}
}

export function attachBeforeUnloadSync(getState: () => Omit<RecoverableSession, 'savedAt'> | null) {
    if (typeof window === 'undefined') return () => {};
    
    const handler = () => {
        const state = getState();
        if (state && state.currentIndex > 0) {
            saveSession(state, true); // Immediate sync with keepalive
        }
    };
    
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
}
