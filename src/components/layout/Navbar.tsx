'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  ChevronRight,
  Flame,
  House,
  Keyboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  Search,
  Settings,
  Trophy,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import { useGameStore } from '@/stores/game-store';
import { useSettingsStore } from '@/stores/settings-store';
import { createClient } from '@/lib/supabase/client';
import { AuthModal } from '@/components/auth/AuthModal';
import { MobileNav } from './MobileNav';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { lessons } from '@/lib/lessons';
export const navigation = [
  { href: '/', label: 'Overview', icon: House },
  { href: '/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/practice', label: 'Practice', icon: Keyboard },
  { href: '/challenges', label: 'Challenges', icon: Zap },
  { href: '/stats', label: 'Analytics', icon: ChartNoAxesCombined },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
];
export function Navbar() {
  const pathname = usePathname();
  const theme = useSettingsStore((s) => s.settings.theme);
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const isDark = theme !== 'light';
  const username = useUserStore((s) => s.username);
  const streak = useGameStore((s) => s.game.dailyStreak);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  async function signOut() {
    const { error } = await createClient().auth.signOut();
    if (!error) useUserStore.setState({ username: '', profileLoaded: true });
  }
  const destinations = [
    ...navigation,
    ...lessons.map((lesson) => ({
      href: `/lessons/${lesson.id}`,
      label: lesson.title,
      icon: BookOpen,
    })),
  ]
    .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);
  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <header className="workspace-topbar">
        <div className="studio-brand-row">
          <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open mobile menu" onClick={() => setMobileOpen(true)}><Menu /></Button>
          <Link href="/" className="studio-brand" aria-label="Aloo Type home"><span className="studio-brand-symbol"><Keyboard size={21} /></span><span>aloo<span className="text-primary">type</span></span></Link>
        </div>
        <nav aria-label="Main navigation" className="studio-navigation">
          {[...navigation, { href: '/settings', label: 'Settings', icon: Settings }].map(({href,label}) => <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined} className={cn('studio-nav-link',active(href) && 'is-active')}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <DialogTrigger asChild>
            <button type="button" aria-label="Search lessons and pages" className="search-launcher">
              <Search size={16} />
              <span className="hidden 2xl:inline">Search</span>
            </button>
          </DialogTrigger>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => updateSetting('theme', isDark ? 'light' : 'dark')}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          {streak > 0 && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-primary">
              <Flame size={16} />
              {streak} day streak
            </span>
          )}
          {!username && (
            <Button size="sm" variant="outline" onClick={() => setAuthOpen(true)}>
              Sign in
            </Button>
          )}
          {username && (
            <span className="max-w-24 truncate text-sm text-muted-foreground">{username}</span>
          )}
        </div>
      </header>
      <MobileNav
        isOpen={mobileOpen}
        onOpenChange={setMobileOpen}
        username={username}
        dailyStreak={streak}
        onSignInClick={() => setAuthOpen(true)}
        onSignOutClick={signOut}
      />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Find your next step</DialogTitle>
          <DialogDescription>Search the curriculum or jump to a workspace page.</DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          aria-label="Search lessons and pages"
          placeholder="Try home row, speed, or analytics"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="space-y-1">
          {destinations.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSearchOpen(false)}
              className="flex items-center gap-3 rounded-lg p-3 text-sm hover:bg-accent"
            >
              <Icon size={16} className="text-muted-foreground" />
              {label}
              <ChevronRight size={15} className="ml-auto text-muted-foreground" />
            </Link>
          ))}
          {!destinations.length && (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No matching lessons. Try a different keyword.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
