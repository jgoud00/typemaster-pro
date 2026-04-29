'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an analytics service if needed
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container max-w-md text-center z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-destructive/20 shadow-2xl shadow-destructive/10">
                        <AlertTriangle className="w-10 h-10 text-destructive" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4 tracking-tight">Something went wrong!</h1>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        An unexpected error occurred in the system. Don't worry, your data is safe.
                    </p>
                    
                    <div className="bg-muted/30 border border-white/5 rounded-xl p-4 mb-10 text-left overflow-hidden">
                        <p className="text-xs font-mono text-muted-foreground break-all">
                            {error.message || 'Unknown system error'}
                            {error.digest && <span className="block mt-1 opacity-50">Digest: {error.digest}</span>}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={reset} size="lg" className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            <RefreshCcw className="w-4 h-4" />
                            Try Again
                        </Button>
                        <Button variant="outline" asChild size="lg" className="gap-2">
                            <Link href="/">
                                <Home className="w-4 h-4" />
                                Return Home
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
