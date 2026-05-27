'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Target, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { cn } from '@/lib/utils';
import { HMMState } from '@/types/analytics';

export function AICoach({ hasData = true }: { hasData?: boolean }) {
    const { mlResults, getProblematicKeys, getAverageHesitation } = useAnalyticsStore();
    const { skillStates, errorPrediction, bayesianEstimates } = mlResults;
    const problemKeys = getProblematicKeys(85);
    const avgHesitation = getAverageHesitation();

    // Group keys by their HMM state
    const groupedStates = useMemo(() => {
        const groups: Record<HMMState, string[]> = {
            learning: [],
            proficient: [],
            mastered: [],
            regressing: [],
        };
        
        for (const [key, state] of Object.entries(skillStates)) {
            if (groups[state]) {
                groups[state].push(key);
            }
        }
        return groups;
    }, [skillStates]);

    // Generate AI assessment text
    const aiAssessment = useMemo(() => {
        let text = "Analyzing keystroke telemetry...\n\n";
        
        if (!hasData) {
            return text + "📊 GATHERING DATA: Complete your first practice session to allow the ML engine to build a complete profile of your neuro-motor pathways.";
        }

        if (errorPrediction > 0.7) {
            text += "⚠️ FATIGUE DETECTED: Your error prediction score is elevated. Muscle memory degradation likely in progress. Recommend taking a 5-minute break.\n\n";
        }

        if (groupedStates.regressing.length > 0) {
            text += `📉 REGRESSION ALERT: You are losing accuracy on keys: [ ${groupedStates.regressing.join(', ')} ]. Focus on Free Practice to rebuild neuro-motor pathways.\n`;
        }

        if (problemKeys.length > 0) {
            text += `🎯 WEAKNESS TARGET: Bayesian models indicate high variance on keys: [ ${problemKeys.join(', ')} ]. Use targeted Free Practice to minimize these errors.\n`;
        } else if (groupedStates.mastered.length > 0) {
            text += `🏆 PERFORMANCE NOMINAL: High precision maintained. Keys [ ${groupedStates.mastered.slice(0, 5).join(', ')}${groupedStates.mastered.length > 5 ? '...' : ''} ] show master-level automaticity.\n`;
        } else {
            text += `📊 GATHERING DATA: Keep typing to allow the ML engine to build a complete profile of your neuro-motor pathways.\n`;
        }

        if (avgHesitation > 300) {
            text += `\n⏱️ HESITATION: High cognitive load detected (Avg: ${Math.round(avgHesitation)}ms delay). Focus on looking ahead rather than at the current key.`;
        }

        return text;
    }, [errorPrediction, groupedStates, problemKeys, avgHesitation, hasData]);

    return (
        <div className="relative rounded-2xl glass-glow p-6 space-y-6 overflow-hidden mb-8 border border-cyan-500/20">
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 p-32 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 relative z-10">
                <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                    <Brain className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="font-display text-xl font-bold text-white tracking-wide">Nexus AI Coach</h2>
                    <p className="text-xs text-cyan-400/70 uppercase tracking-widest font-mono">Live Telemetry Analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Fatigue Monitor */}
                <div className="p-5 rounded-xl bg-black/40 border border-white/5 space-y-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold uppercase tracking-wider">
                            <Activity className="w-4 h-4" />
                            Neural Fatigue
                        </div>
                        <span className={cn(
                            "font-mono font-bold",
                            !hasData ? "text-zinc-500" : errorPrediction > 0.7 ? "text-red-400" : errorPrediction > 0.4 ? "text-yellow-400" : "text-emerald-400"
                        )}>
                            {!hasData ? '-.-%' : `${(errorPrediction * 100).toFixed(1)}%`}
                        </span>
                    </div>
                    
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div 
                            className={cn(
                                "h-full rounded-full",
                                errorPrediction > 0.7 ? "bg-red-500" : errorPrediction > 0.4 ? "bg-yellow-500" : "bg-emerald-500"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${errorPrediction * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                    <p className="text-xs text-zinc-500">
                        Higher percentage indicates increased probability of errors due to cognitive fatigue.
                    </p>
                </div>

                {/* State Classification */}
                <div className="p-5 rounded-xl bg-black/40 border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-4">
                        <Target className="w-4 h-4" />
                        Skill Matrix
                    </div>
                    
                    <div className="space-y-3">
                        <StateRow state="Mastered" keys={groupedStates.mastered} icon={<ShieldCheck className="w-3 h-3 text-emerald-400" />} color="bg-emerald-500/20 text-emerald-400 border-emerald-500/30" />
                        <StateRow state="Proficient" keys={groupedStates.proficient} icon={<Zap className="w-3 h-3 text-blue-400" />} color="bg-blue-500/20 text-blue-400 border-blue-500/30" />
                        <StateRow state="Learning" keys={groupedStates.learning} icon={<Brain className="w-3 h-3 text-yellow-400" />} color="bg-yellow-500/20 text-yellow-400 border-yellow-500/30" />
                        <StateRow state="Regressing" keys={groupedStates.regressing} icon={<AlertTriangle className="w-3 h-3 text-red-400" />} color="bg-red-500/20 text-red-400 border-red-500/30" />
                    </div>
                </div>

                {/* AI Terminal Output */}
                <div className="p-5 rounded-xl bg-[#0a0a0f] border border-cyan-500/20 font-mono text-sm relative group overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
                    <div className="flex items-center gap-2 mb-3 text-cyan-500/80 text-xs border-b border-cyan-500/20 pb-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        system.analyze()
                    </div>
                    <div className="text-cyan-100/70 whitespace-pre-wrap leading-relaxed h-[120px] overflow-y-auto custom-scrollbar">
                        {aiAssessment}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StateRow({ state, keys, icon, color }: { state: string, keys: string[], icon: React.ReactNode, color: string }) {
    if (keys.length === 0) return null;
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 w-20 flex-shrink-0">{state}</span>
            <div className="flex flex-wrap gap-1">
                {keys.slice(0, 8).map(k => (
                    <span key={k} className={cn("px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border flex items-center gap-1", color)}>
                        {k === ' ' ? 'SPC' : k}
                    </span>
                ))}
                {keys.length > 8 && <span className="text-xs text-zinc-600">+{keys.length - 8}</span>}
            </div>
        </div>
    );
}
