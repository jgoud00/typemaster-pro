'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight, TrendingUp, Target, AlertTriangle,
    Lightbulb, Star, Zap, BookOpen, Trophy, Printer
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDiagnosticStore, Interpretation, Recommendation } from '@/stores/diagnostic-store';
import { RankBadge, Certificate } from '@/components/diagnostic/certificate';

export default function DiagnosticResultsPage() {
    const router = useRouter();
    const {
        hasTakenDiagnostic,
        diagnosticResult,
        userLevel,
        interpretations,
        recommendations
    } = useDiagnosticStore();

    // Redirect if no diagnostic taken
    useEffect(() => {
        if (!hasTakenDiagnostic || !diagnosticResult) {
            router.push('/diagnostic');
        }
    }, [hasTakenDiagnostic, diagnosticResult, router]);

    if (!diagnosticResult || !userLevel) {
        return null;
    }



    const getInterpretationIcon = (type: Interpretation['type']) => {
        switch (type) {
            case 'strength': return Star;
            case 'weakness': return AlertTriangle;
            case 'insight': return Lightbulb;
        }
    };

    const getInterpretationColor = (type: Interpretation['type']) => {
        switch (type) {
            case 'strength': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'weakness': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'insight': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    const getRecommendationIcon = (category: Recommendation['category']) => {
        switch (category) {
            case 'lesson': return BookOpen;
            case 'practice': return Target;
            case 'mode': return Zap;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Your Typing Profile</h1>
                    <p className="text-xl text-muted-foreground">
                        Based on your diagnostic test, here&apos;s what we learned
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <StatCard
                        label="Speed"
                        value={`${diagnosticResult.wpm}`}
                        unit="WPM"
                    />
                    <StatCard
                        label="Accuracy"
                        value={`${diagnosticResult.accuracy.toFixed(1)}`}
                        unit="%"
                    />
                    <StatCard
                        label="Characters"
                        value={`${diagnosticResult.totalKeystrokes}`}
                        unit=""
                    />
                    <StatCard
                        label="Corrections"
                        value={`${diagnosticResult.backspaceCount}`}
                        unit=""
                    />
                </motion.div>

                {/* Rank Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 flex justify-center"
                >
                    <RankBadge level={userLevel} className="w-full max-w-md bg-card/50 backdrop-blur-sm" />
                </motion.div>

                {/* Interpretations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <h3 className="text-xl font-semibold mb-4">What We Found</h3>
                    <div className="space-y-3">
                        {interpretations.map((interp, index) => {
                            const Icon = getInterpretationIcon(interp.type);
                            const colors = getInterpretationColor(interp.type);

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <Card className={`border ${colors.split(' ')[2]}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${colors.split(' ').slice(0, 2).join(' ')}`}>
                                                    <Icon className={`w-5 h-5 ${colors.split(' ')[0]}`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{interp.title}</h4>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {interp.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                >
                    <h3 className="text-xl font-semibold mb-4">Your Personalized Path</h3>
                    <div className="space-y-3">
                        {recommendations.map((rec, index) => {
                            const Icon = getRecommendationIcon(rec.category);

                            return (
                                <motion.div
                                    key={rec.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                >
                                    <Link href={rec.path}>
                                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-l-4 border-l-primary">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <Icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            {rec.priority === 1 && (
                                                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                                                    Recommended
                                                                </span>
                                                            )}
                                                            <h4 className="font-semibold">{rec.title}</h4>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {rec.description}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Certificate Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-12 text-center"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">Your Certificate</h3>
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                            <Printer className="w-4 h-4" />
                            Print Certificate
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-xl border bg-white shadow-xl transform scale-[0.8] md:scale-100 origin-top">
                        <Certificate
                            wpm={diagnosticResult.wpm}
                            accuracy={diagnosticResult.accuracy}
                            level={userLevel}
                            date={new Date()}
                        />
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-center pt-4"
                >
                    <Link href={recommendations[0]?.path || '/'}>
                        <Button size="lg" className="gap-2 text-lg px-8 py-6">
                            Start Your Journey
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>

                    <p className="text-sm text-muted-foreground mt-4">
                        <Link href="/" className="underline hover:text-foreground">
                            or skip to dashboard
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
    return (
        <Card>
            <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold mt-1">
                    {value}
                    <span className="text-lg text-muted-foreground ml-1">{unit}</span>
                </p>
            </CardContent>
        </Card>
    );
}
