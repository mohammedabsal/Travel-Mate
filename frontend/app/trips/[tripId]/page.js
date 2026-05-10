import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export async function generateMetadata({ params }) {
  const trip = await prisma.trip.findUnique({ where: { id: params.tripId } });

  if (!trip) {
    return { title: 'Trip not found' };
  }

  return {
    title: trip.title,
    description: trip.description ?? 'Trip overview'
  };
}

export default async function TripDetailPage({ params }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, ownerId: session.user.id },
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
        <Card className="rounded-[2rem] overflow-hidden">
          <CardHeader>
            <CardDescription>{trip.visibility.toLowerCase()}</CardDescription>
            <CardTitle className="text-4xl">{trip.title}</CardTitle>
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
                  <div key={stop.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
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