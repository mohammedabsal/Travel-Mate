import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateMetadata({ params }) {
  const sharedTrip = await prisma.sharedTrip.findUnique({
    where: { slug: params.shareId },
    include: { trip: true }
  });

  if (!sharedTrip) return { title: 'Shared itinerary' };

  return {
    title: `${sharedTrip.trip.title} | Shared itinerary`,
    description: sharedTrip.trip.description ?? 'Public itinerary page'
  };
}

export default async function SharedTripPage({ params }) {
  const sharedTrip = await prisma.sharedTrip.findUnique({
    where: { slug: params.shareId },
    include: {
      trip: {
        include: { stops: { orderBy: { order: 'asc' } }, budget: true }
      }
    }
  });

  if (!sharedTrip || !sharedTrip.isPublic) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardDescription>Read-only itinerary</CardDescription>
          <CardTitle className="text-4xl">{sharedTrip.trip.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sharedTrip.trip.stops.map((stop) => (
            <div key={stop.id} className="rounded-2xl border border-border p-4">
              <p className="font-medium">{stop.city}</p>
              <p className="text-sm text-muted-foreground">{stop.country}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}