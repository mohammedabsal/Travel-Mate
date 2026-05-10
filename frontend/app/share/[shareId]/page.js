import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateMetadata({ params }) {
  params = await params;
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
  params = await params;
  try {
    const sharedTrip = await prisma.sharedTrip.findUnique({
      where: { slug: params.shareId },
      include: {
        trip: {
          include: { 
            stops: { orderBy: { order: 'asc' } }, 
            budget: true,
            activities: true
          }
        }
      }
    });

    if (!sharedTrip || !sharedTrip.isPublic) {
      notFound();
    }

    const trip = sharedTrip.trip;

    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardDescription>Read-only shared itinerary</CardDescription>
            <CardTitle className="text-4xl">{trip.title}</CardTitle>
            {trip.description && <p className="mt-2 text-muted-foreground">{trip.description}</p>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Trip Stops</h3>
              <div className="grid gap-4">
                {trip.stops && trip.stops.length > 0 ? (
                  trip.stops.map((stop) => (
                    <div key={stop.id} className="rounded-2xl border border-border p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-xl">{stop.city}</p>
                          <p className="text-sm text-muted-foreground">{stop.country} {stop.region && `• ${stop.region}`}</p>
                          {stop.arrivalDate && <p className="text-xs text-muted-foreground mt-2">
                            {new Date(stop.arrivalDate).toLocaleDateString()} → {new Date(stop.departureDate).toLocaleDateString()}
                          </p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Day {stop.order}</p>
                        </div>
                      </div>
                      {stop.notes && <p className="mt-3 text-sm text-muted-foreground">{stop.notes}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No stops added yet</p>
                )}
              </div>
            </div>

            {trip.budget && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Budget</h3>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span>Planned:</span>
                    <span>${trip.budget.totalPlanned.toString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spent:</span>
                    <span>${trip.budget.totalSpent.toString()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Remaining:</span>
                    <span>${(Number(trip.budget.totalPlanned) - Number(trip.budget.totalSpent)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error loading shared trip:', error);
    notFound();
  }
}