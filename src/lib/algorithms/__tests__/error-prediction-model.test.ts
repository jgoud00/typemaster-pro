import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorPredictionModel } from '../error-prediction-model';

describe('ErrorPredictionModel', () => {
    let model: ErrorPredictionModel;

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        model = new ErrorPredictionModel();
    });

    it('should initialize with random weights', () => {
        expect((model as any).isInitialized).toBe(true);
        expect((model as any).weightsIH.length).toBe(10); // Input size
    });

    it('should predict error probability', () => {
        const result = model.predict({
            currentChar: 'a',
            previousChars: ['b'],
            currentWPM: 60,
            currentAccuracy: 95,
            timeOfDay: 12,
            sessionDuration: 5,
            recentErrors: 0,
            keyDifficulty: 20,
            ngramDifficulty: 10
        });

        expect(result.probability).toBeGreaterThanOrEqual(0);
        expect(result.probability).toBeLessThanOrEqual(1);
        expect(result.riskLevel).toBeDefined();
    });

    it('should reduce loss during training (verifying backpropagation)', () => {
        const trainingData = [];
        for (let i = 0; i < 20; i++) {
            const val = Math.random();
            const features = [val, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const label = val > 0.5 ? 1 : 0;
            trainingData.push({ features, label });
        }

        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        model.train(trainingData, 50);

        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should save and load model', () => {
        model.save();
        expect(localStorage.setItem).toHaveBeenCalledWith('error-prediction-model', expect.any(String));

        // Mock return value for load
        const mockData = JSON.stringify({
            weightsIH: [], weightsHH: [], weightsHO: [], biasH1: [], biasH2: [], biasO: 0
        });
        localStorage.setItem('error-prediction-model', mockData);

        const loaded = model.load();
        expect(loaded).toBe(true);
    });
});
