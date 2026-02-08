'use client';

import { useEffect, useState } from 'react';
import { ultimateWeaknessDetector, type UltimateWeaknessResult } from '@/lib/algorithms/ultimate-weakness-detector';
import { transferLearningAnalyzer, type TransferInsight } from '@/lib/algorithms/transfer-learning';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    BarChart,
    Bar,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

export function UltimateWeaknessDashboard() {
    const [analysis, setAnalysis] = useState<UltimateWeaknessResult[]>([]);
    const [transferInsights, setTransferInsights] = useState<TransferInsight[]>([]);

    useEffect(() => {
        const results = ultimateWeaknessDetector.analyzeAll();
        setAnalysis(results);

        // Get transfer insights for top 3 weak keys
        if (results.length > 0) {
            const insights = results.slice(0, 3).map(r =>
                transferLearningAnalyzer.getTransferInsights(r.key)
            );
            setTransferInsights(insights);
        }
    }, []);

    const topWeaknesses = analysis.slice(0, 5);

    // Calculate state distribution
    const stateDistribution = {
        learning: analysis.filter(a => a.currentState === 'learning').length,
        proficient: analysis.filter(a => a.currentState === 'proficient').length,
        mastered: analysis.filter(a => a.currentState === 'mastered').length,
        regressing: analysis.filter(a => a.currentState === 'regressing').length,
    };

    // Prepare chart data
    const ensembleChartData = topWeaknesses.map(r => ({
        key: r.key.toUpperCase(),
        Bayesian: Math.round(r.ensemblePredictions.bayesian * 100),
        HMM: Math.round(r.ensemblePredictions.hmm * 100),
        Temporal: Math.round(r.ensemblePredictions.temporal * 100),
        Ensemble: Math.round(r.ensemblePredictions.ensemble * 100),
    }));

    const radarData = topWeaknesses.map(r => ({
        key: r.key.toUpperCase(),
        accuracy: r.accuracyEstimate * 100,
        speed: Math.max(0, (1 - r.speedEstimate / 500) * 100),
        confidence: r.confidence * 100,
        priority: r.practicePriority,
        learningRate: Math.min(100, r.learningRate * 500),
    }));

    if (analysis.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">🧠</div>
                <h2 className="text-2xl font-bold mb-2">No Analysis Data Yet</h2>
                <p className="text-muted-foreground max-w-md">
                    Start typing to build up data for the ultimate weakness detection system.
                    The algorithms need at least 5 attempts per key to begin analysis.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">🧠 Ultimate Weakness Analysis</h1>
                <p className="text-muted-foreground">
                    Advanced Bayesian + HMM + Ensemble Predictions • Research-Grade ML
                </p>
            </div>

            {/* Top Weaknesses */}
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">🎯 Priority Practice Queue</h2>

                <div className="space-y-4">
                    {topWeaknesses.map((result, index) => (
                        <WeaknessCard key={result.key} result={result} rank={index + 1} />
                    ))}
                </div>

                {topWeaknesses.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                        Not enough data yet. Keep practicing!
                    </p>
                )}
            </Card>

            {/* Ensemble Predictions Comparison */}
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">📊 Model Predictions Comparison</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Comparing predictions from Bayesian, Hidden Markov Model, Temporal, and Ensemble methods
                </p>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ensembleChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="key" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Bayesian" fill="#3B82F6" />
                        <Bar dataKey="HMM" fill="#10B981" />
                        <Bar dataKey="Temporal" fill="#F59E0B" />
                        <Bar dataKey="Ensemble" fill="#8B5CF6" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* HMM State Distribution */}
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">🔄 Learning States (HMM)</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Hidden Markov Model state classification for all tracked keys
                </p>

                <div className="grid grid-cols-4 gap-4">
                    {(['learning', 'proficient', 'mastered', 'regressing'] as const).map(state => {
                        const count = stateDistribution[state];
                        const percentage = analysis.length > 0 ? (count / analysis.length) * 100 : 0;
                        const colors = {
                            learning: 'bg-blue-500',
                            proficient: 'bg-green-500',
                            mastered: 'bg-purple-500',
                            regressing: 'bg-red-500',
                        };
                        const icons = {
                            learning: '📚',
                            proficient: '✅',
                            mastered: '🏆',
                            regressing: '⚠️',
                        };

                        return (
                            <div key={state} className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-3xl mb-1">{icons[state]}</div>
                                <div className="text-3xl font-bold">{count}</div>
                                <div className="text-sm text-muted-foreground capitalize">{state}</div>
                                <div className="mt-2">
                                    <Progress value={percentage} className={`h-2 ${colors[state]}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Radar Chart - Multi-dimensional Analysis */}
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">🎯 Multi-Dimensional Weakness Profile</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Visualizing accuracy, speed, confidence, priority, and learning rate
                </p>

                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="key" />
                        <Radar
                            name="Priority"
                            dataKey="priority"
                            stroke="#8B5CF6"
                            fill="#8B5CF6"
                            fillOpacity={0.6}
                        />
                        <Radar
                            name="Accuracy"
                            dataKey="accuracy"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.3}
                        />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </Card>

            {/* Transfer Learning Insights */}
            {transferInsights.length > 0 && (
                <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">🔗 Transfer Learning Insights</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Improving one key may boost performance on related keys
                    </p>

                    <div className="space-y-4">
                        {transferInsights.map((insight, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="text-3xl font-bold font-mono bg-muted px-3 py-1 rounded">
                                        {insight.sourceKey.toUpperCase()}
                                    </div>
                                    <div className="text-muted-foreground">→</div>
                                    <div className="flex flex-wrap gap-2">
                                        {insight.relatedKeys.slice(0, 5).map(related => (
                                            <Badge
                                                key={related.key}
                                                variant="outline"
                                                className={
                                                    related.relationship === 'same_finger' ? 'border-purple-500 text-purple-500' :
                                                        related.relationship === 'mirror' ? 'border-blue-500 text-blue-500' :
                                                            related.relationship === 'same_row' ? 'border-green-500 text-green-500' :
                                                                'border-gray-500'
                                                }
                                            >
                                                {related.key.toUpperCase()}
                                                <span className="ml-1 text-xs opacity-70">
                                                    ({related.relationship.replace('_', ' ')})
                                                </span>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    {insight.explanation}
                                </div>

                                {insight.relatedKeys.length > 0 && (
                                    <div className="mt-3 flex items-center gap-4">
                                        <div>
                                            <span className="text-xs text-muted-foreground">Avg Transfer:</span>
                                            <span className={`ml-2 font-semibold ${(insight.relatedKeys[0]?.transferScore || 0) > 60 ? 'text-green-500' :
                                                (insight.relatedKeys[0]?.transferScore || 0) > 30 ? 'text-yellow-500' :
                                                    'text-muted-foreground'
                                                }`}>
                                                {insight.relatedKeys[0]?.transferScore || 0}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={insight.relatedKeys[0]?.transferScore || 0}
                                            className="flex-1 h-2"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
                        <div className="font-semibold mb-1">💡 What is Transfer Learning?</div>
                        <div className="text-muted-foreground">
                            Keys typed with the same finger share muscle memory. Improving one often
                            helps the others. Mirror keys (e.g., F-J) reinforce cross-hand coordination.
                        </div>
                    </div>
                </Card>
            )}

            {/* Algorithm Legend */}
            <Card className="p-6 bg-linear-to-r from-purple-500/10 to-blue-500/10">
                <h2 className="text-xl font-semibold mb-4">🔬 Algorithm Components</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-3 bg-background/50 rounded-lg">
                        <div className="font-semibold text-blue-500">Bayesian</div>
                        <div className="text-muted-foreground">Beta-Binomial conjugate priors with 95% credible intervals</div>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg">
                        <div className="font-semibold text-green-500">HMM</div>
                        <div className="text-muted-foreground">Hidden Markov Model for learning state transitions</div>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg">
                        <div className="font-semibold text-amber-500">Thompson Sampling</div>
                        <div className="text-muted-foreground">Multi-armed bandit for exploration-exploitation</div>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg">
                        <div className="font-semibold text-purple-500">Ensemble</div>
                        <div className="text-muted-foreground">Weighted combination of all prediction models</div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

interface WeaknessCardProps {
    result: UltimateWeaknessResult;
    rank: number;
}

function WeaknessCard({ result, rank }: WeaknessCardProps) {
    const stateColors: Record<string, string> = {
        learning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        proficient: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        mastered: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        regressing: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
        <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-muted-foreground">
                        #{rank}
                    </div>
                    <div>
                        <div className="text-3xl font-bold font-mono">{result.key.toUpperCase()}</div>
                        <Badge className={stateColors[result.currentState]}>
                            {result.currentState.charAt(0).toUpperCase() + result.currentState.slice(1)}
                        </Badge>
                    </div>
                </div>

                <div className="text-right">
                    <div className={`text-2xl font-bold ${result.weaknessScore > 60 ? 'text-red-500' : result.weaknessScore > 30 ? 'text-amber-500' : 'text-green-500'}`}>
                        {result.weaknessScore.toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Weakness Score</div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                    <div className="text-lg font-semibold">
                        {(result.accuracyEstimate * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                        CI: [{(result.accuracyCI[0] * 100).toFixed(0)}%,{' '}
                        {(result.accuracyCI[1] * 100).toFixed(0)}%]
                    </div>
                </div>

                <div>
                    <div className="text-xs text-muted-foreground">Speed</div>
                    <div className="text-lg font-semibold">
                        {result.speedEstimate.toFixed(0)}ms
                    </div>
                    <div className="text-xs text-muted-foreground">
                        CI: [{result.speedCI[0].toFixed(0)}, {result.speedCI[1].toFixed(0)}]
                    </div>
                </div>

                <div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="text-lg font-semibold">
                        {(result.confidence * 100).toFixed(0)}%
                    </div>
                </div>
            </div>

            {/* Priority Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span>Practice Priority</span>
                    <span className="font-semibold">{result.practicePriority.toFixed(0)}/100</span>
                </div>
                <Progress
                    value={result.practicePriority}
                    className="h-2"
                />
            </div>

            {/* Ensemble Predictions */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-950 rounded p-2">
                    <div className="text-xs text-blue-600 dark:text-blue-400">Bayesian</div>
                    <div className="font-semibold">{(result.ensemblePredictions.bayesian * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded p-2">
                    <div className="text-xs text-green-600 dark:text-green-400">HMM</div>
                    <div className="font-semibold">{(result.ensemblePredictions.hmm * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 rounded p-2">
                    <div className="text-xs text-amber-600 dark:text-amber-400">Temporal</div>
                    <div className="font-semibold">{(result.ensemblePredictions.temporal * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950 rounded p-2">
                    <div className="text-xs text-purple-600 dark:text-purple-400">Ensemble</div>
                    <div className="font-semibold">{(result.ensemblePredictions.ensemble * 100).toFixed(0)}%</div>
                </div>
            </div>

            {/* Recommendations */}
            {result.recommendedInterventions.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950 rounded p-3 mb-3">
                    <div className="text-xs font-semibold mb-2">💡 Top Recommendation:</div>
                    <div className="text-sm">
                        {result.recommendedInterventions[0].intervention}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Expected improvement: {result.recommendedInterventions[0].expectedImprovement}%
                        (confidence: {(result.recommendedInterventions[0].confidence * 100).toFixed(0)}%)
                    </div>
                </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                    Next: {result.optimalNextPractice.toLocaleDateString()}
                </Badge>
                <Badge variant="outline">
                    {result.estimatedSessionsToMastery} sessions to mastery
                </Badge>
                <Badge variant="outline">
                    Learning: {(result.learningRate * 100).toFixed(1)}%/session
                </Badge>
                <Badge variant="outline">
                    Best time: {result.bestPracticeTime}:00
                </Badge>
                {result.expectedPlateauDate && (
                    <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950">
                        Plateau: {result.expectedPlateauDate.toLocaleDateString()}
                    </Badge>
                )}
            </div>
        </div>
    );
}
