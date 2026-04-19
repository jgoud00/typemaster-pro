import 'fake-indexeddb/auto';
import { bench, describe, it, expect } from 'vitest';
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

    bench('analyzeKey() single key alias', () => {
        detector.analyzeKey('a');
    });

    bench('analyzeDebounced() hot path', () => {
        detector.analyzeDebounced('a', 50);
    });
});

describe('WeaknessDetector Stress Tests', () => {
    it('10,000 sequential keystrokes — memory and time', async () => {
        const keys = 'abcdefghijklmnopqrstuvwxyz '.split('');
        const before = process.memoryUsage().heapUsed;
        const start = performance.now();
        
        for (let i = 0; i < 10000; i++) {
            const key = keys[i % keys.length];
            detector.updateKey(key, Math.random() > 0.2, 80 + Math.random() * 200, {
                timestamp: Date.now(), 
                sessionPosition: i / 10000, 
                recentErrors: i % 5
            });
        }
        
        const elapsed = performance.now() - start;
        const memDelta = (process.memoryUsage().heapUsed - before) / 1024 / 1024;
        
        console.log(`10k keystrokes: ${elapsed.toFixed(1)}ms | +${memDelta.toFixed(1)}MB`);
        expect(elapsed).toBeLessThan(1000);  // must complete under 1 second
        expect(memDelta).toBeLessThan(50);   // must not leak more than 50MB
    });

    it('saveNow() under 10k keyStates — IDB write time', async () => {
        const start = performance.now();
        await detector.saveNow();
        const elapsed = performance.now() - start;
        
        console.log(`saveNow(): ${elapsed.toFixed(1)}ms`);
        expect(elapsed).toBeLessThan(500);   // must write under 500ms
    });

    it('analyzeAllKeys() stays under 16ms frame budget', () => {
        const start = performance.now();
        detector.analyzeAllKeys();
        const elapsed = performance.now() - start;
        
        console.log(`analyzeAllKeys(): ${elapsed.toFixed(1)}ms`);
        expect(elapsed).toBeLessThan(16);    // 60fps threshold
    });

    it('concurrent tab simulation — 3 detectors writing simultaneously', async () => {
        const d1 = new UltimateWeaknessDetector();
        const d2 = new UltimateWeaknessDetector();
        const d3 = new UltimateWeaknessDetector();
        
        // All three write at the same time
        await Promise.all([d1.saveNow(), d2.saveNow(), d3.saveNow()]);
        
        // d1 should be able to load without corruption
        await d1.load();
        expect(d1.analyzeAllKeys()).toBeDefined();
    });
});
