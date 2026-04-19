import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AchievementToast } from "@/components/gamification/achievement-toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PWARegistry } from "@/components/pwa-registry";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#000000",
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          {children}
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
        <PWARegistry />
      </body>
    </html>
  );
}


