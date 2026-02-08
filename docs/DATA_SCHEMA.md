# 📊 Data Schema & Internal Structures

Complete documentation of TypeMaster Pro's data structures, storage, and privacy measures.

## Core Data Types

### KeystrokeEvent

```typescript
interface KeystrokeEvent {
  // Identification
  id: string;                    // UUID
  sessionId: string;             // Groups keystrokes by session
  userId?: string;               // Optional user ID (anonymized)
  
  // Keystroke data
  key: string;                   // Actual key pressed
  expectedKey: string;           // Key that should have been pressed
  correct: boolean;              // key === expectedKey
  
  // Timing
  timestamp: number;             // Unix epoch (ms)
  latencyMs: number;             // Time since previous keystroke
  hesitationMs: number;          // Pause before this keystroke
  
  // Context
  previousKey?: string;          // For bigram analysis
  previousPreviousKey?: string;  // For trigram analysis
  fingerUsed: Finger;            // Which finger pressed the key
  position: number;              // Character index in text
  
  // Session context
  sessionPosition: number;       // 0-1, position within session
  cumulativeFatigue: number;     // 0-1, estimated fatigue
  currentWPM: number;            // WPM at this moment
  currentAccuracy: number;       // Accuracy at this moment
  
  // Metadata
  source: 'lesson' | 'practice' | 'speed-test';
  difficulty: 'easy' | 'medium' | 'hard';
}
```

### KeyStatistics

```typescript
interface KeyStatistics {
  key: string;
  
  // Raw counts
  totalAttempts: number;
  correct: number;
  errors: number;
  
  // Timing
  avgLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  latencyVariance: number;
  
  // Bayesian model parameters
  alphaPrior: number;
  betaPrior: number;
  alphaPost: number;
  betaPost: number;
  
  // Timestamps (for temporal analysis)
  attemptTimestamps: number[];
  errorTimestamps: number[];
  
  // Contextual
  timeOfDayPerformance: Map<number, number>;  // Hour -> accuracy
  fingerLoadCumulative: number;
  
  // Learning
  learningCurve: number[];       // Historical accuracy by window
  learningRate: number;          // Improvement per session
  
  // HMM
  currentState: State;
  stateProbabilities: Map<State, number>;
  
  // Last updated
  lastUpdated: number;
}
```

### Session

```typescript
interface Session {
  id: string;
  userId?: string;
  
  // Timing
  startTime: number;
  endTime: number;
  duration: number;  // seconds
  
  // Performance
  wpm: number;
  accuracy: number;
  errorCount: number;
  keystrokeCount: number;
  
  // Engagement
  combo: number;
  maxCombo: number;
  score: number;
  
  // Content
  mode: 'lesson' | 'practice' | 'speed-test';
  lessonId?: string;
  textCompleted: string;
  
  // Analysis
  weakKeys: string[];
  difficultBigrams: string[];
  hmmStateChanges: Array<{timestamp: number; state: State}>;
  
  // Metadata
  created: Date;
}
```

---

## Storage Structure

### LocalStorage Keys

| Key | Purpose | Size |
|-----|---------|------|
| `typemaster-progress` | Progress store (lessons, achievements) | ~200KB |
| `typemaster-analytics` | Analytics store (key stats, n-grams) | ~2MB |
| `typemaster-game` | Game store (score, combos, streaks) | ~50KB |
| `typemaster-settings` | User settings | ~10KB |
| `ultimate-weakness-detector` | ML model state | ~300KB |
| `error-prediction-model` | Neural network weights | ~100KB |
| `user-profile` | Personalization data | ~50KB |

### Storage Size Limits

- **Target:** <5MB total (localStorage limit is ~10MB)
- **Key stats:** ~2MB (26 keys × ~80KB each)
- **Session history:** ~1MB (last 100 sessions)
- **ML models:** ~500KB
- **Settings:** <10KB

### Data Retention

| Data Type | Retention |
|-----------|-----------|
| Session history | Last 200 sessions |
| Keystroke buffer | Last 1,000 keystrokes (circular) |
| Learning curves | Last 50 data points per key |

