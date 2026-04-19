'use client';
import { useEffect } from 'react';

export function PWARegistry() {
    useEffect(() => {
        if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }, []);
    return null;
}
