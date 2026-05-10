import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTripImage } from '@/lib/image-fallback';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
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
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <Card className="overflow-hidden rounded-xl transition hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[220px_1fr]">
                        <div className="relative h-40 md:h-full">
                          <Image src={getTripImage(trip)} alt={trip.title} fill sizes="220px" className="object-cover" />
                        </div>
                        <div className="flex items-center justify-between p-5">
                          <div>
                            <p className="font-semibold">{trip.title}</p>
                            <p className="text-sm text-muted-foreground">{trip.stops.length} stops · {trip.currency} {trip.budget?.totalPlanned ?? 0}</p>
                          </div>
                          <span className="text-sm font-medium text-primary">Open</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <Card className="overflow-hidden rounded-xl transition hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[220px_1fr]">
                        <div className="relative h-40 md:h-full">
                          <Image src={getTripImage(trip)} alt={trip.title} fill sizes="220px" className="object-cover" />
                        </div>
                        <div className="flex items-center justify-between p-5">
                          <div>
                            <p className="font-semibold">{trip.title}</p>
                            <p className="text-sm text-muted-foreground">Starts {new Date(trip.startDate).toLocaleDateString()} · {trip.stops.length} stops</p>
                          </div>
                          <span className="text-sm font-medium text-primary">Open</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <Card className="overflow-hidden rounded-xl transition hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[220px_1fr]">
                        <div className="relative h-40 md:h-full">
                          <Image src={getTripImage(trip)} alt={trip.title} fill sizes="220px" className="object-cover" />
                        </div>
                        <div className="flex items-center justify-between p-5">
                          <div>
                            <p className="font-semibold">{trip.title}</p>
                            <p className="text-sm text-muted-foreground">Completed {new Date(trip.endDate).toLocaleDateString()}</p>
                          </div>
                          <span className="text-sm font-medium text-primary">Open</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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