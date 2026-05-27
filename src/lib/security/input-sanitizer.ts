/**
 * Input Sanitizer — XSS prevention & validation
 *
 * Provides utilities for sanitizing user-provided content
 * before rendering or storing.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#96;',
};

const DANGEROUS_PATTERNS = [
    /javascript\s*:/gi,
    /on\w+\s*=/gi,
    /<script[\s>]/gi,
    /<\/script>/gi,
    /<iframe[\s>]/gi,
    /<object[\s>]/gi,
    /<embed[\s>]/gi,
    /data\s*:\s*text\/html/gi,
    /vbscript\s*:/gi,
];

/**
 * HTML entity encoding for any user-provided text rendered in UI.
 */
export function escapeHtml(str: string): string {
    return str.replace(/[&<>"'`/]/g, char => HTML_ENTITY_MAP[char] || char);
}

/**
 * Strips dangerous HTML/script content from strings.
 */
export function stripDangerousContent(input: string): string {
    let result = input;
    for (const pattern of DANGEROUS_PATTERNS) {
        result = result.replace(pattern, '');
    }
    return result;
}

/**
 * Sanitizes a username: alphanumeric + limited special chars, max length.
 */
export function sanitizeUsername(name: string, maxLength = 20): string {
    return name
        .trim()
        .replace(/[^\w\s\-_.]/g, '')  // Allow alphanumeric, space, dash, underscore, dot
        .replace(/\s+/g, ' ')          // Collapse whitespace
        .slice(0, maxLength);
}

/**
 * Validates a URL is safe (http/https only, no javascript: etc).
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Sanitizes custom typing text input.
 * Removes control characters, zero-width chars, and script content.
 */
export function sanitizeTypingText(text: string, maxLength = 10_000): string {
    return stripDangerousContent(text)
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')  // Control chars
        .replace(/[\u200B-\u200F\uFEFF\u2028\u2029]/g, '')    // Zero-width & line/paragraph separators
        .replace(/\t/g, '    ')                                  // Tabs to spaces
        .trim()
        .slice(0, maxLength);
}

/**
 * Validates imported JSON data structure with deep type checking.
 */
export function validateProgressImport(data: unknown): data is {
    version: string;
    data: { progress: Record<string, unknown>; hasSeenWelcome?: boolean };
} {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    if (typeof obj.version !== 'string') return false;
    if (typeof obj.data !== 'object' || obj.data === null) return false;
    const inner = obj.data as Record<string, unknown>;
    if (typeof inner.progress !== 'object' || inner.progress === null) return false;
    const progress = inner.progress as Record<string, unknown>;
    if (!Array.isArray(progress.completedLessons)) return false;
    if (typeof progress.lessonScores !== 'object' || progress.lessonScores === null) return false;
    if (!Array.isArray(progress.records)) return false;
    if (typeof progress.totalPracticeTime !== 'number' || progress.totalPracticeTime < 0) return false;
    if (typeof progress.totalKeystrokes !== 'number' || progress.totalKeystrokes < 0) return false;
    return true;
}
