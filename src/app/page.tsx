'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Keyboard, Trophy, TrendingUp, Flame, Clock, Target,
  ChevronRight, Star, Zap, Settings, Info, BookOpen, Play, X, Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { lessons, lessonCategories, getLessonsByCategory } from '@/lib/lessons';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useDiagnosticStore } from '@/stores/diagnostic-store';
import { cn } from '@/lib/utils';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';
import { DailyGoals } from '@/components/goals/DailyGoals';

export default function HomePage() {
  const { progress } = useProgressStore();
  const { game } = useGameStore();
  const { hasTakenDiagnostic, recommendations, userLevel } = useDiagnosticStore();
  const [showDiagnosticBanner, setShowDiagnosticBanner] = useState(true);

  const completedCount = progress.completedLessons.length;
  const totalLessons = lessons.length;
  const overallProgress = (completedCount / totalLessons) * 100;

  // Find the next uncompleted lesson
  const nextLesson = lessons.find(l => !progress.completedLessons.includes(l.id));
  const nextLessonCategory = nextLesson
    ? lessonCategories.find(c => getLessonsByCategory(c.id).some(l => l.id === nextLesson.id))
    : null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
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
            <Link href="/lessons">
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Lessons
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
        {/* Optional Diagnostic Invitation Banner - Non-blocking */}
        <AnimatePresence>
          {!hasTakenDiagnostic && showDiagnosticBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-linear-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/20 shrink-0">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">Get a Personalized Learning Path</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        Take a quick 60-second typing assessment and we&apos;ll tailor lessons to your skill level and weak spots.
                      </p>
                      <div className="flex items-center gap-3">
                        <Link href="/diagnostic">
                          <Button size="sm" className="gap-2">
                            <Zap className="w-4 h-4" />
                            Take Assessment
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDiagnosticBanner(false)}
                        >
                          Maybe Later
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowDiagnosticBanner(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section - Practice Modes (PRIMARY FOCUS) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Start Practicing</h2>
            <p className="text-muted-foreground">Choose a practice mode and improve your typing skills</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PracticeModeCard
              title="Speed Test"
              description="Test your typing speed with timed challenges"
              href="/practice?mode=speed-test"
              icon="⚡"
              color="from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:border-yellow-500/50"
            />
            <PracticeModeCard
              title="Free Practice"
              description="Practice with random texts at your own pace"
              href="/practice?mode=free"
              icon="🎯"
              color="from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:border-blue-500/50"
            />
            <PracticeModeCard
              title="Smart Practice"
              description="AI-powered adaptive exercises for your weaknesses"
              href="/practice/smart"
              icon="🧠"
              color="from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-500/50"
            />
            <PracticeModeCard
              title="Speed Training"
              description="Metronome and sprint modes to build speed"
              href="/practice/speed-training"
              icon="🚀"
              color="from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-500/50"
            />
          </div>
        </motion.section>

        {/* Continue Learning Card (Compact) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-linear-to-r from-primary/10 to-purple-500/10 border-primary/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Left: Progress Info */}
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Continue Learning</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{completedCount} of {totalLessons} lessons</span>
                      <span className="font-medium">{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>

                  {nextLesson ? (
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{nextLessonCategory?.icon || '📚'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{nextLesson.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{nextLesson.description}</p>
                      </div>
                      <Link href={`/lessons/${nextLesson.id}`}>
                        <Button size="sm" className="gap-1">
                          <Play className="w-3 h-3" />
                          Start
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎉</div>
                      <div className="flex-1">
                        <p className="font-medium">All lessons completed!</p>
                        <p className="text-sm text-muted-foreground">Keep practicing to improve your speed</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: View All CTA */}
                <Link href="/lessons" className="md:w-48 flex">
                  <div className="flex-1 flex items-center justify-center gap-2 p-6 bg-primary/5 hover:bg-primary/10 transition-colors border-t md:border-t-0 md:border-l border-primary/20">
                    <span className="font-medium">View All Lessons</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

        {/* Daily Goals (Compact) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DailyGoals />
        </motion.section>
      </main>
    </div>
  );
}

// Stat Card Component
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

// Practice Mode Card Component (Enhanced)
function PracticeModeCard({ title, description, href, icon, color }: {
  title: string;
  description: string;
  href: string;
  icon: string;
  color?: string;
}) {
  return (
    <Link href={href}>
      <Card className={cn(
        'h-full transition-all hover:shadow-lg cursor-pointer bg-linear-to-br',
        color || 'from-primary/10 to-primary/5 border-primary/30 hover:border-primary/50'
      )}>
        <CardContent className="p-6">
          <div className="text-4xl mb-4">{icon}</div>
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
