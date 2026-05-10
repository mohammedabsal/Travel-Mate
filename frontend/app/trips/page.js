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
  // categorize trips into ongoing, upcoming, completed
  const now = new Date();
  const ongoing = [];
  const upcoming = [];
  const completed = [];

  for (const trip of trips) {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    if (trip.status === 'COMPLETED' || end < now) {
      completed.push(trip);
    } else if (trip.status === 'ACTIVE' && start <= now && end >= now) {
      ongoing.push(trip);
    } else {
      upcoming.push(trip);
    }
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Trips</h2>
          <p className="text-muted-foreground">Search, group, and manage your trips.</p>
        </div>
        <Button asChild>
          <Link href="/trips/new">Plan a trip</Link>
        </Button>
      </div>

      <div className="space-y-10">
        <section>
          <h3 className="mb-4 text-2xl font-semibold">Ongoing</h3>
          <div className="space-y-4">
            {ongoing.length ? (
              ongoing.map((trip) => (
                <Card key={trip.id} className="rounded-lg">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{trip.title}</p>
                        <p className="text-sm text-muted-foreground">{trip.stops.length} stops · {trip.currency} {trip.budget?.totalPlanned ?? 0}</p>
                      </div>
                      <div>
                        <Link href={`/trips/${trip.id}`} className="text-sm text-primary">Open</Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-muted-foreground">No ongoing trips</div>
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-semibold">Upcoming</h3>
          <div className="space-y-4">
            {upcoming.length ? (
              upcoming.map((trip) => (
                <Card key={trip.id} className="rounded-lg">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{trip.title}</p>
                        <p className="text-sm text-muted-foreground">Starts {new Date(trip.startDate).toLocaleDateString()} · {trip.stops.length} stops</p>
                      </div>
                      <div>
                        <Link href={`/trips/${trip.id}`} className="text-sm text-primary">Open</Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-muted-foreground">No upcoming trips</div>
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-semibold">Completed</h3>
          <div className="space-y-4">
            {completed.length ? (
              completed.map((trip) => (
                <Card key={trip.id} className="rounded-lg">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{trip.title}</p>
                        <p className="text-sm text-muted-foreground">Completed {new Date(trip.endDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Link href={`/trips/${trip.id}`} className="text-sm text-primary">Open</Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-muted-foreground">No completed trips</div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}