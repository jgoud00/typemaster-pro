import { defineConfig } from 'vite';
import type { ViteUserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', '.next', 'dist'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/lib/**/*.ts', 'src/stores/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'src/**/*.d.ts'],
            thresholds: {
                'src/lib/algorithms/**/*.ts': {
                    lines: 60,
                    functions: 60,
                    statements: 60,
                    branches: 60
                }
            }
        },
        testTimeout: 10000,
        mockReset: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
} as ViteUserConfig);
