'use client';

import { ArrowLeft, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
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
                            <Info className="w-6 h-6 text-primary" />
                            <h1 className="text-xl font-bold">About</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 space-y-8 max-w-3xl">
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black tracking-tight text-primary">Aloo Type</h2>
                            <p className="text-muted-foreground text-lg">
                                Ultra-minimal, distraction-free typing application with flow intelligence.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold border-b border-white/10 pb-2">Tech Stack</h3>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li><strong>Framework:</strong> Next.js 14</li>
                                <li><strong>Language:</strong> TypeScript</li>
                                <li><strong>Styling:</strong> Tailwind CSS v4</li>
                                <li><strong>State Management:</strong> Zustand</li>
                                <li><strong>Animations:</strong> Framer Motion</li>
                                <li><strong>Backend & Auth:</strong> Supabase</li>
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
