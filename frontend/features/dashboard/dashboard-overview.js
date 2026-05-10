import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPinned, Wallet, Sparkles } from 'lucide-react';
import { picsumBySeed } from '@/lib/image-fallback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const cards = [
  { title: 'Upcoming trips', value: '3', hint: 'Next 30 days', icon: Calendar },
  { title: 'Budget planned', value: '$12.8k', hint: 'Across active trips', icon: Wallet },
  { title: 'Destinations saved', value: '18', hint: 'Curated places', icon: MapPinned },
  { title: 'AI suggestions', value: '24', hint: 'This week', icon: Sparkles }
];

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden rounded-[2rem] border-white/40 bg-white/70 backdrop-blur dark:bg-slate-950/60">
        <CardContent className="grid gap-0 p-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Travel pulse</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Your next city is waiting for a plan.</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">Fresh destination visuals and activity trends keep the dashboard lively while you build itineraries.</p>
          </div>
          <div className="relative h-56 md:h-full">
            <Image src={picsumBySeed('dashboard-hero', 1400, 900)} alt="Travel dashboard hero" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="rounded-[1.75rem]">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardDescription>{card.title}</CardDescription>
                  <CardTitle className="mt-2 text-3xl">{card.value}</CardTitle>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="rounded-[2rem] border-white/50 bg-white/75 backdrop-blur dark:bg-slate-950/60">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Quick actions</CardTitle>
                <CardDescription>Launch the core planning flows.</CardDescription>
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

        <Card className="rounded-[2rem] bg-slate-950 text-white dark:bg-white dark:text-slate-950">
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
    </div>
  );
}