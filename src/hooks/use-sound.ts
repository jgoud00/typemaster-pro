'use client';

import { useCallback, useEffect, useState } from 'react';
import { soundEngine, SoundType } from '@/lib/sound-engine';

interface SoundSettings {
    enabled: boolean;
    volume: number;
    keystrokeSounds: boolean;
    errorSounds: boolean;
    comboSounds: boolean;
    completionSounds: boolean;
}

export function useSound() {
    const [settings, setSettings] = useState<SoundSettings>(() => soundEngine.getSettings());
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        soundEngine.loadSettings();
        setSettings(soundEngine.getSettings());
        setIsLoaded(true);
    }, []);

    const play = useCallback((type: SoundType) => {
        soundEngine.play(type);
    }, []);

    const updateSettings = useCallback((newSettings: Partial<SoundSettings>) => {
        soundEngine.updateSettings(newSettings);
        setSettings(soundEngine.getSettings());
    }, []);

    const toggleEnabled = useCallback(() => {
        updateSettings({ enabled: !settings.enabled });
    }, [settings.enabled, updateSettings]);

    const setVolume = useCallback((volume: number) => {
        updateSettings({ volume: Math.max(0, Math.min(1, volume)) });
    }, [updateSettings]);

    return {
        settings,
        isLoaded,
        play,
        updateSettings,
        toggleEnabled,
        setVolume,
    };
}
