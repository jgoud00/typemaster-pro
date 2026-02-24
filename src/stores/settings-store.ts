'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
    // Sound
    keystrokeSounds: boolean;
    achievementSounds: boolean;
    volume: number;

    // Display
    theme: 'light' | 'dark' | 'system';
    showVirtualKeyboard: boolean;
    showFingerHints: boolean;

    // Typing
    smoothCaret: boolean;
    quickRestart: boolean;
    fontSize: 'small' | 'medium' | 'large';

    // Keyboard Layout
    keyboardLayout: 'qwerty' | 'dvorak' | 'colemak' | 'azerty';

    // Smart Practice
    focusModeEnabled: boolean;

    // Customization
    keyboardSound: 'mechanical' | 'typewriter' | 'digital' | 'none';
    cursorStyle: 'line' | 'block' | 'underline' | 'bar';
};

interface SettingsStore {
    settings: SettingsState;

    // Actions
    updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
    resetSettings: () => void;
}

const defaultSettings: SettingsState = {
    // Sound
    keystrokeSounds: true,
    achievementSounds: true,
    volume: 70,

    // Display
    theme: 'dark',
    showVirtualKeyboard: true,
    showFingerHints: true,

    // Typing
    smoothCaret: true,
    quickRestart: true,
    fontSize: 'medium',

    // Keyboard Layout
    keyboardLayout: 'qwerty',

    // Smart Practice
    focusModeEnabled: false,

    // Customization
    keyboardSound: 'mechanical',
    cursorStyle: 'line',
};

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            settings: defaultSettings,

            updateSetting: (key, value) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        [key]: value,
                    },
                }));
            },

            resetSettings: () => {
                set({ settings: defaultSettings });
            },
        }),
        {
            name: 'typemaster-settings',
        }
    )
);
