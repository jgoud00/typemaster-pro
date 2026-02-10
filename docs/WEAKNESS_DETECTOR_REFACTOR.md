# Architecture Refactor Strategy: UltimateWeaknessDetector

## Current State
- **File:** `src/lib/algorithms/ultimate-weakness-detector.ts`
- **Size:** 1,252 lines (43KB)
- **Methods:** 46 public/private methods
- **Complexity:** High - single class doing multiple concerns

## Proposed Modular Architecture

```
src/lib/algorithms/weakness-detector/
├── index.ts                    # Public API (re-exports)
├── types.ts                    # Shared interfaces
├── core/
│   ├── detector.ts             # Main orchestrator (~200 lines)
│   └── state-manager.ts        # KeyState CRUD + localStorage
├── models/
│   ├── bayesian-model.ts       # Beta-Binomial accuracy
│   ├── speed-model.ts          # Gamma-Poisson speed
│   └── hmm-model.ts            # Hidden Markov Model
├── analysis/
│   ├── temporal-analysis.ts    # Time-based patterns
│   ├── contextual-analysis.ts  # Session position, fatigue
│   └── ensemble.ts             # Weighted aggregation
└── utils/
    ├── debounce.ts             # Performance utilities
    └── statistics.ts           # Beta, betaInv, gamma functions
```

## Module Breakdown

### 1. `types.ts` (~80 lines)
```typescript
export interface KeyState { ... }
export interface SerializedKeyState { ... }
export interface UltimateWeaknessResult { ... }
```

### 2. `models/bayesian-model.ts` (~150 lines)
- `calculateBayesianAccuracy()`
- `updateBetaPriors()`
- `calculateCredibleInterval()`

### 3. `models/hmm-model.ts` (~200 lines)
- `initializeTransitionProbs()`
- `updateHMMState()`
- `learnTransitionProbabilities()`
- `calculateHMMPrediction()`

### 4. `models/speed-model.ts` (~100 lines)
- `updateSpeedModel()`
- `calculateSpeedEstimate()`
- `detectSpeedAnomalies()`

### 5. `analysis/ensemble.ts` (~100 lines)
- `combineModels()`
- `calibrateWeights()`
- `getEnsemblePrediction()`

### 6. `core/detector.ts` (~200 lines)
- Composes all modules
- Main `analyze()` and `updateKey()` methods
- Delegates to specialized modules

## Migration Steps

| Phase | Action | Effort |
|-------|--------|--------|
| 1 | Extract `types.ts` | 30 min |
| 2 | Extract `utils/statistics.ts` | 1 hour |
| 3 | Extract `models/bayesian-model.ts` | 2 hours |
| 4 | Extract `models/hmm-model.ts` | 2 hours |
| 5 | Extract analysis modules | 2 hours |
| 6 | Refactor core detector | 2 hours |
| 7 | Integration testing | 2 hours |

**Total estimated effort:** 1-2 days

## Benefits

1. **Testability** - Each module can be unit tested independently
2. **Maintainability** - Smaller files, clearer ownership
3. **Tree-shaking** - Import only what's needed
4. **Collaboration** - Multiple developers can work simultaneously
5. **Documentation** - Each module has focused purpose

## Compatibility Notes

- Maintain same public API via `index.ts` re-exports
- localStorage key remains unchanged
- React 19 / Next.js 16 compatible (no breaking changes)
