import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { ItineraryBoard } from '@/features/itinerary/itinerary-board';

export const metadata = { title: 'Itinerary Builder' };

export default async function ItineraryPage({ params }) {
  const session = await auth();

  if (!session?.user) redirect('/login');

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, ownerId: session.user.id },
    include: { stops: { orderBy: { order: 'asc' } } }
  });

  return (
    <AppShell>
      <ItineraryBoard initialStops={trip?.stops ?? []} />
    </AppShell>
  );
}