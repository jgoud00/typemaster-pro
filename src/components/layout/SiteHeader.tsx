'use client';

import { useState, useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Keyboard, Trophy, TrendingUp, Flame, Star, Settings,
    Info, BookOpen, ChevronDown, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/stores/game-store';

function SiteHeaderComponent() {
    const pathname = usePathname();
    const { game } = useGameStore();
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setIsMoreOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Keyboard className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Aloo Type</h1>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-2 md:gap-4">

                    {/* Streak Badge (Always visible) */}
                    {game.dailyStreak > 0 && (
                        <div className="hidden md:flex items-center gap-1.5 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 mr-2">
                            <Flame className="w-4 h-4 fill-current" />
                            <span className="font-bold text-sm">{game.dailyStreak}</span>
                        </div>
                    )}

                    {/* Primary Nav Items */}
                    <Link href="/lessons">
                        <Button variant={isActive('/lessons') ? "secondary" : "ghost"} size="sm" className="hidden md:flex">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Lessons
                        </Button>
                    </Link>

                    <Link href="/stats">
                        <Button variant={isActive('/stats') ? "secondary" : "ghost"} size="sm" className="hidden md:flex">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Stats
                        </Button>
                    </Link>

                    {/* More Dropdown */}
                    <div className="relative" ref={moreRef}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("gap-1", isMoreOpen && "bg-accent text-accent-foreground")}
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                        >
                            <span className="hidden md:inline">More</span>
                            <MoreHorizontal className="w-4 h-4 md:hidden" />
                            <ChevronDown className={cn("w-4 h-4 transition-transform hidden md:block", isMoreOpen && "rotate-180")} />
                        </Button>

                        <AnimatePresence>
                            {isMoreOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-full mt-2 w-48 p-1 rounded-xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="flex flex-col gap-1">
                                        {/* Mobile only items */}
                                        <div className="md:hidden">
                                            <DropdownItem href="/lessons" icon={<BookOpen className="w-4 h-4" />} label="Lessons" onClick={() => setIsMoreOpen(false)} />
                                            <DropdownItem href="/stats" icon={<TrendingUp className="w-4 h-4" />} label="Stats" onClick={() => setIsMoreOpen(false)} />
                                            <div className="h-px bg-white/10 my-1" />
                                        </div>

                                        <DropdownItem href="/challenges" icon={<Trophy className="w-4 h-4" />} label="Challenges" onClick={() => setIsMoreOpen(false)} />
                                        <DropdownItem href="/achievements" icon={<Star className="w-4 h-4" />} label="Achievements" onClick={() => setIsMoreOpen(false)} />
                                        <div className="h-px bg-white/10 my-1" />
                                        <DropdownItem href="/about" icon={<Info className="w-4 h-4" />} label="About" onClick={() => setIsMoreOpen(false)} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    {/* Settings */}
                    <Link href="/settings">
                        <Button variant="ghost" size="icon" className="hover:rotate-45 transition-transform duration-300">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
export const SiteHeader = memo(SiteHeaderComponent);

function DropdownItem({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <Link href={href} onClick={onClick}>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                <span className="text-muted-foreground">{icon}</span>
                <span>{label}</span>
            </div>
        </Link>
    )
}
