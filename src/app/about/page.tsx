'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/layout/SiteHeader';

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            <SiteHeader />

            <main className="container mx-auto px-4 py-16 space-y-8 max-w-3xl">
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="font-display text-3xl font-black tracking-tight text-(--color-primary)">Aloo Type</h1>
                            <p className="text-(--color-content-secondary) text-lg">
                                Ultra-minimal, distraction-free typing application with flow intelligence.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="font-display text-xl font-bold border-b border-white/10 pb-2 text-(--color-content-primary)">Tech Stack</h2>
                            <ul className="list-disc pl-5 space-y-2 text-(--color-content-secondary)">
                                <li><strong>Framework:</strong> Next.js 14</li>
                                <li><strong>Language:</strong> TypeScript</li>
                                <li><strong>Styling:</strong> Tailwind CSS v4</li>
                                <li><strong>State Management:</strong> Zustand</li>
                                <li><strong>Animations:</strong> Framer Motion</li>
                                <li><strong>Backend &amp; Auth:</strong> Supabase</li>
                            </ul>
                        </div>
                        
                        <div className="pt-4 flex justify-center">
                            <Button variant="outline" onClick={() => router.push('/')}>
                                Return Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
