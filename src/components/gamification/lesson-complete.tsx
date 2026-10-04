'use client';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Trophy, Clock, Target, Zap, Star, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PerformanceRecord } from '@/types';

interface LessonCompleteProps {
  record: PerformanceRecord;
  stars: number;
  passed?: boolean;
  targetWpm?: number;
  targetAccuracy?: number;
  nextLabel?: string;
  finalExercise?: boolean;
  isPersonalBest: boolean;
  onRestart: () => void;
  onNext: () => void;
  onHome: () => void;
}

export function LessonComplete({
  record,
  stars,
  passed = true,
  targetWpm,
  targetAccuracy,
  nextLabel = 'Next lesson',
  finalExercise = false,
  isPersonalBest,
  onRestart,
  onNext,
  onHome,
}: Readonly<LessonCompleteProps>) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onHome();
      }}
    >
      <DialogContent className="max-w-md p-7 bg-card">
        <DialogDescription className="sr-only">
          Review your session and choose your next step.
        </DialogDescription>
        {/* Header */}
        <div className="text-center mb-6">
          <div>
            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          </div>
          <DialogTitle className="text-2xl font-semibold">{passed ? finalExercise ? 'Lesson complete!' : 'Exercise complete!' : 'Keep practicing'}</DialogTitle>
          {!passed && <p className="mt-3 text-sm text-muted-foreground">Reach {targetWpm} WPM and {targetAccuracy}% accuracy to continue.</p>}
          {isPersonalBest && (
            <p className="text-green-500 font-medium mt-1">🎉 New Personal Best!</p>
          )}
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((starNum) => (
            <div key={starNum}>
              <Star
                className={cn(
                  'w-12 h-12',
                  starNum <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground',
                )}
              />
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatItem
            icon={<Zap className="w-5 h-5 text-blue-400" />}
            label="Speed"
            value={`${record.wpm} WPM`}
          />
          <StatItem
            icon={<Target className="w-5 h-5 text-green-400" />}
            label="Accuracy"
            value={`${record.accuracy}%`}
          />
          <StatItem
            icon={<Clock className="w-5 h-5 text-purple-400" />}
            label="Time"
            value={formatTime(record.duration)}
          />
          <StatItem
            icon={<span className="text-orange-400">🔥</span>}
            label="Max Combo"
            value={`${record.maxCombo}`}
          />
        </div>

        {/* Score */}
        <div className="text-center mb-8">
          <div className="text-sm text-muted-foreground">Total Score</div>
          <div className="text-4xl font-bold text-primary">{record.score.toLocaleString()}</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button onClick={onNext} disabled={!passed} className="w-full" size="lg">
            {nextLabel}
          </Button>
          <div className="flex gap-3">
            <Button onClick={onRestart} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button onClick={onHome} variant="outline" className="flex-1">
              Home
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: Readonly<StatItemProps>) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      {icon}
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}
