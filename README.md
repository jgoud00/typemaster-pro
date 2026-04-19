<div align="center">

# ⌨️ TypeMaster Pro

### The World's Most Advanced AI-Powered Typing Tutor

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![ML Grade](https://img.shields.io/badge/ML-Research_Grade-purple)](/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![CI/CD Status](https://github.com/yourusername/typemaster-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/typemaster-pro/actions/workflows/ci.yml)

**🧠 Research-Grade Machine Learning • 📊 Real-Time Analytics • 🎮 Gamified Learning**

*The only typing tutor with PhD-thesis quality adaptive learning algorithms*

</div>

---

## 🌟 What Makes TypeMaster Pro Different?

TypeMaster Pro is not just another browser typing test. It is a comprehensive, production-ready educational platform that employs **research-grade machine learning algorithms** to adapt to your unique learning patterns in real-time. 

While other typing tutors use simple rule-based systems or static thresholds, TypeMaster Pro dynamically builds a statistical profile of your fingers, modeling your cognitive load, muscle memory, and fatigue.

| Feature | TypeMaster Pro | Other Tutors |
|---------|---------------|--------------|
| Weakness Detection | **Bayesian + HMM Ensemble** | Simple static thresholds |
| Error Prediction | **Neural Networks** | None |
| Lesson Adaptation | **Zone of Proximal Development** | Fixed curriculum difficulty |
| Pattern Recognition | **Multi-dimensional Context Analysis** | Basic WPM/Accuracy stats |
| Data Privacy | **100% Client-Side Local Storage** | Cloud-dependent accounts |

---

## ✨ Full Feature Overview

### 🧠 Advanced AI/ML System
Built from the ground up, the intelligent typing engine uses four separate mathematical models:
- **Ultimate Weakness Detection** — A hierarchical Bayesian model utilizing Beta-Binomial conjugate priors and Hidden Markov Model (HMM) state tracking to definitively classify a key as `Learning`, `Proficient`, `Mastered`, or `Regressing`.
- **Neural Network Error Predictor** — A feed-forward engine that evaluates N-gram history, current speed, and session fatigue to predict mistakes *before* they happen.
- **Thompson Sampling** — A multi-armed bandit algorithm that balances exploration (trying new keys) and exploitation (drilling weak keys) for optimal practice scheduling.
- **Transfer Learning** — Understands finger adjacency. If you improve on the `J` key, the system probabilistically anticipates improvements on the `U` and `M` keys.

### 🎯 Core Typing Engine
- **O(1) Real-time Tracking** — Hand-optimized React architectures ensure the main thread never blocks, capturing exact millisecond delays and WPM at 60fps.
- **Progressive Curriculum** — Handcrafted lessons taking users from home-row basics to advanced multi-finger punctuation.
- **Smart Practice** — Generates bespoke practice text containing high concentrations of your statistically weakest keys.

### 🏃 Speed Training Modules
- **Burst Mode** — Level-based dynamic text generation that forces you to hit specific split-second WPM targets to stay alive.
- **Metronome Mode** — Interactive Tone.js audio cues (30-200 BPM) with pulsing visual beats to forge strict, unbreakable typing rhythm.
- **Sprint Mode** — Interval training with customizable burst/rest durations, followed by an overarching analytical summary chart.

### 🎮 Gamification & Engagement
- **28 Unlockable Achievements** covering speed, accuracy, streaks, and endurance.
- **Dynamic Combo System** — Multipliers that scale your score exponentially the longer you maintain perfect accuracy.
- **Daily Challenges** — Seeded generation ensures a fresh, global challenge text every 24 hours.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/typemaster-pro.git
cd typemaster-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🏗️ Architecture Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 16 | React framework with App Router |
| **Language** | TypeScript | Total end-to-end type safety |
| **Styling** | Tailwind CSS 4 | Utility-first, responsive, and dark-mode native graphics |
| **State** | Zustand 5 | Lightweight, highly performant global state stores |
| **Charts** | Recharts | Data visualization for complex mathematical outputs |
| **Audio** | Tone.js | Low-latency polyphonic sound synthesis for Metronome |
| **Animation** | Framer Motion | Smooth, 60fps SVG and layout transitions |

---

## 🔬 Mathematical Deep Dive

TypeMaster Pro operates an **Ensemble Prediction Pipeline**. Rather than asking one algorithm what text you should practice, it asks four:

1. **Bayesian Model (40% Weight):** Uses Beta-Binomial priors to quantify uncertainty. (e.g., "The user missed 'Q' once out of 2 attempts. We are 60% sure they are weak at it.")
2. **Hidden Markov Model (30% Weight):** Employs empirical state-history tracking. Every keystroke transition updates the transition matrix.
3. **Temporal Trend Analysis (20% Weight):** Plots raw speed over a moving time window.
4. **N-Gram Calculator (10% Weight):** Measures bigram and trigram hesitancy (e.g., the delay specifically hitting `E` immediately after `TH`).

These four models vote via a weighted multiplier. The resulting prioritization score is fed into the UI to schedule your next Smart Practice text.

---

## 🔒 Privacy & Data Handling

TypeMaster Pro is an entirely offline-capable Progressive Web Application (PWA).

**What We Track:**
- Aggregate statistics (WPM, accuracy)
- Per-key timestamps and hesitancy metrics
- Array counts for learning curves

**Where Data Lives:**
- 100% client-side (browser `localStorage`).
- Absolutely no remote database servers, telemetry, or analytics tracking. 
- You own your data. Export your entire ML profile as a `.json` backup anytime.

---

## 🎨 Design & Accessibility Highlights

- **Glassmorphism Aesthetic** — A breathtaking UX built on modern blur filters, subtle gradients, and reactive hover states.
- **Dark/Light Mode** — Automatic system preference detection flawlessly synced with Tailwind palettes.
- **Responsive Geometry** — Fluidly adapts the visual keyboard and analytics dashboards from ultra-wide 4k down to mobile viewports.
- **Accessibility (a11y)** — Fully navigable via ARIA live regions and keyboard event hooks.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Target Future Milestones:**
- [ ] Migrate `localStorage` matrices to `IndexedDB` to support 100,000+ keystroke sessions without pausing the Main Thread.
- [ ] Implement Multi-language support (Spanish, French, German layouts).
- [ ] Release a Desktop standalone packaging via Electron/Tauri.

---

<div align="center">

**Built with ⌨️ and 🧠**

*The future of typing education is adaptive.*

[![Star this repo](https://img.shields.io/github/stars/yourusername/typemaster-pro?style=social)](https://github.com/yourusername/typemaster-pro)

</div>
