'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';
import { TypingArea } from '@/components/typing/typing-area';
import { TypingStats } from '@/components/typing/typing-stats';
import { useTypingController } from '@/hooks/use-typing-controller';
import { useSound } from '@/hooks/use-sound';

import { MarkovChain } from '@/lib/algorithms/markov-chain';

const CORPUS = `
The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do.
Clean code reads like well-written prose. Any fool can write code that a computer can understand. Good programmers write code that humans can understand.
Simplicity is the soul of efficiency. Perfection is achieved not when there is nothing more to add but when there is nothing left to take away.
Code never lies, comments sometimes do. First solve the problem then write the code.
Experience is the name everyone gives to their mistakes. Java is to JavaScript what car is to Carpet.
Knowledge is power. Time is money. Practice makes perfect.
To be or not to be that is the question. All the world's a stage.
The only way to do great work is to love what you do. Stay hungry stay foolish.
Innovation distinguishes between a leader and a follower.
Life is what happens when you are busy making other plans.
The greatest glory in living lies not in never falling, but in rising every time we fall.
The way to get started is to quit talking and begin doing.
Your time is limited, so don't waste it living someone else's life.
If life were predictable it would cease to be life, and be without flavor.
If you look at what you have in life, you'll always have more.
If you look at what you don't have in life, you'll never have enough.
If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.
Life is really simple, but we insist on making it complicated.
In the end, it's not the years in your life that count. It's the life in your years.
Many of life's failures are people who did not realize how close they were to success when they gave up.
You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.
Code is poetry written in logic.
Design patterns are solutions to recurring problems in software design.
Refactoring is the process of restructuring existing computer code without changing its external behavior.
Unit testing is a software testing method by which individual units of source code are tested.
Continuous integration is the practice of merging all developers' working copies to a shared mainline several times a day.
`;

export default function InfiniteModePage() {
    // ... (existing logic)
    const router = useRouter();
    const { play } = useSound();
    const generator = useRef<MarkovChain | null>(null);
    const [isZen, setIsZen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sentenceQueue, setSentenceQueue] = useState<string[]>([]);
    const [currentSentence, setCurrentSentence] = useState('');

    useEffect(() => {
        if (!generator.current) {
            generator.current = new MarkovChain(2);
            generator.current.train(CORPUS);
        }
        const initial = [
            generator.current.generate(10),
            generator.current.generate(10)
        ];
        setSentenceQueue(initial);
        setCurrentSentence(initial[0]);
        setIsLoaded(true);
    }, []);

    const handleComplete = useCallback(() => {
        if (!generator.current) return;
        play('complete');
        const newFuture = generator.current.generate(randomInt(8, 15));
        const next = sentenceQueue[1] || newFuture;
        setSentenceQueue([next, newFuture]);
        setCurrentSentence(next);
    }, [play, sentenceQueue]);

    const {
        reset,
    } = useTypingController({
        text: currentSentence,
        mode: 'free',
        onComplete: handleComplete,
    });

    // Reset engine when sentence changes
    useEffect(() => {
        if (currentSentence) {
            reset();
        }
    }, [currentSentence, reset]);

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading Infinity...</div>;

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30 transition-colors duration-1000">
            {/* Header - Hidden in Zen Mode */}
            <header className={`border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg transition-all duration-500 ${isZen ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <Infinity className="w-6 h-6 text-primary animate-pulse" />
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400">
                                Infinite Flow
                            </h1>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsZen(!isZen)}
                        className={isZen ? 'fixed top-4 right-4 z-50 bg-background/50 hover:bg-background/80' : ''}
                    >
                        Toggle Zen Mode (Z)
                    </Button>
                </div>
            </header>

            {/* Zen Mode Toggle (Visible when Zen is active) */}
            {isZen && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsZen(false)}
                    className="fixed top-6 right-6 z-50 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" /> {/* Icon to exit Zen */}
                </Button>
            )}


            <main className={`container mx-auto px-4 py-8 space-y-6 transition-all duration-1000 ${isZen ? 'flex flex-col items-center justify-center min-h-[80vh]' : ''}`}>
                <Card className={`bg-black/20 border-white/10 transition-all duration-500 ${isZen ? 'border-transparent bg-transparent shadow-none' : ''}`}>
                    <div className="p-8">
                        {/* Stats - Hidden in Zen Mode */}
                        <div className={`transition-opacity duration-500 ${isZen ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}>
                            <TypingStats />
                        </div>

                        <div className="mt-8 mb-4">
                            <TypingArea
                                className={`transition-all duration-500 ${isZen ? 'text-4xl leading-relaxed text-center font-serif text-muted-foreground/80' : ''}`}
                            />
                        </div>

                        {/* Preview of next sentence */}
                        <div className={`mt-8 pt-4 border-t border-white/5 opacity-50 blur-[0.5px] select-none pointer-events-none transition-all duration-500 ${isZen ? 'border-none opacity-20' : ''}`}>
                            <p className={`text-lg text-muted-foreground line-clamp-1 ${isZen ? 'text-center' : ''}`}>
                                {sentenceQueue[1]}...
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Keyboard - Hidden in Zen Mode */}
                <div className={`transition-opacity duration-500 ${isZen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <VirtualKeyboard />
                </div>
            </main>
        </div>
    );
}

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
