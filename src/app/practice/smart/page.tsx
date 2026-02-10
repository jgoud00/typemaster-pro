'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Brain,
    Target,
    TrendingUp,
    Lightbulb,
    RefreshCw,
    Play,
    Zap,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { useConfetti } from '@/hooks/use-confetti';
import { useSound } from '@/hooks/use-sound';
import { cn } from '@/lib/utils';
import { ngramAnalyzer } from '@/lib/ngram-analyzer';
import { analyzeWeaknesses } from '@/lib/weakness-predictor';
import { generateDailyBriefing, Insight } from '@/lib/coach-insights';
import {
    generateAdaptiveExercise,
    calculateDifficultyLevel,
    DifficultyLevel
} from '@/lib/adaptive-engine';
import { PerformanceRecord } from '@/types';
import toast from 'react-hot-toast';

export default function SmartPracticePage() {
    const router = useRouter();
    const { progress } = useProgressStore();
    const { game } = useGameStore();
    const { keyStats, getProblematicKeys } = useAnalyticsStore();
    const { fireLessonComplete } = useConfetti();
    const { play } = useSound();

    const [isTyping, setIsTyping] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<{ text: string; focusKeys: string[]; reason: string } | null>(null);
    const [exercisesCompleted, setExercisesCompleted] = useState(0);
    const [sessionResults, setSessionResults] = useState<PerformanceRecord[]>([]);
    const completionHandledRef = useRef(false);

    // Calculate per-key errors from analytics store
    const perKeyErrors = new Map<string, { attempts: number; errors: number }>();
    Object.entries(keyStats).forEach(([key, stat]) => {
        perKeyErrors.set(key, {
            attempts: stat.totalAttempts,
            errors: stat.errors
        });
    });

    const avgWpm = progress.personalBests.wpm || 30;
    const avgAccuracy = progress.personalBests.accuracy || 85;

    // Generate weakness report
    const weaknessReport = analyzeWeaknesses(perKeyErrors);
    const ngramReport = ngramAnalyzer.getReport(3);

    // Calculate difficulty level
    const difficultyLevel = calculateDifficultyLevel(avgWpm, avgAccuracy);

    // Generate daily briefing
    const briefing = generateDailyBriefing(weaknessReport, ngramReport, {
        recentWpm: avgWpm,
        recentAccuracy: avgAccuracy,
        totalPracticeTime: Math.floor(progress.totalPracticeTime / 60),
        streakDays: game.dailyStreak,
        improvementTrend: 'stable',
    });

    // Generate new exercise
    const generateExercise = useCallback(() => {
        const exercise = generateAdaptiveExercise(
            weaknessReport,
            difficultyLevel,
            [] // masteredKeys would come from deeper analysis
        );
        setCurrentExercise(exercise);
        setIsTyping(true);
    }, [weaknessReport, difficultyLevel]);

    // Handle exercise completion
    const handleComplete = useCallback((record: PerformanceRecord) => {
        if (completionHandledRef.current) return;
        completionHandledRef.current = true;

        setIsTyping(false);
        setExercisesCompleted(prev => prev + 1);
        setSessionResults(prev => [...prev, record]);

        // Track ngrams
        ngramAnalyzer.save();

        play('complete');
        toast.dismiss();

        if (record.accuracy >= 95) {
            fireLessonComplete();
            toast.success(`Excellent! ${record.wpm} WPM at ${record.accuracy}% accuracy`, {
                id: 'smart-practice-complete',
            });
        } else {
            toast(`${record.wpm} WPM at ${record.accuracy}% accuracy`, {
                icon: '📊',
                id: 'smart-practice-result',
            });
        }
    }, [play, fireLessonComplete]);

    const {
        currentIndex,
        errorIndices,
        activeKey,
        wpm,
        accuracy,
        combo,
        multiplier,
        elapsedTime,
        reset,
    } = useTypingEngine({
        text: currentExercise?.text || '',
        mode: 'free',
        onComplete: handleComplete,
    });

    // Start new exercise
    const startNewExercise = () => {
        reset();
        completionHandledRef.current = false;
        toast.dismiss();
        ngramAnalyzer.resetSequence();
        generateExercise();
    };

    // Calculate session stats
    const sessionAvgWpm = sessionResults.length > 0
        ? Math.round(sessionResults.reduce((sum, r) => sum + r.wpm, 0) / sessionResults.length)
        : 0;
    const sessionAvgAcc = sessionResults.length > 0
        ? (sessionResults.reduce((sum, r) => sum + r.accuracy, 0) / sessionResults.length).toFixed(1)
        : '0';

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <Brain className="w-6 h-6 text-primary" />
                            <h1 className="text-xl font-bold">Smart Practice</h1>
                        </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                        <Zap className="w-3 h-3" />
                        Level {difficultyLevel.level}: {difficultyLevel.name}
                    </Badge>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-6">
                {!isTyping ? (
                    <>
                        {/* Coach Briefing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="bg-linear-to-r from-primary/10 to-purple-500/10 border-primary/20">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <Brain className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold mb-2">{briefing.greeting}</h2>

                                            {/* Today's Focus */}
                                            <div className="mb-4">
                                                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                                    Today's Focus
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {briefing.todaysFocus.map((focus, i) => (
                                                        <Badge key={i} variant="secondary">{focus}</Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quote */}
                                            <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary/50 pl-3">
                                                "{briefing.motivationalQuote}"
                                            </blockquote>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Insights */}
                        {briefing.insights.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                                    Coach Insights
                                </h3>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {briefing.insights.map((insight, i) => (
                                        <InsightCard key={insight.id} insight={insight} index={i} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Weakness Summary */}
                        {weaknessReport.weakKeys.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="w-5 h-5" />
                                            Areas to Improve
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Weak Keys</h4>
                                            <div className="flex gap-2 flex-wrap">
                                                {weaknessReport.weakKeys.map(key => (
                                                    <Badge key={key} variant="destructive" className="text-lg px-3 py-1">
                                                        {key.toUpperCase()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {weaknessReport.weakBigrams.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium mb-2">Problem Transitions</h4>
                                                <div className="flex gap-2 flex-wrap">
                                                    {weaknessReport.weakBigrams.slice(0, 6).map(bigram => (
                                                        <Badge key={bigram} variant="outline" className="font-mono">
                                                            {bigram}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {weaknessReport.patterns.sameFingerBigrams.length > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <AlertCircle className="w-4 h-4" />
                                                Same-finger transitions detected: {weaknessReport.patterns.sameFingerBigrams.slice(0, 3).join(', ')}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Session Stats */}
                        {sessionResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" />
                                            Session Progress
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-3xl font-bold text-primary">{exercisesCompleted}</div>
                                                <div className="text-sm text-muted-foreground">Exercises</div>
                                            </div>
                                            <div>
                                                <div className="text-3xl font-bold">{sessionAvgWpm}</div>
                                                <div className="text-sm text-muted-foreground">Avg WPM</div>
                                            </div>
                                            <div>
                                                <div className="text-3xl font-bold">{sessionAvgAcc}%</div>
                                                <div className="text-sm text-muted-foreground">Avg Accuracy</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Start Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center pt-4"
                        >
                            <Button size="lg" onClick={startNewExercise} className="gap-2">
                                <Play className="w-5 h-5" />
                                {exercisesCompleted > 0 ? 'Next Exercise' : 'Start Smart Practice'}
                            </Button>
                        </motion.div>
                    </>
                ) : (
                    <>
                        {/* Exercise Info */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Badge variant="secondary" className="mb-1">
                                            Exercise {exercisesCompleted + 1}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground">
                                            {currentExercise?.reason}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setIsTyping(false)}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Skip
                                    </Button>
                                </div>
                                {currentExercise?.focusKeys.length ? (
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-muted-foreground">Focus:</span>
                                        {currentExercise.focusKeys.slice(0, 5).map(k => (
                                            <Badge key={k} variant="outline" className="text-xs">
                                                {k.toUpperCase()}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>

                        {/* Typing UI */}
                        <TypingStats
                            wpm={wpm}
                            accuracy={accuracy}
                            combo={combo}
                            multiplier={multiplier}
                            elapsedTime={elapsedTime}
                        />

                        <TypingArea
                            text={currentExercise?.text || ''}
                            currentIndex={currentIndex}
                            errorIndices={errorIndices}
                        />

                        <VirtualKeyboard activeKey={activeKey} />
                    </>
                )}
            </main>
        </div>
    );
}

// Insight Card Component
function InsightCard({ insight, index }: { insight: Insight; index: number }) {
    const typeColors = {
        tip: 'border-blue-500/30 bg-blue-500/5',
        encouragement: 'border-green-500/30 bg-green-500/5',
        warning: 'border-yellow-500/30 bg-yellow-500/5',
        milestone: 'border-purple-500/30 bg-purple-500/5',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className={cn('h-full', typeColors[insight.type])}>
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">{insight.icon}</span>
                        <div>
                            <h4 className="font-semibold">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground">{insight.message}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
