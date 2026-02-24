'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Keyboard, Trophy, TrendingUp, Flame, Clock, Target,
  ChevronRight, Star, Zap, Settings, Info, BookOpen, Play, X, Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { lessons, lessonCategories, getLessonsByCategory } from '@/lib/lessons';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useDiagnosticStore } from '@/stores/diagnostic-store';
import { cn } from '@/lib/utils';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';
import { DailyGoals } from '@/components/goals/DailyGoals';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { WeaknessHeatmap } from '@/components/WeaknessHeatmap';

export default function HomePage() {
  const { progress } = useProgressStore();
  const { game } = useGameStore();
  const { hasTakenDiagnostic } = useDiagnosticStore();
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
    <div className="min-h-screen">
      {/* Welcome Modal for first-time users */}
      <WelcomeModal />
      <SiteHeader />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Banner (Primary Focus) */}
        <HeroBanner
          completedCount={completedCount}
          totalLessons={totalLessons}
          overallProgress={overallProgress}
          nextLesson={nextLesson}
          nextLessonCategory={nextLessonCategory}
        />

        {/* Diagnostic Banner */}
        <AnimatePresence>
          {!hasTakenDiagnostic && showDiagnosticBanner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-linear-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20 relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/20 shrink-0">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">Get a Personalized Learning Path</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        Take a quick 60-second assessment to tailor lessons to your skill level.
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
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insight Section: Weakness Heatmap */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🧠</span> AI Knowledge Graph
            </h2>
            <span className="text-sm text-muted-foreground">Real-time Mastery Tracking</span>
          </div>
          <WeaknessHeatmap />
        </motion.section>

        {/* Practice Modes */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Practice Modes</h2>
            <Link href="/practice" className="text-sm text-primary hover:underline">
              View all modes
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PracticeModeCard
              title="Speed Test"
              description="Timed challenges"
              href="/practice?mode=speed-test"
              icon="⚡"
              color="from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
            />
            <PracticeModeCard
              title="Smart Practice"
              description="AI weakness targeting"
              href="/practice/smart"
              icon="🧠"
              color="from-purple-500/20 to-pink-500/20 border-purple-500/30"
            />
            <PracticeModeCard
              title="Infinite Flow"
              description="Zen mode typing"
              href="/practice/infinite"
              icon="∞"
              color="from-indigo-500/20 to-violet-500/20 border-indigo-500/30"
            />
            <PracticeModeCard
              title="Burst Mode"
              description="High-intensity intervals"
              href="/practice/speed-training"
              icon="🚀"
              color="from-red-500/20 to-orange-500/20 border-red-500/30"
            />
          </div>
        </section>

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

// Stat Card Component (with Glassmorphism Hover)
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card className="transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:bg-white/10 hover:backdrop-blur-2xl">
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
    </motion.div>
  );
}


// Practice Mode Card Component (Enhanced with Glassmorphism Hover)
function PracticeModeCard({ title, description, href, icon, color }: {
  title: string;
  description: string;
  href: string;
  icon: string;
  color?: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{
          scale: 1.03,
          y: -4,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <Card className={cn(
          'h-full cursor-pointer bg-linear-to-br backdrop-blur-xl',
          'border-2 transition-all duration-300',
          'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:backdrop-blur-2xl',
          'hover:bg-white/10',
          color || 'from-primary/10 to-primary/5 border-primary/30 hover:border-primary/50'
        )}>
          <CardContent className="p-6 relative overflow-hidden">
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