---

## Data Flow Architecture

```
User Keyboard Input
    ↓
Event Listener (useTypingEngine)
    ↓
┌─────────────────────────────┐
│   keystrokeEvent created    │
└─────────────────────────────┘
    ↓
┌──────────────┬──────────────┬──────────────┬───────────────┐
↓              ↓              ↓              ↓               ↓
TypingStore   AnalyticsStore  GameStore    NgramAnalyzer   ErrorPredictor
    ↓              ↓              ↓              ↓               ↓
Update State   Update KeyStats Update Combo   Update Bigrams  Predict Next
    ↓              ↓              ↓              ↓               ↓
└──────────────┴──────────────┴──────────────┴───────────────┘
                         ↓
                   UI Re-render
                         ↓
                   User Sees Feedback
```

---

## Privacy & Security

### What We Store Locally

✅ Aggregate statistics (WPM, accuracy)  
✅ Per-key performance metrics  
✅ Session history (anonymized)  
✅ ML model parameters  

### What We DON'T Store

❌ Raw typed text content  
❌ Biometric fingerprints  
❌ Personally identifiable information  
❌ Keystroke timing patterns (beyond aggregates)  

### Data Control

| Feature | Description |
|---------|-------------|
| Storage Location | Browser localStorage only |
| Server Transmission | None (fully client-side) |
| Data Export | JSON download available |
| Data Deletion | Clear browser data |

### Anonymization

```typescript
// User IDs are hashed if provided
const anonymizedId = await crypto.subtle.digest(
  'SHA-256',
  new TextEncoder().encode(userId)
);
```

---

## Data Export Format

```json
{
  "version": "1.0",
  "exportDate": "2026-02-08T10:30:00Z",
  "user": {
    "anonymousId": "a8f7...",
    "totalSessions": 127,
    "totalKeystrokes": 45234
  },
  "statistics": {
    "keys": {
      "a": {
        "accuracy": 0.94,
        "avgSpeed": 187,
        "attempts": 1234
      }
    },
    "sessions": [...],
    "progress": {...}
  },
  "models": {
    "bayesian": {...},
    "hmm": {...},
    "neural": {...}
  }
}
```

---

## Real-Time Updates

### Update Frequency

| Component | Frequency |
|-----------|-----------|
| UI | Every keystroke (60fps capable) |
| Analytics | Every 10 keystrokes (batched) |
| ML models | Every 50 keystrokes |
| Persistence | Every 100 keystrokes + on session end |

### Performance Optimization

```typescript
// Debounced persistence
const debouncedSave = debounce(() => {
  localStorage.setItem('analytics', JSON.stringify(state));
}, 5000); // Save max once per 5 seconds
```

---

## Data Integrity

### Validation

```typescript
// Type guards ensure data integrity
function isValidKeystrokeEvent(event: any): event is KeystrokeEvent {
  return (
    typeof event.key === 'string' &&
    typeof event.timestamp === 'number' &&
    event.timestamp > 0 &&
    typeof event.correct === 'boolean'
  );
}
```

### Migration Strategy

```typescript
// Version migration
if (savedVersion === '1.0' && currentVersion === '1.1') {
  migrateV1toV1_1(data);
}
```

### Error Recovery

```typescript
// Graceful degradation on corrupt data
try {
  const data = JSON.parse(localStorage.getItem('analytics'));
  return validateAndMigrate(data);
} catch (e) {
  console.warn('Analytics data corrupted, resetting...');
  return getDefaultState();
}
```

---

## State Diagram

```
┌─────────────┐     keystroke      ┌─────────────┐
│   Idle      │ ─────────────────► │  Tracking   │
└─────────────┘                    └─────────────┘
      ▲                                   │
      │                                   │
      │                                   ▼
      │                            ┌─────────────┐
      │     session end            │  Analysis   │
      └────────────────────────────│  & Persist  │
                                   └─────────────┘
```
