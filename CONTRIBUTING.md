# 🤝 Contributing to TypeMaster Pro

Thank you for your interest in contributing! This guide will help you get started.

## Quick Start for Contributors

### Understanding the Codebase

**Key Files to Know:**

```
src/
├── lib/algorithms/
│   ├── ultimate-weakness-detector.ts   ← Main ML system
│   ├── error-prediction-model.ts       ← Neural network
│   └── advanced-ngram-analyzer.ts      ← N-gram analysis
├── hooks/
│   └── use-typing-engine.ts            ← Core typing logic
├── stores/
│   ├── analytics-store.ts              ← Data collection
│   └── typing-store.ts                 ← Session state
└── components/
    ├── typing/                          ← Typing interface
    └── weakness/                        ← Analysis dashboards
```

### Data Flow

1. User types → `useTypingEngine` hook
2. Hook updates → Multiple stores (analytics, game, typing)
3. Stores trigger → ML model updates
4. Models generate → Predictions & recommendations
5. UI renders → Feedback to user

---

## Adding a New Algorithm

### Example: Adding a new weakness detection method

**Step 1:** Create algorithm file:

```typescript
// src/lib/algorithms/my-new-detector.ts

export interface MyDetectorResult {
  key: string;
  score: number;
  confidence: number;
}

export class MyNewDetector {
  analyze(keyData: KeyPerformance): MyDetectorResult {
    // Your algorithm here
    return {
      key: keyData.key,
      score: this.calculateScore(keyData),
      confidence: this.calculateConfidence(keyData)
    };
  }
  
  private calculateScore(data: KeyPerformance): number {
    // Implementation
    return 0;
  }
  
  private calculateConfidence(data: KeyPerformance): number {
    // Implementation
    return 0;
  }
}

export const myNewDetector = new MyNewDetector();
```

**Step 2:** Add to ensemble:

```typescript
// src/lib/algorithms/ultimate-weakness-detector.ts

import { myNewDetector } from './my-new-detector';

// In combineEnsemble function:
const myNewPrediction = myNewDetector.analyze(state);
const ensemblePrediction = (
  bayesian * 0.35 +
  hmm * 0.25 +
  temporal * 0.20 +
  neural * 0.10 +
  myNew * 0.10  // Add your weight
);
```

**Step 3:** Tune weights (optional):

```bash
npm run optimize-ensemble
```

**Step 4:** Validate:

```bash
npm run evaluate -- --model my-new-detector
```

---

## Testing Your Changes

### Unit Tests

```bash
npm run test -- ultimate-weakness-detector
```

### Integration Tests

```bash
npm run test:integration
```

### Performance Tests

```bash
npm run test:performance
```

**Performance Requirements:**
- Keystroke update: <5ms
- Full analysis: <50ms
- Memory usage: <100MB

---

## Evaluation Pipeline

### Generate Test Data

```bash
npm run generate-test-data -- --profiles 50 --keystrokes 50000
```

### Run Evaluation

```bash
npm run evaluate -- --dataset test --metrics all
```

**Expected Output:**
```
=== Evaluation Results ===
F1 Score: 0.92 ± 0.01
Precision: 0.93 ± 0.02
Recall: 0.91 ± 0.01
```

### Compare to Baseline

```bash
npm run compare -- --baseline main --branch my-feature
```

---

## Model Regression Tests

Add regression test:

```typescript
// __tests__/regression/weakness-detector.test.ts

test('Weakness detector maintains accuracy', () => {
  const results = weaknessDetector.analyzeAll();
  const f1Score = calculateF1(results);
  
  expect(f1Score).toBeGreaterThan(0.90); // Minimum threshold
});
```

Run regression suite:

```bash
npm run test:regression
```

---

## Documentation Standards

Every new algorithm needs:

1. **Mathematical foundation** (add to `docs/ALGORITHMS.md`)
2. **Performance characteristics**
3. **Test coverage >80%**
4. **Example usage**
5. **Benchmark results**

### Example Documentation

```markdown
## My New Detection Algorithm

### Mathematical Foundation
Uses [method] to [purpose]...

### Performance
- Time complexity: O(n)
- Space complexity: O(1)
- Accuracy: 94.2% F1

### Usage
\`\`\`typescript
const result = myDetector.analyze(keyData);
\`\`\`
```

---

## Research Contributions

### Publishing Process

1. **Implement & validate** algorithm
2. **Run full evaluation** (500k+ keystrokes)
3. **Write up results** (docs/research/)
4. **Submit to conference** (CHI, UIST, IUI)
5. **Publish code & data** (reproducibility)

### Target Conferences

| Conference | Focus | Deadline |
|------------|-------|----------|
| CHI | Human-Computer Interaction | Sep/Feb |
| UIST | User Interface Software & Technology | Apr |
| IUI | Intelligent User Interfaces | Oct |
| LAK | Learning Analytics & Knowledge | Nov |

### Dataset Sharing

- Anonymize all user data
- Use data export: `npm run export-research-data`
- Upload to OSF.io or similar
- Link in paper

---

## Code Style

### TypeScript
- Strict mode enabled
- No `any` types
- Document public APIs with JSDoc

### Naming
- Models: `PascalCase` classes
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Comments
- Why, not what
- Document assumptions
- Explain mathematical formulas

---

## Pull Request Process

1. Fork the repository
2. Create feature branch (`git checkout -b feature/my-feature`)
3. Make changes with tests
4. Run `npm run lint && npm run test`
5. Submit PR with description

### PR Checklist

- [ ] Tests pass
- [ ] Documentation updated
- [ ] Performance benchmarked
- [ ] No linting errors

---

## Questions?

- 💬 [GitHub Discussions](https://github.com/you/typemaster-pro/discussions)
- 🐛 Bug reports: [Issues](https://github.com/you/typemaster-pro/issues)
