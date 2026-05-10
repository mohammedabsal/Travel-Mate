import { HomePage } from '@/components/marketing/home-page';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const [destinationsRaw, recentTripsRaw] = await Promise.all([
    prisma.destination.findMany({
      where: { isFeatured: true },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        slug: true,
        imageUrl: true
      },
      take: 5
    }),
    prisma.trip.findMany({
      where: { visibility: 'PUBLIC' },
      select: {
        id: true,
        title: true,
        coverImageUrl: true,
        status: true,
        currency: true,
        stops: {
          select: { city: true },
          take: 3
        },
        budget: {
          select: {
            totalSpent: true
          }
        }
      },
      orderBy: { startDate: 'desc' },
      take: 3
    })
  ]);

  const destinations = destinationsRaw.map((d) => ({
    id: d.id,
    name: d.name,
    city: d.city,
    country: d.country,
    slug: d.slug,
    imageUrl: d.imageUrl
  }));

  const recentTrips = recentTripsRaw.map((trip) => ({
    id: trip.id,
    title: trip.title,
    coverImageUrl: trip.coverImageUrl,
    status: trip.status,
    currency: trip.currency,
    stops: trip.stops,
    budget: trip.budget
      ? {
          totalSpent: Number(trip.budget.totalSpent)
        }
      : null
  }));

  return <HomePage destinations={destinations} recentTrips={recentTrips} />;
}