'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingController } from '@/hooks/use-typing-controller';
import { generateAdaptiveText } from '@/lib/practice-texts';
import { PerformanceRecord } from '@/types';
import { RotateCcw, ArrowRight } from 'lucide-react';

export default function WarmupPracticePage() {
    const router = useRouter();
    
    // Fixed easy text, ~60 words, no difficulty picker
    const [text, setText] = useState(() => generateAdaptiveText(60, 'easy'));
    const [isComplete, setIsComplete] = useState(false);
    const [result, setResult] = useState<PerformanceRecord | null>(null);

    const {
        reset,
    } = useTypingController({
        text,
        mode: 'free', // No timer pressure, just text completion
        onComplete: (record) => {
            setResult(record);
            setIsComplete(true);
        }
    });

    const handleRestart = () => {
        setText(generateAdaptiveText(60, 'easy'));
        reset();
        setIsComplete(false);
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex flex-col">
            <SiteHeader />
            
            <main className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center py-12">
                {isComplete && result ? (
                    <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center space-y-8 border border-white/[0.08]">
                        <div>
                            <h2 className="text-2xl font-bold font-display text-white mb-2">Warmup Complete</h2>
                            <p className="text-sm text-(--color-content-muted)">You are ready for the real thing.</p>
                        </div>
                        
                        <div className="flex justify-center gap-12 py-4">
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-(--color-content-muted) font-bold mb-2">WPM</div>
                                <div className="text-5xl font-black text-white font-mono">{result.wpm}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-(--color-content-muted) font-bold mb-2">Accuracy</div>
                                <div className="text-5xl font-black text-white font-mono">{result.accuracy}%</div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <Button 
                                onClick={() => router.push('/practice?mode=free')} 
                                className="w-full h-12 text-base font-bold group"
                                style={{
                                    background: 'var(--color-primary)',
                                    color: '#000'
                                }}
                            >
                                Start Real Practice
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleRestart} 
                                className="w-full h-12 text-sm border-white/[0.1] text-zinc-300 hover:bg-white/[0.05]"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Warmup Again
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-5xl transition-all duration-700">
                        <div className="mb-12 text-center">
                            <h1 className="text-2xl font-bold text-white mb-2 font-display">Warmup</h1>
                            <p className="text-(--color-content-muted) text-sm">A short, easy session to get your fingers moving. No pressure.</p>
                        </div>
                        
                        <TypingStats />
                        <TypingArea />
                    </div>
                )}
            </main>
        </div>
    );
}
