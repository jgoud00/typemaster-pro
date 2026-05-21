'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TARGET = 'home';

export default function NotFound() {
  const router = useRouter();
  const [typed, setTyped] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typed === TARGET) {
      const id = setTimeout(() => router.push('/'), 300);
      return () => clearTimeout(id);
    }
  }, [typed, router]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only accept characters that match the target prefix
    if (TARGET.startsWith(val)) {
      setTyped(val);
    } else {
      // Allow wrong chars up to target length for visual error feedback
      setTyped(val.slice(0, TARGET.length));
    }
  };

  const prompt = `type '${TARGET}' to escape`;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      onClick={() => inputRef.current?.focus()}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center"
      >
        {/* 404 gradient number */}
        <h1
          className="font-display font-black leading-none select-none"
          style={{
            fontSize: '120px',
            lineHeight: 1,
            background: 'linear-gradient(to bottom, var(--color-content-primary), var(--color-border-subtle))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        {/* Interactive typing prompt */}
        <div
          className="relative font-mono text-xl tracking-widest rounded-xl px-8 py-5 border mt-6 cursor-text"
          style={{
            background: 'var(--color-surface-elevated)',
            borderColor: 'var(--color-border-subtle)',
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Hidden input captures keystrokes */}
          <input
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            className="absolute inset-0 opacity-0 cursor-text w-full h-full"
            autoFocus
            aria-label="Type home to go back"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {/* Rendered characters */}
          {prompt.split('').map((char, i) => {
            // Only characters within typed zone get colored
            const isTypingZone = i >= 6 && i <= 9; // indices of 'home' in "type 'home' to escape"
            const typedOffset = i - 6; // offset within 'home'

            if (!isTypingZone || typedOffset < 0) {
              return (
                <span key={i} style={{ color: 'var(--color-content-muted)' }}>
                  {char}
                </span>
              );
            }

            const typedChar = typed[typedOffset];
            if (typedChar === undefined) {
              // Add blinking caret at current position
              const isNext = typedOffset === typed.length;
              return (
                <span key={i} className="relative">
                  {isNext && (
                    <motion.span
                      className="absolute -left-0.5 top-0 bottom-0 w-0.5 rounded-full"
                      style={{ background: 'var(--color-primary)' }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  <span style={{ color: 'var(--color-content-muted)' }}>{char}</span>
                </span>
              );
            }

            if (typedChar === char) {
              return (
                <span key={i} style={{ color: 'var(--color-primary)' }}>
                  {char}
                </span>
              );
            }

            return (
              <span
                key={i}
                style={{
                  color: 'var(--color-error)',
                  background: 'color-mix(in srgb, var(--color-error) 20%, transparent)',
                  borderRadius: '2px',
                }}
              >
                {typedChar}
              </span>
            );
          })}
        </div>

        {/* Subtext */}
        <p className="text-sm mt-4" style={{ color: 'var(--color-content-muted)' }}>
          Or just click the button, no judgment.
        </p>

        {/* Go Home button */}
        <Link
          href="/"
          className="mt-6 inline-block font-bold px-8 py-3 rounded-xl transition-all bg-primary text-black hover:opacity-90 shadow-lg"
          style={{ boxShadow: '0 8px 24px color-mix(in srgb, var(--color-primary) 25%, transparent)' }}
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
