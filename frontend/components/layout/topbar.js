'use client';

import { Bell, Menu, MoonStar, Search, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/use-ui-store';

export function Topbar() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-3 z-30 px-1 lg:px-4">
      <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/75 px-4 py-3 shadow-xl shadow-violet-500/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="xl:hidden" onClick={toggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">AI-ready travel operations</p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Traveloop</h1>
        </div>
      </div>

      <div className="hidden max-w-xs flex-1 items-center rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950/60 md:mx-5 md:flex">
        <Search className="mr-2 h-4 w-4" />
        Search trips, destinations, expenses...
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-semibold text-white dark:flex dark:bg-white dark:text-slate-950">TL</div>
      </div>
      </div>
    </header>
  );
}