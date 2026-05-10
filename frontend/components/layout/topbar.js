'use client';

import { Bell, Menu, MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/use-ui-store';

export function Topbar() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="xl:hidden" onClick={toggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm font-medium text-muted-foreground">AI-ready travel operations</p>
          <h1 className="text-lg font-semibold tracking-tight">Traveloop</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}