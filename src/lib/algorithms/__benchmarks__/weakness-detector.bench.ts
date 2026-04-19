import 'fake-indexeddb/auto';
import { bench, describe } from 'vitest';
import { UltimateWeaknessDetector } from '../ultimate-weakness-detector';

// Setup Mock Detector with seed data
const setupDetector = () => {
    const detector = new UltimateWeaknessDetector();
    const keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()'.split('').slice(0, 47);
    
    for (const key of keys) {
        for (let i = 0; i < 500; i++) {
            const isCorrect = Math.random() > 0.2;
            const speed = 80 + Math.random() * 220;
            detector.updateKey(key, isCorrect, speed, {
                timestamp: Date.now() - (500 - i) * 1000,
                sessionPosition: i / 500,
                recentErrors: i % 3 === 0 ? 1 : 0
            });
        }
    }
    return detector;
};

const detector = setupDetector();

describe('WeaknessDetector Benchmarks', () => {
    bench('updateKey() single keystroke', () => {
        detector.updateKey('a', true, 120, {
            timestamp: Date.now(),
            sessionPosition: 0.5,
            recentErrors: 2
        });
    });

    bench('analyzeAllKeys() full scan — 47 keys', () => {
        detector.analyzeAllKeys();
    });

    bench('analyze() single key', () => {
        detector.analyze('a');
    });

    bench('analyzeDebounced() hot path', () => {
        detector.analyzeDebounced('a', 50);
    });
});
