import { Finger, KeyStat, BigramStat, TrigramStat } from './index';

export interface BayesianState {
  alpha: number;
  beta: number;
  mean: number;
  accuracy: number;
  lowerBound: number;
  upperBound: number;
}

export type HMMState = 'learning' | 'proficient' | 'mastered' | 'regressing';

export interface HMMKeyState {
  currentState: HMMState;
  transitionHistory: HMMState[];
  totalAttempts: number;
}

export interface FatiguePrediction {
  fatigueLevel: number; // 0 to 1
  estimatedTimeUntilFatigue: number; // minutes
}

export interface SyncMetadata {
  lastSync: number;
  deviceId: string;
}

export type VectorClock = Record<string, number>;

export interface AnalyticsPayload {
  keyStats: Record<string, KeyStat>;
  fingerStats: Record<Finger, { correct: number; total: number }>;
  bigramStats: Record<string, BigramStat>;
  trigramStats: Record<string, TrigramStat>;
  bayesianStates: Record<string, BayesianState>;
  hmmStates: Record<string, HMMState>;
  fatigue: FatiguePrediction;
  syncMeta: SyncMetadata;
}

export interface SyncRecord {
  data: AnalyticsPayload;
  vector_clock: VectorClock;
  schema_version: number;
  updated_at: string;
}
