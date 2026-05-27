import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useTypingStore } from './typing-store';

describe('typing-store', () => {
    beforeEach(() => {
        useTypingStore.getState().reset();
        useTypingStore.getState().setText('hello world');
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize with empty state correctly', () => {
        const state = useTypingStore.getState().state;
        expect(state.text).toBe('hello world');
        expect(state.currentIndex).toBe(0);
        expect(state.errorIndices.length).toBe(0);
        expect(state.isComplete).toBe(false);
    });

    it('should correctly handle a valid keystroke', () => {
        // Mock time to start the session
        const now = Date.now();
        vi.setSystemTime(now);

        const store = useTypingStore.getState();
        const keystroke = store.handleKeystroke('h'); // first character

        expect(keystroke).not.toBeNull();
        expect(keystroke?.isCorrect).toBe(true);
        expect(useTypingStore.getState().state.currentIndex).toBe(1);
        expect(useTypingStore.getState().activeKey).toBe('e');
        expect(useTypingStore.getState().correctCount).toBe(1);
    });

    it('should correctly handle an invalid keystroke', () => {
        const now = Date.now();
        vi.setSystemTime(now);

        const store = useTypingStore.getState();
        const keystroke = store.handleKeystroke('x'); // wrong character

        expect(keystroke).not.toBeNull();
        expect(keystroke?.isCorrect).toBe(false);
        // index shouldn't advance on monkeytype-style error without backspace
        expect(useTypingStore.getState().state.currentIndex).toBe(0);
        expect(useTypingStore.getState().state.errorIndices).toContain(0);
    });

    it('should accurately calculate WPM and Accuracy', () => {
        // Start time non-zero
        vi.setSystemTime(10000);
        
        const store = useTypingStore.getState();
        store.handleKeystroke('h');
        store.handleKeystroke('e');
        store.handleKeystroke('l');
        store.handleKeystroke('l');
        
        // 2 seconds later
        vi.advanceTimersByTime(2000);
        store.handleKeystroke('x'); // Wrong
        store.handleKeystroke('o'); // Right
        
        const updatedStore = useTypingStore.getState();
        
        // 5 correct, 1 wrong = 6 total
        const accuracy = updatedStore.getAccuracy();
        expect(accuracy).toBe(Math.round((5 / 6) * 100)); // 83%

        console.log('State:', {
            startTime: updatedStore.state.startTime,
            endTime: updatedStore.state.endTime,
            correctCount: updatedStore.correctCount,
            elapsedSeconds: updatedStore.getElapsedTime(),
            currentDateNow: Date.now()
        });

        // WPM: 5 correct keystrokes = 1 word. 1 word / 2 seconds = 30 WPM
        const wpm = updatedStore.getWpm();
        expect(wpm).toBe(30);
    });

    it('should handle backspace correctly', () => {
        const store = useTypingStore.getState();
        
        // Type 'h'
        store.handleKeystroke('h');
        expect(useTypingStore.getState().state.currentIndex).toBe(1);
        
        // Backspace
        const success = store.handleBackspace();
        expect(success).toBe(true);
        expect(useTypingStore.getState().state.currentIndex).toBe(0);
    });

    it('should pause and resume correctly without affecting WPM time', () => {
        vi.setSystemTime(10000); // Non-zero start time
        const store = useTypingStore.getState();
        store.handleKeystroke('h'); // starts timer
        
        vi.advanceTimersByTime(1000);
        store.pause();
        
        vi.advanceTimersByTime(4000); // 4 seconds pass while paused
        store.resume();
        
        vi.advanceTimersByTime(1000);
        store.handleKeystroke('e');
        store.handleKeystroke('l');
        store.handleKeystroke('l');
        store.handleKeystroke('o');
        
        const updatedStore = useTypingStore.getState();
        
        // Total wall time = 6000ms. Paused time = 4000ms. Active time = 2000ms (2s).
        // 5 correct keystrokes = 1 word. 1 word / 2s = 30 WPM.
        expect(updatedStore.getElapsedTime()).toBe(2);
        expect(updatedStore.getWpm()).toBe(30);
    });
});
