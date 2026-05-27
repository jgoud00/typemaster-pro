'use client';

import { useEffect, useRef, memo } from 'react';

function AmbientBackgroundComponent() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; deltaAlpha: number }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            // About 1 particle per 10000 pixels
            const numParticles = Math.floor((canvas.width * canvas.height) / 10000);
            
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3, // Very slow drift
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 0.5,
                    alpha: Math.random() * 0.5,
                    deltaAlpha: (Math.random() * 0.01) - 0.005
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Twinkle
                p.alpha += p.deltaAlpha;
                if (p.alpha <= 0.1 || p.alpha >= 0.6) p.deltaAlpha = -p.deltaAlpha;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 150, 255, ${p.alpha})`; // Soft blueish white
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#0d1117]">
            {/* Canvas Particle Layer */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
            
            {/* Soft Ambient Corner Glows to prevent it from looking completely flat */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-[var(--color-primary)] opacity-[0.05] blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-[var(--color-secondary)] opacity-[0.05] blur-[120px] rounded-full" />
        </div>
    );
}

export const AmbientBackground = memo(AmbientBackgroundComponent);
