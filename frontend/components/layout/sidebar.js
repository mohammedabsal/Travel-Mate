'use client';

import Link from 'next/link';
import { CalendarDays, Compass, LayoutDashboard, MapPinned, NotebookPen, Settings, Wallet, Luggage, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/use-ui-store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trips', label: 'Trips', icon: CalendarDays },
  { href: '/trips/new', label: 'New Trip', icon: MapPinned },
  { href: '/profile', label: 'Profile', icon: Settings },
  { href: '/share/demo', label: 'Shared Itinerary', icon: Share2 }
];

export function Sidebar() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);

  return (
    <aside className={cn('hidden h-screen flex-col border-r border-border bg-card/80 px-4 py-6 backdrop-blur xl:flex', collapsed ? 'w-[84px]' : 'w-[272px]')}>
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Compass className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">Traveloop</p>
            <p className="text-sm text-muted-foreground">Plan multi-city trips</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              <Icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-border bg-primary/10 p-4 text-sm text-foreground">
        <Luggage className="mb-3 h-5 w-5 text-primary" />
        {!collapsed && <p>Keep every city, expense, and note in one timeline.</p>}
      </div>
    </aside>
  );
}