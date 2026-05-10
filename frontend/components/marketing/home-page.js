'use client';

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

export function HomePage() {
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