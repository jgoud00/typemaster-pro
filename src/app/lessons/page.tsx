'use client';

import { motion } from 'framer-motion';
import { lessons, lessonCategories, getLessonsByCategory } from '@/lib/lessons';
import { useProgressStore } from '@/stores/progress-store';
import { cn } from '@/lib/utils';
import { LessonPath } from '@/components/lessons/lesson-journey';
import { SiteHeader } from '@/components/layout/SiteHeader';

export default function LessonsPage() {
    const { progress } = useProgressStore();
    const completedCount = progress.completedLessons.length;
    const totalLessons = lessons.length;
    const overallProgress = (completedCount / totalLessons) * 100;

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

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Global progress bar */}
            <div className="fixed top-16 left-0 right-0 z-30 h-[3px] bg-(--color-border-subtle)">
                <div
                    className="h-full bg-(--color-primary) transition-all duration-700"
                    style={{ width: `${overallProgress}%` }}
                />
            </div>

            <SiteHeader />

            <main className="container mx-auto px-4 py-8 space-y-6">
                {/* Progress Overview */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="relative rounded-2xl glass-glow p-6 overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                            <div>
                                <h2 className="font-display text-2xl font-bold mb-1 text-white tracking-tight">
                                    {completedCount} of {totalLessons} Lessons
                                    <span className="text-blue-400 ml-2">Complete</span>
                                </h2>
                                <p className="text-zinc-500 text-sm">
                                    Master typing from home row to advanced techniques
                                </p>
                            </div>
                            <div className="w-full md:w-64 shrink-0">
                                <div className="flex justify-between text-xs font-medium mb-2">
                                    <span className="text-zinc-500">Overall Progress</span>
                                    <span className="text-white font-bold">{Math.round(overallProgress)}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${overallProgress}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Lesson Categories - Vertical Roadmap */}
                <div className="space-y-12 relative pb-24">
                    {lessonCategories.map((category, categoryIndex) => {
                        const categoryLessons = getLessonsByCategory(category.id);
                        // Calculate global start index for this category's lessons to maintain left/right alternating correctly
                        const globalStartIndex = lessonCategories
                            .slice(0, categoryIndex)
                            .reduce((acc, cat) => acc + getLessonsByCategory(cat.id).length, 0);

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + categoryIndex * 0.1 }}
                                className="relative"
                            >
                                <LessonPath
                                    lessons={categoryLessons}
                                    completedLessonIds={progress.completedLessons}
                                    lessonScores={progress.lessonScores}
                                    categoryName={category.name}
                                    categoryIcon={category.icon}
                                    categoryLessonCount={categoryLessons.length}
                                    globalStartIndex={globalStartIndex}
                                    showHeader={true}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
