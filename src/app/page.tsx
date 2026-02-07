'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Trophy, TrendingUp, Flame, Clock, Target, ChevronRight, ChevronDown, Star, Zap, Settings, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { lessons, lessonCategories, getLessonsByCategory } from '@/lib/lessons';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { cn } from '@/lib/utils';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';
import { DailyGoals } from '@/components/goals/DailyGoals';

export default function HomePage() {
  const { progress } = useProgressStore();
  const { game } = useGameStore();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['home-row']);

  const completedCount = progress.completedLessons.length;
  const totalLessons = lessons.length;
  const overallProgress = (completedCount / totalLessons) * 100;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50',
      green: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/50',
      orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50',
      purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50',
      pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-500/50',
      red: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/50',
    };
    return colors[color] || colors.blue;
  };

  const getProgressColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      red: 'bg-red-500',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      {/* Welcome Modal for first-time users */}
      <WelcomeModal />

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">TypeMaster Pro</h1>
          </div>

          <div className="flex items-center gap-4">
            {game.dailyStreak > 0 && (
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-5 h-5" />
                <span className="font-medium">{game.dailyStreak} day{game.dailyStreak > 1 ? 's' : ''}</span>
              </div>
            )}
            <Link href="/practice/smart">
              <Button variant="ghost" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Smart Practice
              </Button>
            </Link>
            <Link href="/challenges">
              <Button variant="ghost" size="sm">
                <Trophy className="w-4 h-4 mr-2" />
                Challenges
              </Button>
            </Link>
            <Link href="/achievements">
              <Button variant="ghost" size="sm">
                <Star className="w-4 h-4 mr-2" />
                Achievements
              </Button>
            </Link>
            <Link href="/stats">
              <Button variant="ghost" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Stats
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="icon">
                <Info className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome & Progress */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-linear-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {completedCount === 0
                      ? 'Welcome to TypeMaster Pro!'
                      : `${completedCount} of ${totalLessons} lessons completed`}
                  </h2>
                  <p className="text-muted-foreground">
                    {completedCount === 0
                      ? 'Start your typing journey with 73 comprehensive lessons.'
                      : 'Keep up the great work! Practice makes perfect.'}
                  </p>
                </div>
                <div className="w-full md:w-64">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span className="font-medium">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
            label="Best WPM"
            value={progress.personalBests.wpm || '-'}
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-green-400" />}
            label="Best Accuracy"
            value={progress.personalBests.accuracy ? `${progress.personalBests.accuracy}%` : '-'}
          />
          <StatCard
            icon={<Flame className="w-5 h-5 text-orange-400" />}
            label="Best Combo"
            value={progress.personalBests.combo || '-'}
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-purple-400" />}
            label="Practice Time"
            value={formatTime(progress.totalPracticeTime)}
          />
        </motion.section>

        {/* Daily Goals */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <DailyGoals />
        </motion.section>

        {/* Collapsible Lesson Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Lesson Curriculum</h3>

          {lessonCategories.map((category, categoryIndex) => {
            const categoryLessons = getLessonsByCategory(category.id);
            const completedInCategory = categoryLessons.filter(l =>
              progress.completedLessons.includes(l.id)
            ).length;
            const categoryProgress = (completedInCategory / categoryLessons.length) * 100;
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + categoryIndex * 0.05 }}
              >
                <Card className={cn(
                  'transition-all cursor-pointer bg-linear-to-r',
                  getCategoryColor(category.color),
                  isExpanded && 'ring-2 ring-primary/20'
                )}>
                  <CardHeader
                    className="pb-3"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {category.name}
                            <Badge variant="secondary" className="ml-2">
                              {completedInCategory}/{categoryLessons.length}
                            </Badge>
                            {completedInCategory === categoryLessons.length && categoryLessons.length > 0 && (
                              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                                ✓ Complete
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 hidden md:block">
                          <Progress
                            value={categoryProgress}
                            className="h-2"
                          />
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0 pb-4">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {categoryLessons.map((lesson, lessonIndex) => {
                              const isCompleted = progress.completedLessons.includes(lesson.id);
                              const score = progress.lessonScores[lesson.id];

                              return (
                                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: lessonIndex * 0.02 }}
                                  >
                                    <Card className={cn(
                                      'h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer',
                                      isCompleted && 'bg-green-500/10 border-green-500/40'
                                    )}>
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{lesson.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                              {lesson.description}
                                            </p>
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                          <div className="flex items-center gap-0.5">
                                            {[1, 2, 3].map((star) => (
                                              <Star
                                                key={star}
                                                className={cn(
                                                  'w-3 h-3',
                                                  score && star <= score.stars
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-muted-foreground/30'
                                                )}
                                              />
                                            ))}
                                          </div>
                                          {score ? (
                                            <span className="text-xs text-muted-foreground">
                                              {score.bestWpm} WPM
                                            </span>
                                          ) : (
                                            <span className="text-xs text-muted-foreground/50">
                                              Not started
                                            </span>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                </Link>
                              );
                            })}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Practice Modes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4">Practice Modes</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <PracticeModeCard
              title="Speed Test"
              description="Test your typing speed with timed challenges"
              href="/practice?mode=speed-test"
              icon="⚡"
            />
            <PracticeModeCard
              title="Free Practice"
              description="Practice with random texts at your own pace"
              href="/practice?mode=free"
              icon="🎯"
            />
            <PracticeModeCard
              title="Smart Practice"
              description="AI-powered adaptive exercises for your weaknesses"
              href="/practice/smart"
              icon="🧠"
            />
            <PracticeModeCard
              title="Custom Text"
              description="Paste your own text to practice"
              href="/practice?mode=custom"
              icon="📝"
            />
          </div>
        </motion.section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PracticeModeCard({ title, description, href, icon }: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
        <CardContent className="p-5">
          <div className="text-3xl mb-3">{icon}</div>
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
