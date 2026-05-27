'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/game-store';
import { typingBus } from '@/lib/events/typing-bus';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

interface ParticleSystemProps {
    cursorRef: React.RefObject<HTMLElement | null>;
}

export function ParticleSystem({ cursorRef }: ParticleSystemProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Resize canvas to match container
        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const particles = particlesRef.current;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15; // Gravity
                p.life -= 1;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                const progress = p.life / p.maxLife;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace(')', `, ${progress})`).replace('rgb', 'rgba');
                ctx.fill();
            }

            animationFrameRef.current = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    useEffect(() => {
        const handleKeystroke = (ctx: any) => {
            if (!ctx.isCorrect) return;

            const cursor = cursorRef.current;
            const container = containerRef.current;
            if (!cursor || !container) return;

            const cursorRect = cursor.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Calculate relative position within the container
            const x = cursorRect.left - containerRect.left + (cursorRect.width / 2);
            const y = cursorRect.top - containerRect.top + (cursorRect.height / 2);

            const combo = useGameStore.getState().game.combo;
            
            // Determine particle count based on combo
            let count = 0;
            if (combo > 50) count = Math.floor(Math.random() * 3) + 3; // 3-5
            else if (combo > 20) count = Math.floor(Math.random() * 2) + 2; // 2-3
            else if (combo > 5) count = Math.floor(Math.random() * 2) + 1; // 1-2

            if (count === 0) return;

            // Colors based on combo
            let colors = ['rgb(59, 130, 246)', 'rgb(147, 197, 253)']; // Blue
            if (combo > 100) colors = ['rgb(245, 158, 11)', 'rgb(252, 211, 77)']; // Orange/Gold
            else if (combo > 50) colors = ['rgb(16, 185, 129)', 'rgb(110, 231, 183)']; // Emerald

            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 1) * 4 - 2, // Upward bias
                    life: 20 + Math.random() * 15,
                    maxLife: 35,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: 2 + Math.random() * 2,
                });
            }
        };

        typingBus.on('KEYSTROKE_REGISTERED', handleKeystroke);
        return () => typingBus.off('KEYSTROKE_REGISTERED', handleKeystroke);
    }, [cursorRef]);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}
