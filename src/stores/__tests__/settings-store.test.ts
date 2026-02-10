import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '../settings-store';
import { act } from '@testing-library/react';

describe('SettingsStore', () => {
    beforeEach(() => {
        // Reset store to defaults
        const { resetSettings } = useSettingsStore.getState();
        resetSettings();
    });

    describe('Initial State', () => {
        it('should have correct default settings', () => {
            const { settings } = useSettingsStore.getState();

            expect(settings.keystrokeSounds).toBe(true);
            expect(settings.volume).toBe(70);
            expect(settings.showVirtualKeyboard).toBe(true);
            expect(settings.keyboardLayout).toBe('qwerty');
        });
    });

    describe('updateSetting()', () => {
        it('should update keystroke sounds setting', () => {
            // Arrange
            const store = useSettingsStore.getState();

            // Act
            act(() => {
                store.updateSetting('keystrokeSounds', false);
            });

            // Assert
            const { settings } = useSettingsStore.getState();
            expect(settings.keystrokeSounds).toBe(false);
        });

        it('should update volume setting', () => {
            // Arrange
            const store = useSettingsStore.getState();

            // Act
            act(() => {
                store.updateSetting('volume', 75);
            });

            // Assert
            const { settings } = useSettingsStore.getState();
            expect(settings.volume).toBe(75);
        });

        it('should update keyboard layout', () => {
            // Arrange
            const store = useSettingsStore.getState();

            // Act
            act(() => {
                store.updateSetting('keyboardLayout', 'dvorak');
            });

            // Assert
            const { settings } = useSettingsStore.getState();
            expect(settings.keyboardLayout).toBe('dvorak');
        });

        it('should update font size', () => {
            // Arrange
            const store = useSettingsStore.getState();

            // Act
            act(() => {
                store.updateSetting('fontSize', 'large');
            });

            // Assert
            const { settings } = useSettingsStore.getState();
            expect(settings.fontSize).toBe('large');
        });

        it('should update focus mode setting', () => {
            // Arrange
            const store = useSettingsStore.getState();

            // Act
            act(() => {
                store.updateSetting('focusModeEnabled', true);
            });

            // Assert
            const { settings } = useSettingsStore.getState();
            expect(settings.focusModeEnabled).toBe(true);
        });
    });

    describe('resetSettings()', () => {
        it('should reset all settings to defaults', () => {
            // Arrange: Change some settings
            const store = useSettingsStore.getState();
            act(() => {
                store.updateSetting('volume', 100);
                store.updateSetting('keyboardLayout', 'colemak');
                store.updateSetting('showVirtualKeyboard', false);
            });

            // Act
            act(() => {
                store.resetSettings();
            });

            // Assert
            const { settings } = useSettingsStore.getState();
            expect(settings.volume).toBe(70);
            expect(settings.keyboardLayout).toBe('qwerty');
            expect(settings.showVirtualKeyboard).toBe(true);
        });
    });

    describe('Multiple Settings Update', () => {
        it('should handle multiple setting updates correctly', () => {
            // Arrange
            const store = useSettingsStore.getState();

            // Act
            act(() => {
                store.updateSetting('smoothCaret', false);
                store.updateSetting('quickRestart', false);
                store.updateSetting('achievementSounds', false);
            });

            // Assert
            const { settings } = useSettingsStore.getState();
            expect(settings.smoothCaret).toBe(false);
            expect(settings.quickRestart).toBe(false);
            expect(settings.achievementSounds).toBe(false);
        });
    });

    describe('Persistence', () => {
        it('should persist settings to localStorage', () => {
            // Arrange
            const store = useSettingsStore.getState();

            // Act
            act(() => {
                store.updateSetting('volume', 80);
            });

            // Assert: Check localStorage was called
            // (localStorage is mocked in setup.ts)
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });
});
