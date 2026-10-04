'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Keyboard,
  BookOpen,
  Zap,
  Flame,
  BarChart2,
  Trophy,
  Settings,
  Info,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  username?: string;
  dailyStreak?: number;
  onSignInClick: () => void;
  onSignOutClick: () => void;
}

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: Keyboard },
  { href: '/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/practice', label: 'Practice', icon: Zap },
  { href: '/challenges', label: 'Challenges', icon: Flame },
  { href: '/stats', label: 'Analytics', icon: BarChart2 },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/about', label: 'About', icon: Info },
];

export function MobileNav({
  isOpen,
  onOpenChange,
  username,
  dailyStreak = 0,
  onSignInClick,
  onSignOutClick,
}: MobileNavProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(360px,calc(100vw-24px))] overflow-y-auto p-0 flex flex-col justify-between"
      >
        <div className="p-6">
          <SheetHeader className="text-left pb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand/10 border border-brand/30">
                <Keyboard className="w-5 h-5 text-brand" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold font-display tracking-tight text-foreground">
                  Aloo<span className="text-brand">Type</span>
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Your typing workspace
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <nav className="space-y-1" aria-label="Mobile Navigation">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  aria-current={isActive ? 'page' : undefined}
                  href={href}
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand/15 text-brand font-semibold border border-brand/25'
                      : 'text-text-secondary hover:text-foreground hover:bg-muted/60',
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-brand' : 'text-text-muted')} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 bg-surface-elevated/40 border-t border-border-subtle space-y-4">
          {dailyStreak > 0 && (
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-streak/10 border border-streak/25 text-streak text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 fill-current" />
                <span>Daily Practice Streak</span>
              </div>
              <span className="font-bold font-mono text-sm">{dailyStreak}d</span>
            </div>
          )}

          {username ? (
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-text-secondary">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-text-primary truncate">{username}</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  onSignOutClick();
                  onOpenChange(false);
                }}
                aria-label="Sign Out"
                className="text-text-muted hover:text-danger hover:bg-danger/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => {
                onOpenChange(false);
                onSignInClick();
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
