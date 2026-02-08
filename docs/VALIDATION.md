# 🔬 Validation Framework

> ⚠️ **Status: Awaiting Real Data**  
> This document outlines the validation methodology. Actual metrics will be populated once real user data is collected.

---

## How to Collect Real User Data

### Option 1: Self-Testing (Quick Start)
Use the app yourself and export your data:

1. **Use TypeMaster Pro** for 5-10 sessions across different days
2. Go to **Settings → Export Data** (or run in browser console):
   ```javascript
   // Export all analytics data
   const data = localStorage.getItem('typemaster-analytics');
   console.log(JSON.parse(data));
   ```
3. This gives you real keystroke-level data for analysis

### Option 2: Beta Testers (Recommended)
Recruit 10-20 users for meaningful statistical power:

1. **Deploy to Vercel/Netlify** - Free tier is sufficient
2. **Share with friends/colleagues** - Ask them to use it for 1 week
3. **Add data export** - Users can download their JSON data
4. **Aggregate anonymously** - Combine data for analysis

### Option 3: Simulated Data (For Testing Pipeline)
Generate realistic synthetic data:

```typescript
// Script to generate test data
function generateSimulatedSession(userSkill: 'beginner' | 'intermediate' | 'advanced') {
  const baseAccuracy = { beginner: 0.7, intermediate: 0.85, advanced: 0.95 }[userSkill];
  const keystrokes = [];
  
  for (let i = 0; i < 500; i++) {
    keystrokes.push({
      key: String.fromCharCode(97 + Math.floor(Math.random() * 26)),
      correct: Math.random() < baseAccuracy,
      latencyMs: 150 + Math.random() * 200,
      timestamp: Date.now() + i * 200
    });
  }
  return keystrokes;
}
```

---

## Evaluation Metrics (To Be Measured)

### 1. Error Prediction Accuracy

| Metric | Description | Target |
|--------|-------------|--------|
| Precision | True positives / Predicted positives | >85% |
| Recall | True positives / Actual positives | >80% |
| F1 Score | Harmonic mean of P & R | >82% |
| ROC-AUC | Classification performance | >0.90 |

**How to Measure:**
```typescript
// Compare predictions to actual errors
const predictions = errorPredictor.predict(keystroke);
const actual = keystroke.correct ? 0 : 1;
// Track TP, FP, TN, FN counts
```

### 2. Weakness Detection Accuracy

Test if detected weak keys match actual error patterns:
```typescript
const detectedWeakKeys = weaknessDetector.getTopWeakKeys(5);
const actualWeakKeys = getKeysWithLowestAccuracy(keyStats, 5);
const overlap = detectedWeakKeys.filter(k => actualWeakKeys.includes(k));
const accuracy = overlap.length / 5;
```

### 3. Learning Improvement (A/B Test)

**Methodology:**
1. Split users into 2 groups
2. Group A: Adaptive curriculum (your ML system)
3. Group B: Fixed curriculum (random lessons)
4. Measure WPM gain over 2 weeks

**Minimum Sample Size:** 20 users per group for statistical significance

---

## What Data You Already Have

The app already collects this in localStorage:

| Data Type | Location | What It Contains |
|-----------|----------|------------------|
| Key stats | `typemaster-analytics` | Per-key accuracy, speed, attempts |
| Sessions | `typemaster-progress` | WPM, accuracy per session |
| ML state | `ultimate-weakness-detector` | Bayesian priors, HMM states |

### View Your Current Data
Open browser console on the app:
```javascript
// See all collected analytics
console.log(JSON.parse(localStorage.getItem('typemaster-analytics')));

// See session history  
console.log(JSON.parse(localStorage.getItem('typemaster-progress')));
```

---

## Validation Checklist

- [ ] Collect data from 10+ sessions
- [ ] Export and analyze keystroke data
- [ ] Calculate actual F1/precision/recall
- [ ] Compare adaptive vs baseline learning
- [ ] Update this document with real numbers

---

## Sample Evaluation Script

Create `scripts/evaluate.ts`:

```typescript
import { ultimateWeaknessDetector } from '../src/lib/algorithms/ultimate-weakness-detector';

interface EvaluationResult {
  f1Score: number;
  precision: number;
  recall: number;
  sampleSize: number;
}

export function evaluate(testData: KeystrokeEvent[]): EvaluationResult {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  
  for (const keystroke of testData) {
    const prediction = ultimateWeaknessDetector.predictError(keystroke.key);
    const actual = !keystroke.correct;
    
    if (prediction && actual) tp++;
    else if (prediction && !actual) fp++;
    else if (!prediction && actual) fn++;
    else tn++;
  }
  
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
  
  return { f1Score, precision, recall, sampleSize: testData.length };
}
```

---

**Last Updated:** February 8, 2026  
**Status:** Framework ready, awaiting real data collection
