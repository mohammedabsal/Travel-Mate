import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAvatarImage, getTripImage } from '@/lib/image-fallback';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/features/profile/profile-form';

export const metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) redirect('/login');

  const trips = await prisma.trip.findMany({
    where: { ownerId: session.user.id },
    orderBy: { startDate: 'desc' },
    take: 6
  });

  const preplannedTrips = trips.filter((trip) => trip.status !== 'COMPLETED').slice(0, 3);
  const previousTrips = trips.filter((trip) => trip.status === 'COMPLETED').slice(0, 3);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: Avatar */}
          <div className="col-span-1">
            <div className="rounded-full overflow-hidden border border-border w-40 h-40 bg-background">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <Image src={getAvatarImage(session.user.name ?? session.user.email)} alt="avatar" width={160} height={160} className="h-full w-full object-cover" />
              )}
            </div>
          </div>

          {/* Middle: Details */}
          <div className="col-span-2">
            <Card className="rounded-[1rem]">
              <CardHeader>
                <CardTitle>{session.user.name ?? 'Your profile'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm defaultValues={{ name: session.user.name ?? '', bio: session.user.bio ?? '', image: session.user.image ?? '', locale: session.user.locale ?? 'en', currency: session.user.currency ?? 'USD', timezone: session.user.timezone ?? 'UTC' }} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preplanned and Previous Trips */}
        <div className="mt-8 grid gap-6">
          <section>
            <h3 className="mb-4 text-2xl font-semibold">Preplanned Trips</h3>
            <div className="grid grid-cols-3 gap-4">
              {preplannedTrips.map((trip) => (
                <Link key={trip.id} href={`/trips/${trip.id}`} className="rounded-lg border border-border p-3 transition hover:shadow-md">
                  <div className="relative mb-3 h-36 overflow-hidden rounded-md">
                    <Image src={getTripImage(trip)} alt={trip.title} fill sizes="(max-width: 1024px) 33vw, 280px" className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{trip.title}</p>
                      <p className="text-sm text-muted-foreground">{new Date(trip.startDate).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-md bg-primary px-3 py-1 text-white">View</span>
                  </div>
                </Link>
              ))}
              {!preplannedTrips.length && (
                <div className="col-span-3 rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">No preplanned trips yet.</div>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-2xl font-semibold">Previous Trips</h3>
            <div className="grid grid-cols-3 gap-4">
              {previousTrips.map((trip) => (
                <Link key={trip.id} href={`/trips/${trip.id}`} className="rounded-lg border border-border p-3 transition hover:shadow-md">
                  <div className="relative mb-3 h-36 overflow-hidden rounded-md">
                    <Image src={getTripImage(trip)} alt={trip.title} fill sizes="(max-width: 1024px) 33vw, 280px" className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{trip.title}</p>
                      <p className="text-sm text-muted-foreground">Completed {new Date(trip.endDate).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-md bg-primary px-3 py-1 text-white">View</span>
                  </div>
                </Link>
              ))}
              {!previousTrips.length && (
                <div className="col-span-3 rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">No previous trips yet.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}