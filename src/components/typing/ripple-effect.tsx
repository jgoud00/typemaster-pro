'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
    id: number;
    x: number;
    y: number;
}

function RippleEffectComponent({
    currentIndex,
    cursorRef,
    containerRef
}: {
    currentIndex: number;
    cursorRef: React.RefObject<HTMLSpanElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useEffect(() => {
        if (currentIndex === 0 || !cursorRef.current || !containerRef.current) return;

        // When currentIndex increases, spawn a ripple at the cursor's location
        const cursorRect = cursorRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate relative position
        const x = cursorRect.left - containerRect.left + (cursorRect.width / 2);
        const y = cursorRect.top - containerRect.top + (cursorRect.height / 2);

        const newRipple = { id: Date.now() + Math.random(), x, y };

        setRipples(prev => [...prev, newRipple]);

        // Cleanup ripple after 600ms
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
    }, [currentIndex, cursorRef, containerRef]);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.div
                        key={ripple.id}
                        initial={{ opacity: 0.8, scale: 0 }}
                        animate={{ opacity: 0, scale: 2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute rounded-full border border-[var(--color-primary)]"
                        style={{
                            left: ripple.x - 20,
                            top: ripple.y - 20,
                            width: 40,
                            height: 40,
                            boxShadow: '0 0 15px var(--color-primary), inset 0 0 10px var(--color-primary)'
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

export const RippleEffect = memo(RippleEffectComponent);
