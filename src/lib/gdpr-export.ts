'use client';

/**
 * GDPR Data Export Utility
 * 
 * Provides comprehensive data export and deletion functionality
 * to comply with GDPR requirements (Right to Access, Right to Erasure).
 */

// All localStorage keys used by Aloo Type
const STORAGE_KEYS = [
    'typing-progress',           // User progress, lesson scores
    'settings-store',            // User preferences
    'achievement-store',         // Unlocked achievements
    'analytics-store',           // Performance analytics
    'diagnostic-store',          // Diagnostic test results
    'ngram-analytics',           // N-gram typing patterns
    'advanced-ngram-analytics',  // Advanced pattern analysis
    'skill-tree',                // Skill progression
    'sound-settings',            // Audio preferences
    'personalization-profile',   // AI personalization
    'error-prediction-model',    // Error prediction data
    'ultimate-weakness-detector', // Weakness analysis
] as const;

export interface GDPRExportData {
    exportVersion: '2.0';
    exportDate: string;
    applicationName: 'Aloo Type';
    dataCategories: {
        name: string;
        description: string;
        data: unknown;
    }[];
    metadata: {
        totalKeys: number;
        exportSizeBytes: number;
    };
}

/**
 * Export ALL user data for GDPR compliance
 */
export function exportAllUserData(): GDPRExportData {
    const categories: GDPRExportData['dataCategories'] = [];

    for (const key of STORAGE_KEYS) {
        try {
            const raw = localStorage.getItem(key);
            if (raw) {
                let data: unknown;
                try {
                    data = JSON.parse(raw);
                } catch {
                    data = raw; // Store as-is if not JSON
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

    const exportData: GDPRExportData = {
        exportVersion: '2.0',
        exportDate: new Date().toISOString(),
        applicationName: 'Aloo Type',
        dataCategories: categories,
        metadata: {
            totalKeys: categories.length,
            exportSizeBytes: 0, // Will be calculated below
        },
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    exportData.metadata.exportSizeBytes = new Blob([jsonString]).size;

    return exportData;
}

/**
 * Download user data as JSON file
 */
export function downloadUserData(): void {
    const data = exportAllUserData();
    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `typemaster-pro-gdpr-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Delete ALL user data (Right to Erasure)
 */
export function deleteAllUserData(): void {
    for (const key of STORAGE_KEYS) {
        try {
            localStorage.removeItem(key);
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

    for (const key of STORAGE_KEYS) {
        const raw = localStorage.getItem(key);
        if (raw) {
            summary.push({
                key,
                size: new Blob([raw]).size,
                description: getKeyDescription(key),
            });
        }
    }

    return summary;
}

/**
 * Human-readable descriptions for each data category
 */
function getKeyDescription(key: string): string {
    const descriptions: Record<string, string> = {
        'typing-progress': 'Lesson completion, WPM scores, accuracy, and practice statistics',
        'settings-store': 'Sound, display, and keyboard preferences',
        'achievement-store': 'Unlocked achievements and badges',
        'analytics-store': 'Performance trends and session analytics',
        'diagnostic-store': 'Initial typing assessment results',
        'ngram-analytics': 'Character sequence timing patterns',
        'advanced-ngram-analytics': 'Advanced typing pattern analysis',
        'skill-tree': 'Skill progression and mastery levels',
        'sound-settings': 'Audio volume and sound effect preferences',
        'personalization-profile': 'AI-driven learning personalization',
        'error-prediction-model': 'Predictive model for typing errors',
        'ultimate-weakness-detector': 'Bayesian analysis of typing weaknesses',
    };

    return descriptions[key] ?? 'Application data';
}
