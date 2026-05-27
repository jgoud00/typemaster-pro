import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AchievementToast } from "@/components/gamification/achievement-toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PWARegistry } from "@/components/pwa-registry";
import { WorkerProvider } from "@/components/providers/worker-provider";
import { HydrationProvider } from "@/components/providers/hydration-provider";
import { SyncProvider } from "@/components/providers/sync-provider";
import { AnalyticsSyncProvider } from "@/components/providers/AnalyticsSyncProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AmbientBackground } from "@/components/layout/ambient-background";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#0d1117",
};

export const metadata: Metadata = {
  title: "Aloo Type - AI-Powered Typing Tutor",
  description: "Master touch typing with adaptive AI-powered lessons, real-time weakness detection, and gamified learning. Track your progress and become a typing pro.",
  keywords: ["typing", "touch typing", "typing tutor", "keyboard practice", "WPM", "typing speed"],
  authors: [{ name: "Aloo Type" }],
  openGraph: {
    title: "Aloo Type - AI-Powered Typing Tutor",
    description: "Master touch typing with adaptive AI lessons",
    type: "website",
  },
  manifest: "/manifest.json",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable} font-sans antialiased`} suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-bold">
          Skip to content
        </a>
        <ErrorBoundary>
          <ThemeProvider>
            <SyncProvider>
              <WorkerProvider>
                <HydrationProvider>
                  <AnalyticsSyncProvider>
                    <div className="relative min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary-foreground">
                      <AmbientBackground />
                      <PWARegistry />
                      {children}
                    </div>
                  </AnalyticsSyncProvider>
                </HydrationProvider>
              </WorkerProvider>
            </SyncProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <AchievementToast />
        <Toaster
          position="bottom-right"
          gutter={8}
          toastOptions={{
            className: 'bg-card text-foreground border',
            duration: 3000,
          }}
        />
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                globalThis.addEventListener('error', (e) => {
                  console.error('RUNTIME ERROR:', e.message, e.filename, e.lineno);
                });
                globalThis.addEventListener('unhandledrejection', (e) => {
                  console.error('UNHANDLED PROMISE:', e.reason);
                });
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
