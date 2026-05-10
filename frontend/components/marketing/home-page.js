'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck2, Layers3, LineChart, MapPinned, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  { icon: MapPinned, title: 'Multi-city itineraries', description: 'Design stop-by-stop journeys with drag-and-drop sequencing and day assignments.' },
  { icon: LineChart, title: 'Budget intelligence', description: 'Track estimates, expenses, and over-budget warnings in one place.' },
  { icon: CalendarCheck2, title: 'Packing and journals', description: 'Manage checklists, notes, and daily memories without leaving the trip.' },
  { icon: ShieldCheck, title: 'Private by default', description: 'Secure sessions, protected routes, and shareable public views when needed.' }
];

const testimonials = [
  {
    quote: 'Traveloop feels like Notion and Google Travel had a very focused planning baby.',
    name: 'Ariana D.',
    role: 'Weekend traveler'
  },
  {
    quote: 'The budget dashboard and itinerary flow make it much easier to plan multi-city trips.',
    name: 'Marcus L.',
    role: 'Product manager'
  },
  {
    quote: 'Public sharing and packing lists are the exact features I kept trying to patch together manually.',
    name: 'Nina S.',
    role: 'Solo explorer'
  }
];

const topDestinations = [
  { name: 'Amalfi Coast', image: '/banner-placeholder.jpg', score: '4.9' },
  { name: 'Kyoto', image: '/banner-placeholder.jpg', score: '4.8' },
  { name: 'Lisbon', image: '/banner-placeholder.jpg', score: '4.7' },
  { name: 'Reykjavik', image: '/banner-placeholder.jpg', score: '4.9' }
];

const timelinePreview = [
  { day: 'Day 1', city: 'Berlin', detail: 'Boutique hotel check-in + museum pass pickup' },
  { day: 'Day 4', city: 'Prague', detail: 'Local food walk + riverside jazz evening' },
  { day: 'Day 8', city: 'Vienna', detail: 'Cultural district loop + designer cafe route' }
];

