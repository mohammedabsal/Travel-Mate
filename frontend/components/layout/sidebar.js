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
    <aside className={cn('hidden h-screen flex-col px-4 py-5 xl:flex', collapsed ? 'w-[92px]' : 'w-[286px]')}>
      <div className="flex h-full flex-col rounded-[1.8rem] border border-white/60 bg-white/75 px-3 py-4 shadow-xl shadow-violet-500/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/55">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-violet-500/15 dark:bg-white dark:text-slate-950">
          <Compass className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-700 dark:text-slate-200">Traveloop</p>
            <p className="text-sm text-slate-500 dark:text-slate-300">Plan multi-city trips</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition-all hover:-translate-y-[1px] hover:bg-white hover:text-slate-900 hover:shadow-md dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
              <Icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-4 text-sm text-slate-700 dark:text-slate-200">
        <Luggage className="mb-3 h-5 w-5 text-violet-700 dark:text-violet-300" />
        {!collapsed && <p>Keep every city, expense, and note in one timeline.</p>}
      </div>
      </div>
    </aside>
  );
}