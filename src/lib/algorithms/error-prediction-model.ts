/**
 * Error Prediction Neural Network
 * 
 * A simple feed-forward neural network that predicts typing errors
 * based on context, user state, and key difficulty.
 * Auto-trains on user's historical data.
 */

export interface PredictionContext {
    currentChar: string;
    previousChars: string[];
    currentWPM: number;
    currentAccuracy: number;
    timeOfDay: number;        // 0-23 hour
    sessionDuration: number;  // minutes since session start
    recentErrors: number;     // errors in last 10 keystrokes
    keyDifficulty: number;    // 0-100 from weakness detector
    ngramDifficulty: number;  // 0-100 from ngram analyzer
}

export interface PredictionResult {
    probability: number;      // 0-1 probability of error
    confidence: number;       // 0-1 confidence in prediction
    riskLevel: 'low' | 'medium' | 'high';
    contributingFactors: Array<{
        factor: string;
        importance: number;
    }>;
}

interface TrainingExample {
    features: number[];
    label: number; // 0 = correct, 1 = error
}

export class ErrorPredictionModel {
    // Network architecture: 10 inputs → 8 hidden → 4 hidden → 1 output
    private weightsIH: number[][] = [];  // Input to Hidden1
    private weightsHH: number[][] = [];  // Hidden1 to Hidden2
    private weightsHO: number[] = [];    // Hidden2 to Output
    private biasH1: number[] = [];
    private biasH2: number[] = [];
    private biasO = 0;

    private readonly INPUT_SIZE = 11; // Was 10 (Split timeOfDay into sin/cos)
    private readonly HIDDEN1_SIZE = 8;
    private readonly HIDDEN2_SIZE = 4;
    private readonly LEARNING_RATE = 0.01;
    private readonly STORAGE_KEY = 'error-prediction-model';

    private isInitialized = false;

    constructor() {
        this.initializeWeights();
        this.load();
    }

    /**
     * Initialize weights using Xavier initialization
     */
    private initializeWeights(): void {
        // Input → Hidden1 weights
        this.weightsIH = [];
        for (let i = 0; i < this.INPUT_SIZE; i++) {
            this.weightsIH[i] = [];
            const scale = Math.sqrt(2 / this.INPUT_SIZE);
            for (let j = 0; j < this.HIDDEN1_SIZE; j++) {
                this.weightsIH[i][j] = (Math.random() - 0.5) * 2 * scale;
            }
        }

        // Hidden1 → Hidden2 weights
        this.weightsHH = [];
        for (let i = 0; i < this.HIDDEN1_SIZE; i++) {
            this.weightsHH[i] = [];
            const scale = Math.sqrt(2 / this.HIDDEN1_SIZE);
            for (let j = 0; j < this.HIDDEN2_SIZE; j++) {
                this.weightsHH[i][j] = (Math.random() - 0.5) * 2 * scale;
            }
        }

        // Hidden2 → Output weights
        this.weightsHO = [];
        // Xavier/Glorot optimization for Sigmoid output
        const scale = Math.sqrt(1 / this.HIDDEN2_SIZE); // Was sqrt(2/n)
        for (let i = 0; i < this.HIDDEN2_SIZE; i++) {
            this.weightsHO[i] = (Math.random() - 0.5) * 2 * scale;
        }

        // Biases
        this.biasH1 = new Array(this.HIDDEN1_SIZE).fill(0);
        this.biasH2 = new Array(this.HIDDEN2_SIZE).fill(0);
        this.biasO = 0;

        this.isInitialized = true;
    }

    /**
     * Extract normalized features from context
     */
    extractFeatures(context: PredictionContext): number[] {
        return [
            this.encodeChar(context.currentChar),
            this.encodeChar(context.previousChars[0] || ''),
            Math.min(1, context.currentWPM / 120),
            context.currentAccuracy / 100,

            // OPTIMIZATION: Cyclic Time Encoding
            // Fixes "Midnight Bug" where 23:59 and 00:01 were seen as opposites.
            Math.sin(2 * Math.PI * context.timeOfDay / 24), // -1 to 1
            Math.cos(2 * Math.PI * context.timeOfDay / 24), // -1 to 1

            Math.min(1, context.sessionDuration / 60),
            this.calculateFatigue(context.sessionDuration, context.recentErrors),
            context.recentErrors / 10,
            context.keyDifficulty / 100,
            context.ngramDifficulty / 100,
        ];
    }

