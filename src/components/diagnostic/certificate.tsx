'use client';

import { UserLevel } from '@/stores/diagnostic-store';
import { Award, Star, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RefObject } from 'react';

const RANK_CONFIG: Record<UserLevel, { title: string; icon: any; color: string; bg: string }> = {
    beginner: {
        title: 'Novice Typist',
        icon: Star,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    intermediate: {
        title: 'Apprentice',
        icon: Award,
        color: 'text-green-500',
        bg: 'bg-green-500/10'
    },
    'fast-sloppy': {
        title: 'Rapid Sprinter',
        icon: Zap,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10'
    },
    advanced: {
        title: 'Grandmaster',
        icon: Crown,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    }
};

interface RankBadgeProps {
    level: UserLevel;
    className?: string;
}

export function RankBadge({ level, className }: RankBadgeProps) {
    const config = RANK_CONFIG[level] || RANK_CONFIG.beginner;
    const Icon = config.icon;

    return (
        <div className={cn("flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed", config.bg, config.color.replace('text', 'border'), className)}>
            <div className={cn("p-4 rounded-full bg-background shadow-sm ring-4 ring-opacity-20", config.color.replace('text', 'ring'))}>
                <Icon className={cn("w-12 h-12", config.color)} />
            </div>
            <div className="text-center">
                <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">Rank Achieved</div>
                <h3 className={cn("text-2xl font-black mt-1 uppercase", config.color)}>{config.title}</h3>
            </div>
        </div>
    );
}

interface CertificateProps {
    userName?: string;
    wpm: number;
    accuracy: number;
    level: UserLevel;
    date: Date;
    certificateRef?: RefObject<HTMLDivElement | null>;
}

export function Certificate({ userName = 'Valued User', wpm, accuracy, level, date, certificateRef }: CertificateProps) {
    const config = RANK_CONFIG[level] || RANK_CONFIG.beginner;

    return (
        <div ref={certificateRef} className="bg-white text-black p-8 rounded-xl shadow-2xl max-w-3xl mx-auto border-16 border-double border-gray-200 relative overflow-hidden print:shadow-none print:border-4 print:max-w-none print:w-full">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-black to-transparent pointer-events-none" />

            <div className="relative z-10 text-center space-y-8 py-8 border-2 border-gray-900/5 h-full rounded-lg">
                <div className="space-y-2">
                    <div className="flex justify-center mb-4">
                        <Award className="w-16 h-16 text-yellow-600" />
                    </div>
                    <h1 className="text-5xl font-serif font-bold tracking-tight text-gray-900">Certificate of Achievement</h1>
                    <p className="text-lg text-gray-500 font-serif italic">This certifies that</p>
                </div>

                <div className="py-4">
                    <h2 className="text-4xl font-bold text-blue-600 font-serif border-b-2 border-gray-200 inline-block px-12 pb-2">
                        {userName}
                    </h2>
                </div>

                <div className="space-y-4">
                    <p className="text-xl text-gray-600">Has successfully completed the TypeMaster Diagnostic Test and achieved the rank of</p>
                    <div className={`text-4xl font-black uppercase tracking-wider ${config.color.replace('text-', 'text-')}`}>
                        {config.title}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto py-8">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Speed</div>
                        <div className="text-3xl font-bold text-gray-900">{Math.round(wpm)} <span className="text-lg font-normal text-gray-500">WPM</span></div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Accuracy</div>
                        <div className="text-3xl font-bold text-gray-900">{accuracy.toFixed(1)}<span className="text-lg font-normal text-gray-500">%</span></div>
                    </div>
                </div>

                <div className="flex justify-between items-end px-12 pt-8 text-sm text-gray-500 font-serif">
                    <div className="text-center">
                        <div className="border-t border-gray-400 w-48 pt-2">{date.toLocaleDateString()}</div>
                        <div>Date</div>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-gray-400 w-48 pt-2">TypeMaster Pro AI</div>
                        <div>Instructor</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
