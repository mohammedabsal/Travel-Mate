'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarCheck2, LineChart, MapPinned, ShieldCheck, Sparkles } from 'lucide-react';
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
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl border border-slate-700/50">
          <div className="relative h-44 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/id/1015/1400/500')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          </div>
          <div className="-mt-8 px-6 pb-6 relative">
            <div className="flex items-center gap-3">
              <input
                aria-label="Search trips or places"
                className="flex-1 rounded-lg border border-slate-600 bg-slate-900/80 px-4 py-3 text-sm shadow-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search bar ......"
              />
              <select value={groupBy} onChange={(event) => setGroupBy(event.target.value)} className={toolbarSelectClass}>
                <option value="none">Group: none</option>
                <option value="status">Group: trip status</option>
                <option value="country">Group: destination country</option>
                <option value="first-stop">Group: first stop city</option>
              </select>
              <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)} className={toolbarSelectClass}>
                <option value="all">Filter: all</option>
                <option value="active">Filter: active trips</option>
                <option value="draft">Filter: draft trips</option>
                <option value="completed">Filter: completed trips</option>
                <option value="budgeted">Filter: budgeted trips</option>
                <option value="image-only">Filter: with images</option>
              </select>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={toolbarSelectClass}>
                <option value="recommended">Sort: recommended</option>
                <option value="name-asc">Sort: name A-Z</option>
                <option value="city-asc">Sort: city A-Z</option>
                <option value="budget-desc">Sort: budget high-low</option>
                <option value="status">Sort: status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top Regional Selections */}
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Top Destinations</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {visibleDestinations.length > 0 ? (
              visibleDestinations.map((destination) => (
                <Link key={destination.id} href={`/destinations/${destination.slug}`}>
                  <div className="relative h-32 w-40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex-shrink-0 group cursor-pointer">
                    <Image
                      src={destination.imageUrl || 'https://picsum.photos/id/1025/800/600'}
                      alt={destination.name}
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-semibold text-white text-sm">{destination.city}</p>
                      <p className="text-xs text-gray-200">{destination.country}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-32 w-40 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg animate-pulse flex-shrink-0" />
              ))
            )}
          </div>
        </div>

        {/* Previous Trips */}
        <div className="mt-12 relative">
          <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Your Recent Trips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTrips.length > 0 ? (
              Object.entries(groupedTrips).map(([groupName, trips]) => (
                <div key={groupName} className="col-span-full space-y-3">
                  {groupBy !== 'none' && <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">{groupName}</p>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <div className="group cursor-pointer h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative w-full h-40 bg-cover bg-center">
                      <Image
                        src={trip.coverImageUrl || 'https://picsum.photos/id/1050/1000/700'}
                        alt={trip.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                    </div>
                    <div className="h-24 bg-gradient-to-b from-slate-900 to-slate-800 p-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{trip.title}</h4>
                        {(trip.stops?.length ?? 0) > 0 && (
                          <p className="text-xs text-cyan-400 mt-1">
                            {trip.stops.map(s => s.city).join(' • ')}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-300">
                        <span>{trip.status}</span>
                        {trip.budget && (
                          <span className="text-cyan-400 font-semibold">{trip.currency} {Math.round(trip.budget.totalSpent || 0)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg animate-pulse" />
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/trips/new">
            <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl">
              + Plan a trip
            </button>
          </Link>
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
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Traveloop combines itinerary building, budgets, checklists, journals, sharing, and destination discovery in a polished, mobile-first workspace.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-2xl px-7">
              <Link href="/signup">Start planning <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl px-7">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {['Trip creation', 'Budget tracking', 'Public sharing'].map((item) => (
              <div key={item} className="glass-panel rounded-3xl p-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-primary/10 blur-3xl" />
          <Card className="relative glass-panel overflow-hidden rounded-[2rem] border-white/20 bg-white/80 p-2 shadow-2xl dark:bg-slate-950/70">
            <CardHeader className="pb-4">
              <CardDescription>Europe summer escape</CardDescription>
              <CardTitle>Berlin · Prague · Vienna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-950 px-4 py-5 text-white dark:bg-white dark:text-slate-950">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60 dark:text-slate-500">Estimated budget</p>
                  <p className="mt-2 text-3xl font-semibold">$4,860</p>
                  <p className="mt-1 text-sm text-white/70 dark:text-slate-600">12 days, 3 cities</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="text-sm font-medium">Packing progress</p>
                  <div className="mt-4 h-2 rounded-full bg-muted">
                    <div className="h-2 w-[72%] rounded-full bg-primary" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">18 of 25 items packed</p>
                </div>
              </div>
              <div className="space-y-3">
                {features.slice(0, 3).map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{feature.title}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything needed to plan, operate, and share a trip.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <Card className="h-full rounded-[1.75rem] border-white/50 bg-white/75 backdrop-blur dark:bg-slate-950/60">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Testimonials</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Built for people who want fewer tabs and better trips.</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="rounded-[1.75rem] border-white/50 bg-white/80 backdrop-blur dark:bg-slate-950/60">
                <CardHeader>
                  <CardDescription className="text-base text-foreground">“{testimonial.quote}”</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
          <div className="rounded-[2.5rem] border border-border bg-slate-950 px-6 py-10 text-white shadow-2xl dark:bg-white dark:text-slate-950 lg:px-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60 dark:text-slate-500">Call to action</p>
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