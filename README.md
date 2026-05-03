# Aloo Type
Ultra-minimal, distraction-free typing application with flow intelligence and anti-cheat protection.

## Features
- **Typing Engine**: Highly responsive typing system with smooth caret and real-time validation.
- **Anti-Cheat System**: Timing-based anomaly detection and session integrity verification.
- **Flow Intelligence**: Real-time monitoring of typing consistency and speed stability.
- **Performance Tracking**: Minimal stats reporting with WPM, accuracy, and detailed history.

## Tech Stack
- **Framework**: Next.js
- **Language**: TypeScript
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS

## Getting Started
```bash
npm install
npm run dev
```

## Folder Structure
- `src/app/`: pages and routing logic.
- `src/components/`: reusable UI components (minimalist design).
- `src/hooks/`: custom React hooks for typing logic and state.
- `src/stores/`: state management stores (Zustand).
- `src/lib/`: core logic, utilities, and anti-cheat implementation.

## Design Philosophy
- **Minimalism**: Inspired by Monkeytype, the interface is stripped of all non-essential UI elements to maximize focus.
- **Performance**: Optimized React components with memoization and efficient state updates.
- **Security**: Robust anti-cheat protections enforced via timing analysis and payload verification.
