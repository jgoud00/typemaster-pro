'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProgressStore } from '@/stores/progress-store';
import { useUserStore } from '@/stores/user-store';
import { useDiagnosticStore } from '@/stores/diagnostic-store';

export function WelcomeModal() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const { username, setUsername } = useUserStore();
    const hasSeenWelcome = useProgressStore((state) => state.hasSeenWelcome);
    const setHasSeenWelcome = useProgressStore((state) => state.setHasSeenWelcome);

    useEffect(() => {
        if (!hasSeenWelcome && pathname === '/') {
            setOpen(true);
            setIsLoading(false);
        }
    }, [hasSeenWelcome, pathname]);

    const handleStart = () => {
        setHasSeenWelcome(true);
        // Activate the diagnostic store
        useDiagnosticStore.setState({ hasTakenDiagnostic: true, diagnosticResult: null });
        setOpen(false);
    };

    if (pathname.startsWith('/lessons')) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-3xl text-center mb-4">
                        Welcome to Aloo Type! 👋
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <p className="text-lg text-center text-muted-foreground">
                        Master touch typing with our AI-powered adaptive learning platform
                    </p>

                    <motion.div 
                        className="space-y-3"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                        }}
                    >
                        {[
                            { icon: '🎮', title: 'Gamified Learning', desc: '28 achievements, streaks, and combos to keep you motivated' },
                            { icon: '📊', title: 'Smart Analytics', desc: 'AI detects your weak keys and creates personalized exercises' },
                            { icon: '🎯', title: '73 Lessons', desc: 'Progressive curriculum from beginner to advanced' },
                        ].map((f, i) => (
                            <motion.div 
                                key={i}
                                variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                                className="flex items-center justify-between p-3.5 bg-muted/50 rounded-lg border border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">{f.icon}</div>
                                    <h3 className="font-semibold text-sm">{f.title}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground text-right max-w-[200px] leading-tight">
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium">Your Name / Alias</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter username..."
                                className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="bg-amber-950/50 border-l-4 border-amber-400 border-y-0 border-r-0 p-4 rounded-r-lg">
                            <h4 className="font-semibold mb-2 text-amber-500">💡 Quick Tip:</h4>
                            <p className="text-sm text-muted-foreground">
                                Start with the Home Row lessons and work your way up.
                                Consistency is key - practice 15 minutes daily for best results!
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <Button 
                            onClick={handleStart} 
                            size="lg" 
                            className="px-8"
                            disabled={isLoading}
                        >
                            Start Learning! 🚀
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
