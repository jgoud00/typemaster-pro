'use client';
import { PageHeader } from '@/components/ui/page-header';

import { motion } from 'framer-motion';
import { Trophy, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  achievements,
  Achievement,
  AchievementCategory,
  getAchievementsByCategory,
} from '@/lib/achievements';
import { useAchievementStore } from '@/stores/achievement-store';

const categories: { id: AchievementCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '🏆' },
  { id: 'quick-win', label: 'Quick Wins', icon: '⚡' },
  { id: 'speed', label: 'Speed', icon: '💨' },
  { id: 'accuracy', label: 'Accuracy', icon: '🎯' },
  { id: 'milestone', label: 'Milestones', icon: '📚' },
  { id: 'streak', label: 'Streaks', icon: '🔥' },
  { id: 'secret', label: 'Secret', icon: '🔮' },
];

export default function AchievementsPage() {
  const { isUnlocked, getProgress, state } = useAchievementStore();
  const progress = getProgress();

  const renderAchievements = (category: AchievementCategory | 'all') => {
    const filteredAchievements =
      category === 'all' ? achievements : getAchievementsByCategory(category);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isUnlocked={isUnlocked(achievement.id)}
            unlockedAt={state.unlockedAchievements.find((a) => a.id === achievement.id)?.unlockedAt}
            index={index}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-full ">
      <main className="collection-page container mx-auto px-4 py-8 space-y-8">
        <PageHeader
          title="The trophy room."
          description="Celebrate the consistency, accuracy, and effort behind your progress."
          badge={
            <span className="text-[10px] tracking-[.18em] text-muted-foreground">
              YOUR COLLECTION
            </span>
          }
        />
        {/* Progress Summary */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card border border-border shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground font-display">
                      {progress.unlocked} / {progress.total} Achievements
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {progress.points.toLocaleString()} total points earned
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-mono font-bold text-primary">
                      {Math.round((progress.unlocked / progress.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary transition-all duration-500"
                      style={{ width: `${(progress.unlocked / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/60 border border-border p-1.5 rounded-xl">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-lg text-xs font-semibold px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground"
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              {renderAchievements(category.id)}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: number;
  index: number;
}

function AchievementCard({ achievement, isUnlocked, unlockedAt, index }: AchievementCardProps) {
  const isSecret = achievement.hidden && !isUnlocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div
        className={cn(
          'h-full transition-all duration-200 relative overflow-hidden rounded-2xl p-4 bg-card border',
          isUnlocked
            ? 'border-primary/30 shadow-[0_0_20px_rgba(245,158,11,0.06)]'
            : 'border-border',
        )}
      >
        {!isUnlocked && (
          <div className="absolute top-3 right-3 z-10">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        )}
        {isSecret && <div className="absolute inset-0 z-20" title="Keep typing to unlock" />}
        <div className="flex items-start gap-3.5">
          {/* Icon */}
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all',
              isUnlocked
                ? 'bg-primary/10 border border-primary/25'
                : 'bg-muted/60 border border-border',
            )}
          >
            {isSecret ? (
              <Lock className="w-4 h-4 text-muted-foreground" />
            ) : (
              <span className="text-xl">{achievement.icon}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3
                className={cn(
                  'font-semibold text-sm leading-6',
                  isUnlocked ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {isSecret ? '???' : achievement.title}
              </h3>
              {isUnlocked && <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {isSecret ? 'This achievement is hidden' : achievement.description}
            </p>

            <div className="flex items-center justify-between mt-3">
              <span
                className={cn(
                  'text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md border',
                  isUnlocked
                    ? 'bg-primary/15 text-primary border-primary/25'
                    : 'bg-muted/60 text-muted-foreground border-border',
                )}
              >
                {achievement.points} pts
              </span>
              {isUnlocked && unlockedAt && (
                <span className="text-[10px] text-muted-foreground">
                  {new Date(unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
