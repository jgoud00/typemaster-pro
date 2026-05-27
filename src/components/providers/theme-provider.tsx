'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useSettingsStore(s => s.settings.theme);

    useEffect(() => {
        const root = document.documentElement;
        // Remove all known theme classes
        root.classList.remove('light', 'dark', 'theme-cyberpunk', 'theme-midnight', 'theme-dracula');
        
        if (theme === 'dark' || theme === 'light') {
            root.classList.add(theme);
        } else {
            root.classList.add('dark'); // Base for premium themes
            root.classList.add(`theme-${theme}`);
        }
    }, [theme]);

    return <>{children}</>;
}