export function HomePage({ destinations = [], recentTrips = [] }) {
  const toolbarSelectClass = 'h-11 min-w-[170px] appearance-none rounded-xl border border-cyan-300/50 bg-slate-900/80 px-4 text-sm font-medium text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400';
  const [query, setQuery] = useState('');
  const [groupBy, setGroupBy] = useState('none');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  const normalizedQuery = query.trim().toLowerCase();

  const visibleDestinations = useMemo(() => {
    let list = [...destinations];

    if (normalizedQuery) {
      list = list.filter((destination) => [destination.name, destination.city, destination.country]
        .some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery)));
    }

    if (filterBy === 'image-only') {
      list = list.filter((destination) => Boolean(destination.imageUrl));
    }

    if (groupBy === 'country') {
      list.sort((a, b) => `${a.country}-${a.city}`.localeCompare(`${b.country}-${b.city}`));
      return list;
    }

    if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'city-asc') {
      list.sort((a, b) => a.city.localeCompare(b.city));
    }

    return list;
  }, [destinations, filterBy, groupBy, normalizedQuery, sortBy]);

  const visibleTrips = useMemo(() => {
    let list = [...recentTrips];

    if (normalizedQuery) {
      list = list.filter((trip) => {
        const stopNames = (trip.stops ?? []).map((stop) => stop.city).join(' ');
        return [trip.title, trip.status, stopNames]
          .some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery));
      });
    }

    if (filterBy === 'active') {
      list = list.filter((trip) => trip.status === 'ACTIVE');
    } else if (filterBy === 'draft') {
      list = list.filter((trip) => trip.status === 'DRAFT');
    } else if (filterBy === 'completed') {
      list = list.filter((trip) => trip.status === 'COMPLETED');
    } else if (filterBy === 'budgeted') {
      list = list.filter((trip) => Number(trip.budget?.totalSpent ?? 0) > 0);
    }

    if (sortBy === 'name-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'budget-desc') {
      list.sort((a, b) => Number(b.budget?.totalSpent ?? 0) - Number(a.budget?.totalSpent ?? 0));
    } else if (sortBy === 'status') {
      list.sort((a, b) => String(a.status).localeCompare(String(b.status)));
    }

    return list;
  }, [filterBy, normalizedQuery, recentTrips, sortBy]);

  const groupedTrips = useMemo(() => {
    if (groupBy === 'status') {
      return visibleTrips.reduce((acc, trip) => {
        const key = trip.status || 'UNKNOWN';
        if (!acc[key]) acc[key] = [];
        acc[key].push(trip);
        return acc;
      }, {});
    }

    if (groupBy === 'first-stop') {
      return visibleTrips.reduce((acc, trip) => {
        const key = trip.stops?.[0]?.city || 'No stop assigned';
        if (!acc[key]) acc[key] = [];
        acc[key].push(trip);
        return acc;
      }, {});
    }

    return { 'Recent Trips': visibleTrips };
  }, [groupBy, visibleTrips]);

  return (
    <div className="relative overflow-hidden">
      {/* Banner + Search Section (wireframe layout) */}
      <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-10">
        <div className="rounded-2xl overflow-hidden bg-slate-800/70 shadow-lg">
          <div className="h-44 bg-[url('/banner-placeholder.jpg')] bg-cover bg-center" />
          <div className="-mt-8 px-6 pb-6">
            <div className="flex items-center gap-3">
              <input
                aria-label="Search trips or places"
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm shadow-sm"
                placeholder="Search bar ......"
              />
              <button className="rounded-lg bg-white/90 px-3 py-2 text-sm">Group by</button>
              <button className="rounded-lg bg-white/90 px-3 py-2 text-sm">Filter</button>
              <button className="rounded-lg bg-white/90 px-3 py-2 text-sm">Sort by...</button>
            </div>
          </div>
        </div>

        {/* Top Regional Selections */}
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold">Top Regional Selections</h3>
          <div className="flex gap-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="h-28 w-28 rounded-lg bg-white/80 shadow-sm" />
            ))}
          </div>
        </div>

        {/* Previous Trips */}
        <div className="mt-8 relative">
          <h3 className="mb-3 text-lg font-semibold">Previous Trips</h3>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="h-56 rounded-xl bg-white/80 shadow"> </div>
            ))}
          </div>
          <button className="absolute bottom-0 right-0 mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white">+ Plan a trip</button>
        </div>
      </section>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_30%)]" />
      <section className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur dark:bg-slate-950/60">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-ready travel planning for modern teams and solo explorers
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Plan multi-city trips with one elegant command center.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Designed with Apple-level clarity, Airbnb warmth, and Linear precision. Build itineraries, run budgets, coordinate packing, and share live plans in a single premium command center.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group rounded-2xl px-7">
              <Link href="/signup">
                Start planning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl px-7">
              <Link href="/dashboard">Preview dashboard</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Active teams', value: '2.4k' },
              { label: 'Trip edits/day', value: '38k+' },
              { label: 'Avg. planning time cut', value: '41%' }
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/50 bg-white/80 px-4 py-4 shadow-lg shadow-violet-500/5 backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[2.4rem] bg-violet-400/20 blur-3xl" />
          <Card className="relative overflow-hidden rounded-[2rem] border-white/60 bg-white/80 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Live itinerary board</CardDescription>
                  <CardTitle>Berlin • Prague • Vienna</CardTitle>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">Synced</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {timelinePreview.map((item, index) => (
                <motion.div
                  key={item.day}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.1 }}
                  className="flex gap-3 rounded-2xl border border-white/60 bg-white/90 p-3 dark:border-white/10 dark:bg-slate-950/65"
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.day} · {item.city}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
              <div className="rounded-2xl bg-slate-950 px-4 py-4 text-white dark:bg-white dark:text-slate-950">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60 dark:text-slate-500">Budget confidence</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-3xl font-semibold">$4,860</p>
                  <p className="text-sm text-white/75 dark:text-slate-600">Predicted variance: 6%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <section id="discover" className="mx-auto mt-14 max-w-7xl px-6 lg:px-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700 dark:text-violet-300">Discover</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Curated places with premium filters</h2>
          </div>
          <Button variant="outline" className="rounded-xl">View all destinations</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topDestinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="group overflow-hidden rounded-[1.6rem] border-white/55 bg-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 dark:border-white/10 dark:bg-slate-900/65">
                <div className="relative h-40 overflow-hidden">
                  <img src={destination.image} alt={destination.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                  <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                    {destination.score}
                  </div>
                </div>
                <CardContent className="flex items-center justify-between p-4">
                  <p className="font-semibold text-slate-900 dark:text-white">{destination.name}</p>
                  <Globe2 className="h-4 w-4 text-slate-500" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto mt-16 max-w-7xl px-6 pb-24 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-700 dark:text-violet-300">Platform</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Everything needed to plan, operate, and share a trip.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <Card className="h-full rounded-[1.75rem] border-white/60 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-slate-900 dark:text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

        <section id="social-proof" className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-700 dark:text-violet-300">Testimonials</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Built for people who want fewer tabs and better trips.</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="rounded-[1.75rem] border-white/50 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                <CardHeader>
                  <CardDescription className="text-base text-slate-700 dark:text-slate-200">“{testimonial.quote}”</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-slate-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
          <div className="rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-slate-950 via-violet-900 to-fuchsia-900 px-6 py-10 text-white shadow-2xl dark:border-white/10 dark:from-slate-100 dark:via-violet-50 dark:to-fuchsia-100 dark:text-slate-950 lg:px-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-white/65 dark:text-slate-600">Call to action</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Start your next multi-city trip with a workspace that stays calm under pressure.</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-2xl px-7">
                  <Link href="/signup">Create free account</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/20 px-7 text-inherit hover:text-inherit dark:border-slate-200">
                  <Link href="/dashboard">See dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}