/**
 * GDPR Data Export Tool
 * 
 * Implements Right to Portability and Right to Erasure
 */

export interface GDPRExportData {
    version: string;
    exportDate: string;
    dataCategories: {
        name: string;
        description: string;
        data: unknown;
    }[];
}

// All localStorage keys used by Aloo Type
const STORAGE_KEYS = [
    'typing-progress',
    'typing-settings',
    'typing-game-state',
    'typing-analytics',
    'typing-ngram-analysis',
    'typing-achievements',
    'personal-records',
];

function getKeyDescription(key: string): string {
    switch (key) {
        case 'typing-progress': return 'Lesson completion and history';
        case 'typing-settings': return 'App preferences and configurations';
        case 'typing-game-state': return 'Current session and streak data';
        case 'typing-analytics': return 'Detailed keystroke performance metrics';
        case 'typing-ngram-analysis': return 'N-gram sequence performance data';
        case 'typing-achievements': return 'Unlocked badges and achievements';
        case 'personal-records': return 'Best WPM and accuracy records';
        default: return 'Application data';
    }
}

/**
 * Export ALL user data for GDPR compliance
 */
export function exportAllUserData(): GDPRExportData | null {
    const isMainThread = typeof window !== 'undefined' && typeof document !== 'undefined';
    const safeStorage = (globalThis as any).localStorage;
    if (!isMainThread || !safeStorage) return null;

    const categories: { name: string; description: string; data: unknown }[] = [];

    for (const key of STORAGE_KEYS) {
        try {
            const raw = safeStorage.getItem(key);
            if (raw) {
                let data: unknown;
                try {
                    data = JSON.parse(raw);
                } catch {
                    data = raw;
                }
                categories.push({
                    name: key,
                    description: getKeyDescription(key),
                    data,
                });
            }
        } catch (e) {
            console.warn(`Failed to export ${key}:`, e);
        }
    }

    return {
        version: '1.0',
        exportDate: new Date().toISOString(),
        dataCategories: categories,
    };
}

/**
 * Triggers a download of all user data as a JSON file
 */
export function downloadUserData(): void {
    const data = exportAllUserData();
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typemaster-pro-privacy-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Delete ALL user data (Right to Erasure)
 */
export function deleteAllUserData(): void {
    const isMainThread = typeof window !== 'undefined' && typeof document !== 'undefined';
    const safeStorage = (globalThis as any).localStorage;
    if (!isMainThread || !safeStorage) return;

    for (const key of STORAGE_KEYS) {
        try {
            safeStorage.removeItem(key);
        } catch (e) {
            console.warn(`Failed to delete ${key}:`, e);
        }
    }
}

/**
 * Get summary of what data is stored
 */
export function getStoredDataSummary(): { key: string; size: number; description: string }[] {
    const summary: { key: string; size: number; description: string }[] = [];
    const isMainThread = typeof window !== 'undefined' && typeof document !== 'undefined';
    const safeStorage = (globalThis as any).localStorage;
    if (!isMainThread || !safeStorage) return summary;

    for (const key of STORAGE_KEYS) {
        try {
            const raw = safeStorage.getItem(key);
            if (raw) {
                summary.push({
                    key,
                    size: new Blob([raw]).size,
                    description: getKeyDescription(key),
                });
            }
        } catch {
            // Ignore individual key errors
        }
    }

    return summary;
}