    /**
     * Encode character to 0-1 range
     */
    private encodeChar(char: string): number {
        if (!char) return 0.5;
        const code = char.toLowerCase().charCodeAt(0);
        if (code >= 97 && code <= 122) {
            return (code - 97) / 26;
        }
        if (code >= 48 && code <= 57) {
            return 0.5 + (code - 48) / 20;
        }
        return 0.5;
    }

    /**
     * Calculate fatigue level based on session duration and recent errors
     */
    private calculateFatigue(sessionMinutes: number, recentErrors: number): number {
        const timeFatigue = Math.min(1, sessionMinutes / 45);
        const errorFatigue = recentErrors / 10;
        return Math.min(1, timeFatigue * 0.6 + errorFatigue * 0.4);
    }

    /**
     * ReLU activation function
     */
    private relu(x: number): number {
        return Math.max(0, x);
    }

    /**
     * Sigmoid activation function
     */
    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
    }

    /**
     * Forward pass through the network
     */
    private forward(features: number[]): {
        probability: number;
        hidden1: number[];
        hidden2: number[];
    } {
        // Input → Hidden1
        const hidden1: number[] = [];
        for (let j = 0; j < this.HIDDEN1_SIZE; j++) {
            let sum = this.biasH1[j];
            for (let i = 0; i < this.INPUT_SIZE; i++) {
                sum += features[i] * this.weightsIH[i][j];
            }
            hidden1[j] = this.relu(sum);
        }

        // Hidden1 → Hidden2
        const hidden2: number[] = [];
        for (let j = 0; j < this.HIDDEN2_SIZE; j++) {
            let sum = this.biasH2[j];
            for (let i = 0; i < this.HIDDEN1_SIZE; i++) {
                sum += hidden1[i] * this.weightsHH[i][j];
            }
            hidden2[j] = this.relu(sum);
        }

        // Hidden2 → Output
        let output = this.biasO;
        for (let j = 0; j < this.HIDDEN2_SIZE; j++) {
            output += hidden2[j] * this.weightsHO[j];
        }

        return {
            probability: this.sigmoid(output),
            hidden1,
            hidden2,
        };
    }

    /**
     * Predict error probability for given context
     */
    predict(context: PredictionContext): PredictionResult {
        const features = this.extractFeatures(context);
        const { probability, hidden1 } = this.forward(features);

        // Calculate confidence (lower entropy = higher confidence)
        const entropy = probability > 0 && probability < 1
            ? -probability * Math.log2(probability) - (1 - probability) * Math.log2(1 - probability)
            : 0;
        const confidence = 1 - entropy;

        // Determine risk level
        const riskLevel = probability > 0.6 ? 'high' : probability > 0.3 ? 'medium' : 'low';

        // Analyze feature importance
        const contributingFactors = this.analyzeImportance(features, hidden1);

        return {
            probability,
            confidence,
            riskLevel,
            contributingFactors,
        };
    }

    /**
     * Analyze which features contribute most to the prediction
     */
    private analyzeImportance(features: number[], hidden1: number[]): Array<{
        factor: string;
        importance: number;
    }> {
        const featureNames = [
            'Current Character',
            'Previous Character',
            'Typing Speed',
            'Current Accuracy',
            'Time (Cyclic Sin)',
            'Time (Cyclic Cos)',
            'Session Duration',
            'Fatigue Level',
            'Recent Errors',
            'Key Difficulty',
            'N-gram Difficulty',
        ];

        const importance: number[] = [];
        for (let i = 0; i < this.INPUT_SIZE; i++) {
            let contribution = 0;
            for (let j = 0; j < this.HIDDEN1_SIZE; j++) {
                contribution += Math.abs(this.weightsIH[i][j] * features[i] * (hidden1[j] > 0 ? 1 : 0));
            }
            importance[i] = contribution;
        }

        // Normalize
        const maxImp = Math.max(...importance, 0.001);

        return featureNames
            .map((name, i) => ({
                factor: name,
                importance: importance[i] / maxImp,
            }))
            .filter(f => f.importance > 0.15)
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 5);
    }

    /**
     * Train model on batch of examples
     */
    train(examples: TrainingExample[], epochs = 50): void {
        if (examples.length < 10) {
            console.log('Not enough examples to train (need 10+)');
            return;
        }

        for (let epoch = 0; epoch < epochs; epoch++) {
            let totalLoss = 0;
            const shuffled = this.shuffle(examples);

            for (const example of shuffled) {
                const { probability, hidden1, hidden2 } = this.forward(example.features);

                // Binary cross-entropy loss
                const loss = -example.label * Math.log(probability + 1e-10)
                    - (1 - example.label) * Math.log(1 - probability + 1e-10);
                totalLoss += loss;

                // Backpropagation
                this.backpropagate(example.features, hidden1, hidden2, probability, example.label);
            }

            if (epoch % 10 === 0) {
                console.log(`Epoch ${epoch}: Loss = ${(totalLoss / examples.length).toFixed(4)}`);
            }
        }

        this.save();
    }

    /**
     * Backpropagation to update weights
     */
    private backpropagate(
        features: number[],
        hidden1: number[],
        hidden2: number[],
        prediction: number,
        label: number
    ): void {
        // 1. Calculate Gradients (BEFORE updating weights)

        // Output gradient
        const outputGrad = prediction - label;

        // Hidden2 Gradients
        const hidden2Grads: number[] = [];
        for (let j = 0; j < this.HIDDEN2_SIZE; j++) {
            hidden2Grads[j] = outputGrad * this.weightsHO[j] * (hidden2[j] > 0 ? 1 : 0);
        }

        // Hidden1 Gradients
        const hidden1Grads: number[] = [];
        for (let i = 0; i < this.HIDDEN1_SIZE; i++) {
            let grad = 0;
            for (let j = 0; j < this.HIDDEN2_SIZE; j++) {
                grad += hidden2Grads[j] * this.weightsHH[i][j];
            }
            hidden1Grads[i] = grad * (hidden1[i] > 0 ? 1 : 0);
        }

        // 2. Update Weights and Biases

        // Update Hidden2 → Output
        for (let j = 0; j < this.HIDDEN2_SIZE; j++) {
            this.weightsHO[j] -= this.LEARNING_RATE * outputGrad * hidden2[j];
        }
        this.biasO -= this.LEARNING_RATE * outputGrad;

        // Update Hidden1 → Hidden2
        for (let i = 0; i < this.HIDDEN1_SIZE; i++) {
            for (let j = 0; j < this.HIDDEN2_SIZE; j++) {
                this.weightsHH[i][j] -= this.LEARNING_RATE * hidden2Grads[j] * hidden1[i];
            }
        }
        for (let j = 0; j < this.HIDDEN2_SIZE; j++) {
            this.biasH2[j] -= this.LEARNING_RATE * hidden2Grads[j];
        }

        // Update Input → Hidden1
        for (let i = 0; i < this.INPUT_SIZE; i++) {
            for (let j = 0; j < this.HIDDEN1_SIZE; j++) {
                this.weightsIH[i][j] -= this.LEARNING_RATE * hidden1Grads[j] * features[i];
            }
        }
        for (let j = 0; j < this.HIDDEN1_SIZE; j++) {
            this.biasH1[j] -= this.LEARNING_RATE * hidden1Grads[j];
        }
    }

    /**
     * Fisher-Yates shuffle
     */
    private shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * Save model to localStorage
     */
    save(): void {
        try {
            if (typeof window === 'undefined') return;
            const data = {
                weightsIH: this.weightsIH,
                weightsHH: this.weightsHH,
                weightsHO: this.weightsHO,
                biasH1: this.biasH1,
                biasH2: this.biasH2,
                biasO: this.biasO,
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save error prediction model:', e);
        }
    }

    /**
     * Load model from localStorage
     */
    load(): boolean {
        try {
            if (typeof window === 'undefined') return false;
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                this.weightsIH = data.weightsIH;
                this.weightsHH = data.weightsHH;
                this.weightsHO = data.weightsHO;
                this.biasH1 = data.biasH1;
                this.biasH2 = data.biasH2;
                this.biasO = data.biasO;
                return true;
            }
        } catch (e) {
            console.warn('Failed to load error prediction model:', e);
        }
        return false;
    }

    /**
     * Check if model is trained
     */
    isTrained(): boolean {
        return this.isInitialized;
    }
}

// Singleton export
export const errorPredictor = new ErrorPredictionModel();
