'use client';
import { Navbar } from './Navbar';
import Link from 'next/link';
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="workspace">
      <Navbar />
      <div className="workspace-content">
        <div
          id="main-content"
          tabIndex={-1}
          className="focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          {children}
        </div>
        <footer className="workspace-footer">
          <span>
            Aloo Type <span className="mx-2 text-border">/</span> Made for your next personal best.
          </span>
          <div className="flex gap-5">
            <Link href="/about">About</Link>
            <Link href="/settings">Your preferences</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
