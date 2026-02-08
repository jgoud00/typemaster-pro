'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillTreeManager, type SkillTree as SkillTreeType, type SkillNode } from '@/lib/skill-tree';
import { useProgressStore } from '@/stores/progress-store';
import { useGameStore } from '@/stores/game-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SkillTree() {
    const [tree, setTree] = useState<SkillTreeType | null>(null);
    const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
    const { progress } = useProgressStore();
    const { game } = useGameStore();

    useEffect(() => {
        // Update skill tree based on current progress
        skillTreeManager.updateProgress({
            bestWpm: progress.personalBests.wpm || 0,
            bestAccuracy: progress.personalBests.accuracy || 0,
            currentStreak: game.dailyStreak || 0,
            sessionMinutes: Math.floor(progress.totalPracticeTime / 60),
            completedLessons: progress.completedLessons?.length || 0,
            testsAt95Plus: 0, // Would need to track this
        });

        setTree(skillTreeManager.getTree());
    }, [progress, game]);

    if (!tree) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🌳 Skill Tree
                    <Badge variant="outline">
                        {skillTreeManager.getUnlockedNodes().length}/13 Unlocked
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {/* Master Node */}
                    <div className="flex justify-center">
                        <SkillNodeComponent
                            node={tree.masterNode}
                            onClick={() => setSelectedNode(tree.masterNode)}
                            isSelected={selectedNode?.id === tree.masterNode.id}
                        />
                    </div>

                    {/* Connecting lines */}
                    <div className="flex justify-center">
                        <div className="w-px h-8 bg-border" />
                    </div>

                    {/* Three Paths */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Speed Path */}
                        <PathColumn
                            title="⚡ Speed"
                            nodes={tree.speedPath}
                            selectedNode={selectedNode}
                            onNodeClick={setSelectedNode}
                        />

                        {/* Accuracy Path */}
                        <PathColumn
                            title="🎯 Accuracy"
                            nodes={tree.accuracyPath}
                            selectedNode={selectedNode}
                            onNodeClick={setSelectedNode}
                        />

                        {/* Endurance Path */}
                        <PathColumn
                            title="🏃 Endurance"
                            nodes={tree.endurancePath}
                            selectedNode={selectedNode}
                            onNodeClick={setSelectedNode}
                        />
                    </div>
                </div>

                {/* Selected Node Details */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mt-6 p-4 bg-muted rounded-lg"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">{selectedNode.icon}</span>
                                <div>
                                    <h3 className="font-bold">{selectedNode.name}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedNode.description}</p>
                                </div>
                                {selectedNode.unlocked && (
                                    <Badge className="ml-auto bg-green-500">Unlocked!</Badge>
                                )}
                            </div>

                            <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{selectedNode.progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={selectedNode.progress} className="h-2" />
                            </div>

                            <div className="mt-3 text-sm">
                                <div className="text-muted-foreground">
                                    Requirement: {selectedNode.requirement.description}
                                </div>
                                <div className="text-muted-foreground">
                                    Reward: {selectedNode.reward.value}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}

interface PathColumnProps {
    title: string;
    nodes: SkillNode[];
    selectedNode: SkillNode | null;
    onNodeClick: (node: SkillNode) => void;
}

function PathColumn({ title, nodes, selectedNode, onNodeClick }: PathColumnProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            <h4 className="font-semibold text-sm">{title}</h4>
            {/* Render nodes from bottom (level 1) to top (level 4) */}
            {[...nodes].reverse().map((node, index) => (
                <div key={node.id} className="flex flex-col items-center">
                    {index > 0 && <div className="w-px h-4 bg-border" />}
                    <SkillNodeComponent
                        node={node}
                        onClick={() => onNodeClick(node)}
                        isSelected={selectedNode?.id === node.id}
                    />
                </div>
            ))}
        </div>
    );
}

interface SkillNodeComponentProps {
    node: SkillNode;
    onClick: () => void;
    isSelected: boolean;
}

function SkillNodeComponent({ node, onClick, isSelected }: SkillNodeComponentProps) {
    const isUnlocked = node.unlocked;
    const isNextUnlockable = !isUnlocked && node.progress > 0;

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all",
                "border-2 shadow-lg",
                isUnlocked && "bg-linear-to-br from-yellow-400 to-orange-500 border-yellow-300",
                isNextUnlockable && "bg-linear-to-br from-blue-400/50 to-purple-500/50 border-blue-300 animate-pulse",
                !isUnlocked && !isNextUnlockable && "bg-muted border-muted-foreground/30 opacity-50",
                isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
            )}
        >
            {node.icon}

            {/* Progress ring for partially complete nodes */}
            {!isUnlocked && node.progress > 0 && (
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${(node.progress / 100) * 175.9} 175.9`}
                        className="text-primary"
                    />
                </svg>
            )}

            {/* Unlocked checkmark */}
            {isUnlocked && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                </div>
            )}
        </motion.button>
    );
}
