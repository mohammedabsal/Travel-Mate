import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Trips'
};

export default async function TripsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const trips = await prisma.trip.findMany({
    where: { ownerId: session.user.id },
    orderBy: { startDate: 'asc' },
    include: { budget: true, stops: { orderBy: { order: 'asc' } } }
  });

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Trips</h2>
          <p className="text-muted-foreground">Manage your itineraries, budgets, and collaboration links.</p>
        </div>
        <Button asChild>
          <Link href="/trips/new">Create trip</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {trips.map((trip) => (
          <Card key={trip.id} className="rounded-[1.75rem]">
            <CardHeader>
              <CardDescription>{trip.visibility.toLowerCase()}</CardDescription>
              <CardTitle>{trip.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{trip.stops.length} stops · {trip.currency} {trip.budget?.totalPlanned ?? 0}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/trips/${trip.id}`}>Open trip</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}