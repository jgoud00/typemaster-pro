'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="container max-w-md px-4 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative inline-block mb-8">
                        <Ghost className="w-24 h-24 text-primary/30 mx-auto" />
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-black opacity-20">404</span>
                    </div>
                    
                    <h1 className="text-3xl font-bold mb-4 tracking-tight">Lost in Cyberspace?</h1>
                    <p className="text-muted-foreground mb-10 leading-relaxed">
                        The page you're looking for has vanished into the digital void. Let's get you back on track.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild size="lg" className="gap-2">
                            <Link href="/">
                                <Home className="w-4 h-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="gap-2" onClick={() => globalThis.window.history.back()}>
                            <Search className="w-4 h-4" />
                            Go Back
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
