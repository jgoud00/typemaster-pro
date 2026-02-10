'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProgressStore } from '@/stores/progress-store';

export function WelcomeModal() {
    const [open, setOpen] = useState(false);
    const hasSeenWelcome = useProgressStore((state) => state.hasSeenWelcome);
    const setHasSeenWelcome = useProgressStore((state) => state.setHasSeenWelcome);

    useEffect(() => {
        if (!hasSeenWelcome) {
            // Small delay to ensure smooth page load first
            const timer = setTimeout(() => setOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, [hasSeenWelcome]);

    const handleStart = () => {
        setHasSeenWelcome(true);
        setOpen(false);
    };

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

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-4xl mb-2">🎮</div>
                            <h3 className="font-semibold mb-2">Gamified Learning</h3>
                            <p className="text-sm text-muted-foreground">
                                28 achievements, streaks, and combos to keep you motivated
                            </p>
                        </div>

                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-4xl mb-2">📊</div>
                            <h3 className="font-semibold mb-2">Smart Analytics</h3>
                            <p className="text-sm text-muted-foreground">
                                AI detects your weak keys and creates personalized exercises
                            </p>
                        </div>

                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-4xl mb-2">🎯</div>
                            <h3 className="font-semibold mb-2">73 Lessons</h3>
                            <p className="text-sm text-muted-foreground">
                                Progressive curriculum from beginner to advanced
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">💡 Quick Tip:</h4>
                        <p className="text-sm text-muted-foreground">
                            Start with the Home Row lessons and work your way up.
                            Consistency is key - practice 15 minutes daily for best results!
                        </p>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <Button onClick={handleStart} size="lg" className="px-8">
                            Start Learning! 🚀
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
