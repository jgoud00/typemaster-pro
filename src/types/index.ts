// Enhanced types for TypeMaster Pro

// ============= Finger & Keyboard =============
export type Finger =
  | 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index'
  | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky'
  | 'thumb';

export interface KeyData {
  key: string;
  shiftKey?: string;
  finger: Finger;
  row: number;
  width?: number;
}

// ============= Keystroke Analytics =============
export interface KeystrokeEvent {
  key: string;
  expected: string;
  timestamp: number;
  isCorrect: boolean;
  hesitationMs: number;     // Time since last keystroke
  finger: Finger;
  previousKey: string | null;  // For bigram tracking
}

export interface KeyStat {
  totalAttempts: number;
  errors: number;
  totalHesitation: number;
  averageSpeed: number;     // ms per keystroke
}

export interface BigramStat {
  bigram: string;           // e.g., "th", "he"
  totalAttempts: number;
  errors: number;
  averageTime: number;      // ms to complete bigram
}

export interface WeaknessProfile {
  keyStats: Record<string, KeyStat>;
  bigramStats: Record<string, BigramStat>;
  fingerAccuracy: Record<Finger, { correct: number; total: number }>;
  averageHesitation: number;
  problemKeys: string[];    // Keys with <85% accuracy
}

// ============= Gamification =============
export interface GameState {
  combo: number;
  maxCombo: number;
  multiplier: number;
  perfectStreak: number;      // Consecutive sessions with >95% accuracy
  dailyStreak: number;
  score: number;
  todayScore: number;
  lastPlayedDate: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quick-win' | 'milestone' | 'secret';
  condition: (state: GameState, progress: UserProgress) => boolean;
  unlockedAt?: number;
}

export const COMBO_THRESHOLDS = {
  LEVEL_1: { combo: 10, multiplier: 1.5 },
  LEVEL_2: { combo: 25, multiplier: 2 },
  LEVEL_3: { combo: 50, multiplier: 3 },
  LEVEL_4: { combo: 100, multiplier: 5 },
} as const;

// ============= Typing State =============
export interface TypingState {
  text: string;
  currentIndex: number;
  startTime: number | null;
  endTime: number | null;
  errorIndices: number[];
  keystrokes: KeystrokeEvent[];
  isComplete: boolean;
  isPaused: boolean;
}

// ============= Lessons =============
export type LessonCategory =
  // Home Row subcategories
  | 'home-row' | 'home-row-basics' | 'home-row-intermediate' | 'home-row-advanced'
  // Top Row subcategories
  | 'top-row' | 'top-row-basics' | 'top-row-intermediate' | 'top-row-advanced'
  // Bottom Row subcategories
  | 'bottom-row' | 'bottom-row-basics' | 'bottom-row-intermediate' | 'bottom-row-advanced'
  // Other categories
  | 'numbers' | 'symbols' | 'advanced' | 'full-keyboard';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  text: string;
  difficulty: Difficulty;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  keys: string[];
  exercises: Exercise[];
  targetWpm: number;
  targetAccuracy: number;
}

// ============= Session =============
export type SessionPhase = 'warmup' | 'focus' | 'challenge' | 'cooldown' | 'complete';

export interface SessionStructure {
  phase: SessionPhase;
  duration: number;  // seconds
  text: string;
  description: string;
}

// ============= Progress & Records =============
export type PracticeMode = 'lesson' | 'free' | 'speed-test' | 'custom';
export type SpeedTestDuration = 60 | 120 | 300;

export interface PerformanceRecord {
  id: string;
  lessonId?: string;
  mode: PracticeMode;
  wpm: number;
  accuracy: number;
  duration: number;
  totalChars: number;
  errors: number;
  maxCombo: number;
  score: number;
  timestamp: number;
}

export interface LessonScore {
  bestWpm: number;
  bestAccuracy: number;
  completedAt: number;
  attempts: number;
  stars: number;  // 0-3 based on performance
}

export interface UserProgress {
  completedLessons: string[];
  lessonScores: Record<string, LessonScore>;
  records: PerformanceRecord[];
  totalPracticeTime: number;
  totalKeystrokes: number;
  personalBests: {
    wpm: number;
    accuracy: number;
    combo: number;
  };
  unlockedAchievements: string[];
}

// ============= Theme =============
export type ThemeMode = 'light' | 'dark' | 'system';
