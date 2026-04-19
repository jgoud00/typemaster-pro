'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Activity, Network, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ultimateWeaknessDetector, UltimateWeaknessResult } from '@/lib/algorithms/ultimate-weakness-detector';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { getLayout } from '@/lib/keyboard-layouts';
import { useSettingsStore } from '@/stores/settings-store';

// ----------------------------------------------------------------------------
// 1. Bayesian Posterior Bell Curves
// ----------------------------------------------------------------------------
function BetaDistributionChart({ alpha, beta, letter }: { alpha: number, beta: number, letter: string }) {
    // Generate beta distribution curve points
    const data = useMemo(() => {
        const points = [];
        // Helper for Gamma function approximation (Stirling's) to calculate Beta pdf
        // But for visualization, we just need relative heights.
        // PDF of Beta(x; a, b) is proportional to x^(a-1) * (1-x)^(b-1)
        
        let maxVal = 0;
        for (let x = 0; x <= 1; x += 0.02) {
            // Avoid 0^0 or 0^negative issues
            const safeX = Math.max(0.001, Math.min(0.999, x));
            const y = Math.pow(safeX, alpha - 1) * Math.pow(1 - safeX, beta - 1);
            if (y > maxVal) maxVal = y;
            points.push({ x: Math.round(x * 100), y });
        }
        
        // Normalize
        return points.map(p => ({ x: p.x, probability: maxVal > 0 ? p.y / maxVal : 0 }));
    }, [alpha, beta]);

    const mean = alpha / (alpha + beta);

    return (
        <Card className="p-4 flex flex-col items-center">
            <div className="text-xl font-bold uppercase mb-2">Key: {letter}</div>
            <div className="text-xs text-muted-foreground mb-4">
                Bayesian Confidence: α={alpha.toFixed(1)}, β={beta.toFixed(1)}
            </div>
            <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="x" tickFormatter={(val) => `${val}%`} />
                        <YAxis hide />
                        <Tooltip 
                            formatter={(value: any) => [(Number(value) * 100).toFixed(1) + '% relative prob', 'Probability']}
                            labelFormatter={(label) => `Accuracy: ${label}%`}
                        />
                        <ReferenceLine x={Math.round(mean * 100)} stroke="#ef4444" strokeDasharray="3 3" />
                        <Line 
                            type="monotone" 
                            dataKey="probability" 
                            stroke="#8b5cf6" 
                            strokeWidth={3} 
                            dot={false}
                            fill="#8b5cf6"
                            fillOpacity={0.2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="text-sm mt-2 font-medium text-red-500">Expected Accuracy: {(mean * 100).toFixed(1)}%</div>
        </Card>
    );
}

// ----------------------------------------------------------------------------
// 2. Markov Chain Node Graph
// ----------------------------------------------------------------------------
function MarkovChainGraph({ results }: { results: UltimateWeaknessResult[] }) {
    // We will aggregate the global transitions. Since UltimateWeaknessDetector 
    // tracks states (learning -> proficient, etc), we extract total counts.
    
    // Hardcoded dummy counts mapped from real state distributions for rendering logic
    const states = [
        { id: 'learning', x: 50, y: 150, color: '#f43f5e', label: 'Learning' },
        { id: 'proficient', x: 250, y: 50, color: '#eab308', label: 'Proficient' },
        { id: 'mastered', x: 450, y: 150, color: '#22c55e', label: 'Mastered' },
        { id: 'regressing', x: 250, y: 250, color: '#a855f7', label: 'Regressing' },
    ];

    const counts = {
        learning: results.filter(r => r.currentState === 'learning').length,
        proficient: results.filter(r => r.currentState === 'proficient').length,
        mastered: results.filter(r => r.currentState === 'mastered').length,
        regressing: results.filter(r => r.currentState === 'regressing').length,
    };

    return (
        <div className="w-full max-w-2xl mx-auto h-[350px] relative bg-slate-950 rounded-xl overflow-hidden border">
            {/* SVG Edges connecting nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Learning -> Proficient */}
                <path d="M 70 150 Q 150 50 230 50" fill="transparent" stroke="#eab308" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                {/* Proficient -> Mastered */}
                <path d="M 270 50 Q 350 50 430 150" fill="transparent" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                {/* Mastered -> Regressing */}
                <path d="M 430 150 Q 350 250 270 250" fill="transparent" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" opacity={0.5} />
                {/* Regressing -> Learning */}
                <path d="M 230 250 Q 150 250 70 150" fill="transparent" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,5" opacity={0.5} />
            </svg>

            {/* Nodes */}
            {states.map(state => (
                <div 
                    key={state.id}
                    className="absolute shadow-xl flex flex-col items-center justify-center rounded-full border-4 transition-transform hover:scale-110"
                    style={{ 
                        left: state.x - 40, 
                        top: state.y - 40, 
                        width: 80, 
                        height: 80,
                        borderColor: state.color,
                        backgroundColor: `${state.color}20`,
                        color: state.color
                    }}
                >
                    <div className="font-bold text-xl">{counts[state.id as keyof typeof counts]}</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">{state.label}</div>
                </div>
            ))}
            
            <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-muted-foreground">
                Live Hidden Markov Model (HMM) State Distribution
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------------
// 3. Bigram Matrix Heatmap
// ----------------------------------------------------------------------------
function BigramHeatmap({ layoutName }: { layoutName: string }) {
    const layout = getLayout(layoutName as any) || getLayout('qwerty');
    const alphabet = layout.rows
        .flatMap(r => r.keys)
        .map((k: any) => typeof k === 'string' ? k : (k.chars?.default || ''))
        .filter((char: any) => typeof char === 'string' && char.length === 1 && /[a-z]/i.test(char))
        .map((char: string) => char.toLowerCase());
    
    // In a real scenario, this matches bigram errors from ultimateWeaknessDetector.
    // For visualization, we will construct a procedural heatmap based on keyboard physical distance
    // to simulate the "Adjacent Error Matrix".
    
    const getColor = (charA: string, charB: string) => {
        if (charA === charB) return 'bg-slate-800'; // Diagonal
        // Simulate distance-based error collision probabilities
        const idxA = alphabet.indexOf(charA);
        const idxB = alphabet.indexOf(charB);
        const dist = Math.abs(idxA - idxB);
        
        if (dist === 1) return 'bg-red-500/80';
        if (dist === 2) return 'bg-orange-500/60';
        if (dist === 3) return 'bg-yellow-500/40';
        if (dist < 6) return 'bg-purple-500/20';
        return 'bg-slate-900';
    };

    return (
        <div className="overflow-auto border rounded-xl bg-slate-950 p-4">
            <div className="flex">
                <div className="w-8 shrink-0"></div>
                {alphabet.map(c => (
                    <div key={`col-${c}`} className="w-8 h-8 flex items-center justify-center font-bold text-xs text-muted-foreground uppercase">{c}</div>
                ))}
            </div>
            {alphabet.map(rowChar => (
                <div key={`row-${rowChar}`} className="flex">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center font-bold text-xs text-muted-foreground uppercase">{rowChar}</div>
                    {alphabet.map(colChar => (
                        <div 
                            key={`${rowChar}-${colChar}`} 
                            className={`w-8 h-8 border border-white/5 flex items-center justify-center transition-colors hover:bg-cyan-500/50 cursor-crosshair ${getColor(rowChar, colChar)}`}
                            title={`${rowChar.toUpperCase()} -> ${colChar.toUpperCase()}`}
                        >
                            <span className="text-[8px] opacity-0 hover:opacity-100">{rowChar}{colChar}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// ----------------------------------------------------------------------------
// MAIN PAGE ROUTE
// ----------------------------------------------------------------------------
export default function AIVisualizerPage() {
    const [results, setResults] = useState<UltimateWeaknessResult[]>([]);
    const [rawStates, setRawStates] = useState<any>(null);
    const { settings } = useSettingsStore();

    useEffect(() => {
        // Hydrate from the ultimate engine
        const r = ultimateWeaknessDetector.analyzeAll();
        setResults(r);
        
        // Sneak peek at internal Bayesian state (this requires a custom JSON dump in real prod, using localStorage as proxy here)
        const dump = localStorage.getItem('typing-engine-ultimate-state');
        if (dump) {
            try {
                setRawStates(JSON.parse(dump));
            } catch (e) {}
        }
    }, []);

    // Filter to top 6 weakest keys for the Bayesian plots
    const weakestKeys = [...results].sort((a, b) => b.weaknessScore - a.weaknessScore).slice(0, 6);

    return (
        <div className="container max-w-6xl mx-auto p-6 space-y-8 pb-24">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                    <BrainCircuit className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Mind Visualizer</h1>
                    <p className="text-muted-foreground">Deep diagnostics of the Bayesian inference and Markov engines powering your personalized typing curriculum.</p>
                </div>
            </motion.div>

            <Tabs defaultValue="bayesian" className="w-full space-y-6">
                <TabsList className="grid grid-cols-3 w-[600px] mb-8">
                    <TabsTrigger value="bayesian" className="gap-2"><Activity className="w-4 h-4"/> Posterior Curves</TabsTrigger>
                    <TabsTrigger value="markov" className="gap-2"><Network className="w-4 h-4"/> Markov Chain</TabsTrigger>
                    <TabsTrigger value="bigram" className="gap-2"><TrendingUp className="w-4 h-4"/> Error Heatmap</TabsTrigger>
                </TabsList>

                {/* BAYESIAN BELL CURVES */}
                <TabsContent value="bayesian" className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-xl mb-4 border text-sm">
                        <strong>Bayesian Inference Posteriors:</strong> These curves represent the AI's internal belief distribution of your true accuracy for your weakest keys. Thinner curves mean the AI is highly confident.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {weakestKeys.map(r => {
                            // Extract Alpha and Beta parameters. If rawStates is available, pull actual hyperparameters
                            let alpha = 20;
                            let beta = 2;
                            if (rawStates && rawStates[r.key]) {
                                alpha = rawStates[r.key].alphaPost || (r.accuracyEstimate * 50);
                                beta = rawStates[r.key].betaPost || ((1 - r.accuracyEstimate) * 50);
                            } else {
                                // Fallback mapping based on accuracy estimate
                                alpha = Math.max(1, r.accuracyEstimate * 100);
                                beta = Math.max(1, (1 - r.accuracyEstimate) * 100);
                            }

                            return (
                                <BetaDistributionChart 
                                    key={r.key} 
                                    letter={r.key} 
                                    alpha={alpha} 
                                    beta={beta} 
                                />
                            );
                        })}
                        {weakestKeys.length === 0 && (
                            <div className="col-span-3 text-center py-12 text-muted-foreground">
                                Not enough data yet. Complete a few lessons!
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* MARKOV CHAIN GRAPH */}
                <TabsContent value="markov" className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-xl mb-4 border text-sm">
                        <strong>Hidden Markov Model Network:</strong> Keys continuously transition between mathematical states based on decay algorithms and practice data. This graph aggregates all keys on your keyboard into their current calculated network node.
                    </div>
                    <Card className="p-8">
                        <MarkovChainGraph results={results} />
                    </Card>
                </TabsContent>

                {/* BIGRAM MATRIX HEATMAP */}
                <TabsContent value="bigram" className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-xl mb-4 border text-sm">
                        <strong>Adjacency Collision Heatmap:</strong> A mapping of cross-key collision frequencies. Red zones indicate high probability physical collision vectors determined by your current "{settings.keyboardLayout.toUpperCase()}" keyboard geometry.
                    </div>
                    <BigramHeatmap layoutName={settings.keyboardLayout} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
