'use client';

import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useRouter } from 'next/navigation';

export default function ChallengesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            <SiteHeader />

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
