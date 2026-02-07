import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AchievementToast } from "@/components/gamification/achievement-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "TypeMaster Pro - Learn Touch Typing",
  description: "An AI-powered adaptive typing learning platform with intelligent weakness detection and gamification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <AchievementToast />
        <Toaster
          position="bottom-right"
          gutter={8}
          toastOptions={{
            className: 'bg-card text-foreground border',
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}


