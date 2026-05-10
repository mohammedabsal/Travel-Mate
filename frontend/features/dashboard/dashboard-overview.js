"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock3, MapPinned, Route, Sparkles, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const cards = [
  { title: 'Upcoming trips', value: '3', hint: 'Next 30 days', icon: Calendar },
  { title: 'Budget planned', value: '$12.8k', hint: 'Across active trips', icon: Wallet },
  { title: 'Destinations saved', value: '18', hint: 'Curated places', icon: MapPinned },
  { title: 'AI suggestions', value: '24', hint: 'This week', icon: Sparkles }
];

const budgetTrend = [
  { month: 'Jan', planned: 2600, actual: 2300 },
  { month: 'Feb', planned: 2900, actual: 2750 },
  { month: 'Mar', planned: 3200, actual: 3040 },
  { month: 'Apr', planned: 3400, actual: 3310 },
  { month: 'May', planned: 3800, actual: 3590 },
  { month: 'Jun', planned: 4100, actual: 3990 }
];

const cityLoad = [
  { city: 'Berlin', sessions: 28 },
  { city: 'Prague', sessions: 22 },
  { city: 'Vienna', sessions: 25 },
  { city: 'Lisbon', sessions: 17 }
];

const itineraryDays = [
  {
    id: 'day-01',
    label: 'Day 01',
    title: 'Arrival + Art District',
    city: 'Berlin',
    start: '09:30',
    items: ['Hotel check-in', 'Museum Island pass', 'Riverside dinner']
  },
  {
    id: 'day-04',
    label: 'Day 04',
    title: 'Old Town + Food Walk',
    city: 'Prague',
    start: '10:00',
    items: ['Charles Bridge sunrise', 'Coffee crawl', 'Night tram photo route']
  },
  {
    id: 'day-08',
    label: 'Day 08',
    title: 'Culture Sprint',
    city: 'Vienna',
    start: '09:00',
    items: ['Belvedere visit', 'Opera quarter lunch', 'Sunset rooftop booking']
  }
];

export function DashboardOverview() {
  const [activeDay, setActiveDay] = useState(itineraryDays[0].id);
  const selectedDay = useMemo(() => itineraryDays.find((item) => item.id === activeDay) ?? itineraryDays[0], [activeDay]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Card className="rounded-[1.75rem] border-white/60 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardDescription className="text-slate-600 dark:text-slate-300">{card.title}</CardDescription>
                  <CardTitle className="mt-2 text-3xl text-slate-900 dark:text-white">{card.value}</CardTitle>
                </div>
                <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-700 dark:text-violet-300">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-300">{card.hint}</p>
              </CardContent>
            </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="rounded-[2rem] border-white/60 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">Quick actions</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">Launch the core planning flows.</CardDescription>
              </div>
              <Badge>Protected route</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Create trip', href: '/trips/new' },
              { label: 'Search destinations', href: '/trips' },
              { label: 'Review budget', href: '/dashboard' },
              { label: 'Open checklist', href: '/trips' }
            ].map((action) => (
              <Button key={action.label} asChild variant="outline" className="justify-start rounded-2xl">
                <Link href={action.href}>
                  {action.label}
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-violet-900 to-fuchsia-900 text-white dark:from-white dark:via-violet-50 dark:to-fuchsia-100 dark:text-slate-950">
          <CardHeader>
            <CardDescription className="text-white/70 dark:text-slate-600">Recent activity</CardDescription>
            <CardTitle>Trip collaboration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-white/75 dark:text-slate-700">
            <p>• Added 3 new stops to the Europe Summer Loop.</p>
            <p>• Marked an expense over budget in Prague.</p>
            <p>• Shared a public itinerary link with friends.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] border-white/60 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Budget trend</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">Planned vs actual spend over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={budgetTrend} margin={{ left: 4, right: 4 }}>
                <defs>
                  <linearGradient id="plannedGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="actualGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#94a3b822" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1aa',
                    background: 'rgba(255,255,255,0.92)',
                    boxShadow: '0 10px 35px rgba(15, 23, 42, 0.12)'
                  }}
                />
                <Area type="monotone" dataKey="planned" stroke="#7c3aed" fill="url(#plannedGradient)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="actual" stroke="#a855f7" fill="url(#actualGradient)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/60 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Engagement by city</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">Most interacted destination hubs this week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityLoad}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#94a3b822" />
                <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1aa',
                    background: 'rgba(255,255,255,0.92)',
                    boxShadow: '0 10px 35px rgba(15, 23, 42, 0.12)'
                  }}
                />
                <Bar dataKey="sessions" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border-white/60 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-slate-900 dark:text-white">Interactive itinerary timeline</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">Tap a day to inspect schedule details and key milestones.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {itineraryDays.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveDay(day.id)}
                  className={`rounded-full px-3 py-1.5 text-sm transition-all ${activeDay === day.id ? 'bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            key={selectedDay.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-4 rounded-[1.5rem] border border-white/60 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-950/60 lg:grid-cols-[0.42fr_0.58fr]"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-700 dark:text-violet-300">{selectedDay.city}</p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{selectedDay.title}</p>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-800 dark:text-violet-200">
                <Clock3 className="h-4 w-4" />
                Starts at {selectedDay.start}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm text-white dark:bg-white dark:text-slate-900">
                <Route className="h-4 w-4" />
                3 key stops optimized
              </div>
            </div>
            <div className="space-y-2">
              {selectedDay.items.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-100/80 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}