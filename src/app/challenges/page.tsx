'use client';

import { ArrowLeft, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ChallengesPage() {
    const router = useRouter();

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
                            <Target className="w-6 h-6 text-primary" />
                            <h1 className="text-xl font-bold">Challenges</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
                <Target className="w-16 h-16 text-muted-foreground/50" />
                <h2 className="text-3xl font-bold">Coming Soon</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    Daily and weekly typing challenges are being built. Check back later to test your skills against the community!
                </p>
                <Button variant="outline" className="mt-8" onClick={() => router.push('/')}>
                    Return Home
                </Button>
            </main>
        </div>
    );
}
