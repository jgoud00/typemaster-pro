'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Keyboard,
    ArrowLeft,
    Heart,
    Sparkles,
    Code2,
    Coffee,
    Zap,
    Target,
    Trophy,
    TrendingUp,
    Github,
    Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    const features = [
        {
            icon: <Target className="w-6 h-6" />,
            title: '73 Progressive Lessons',
            description: 'From home row basics to advanced typing challenges with real words and sentences.'
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: 'Detailed Analytics',
            description: 'Track your WPM, accuracy, and progress over time with beautiful visualizations.'
        },
        {
            icon: <Trophy className="w-6 h-6" />,
            title: 'Gamification',
            description: 'Earn achievements, build streaks, and stay motivated with daily goals.'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Speed Tests',
            description: 'Challenge yourself with timed tests and compete against your personal bests.'
        },
    ];

    const techStack = [
        'Next.js 14',
        'React 18',
        'TypeScript',
        'Tailwind CSS',
        'Framer Motion',
        'Zustand',
        'Recharts',
        'Radix UI'
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Keyboard className="w-8 h-8 text-primary" />
                        <h1 className="text-xl font-bold">About TypeMaster Pro</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">A Vibe Coding Project</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        TypeMaster Pro
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        A modern, gamified typing practice application built with passion,
                        creativity, and the joy of coding. Learn to type faster while having fun!
                    </p>
                </motion.section>

                {/* Story Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-16"
                >
                    <Card className="overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-linear-to-br from-pink-500/20 to-purple-500/20">
                                    <Heart className="w-6 h-6 text-pink-500" />
                                </div>
                                <h2 className="text-2xl font-bold">The Story</h2>
                            </div>

                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    <strong className="text-foreground">TypeMaster Pro</strong> was born from a simple idea:
                                    typing practice should be <em>fun</em>, not boring. Traditional typing tutors
                                    felt dry and uninspiring, so we decided to create something different.
                                </p>

                                <p>
                                    This is a <strong className="text-foreground">hobby project</strong> and a proud product of
                                    <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                                        <Code2 className="w-3 h-3" /> Vibe Coding
                                    </span>
                                    — that magical flow state where creativity meets code, and building feels
                                    less like work and more like play.
                                </p>

                                <p>
                                    Built over countless late nights with
                                    <Coffee className="w-4 h-4 inline mx-1 text-amber-500" />
                                    coffee in hand, TypeMaster Pro represents the joy of creating something
                                    useful while learning and experimenting with modern web technologies.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>

                {/* Features Grid */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">What Makes It Special</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">{feature.title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Tech Stack */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-16"
                >
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20">
                                    <Code2 className="w-6 h-6 text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-bold">Built With</h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>

                {/* Open Source Note */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <Card className="bg-linear-to-r from-primary/5 to-purple-500/5 border-primary/20">
                        <CardContent className="p-8">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 rounded-full bg-primary/10">
                                    <Star className="w-8 h-8 text-primary" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-3">Made with Love</h2>

                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                TypeMaster Pro is a passion project. Every feature was crafted with care
                                to help you become a better typist while enjoying the journey.
                            </p>

                            <div className="flex justify-center gap-3">
                                <Link href="/">
                                    <Button>
                                        <Keyboard className="w-4 h-4 mr-2" />
                                        Start Typing
                                    </Button>
                                </Link>
                                <Button variant="outline">
                                    <Github className="w-4 h-4 mr-2" />
                                    View Source
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-16 text-sm text-muted-foreground"
                >
                    <p>
                        Built with <Heart className="w-3 h-3 inline text-red-500 mx-1" />
                        using the power of Vibe Coding
                    </p>
                    <p className="mt-1">© 2024 TypeMaster Pro. Happy Typing! 🎹</p>
                </motion.footer>
            </main>
        </div>
    );
}
