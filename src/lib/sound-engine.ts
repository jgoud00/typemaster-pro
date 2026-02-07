'use client';

import * as Tone from 'tone';

// Sound types
export type SoundType =
    | 'keystroke'
    | 'error'
    | 'combo-1'
    | 'combo-2'
    | 'combo-3'
    | 'combo-4'
    | 'complete'
    | 'achievement';

interface SoundSettings {
    enabled: boolean;
    volume: number; // 0-1
    keystrokeSounds: boolean;
    errorSounds: boolean;
    comboSounds: boolean;
    completionSounds: boolean;
}

const defaultSettings: SoundSettings = {
    enabled: true,
    volume: 0.5,
    keystrokeSounds: true,
    errorSounds: true,
    comboSounds: true,
    completionSounds: true,
};

class SoundEngine {
    private initialized = false;
    private settings: SoundSettings = defaultSettings;

    // Synthesizers
    private keystrokeSynth: Tone.Synth | null = null;
    private errorSynth: Tone.NoiseSynth | null = null;
    private comboSynth: Tone.PolySynth | null = null;
    private completeSynth: Tone.PolySynth | null = null;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            await Tone.start();

            // Keystroke synth - short click
            this.keystrokeSynth = new Tone.Synth({
                oscillator: { type: 'sine' },
                envelope: {
                    attack: 0.001,
                    decay: 0.05,
                    sustain: 0,
                    release: 0.01,
                },
            }).toDestination();

            // Error synth - noise burst
            this.errorSynth = new Tone.NoiseSynth({
                noise: { type: 'white' },
                envelope: {
                    attack: 0.001,
                    decay: 0.1,
                    sustain: 0,
                    release: 0.05,
                },
            }).toDestination();

            // Combo synth - chimes
            this.comboSynth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'triangle' },
                envelope: {
                    attack: 0.01,
                    decay: 0.2,
                    sustain: 0.1,
                    release: 0.3,
                },
            }).toDestination();

            // Complete synth - fanfare
            this.completeSynth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'square' },
                envelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 0.5,
                },
            }).toDestination();

            this.updateVolume();
            this.initialized = true;
        } catch (error) {
            console.warn('Failed to initialize sound engine:', error);
        }
    }

    private updateVolume(): void {
        const vol = Tone.gainToDb(this.settings.volume * 0.3); // Scale down max volume
        if (this.keystrokeSynth) this.keystrokeSynth.volume.value = vol;
        if (this.errorSynth) this.errorSynth.volume.value = vol - 5; // Error quieter
        if (this.comboSynth) this.comboSynth.volume.value = vol;
        if (this.completeSynth) this.completeSynth.volume.value = vol + 3; // Completion louder
    }

    updateSettings(settings: Partial<SoundSettings>): void {
        this.settings = { ...this.settings, ...settings };
        this.updateVolume();
        this.saveSettings();
    }

    getSettings(): SoundSettings {
        return { ...this.settings };
    }

    private saveSettings(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('sound-settings', JSON.stringify(this.settings));
        }
    }

    loadSettings(): void {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('sound-settings');
            if (saved) {
                try {
                    this.settings = { ...defaultSettings, ...JSON.parse(saved) };
                } catch {
                    this.settings = defaultSettings;
                }
            }
        }
    }

    async play(type: SoundType): Promise<void> {
        if (!this.settings.enabled) return;

        // Check category settings
        if (type === 'keystroke' && !this.settings.keystrokeSounds) return;
        if (type === 'error' && !this.settings.errorSounds) return;
        if (type.startsWith('combo') && !this.settings.comboSounds) return;
        if ((type === 'complete' || type === 'achievement') && !this.settings.completionSounds) return;

        // Initialize on first play (requires user interaction)
        if (!this.initialized) {
            await this.initialize();
        }

        const now = Tone.now();

        switch (type) {
            case 'keystroke':
                // Random pitch for variety
                const pitches = ['C5', 'D5', 'E5', 'F5', 'G5'];
                const pitch = pitches[Math.floor(Math.random() * pitches.length)];
                this.keystrokeSynth?.triggerAttackRelease(pitch, '32n', now);
                break;

            case 'error':
                this.errorSynth?.triggerAttackRelease('16n', now);
                break;

            case 'combo-1':
                this.comboSynth?.triggerAttackRelease(['C4', 'E4', 'G4'], '8n', now);
                break;

            case 'combo-2':
                this.comboSynth?.triggerAttackRelease(['D4', 'F#4', 'A4'], '8n', now);
                this.comboSynth?.triggerAttackRelease(['D5', 'F#5', 'A5'], '8n', now + 0.1);
                break;

            case 'combo-3':
                this.comboSynth?.triggerAttackRelease(['E4', 'G#4', 'B4'], '8n', now);
                this.comboSynth?.triggerAttackRelease(['E5', 'G#5', 'B5'], '8n', now + 0.1);
                this.comboSynth?.triggerAttackRelease(['E6'], '4n', now + 0.2);
                break;

            case 'combo-4':
                // Epic combo sound
                const epicChord = ['C4', 'E4', 'G4', 'B4'];
                this.comboSynth?.triggerAttackRelease(epicChord, '4n', now);
                this.comboSynth?.triggerAttackRelease(['C5', 'E5', 'G5'], '4n', now + 0.15);
                this.comboSynth?.triggerAttackRelease(['C6'], '2n', now + 0.3);
                break;

            case 'complete':
                // Victory fanfare
                this.completeSynth?.triggerAttackRelease(['C4', 'E4'], '8n', now);
                this.completeSynth?.triggerAttackRelease(['E4', 'G4'], '8n', now + 0.15);
                this.completeSynth?.triggerAttackRelease(['G4', 'C5', 'E5'], '4n', now + 0.3);
                break;

            case 'achievement':
                // Special achievement sound
                this.comboSynth?.triggerAttackRelease(['G4', 'B4', 'D5'], '8n', now);
                this.comboSynth?.triggerAttackRelease(['A4', 'C5', 'E5'], '8n', now + 0.15);
                this.comboSynth?.triggerAttackRelease(['B4', 'D5', 'G5'], '4n', now + 0.3);
                this.comboSynth?.triggerAttackRelease(['C5', 'E5', 'G5', 'C6'], '2n', now + 0.5);
                break;
        }
    }

    dispose(): void {
        this.keystrokeSynth?.dispose();
        this.errorSynth?.dispose();
        this.comboSynth?.dispose();
        this.completeSynth?.dispose();
        this.initialized = false;
    }
}

// Singleton instance
export const soundEngine = new SoundEngine();
