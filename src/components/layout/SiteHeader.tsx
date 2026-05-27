'use client';

import { useState, useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Keyboard, Trophy, TrendingUp, Flame, Star, Settings,
    Info, BookOpen, ChevronDown, MoreHorizontal, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore, SettingsState } from '@/stores/settings-store';
import { useGameStore } from '@/stores/game-store';

const THEMES: { id: SettingsState['theme']; label: string; color: string }[] = [
    { id: 'dark', label: 'Default', color: 'bg-zinc-800' },
    { id: 'midnight', label: 'Midnight', color: 'bg-blue-600' },
    { id: 'cyberpunk', label: 'Cyberpunk', color: 'bg-pink-500' },
    { id: 'dracula', label: 'Dracula', color: 'bg-purple-500' },
];

function SiteHeaderComponent() {
    const pathname = usePathname();
    const { game } = useGameStore();
    const theme = useSettingsStore(s => s.settings.theme);
    const updateSetting = useSettingsStore(s => s.updateSetting);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);
    const themeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (moreRef.current && !moreRef.current.contains(target)) setIsMoreOpen(false);
            if (themeRef.current && !themeRef.current.contains(target)) setIsThemeOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/lessons', label: 'Lessons' },
        { href: '/practice', label: 'Practice' },
        { href: '/stats', label: 'Stats' },
    ];

    return (
        <header className="glass-header sticky top-0 z-40">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group shrink-0 outline-none">
                    <motion.div
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center w-9 h-9 rounded-xl glass-glow-primary group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
                    >
                        <Keyboard className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <span className="text-lg font-bold tracking-tight text-white font-display hidden sm:block">
                        Aloo<span className="text-blue-400">.</span>
                    </span>
                </Link>

                {/* Center Nav */}
                <nav className="flex items-center gap-1 p-1 rounded-2xl glass-subtle" aria-label="Main Navigation">
                    {navLinks.map(({ href, label }) => {
                        const active = isActive(href);
                        return (
                            <Link key={href} href={href} className="relative outline-none">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={cn(
                                        'relative px-4 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200',
                                        active
                                            ? 'text-white'
                                            : 'text-zinc-500 hover:text-zinc-200'
                                    )}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="nav-active-pill"
                                            className="absolute inset-0 rounded-xl glass-glow bg-white/[0.07]"
                                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                    <span className="relative z-10">{label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right cluster */}
                <div className="flex items-center gap-2">

                    {/* Streak Badge */}
                    {game.dailyStreak > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-subtle border border-orange-500/25 text-orange-400 text-xs font-bold"
                        >
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            <span>{game.dailyStreak}d</span>
                        </motion.div>
                    )}

                    {/* More Dropdown */}
                    <div className="relative" ref={moreRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="More Options"
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                            className={cn(
                                'flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200',
                                isMoreOpen
                                    ? 'text-white glass-subtle'
                                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                            )}
                        >
                            <span className="hidden md:inline">More</span>
                            <MoreHorizontal className="w-4 h-4 md:hidden" />
                            <motion.span animate={{ rotate: isMoreOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown className="w-3.5 h-3.5 hidden md:block" />
                            </motion.span>
                        </motion.button>

                        <AnimatePresence>
                            {isMoreOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.18, ease: 'easeOut' }}
                                    className="absolute right-0 top-full mt-2 w-52 p-1.5 rounded-2xl glass-strong border border-white/[0.10] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
                                >
                                    {/* Mobile primary nav */}
                                    <div className="md:hidden mb-1 pb-1 border-b border-white/[0.06]">
                                        <DropdownItem href="/practice" icon={<Keyboard className="w-4 h-4" />} label="Practice" onClick={() => setIsMoreOpen(false)} />
                                        <DropdownItem href="/lessons" icon={<BookOpen className="w-4 h-4" />} label="Lessons" onClick={() => setIsMoreOpen(false)} />
                                        <DropdownItem href="/stats" icon={<TrendingUp className="w-4 h-4" />} label="Stats" onClick={() => setIsMoreOpen(false)} />
                                    </div>
                                    <DropdownItem href="/challenges" icon={<Zap className="w-4 h-4" />} label="Challenges" accent="text-yellow-400" onClick={() => setIsMoreOpen(false)} />
                                    <DropdownItem href="/achievements" icon={<Star className="w-4 h-4" />} label="Achievements" accent="text-purple-400" onClick={() => setIsMoreOpen(false)} />
                                    <DropdownItem href="/about" icon={<Info className="w-4 h-4" />} label="About" onClick={() => setIsMoreOpen(false)} />
                                    <div className="mt-1 pt-1 border-t border-white/[0.06]">
                                        <DropdownItem href="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => setIsMoreOpen(false)} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Theme Dropdown */}
                    <div className="relative hidden md:block" ref={themeRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Change Theme"
                            onClick={() => setIsThemeOpen(!isThemeOpen)}
                            className={cn(
                                'w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 outline-none',
                                isThemeOpen ? 'bg-white/[0.07] text-white' : 'text-zinc-500 hover:text-white hover:bg-white/[0.07]'
                            )}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                        </motion.button>
                        <AnimatePresence>
                            {isThemeOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.18, ease: 'easeOut' }}
                                    className="absolute right-0 top-full mt-2 w-40 p-1.5 rounded-2xl glass-strong border border-white/[0.10] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
                                >
                                    {THEMES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                updateSetting('theme', t.id);
                                                setIsThemeOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors duration-150 text-sm group",
                                                theme === t.id ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                                            )}
                                        >
                                            <span>{t.label}</span>
                                            <span className={cn("w-3 h-3 rounded-full border border-white/20", t.color)} />
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Settings shortcut */}
                    <Link href="/settings" className="outline-none hidden md:block">
                        <motion.div
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.25 }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.07] transition-colors duration-200"
                        >
                            <Settings className="w-4 h-4" />
                        </motion.div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
export const SiteHeader = memo(SiteHeaderComponent);

function DropdownItem({ href, icon, label, accent, onClick }: {
    href: string;
    icon: React.ReactNode;
    label: string;
    accent?: string;
    onClick: () => void;
}) {
    return (
        <Link href={href} onClick={onClick}>
            <motion.div
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-colors duration-150 text-sm group"
            >
                <span className={cn('transition-colors', accent ?? 'text-zinc-500 group-hover:text-zinc-300')}>{icon}</span>
                <span className="text-zinc-300 group-hover:text-white transition-colors">{label}</span>
            </motion.div>
        </Link>
    );
}
