'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { lessons, lessonCategories, getLessonsByCategory } from '@/lib/lessons';
import { useProgressStore } from '@/stores/progress-store';
import { cn } from '@/lib/utils';
import { LessonPath } from '@/components/lessons/lesson-journey';

export default function LessonsPage() {
    const { progress } = useProgressStore();
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
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <h1 className="text-xl font-bold">Lesson Curriculum</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-6">
                {/* Progress Overview */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="bg-linear-to-r from-primary/10 to-purple-500/10 border-primary/20">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">
                                        {completedCount} of {totalLessons} Lessons Complete
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Master typing from home row to advanced techniques
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

                {/* Lesson Categories */}
                <div className="space-y-4">
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
                                                    <Progress value={categoryProgress} className="h-2" />
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
                                                    <LessonPath
                                                        lessons={categoryLessons}
                                                        completedLessonIds={progress.completedLessons}
                                                        lessonScores={progress.lessonScores}
                                                    />
                                                </CardContent>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
