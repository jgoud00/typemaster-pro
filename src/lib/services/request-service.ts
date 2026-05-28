/**
 * Request Service — Deduplication, Retry, Caching, Offline Queue
 *
 * Wraps fetch() with production-grade resilience:
 * - In-flight dedup: concurrent identical GETs share a single promise
 * - Retry: exponential backoff with jitter (3 attempts)
 * - LRU cache: 50-entry, 60s TTL for GET responses
 * - Offline queue: buffers POST/PUT/PATCH when offline, flushes on reconnect
 */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions extends Omit<RequestInit, 'method'> {
    method?: HttpMethod;
    retries?: number;
    cacheTtlMs?: number;
    skipCache?: boolean;
    skipDedup?: boolean;
}

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

interface QueuedRequest {
    url: string;
    options: RequestInit;
    resolve: (v: unknown) => void;
    reject: (e: unknown) => void;
}

const DEFAULT_RETRIES = 3;
const DEFAULT_CACHE_TTL_MS = 60_000;
const MAX_CACHE_SIZE = 50;
const BASE_DELAY_MS = 300;

const inFlightMap = new Map<string, Promise<unknown>>();
const cache = new Map<string, CacheEntry<unknown>>();
const offlineQueue: QueuedRequest[] = [];

function cacheKey(url: string, init?: RequestInit): string {
    return `${init?.method ?? 'GET'}:${url}`;
}

function evictStale(): void {
    const now = Date.now();
    for (const [k, v] of cache) {
        if (v.expiresAt <= now) cache.delete(k);
    }
    while (cache.size > MAX_CACHE_SIZE) {
        const oldest = cache.keys().next().value;
        if (oldest) cache.delete(oldest);
        else break;
    }
}

function jitteredDelay(attempt: number): number {
    const base = BASE_DELAY_MS * 2 ** attempt;
    return base + Math.random() * base * 0.3;
}

function isRetryable(status: number): boolean {
    return status === 408 || status === 429 || status >= 500;
}

async function fetchWithRetry(url: string, options: RequestInit, retries: number): Promise<Response> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, options);
            if (res.ok || !isRetryable(res.status) || attempt === retries) return res;
            lastError = new Error(`HTTP ${res.status}`);
        } catch (err) {
            lastError = err;
            if (attempt === retries) break;
        }
        await new Promise(r => setTimeout(r, jitteredDelay(attempt)));
    }
    throw lastError;
}

export async function request<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    const {
        method = 'GET',
        retries = DEFAULT_RETRIES,
        cacheTtlMs = DEFAULT_CACHE_TTL_MS,
        skipCache = false,
        skipDedup = false,
        ...fetchOpts
    } = options;

    const init: RequestInit = { ...fetchOpts, method };
    const key = cacheKey(url, init);

    // Cache hit (GET only)
    if (method === 'GET' && !skipCache) {
        const cached = cache.get(key);
        if (cached && cached.expiresAt > Date.now()) return cached.data as T;
    }

    // Offline queue (mutations only)
    if (method !== 'GET' && typeof navigator !== 'undefined' && !navigator.onLine) {
        return new Promise<T>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const index = offlineQueue.findIndex(q => q.resolve === wrappedResolve);
                if (index !== -1) {
                    offlineQueue.splice(index, 1);
                    reject(new Error('Offline request queued for too long'));
                }
            }, 30_000);
            
            const wrappedResolve = (v: unknown) => {
                clearTimeout(timeoutId);
                resolve(v as T);
            };
            
            const wrappedReject = (e: unknown) => {
                clearTimeout(timeoutId);
                reject(e);
            };

            offlineQueue.push({ url, options: init, resolve: wrappedResolve, reject: wrappedReject });
        });
    }

    // Dedup in-flight GETs
    if (method === 'GET' && !skipDedup && inFlightMap.has(key)) {
        return inFlightMap.get(key) as Promise<T>;
    }

    const promise = (async () => {
        try {
            const res = await fetchWithRetry(url, init, retries);
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`HTTP ${res.status}: ${text}`);
            }
            const data = await res.json() as T;

            if (method === 'GET' && !skipCache) {
                evictStale();
                cache.set(key, { data, expiresAt: Date.now() + cacheTtlMs });
            }
            return data;
        } finally {
            inFlightMap.delete(key);
        }
    })();

    if (method === 'GET' && !skipDedup) {
        inFlightMap.set(key, promise);
    }

    return promise;
}

export function invalidateCache(urlPattern?: string): void {
    if (!urlPattern) { cache.clear(); return; }
    for (const key of cache.keys()) {
        if (key.includes(urlPattern)) cache.delete(key);
    }
}

// Flush offline queue on reconnect
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        const pending = offlineQueue.splice(0);
        for (const req of pending) {
            fetch(req.url, req.options)
                .then(r => r.json())
                .then(req.resolve)
                .catch(req.reject);
        }
    });
}
