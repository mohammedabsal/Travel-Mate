import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTripImage, picsumBySeed } from '@/lib/image-fallback';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export async function generateMetadata({ params }) {
  const { tripId } = await params;
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });

  if (!trip) {
    return { title: 'Trip not found' };
  }

  return {
    title: trip.title,
    description: trip.description ?? 'Trip overview'
  };
}

export default async function TripDetailPage({ params }) {
  const { tripId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, ownerId: session.user.id },
    include: {
      stops: { orderBy: { order: 'asc' } },
      budget: true,
      checklist: { include: { items: true } },
      journalEntries: { orderBy: { entryDate: 'desc' } }
    }
  });

  if (!trip) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <Card className="overflow-hidden rounded-[2rem]">
          <div className="relative h-56 w-full md:h-72">
            <Image src={getTripImage(trip)} alt={trip.title} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <div className="absolute bottom-5 left-6 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">{trip.visibility.toLowerCase()}</p>
              <h1 className="text-4xl font-semibold">{trip.title}</h1>
            </div>
          </div>
          <CardHeader>
            <CardDescription>Navigate your itinerary, budget, checklist, and journal</CardDescription>
            <CardTitle className="text-2xl">Trip Workspace</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline"><Link href={`/trips/${trip.id}/itinerary`}>Itinerary</Link></Button>
            <Button asChild variant="outline"><Link href={`/trips/${trip.id}/budget`}>Budget</Link></Button>
            <Button asChild variant="outline"><Link href={`/trips/${trip.id}/checklist`}>Checklist</Link></Button>
            <Button asChild variant="outline"><Link href={`/trips/${trip.id}/journal`}>Journal</Link></Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className="rounded-[2rem]">
              <CardHeader>
                <CardTitle>Trip overview</CardTitle>
                <CardDescription>{trip.description ?? 'No description yet'}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div><p className="text-sm text-muted-foreground">Stops</p><p className="text-2xl font-semibold">{trip.stops.length}</p></div>
                <div><p className="text-sm text-muted-foreground">Budget target</p><p className="text-2xl font-semibold">{trip.currency} {trip.budget?.totalPlanned ?? 0}</p></div>
                <div><p className="text-sm text-muted-foreground">Journal entries</p><p className="text-2xl font-semibold">{trip.journalEntries.length}</p></div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="timeline">
            <Card className="rounded-[2rem]">
              <CardHeader>
                <CardTitle>Timeline preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trip.stops.map((stop) => (
                  <div key={stop.id} className="grid items-center gap-3 rounded-2xl border border-border p-3 md:grid-cols-[120px_1fr_auto]">
                    <div className="relative h-20 overflow-hidden rounded-xl">
                      <Image src={picsumBySeed(`${stop.city}-${stop.country}`, 500, 300)} alt={stop.city} fill sizes="120px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{stop.city}</p>
                      <p className="text-sm text-muted-foreground">{stop.country}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Stop {stop.order}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="budget">
            <Card className="rounded-[2rem]">
              <CardHeader>
                <CardTitle>Budget summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Planned: {trip.currency} {trip.budget?.totalPlanned ?? 0}</p>
                <p>Spent: {trip.currency} {trip.budget?.totalSpent ?? 0}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}