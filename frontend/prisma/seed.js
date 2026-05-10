const dotenv = require('dotenv');
const { PrismaClient, Prisma } = require('@prisma/client');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Culture', slug: 'culture', icon: 'Landmark' },
    { name: 'Food', slug: 'food', icon: 'UtensilsCrossed' },
    { name: 'Nature', slug: 'nature', icon: 'Trees' },
    { name: 'Adventure', slug: 'adventure', icon: 'Mountain' },
    { name: 'Nightlife', slug: 'nightlife', icon: 'PartyPopper' }
  ];

  for (const category of categories) {
    await prisma.activityCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  const destinations = [
    {
      name: 'Berlin',
      city: 'Berlin',
      region: 'Europe',
      country: 'Germany',
      countryCode: 'DE',
      slug: 'berlin-germany',
      description: 'Design-forward city breaks, history, and nightlife.',
      imageUrl: 'https://picsum.photos/id/1011/800/600',
      costIndex: 112,
      currency: 'EUR',
      isFeatured: true
    },
    {
      name: 'Kyoto',
      city: 'Kyoto',
      region: 'Asia',
      country: 'Japan',
      countryCode: 'JP',
      slug: 'kyoto-japan',
      description: 'Temples, gardens, and seasonally rich travel experiences.',
      imageUrl: 'https://picsum.photos/id/1040/800/600',
      costIndex: 126,
      currency: 'JPY',
      isFeatured: true
    },
    {
      name: 'Lisbon',
      city: 'Lisbon',
      region: 'Europe',
      country: 'Portugal',
      countryCode: 'PT',
      slug: 'lisbon-portugal',
      description: 'Hilltop views, tram rides, and walkable neighborhoods.',
      imageUrl: 'https://picsum.photos/id/1036/800/600',
      costIndex: 95,
      currency: 'EUR',
      isFeatured: true
    }
  ];

  for (const destination of destinations) {
    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: destination,
      create: destination
    });
  }

  const passwordHash = await bcrypt.hash('traveloop123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@traveloop.app' },
    update: {
      name: 'Demo Traveler',
      passwordHash
    },
    create: {
      name: 'Demo Traveler',
      email: 'demo@traveloop.app',
      passwordHash,
      currency: 'USD',
      locale: 'en'
    }
  });

  const tripShareSlug = 'eu-summer-loop';
  let trip = await prisma.trip.findUnique({
    where: { shareSlug: tripShareSlug }
  });

  if (!trip) {
    trip = await prisma.trip.create({
      data: {
        ownerId: user.id,
        title: 'Europe Summer Loop',
        description: 'A three-city route with time for museums, food, and slow mornings.',
        coverImageUrl: 'https://images.unsplash.com/photo-1488747279002-c8523379faaa?auto=format&fit=crop&w=1600&q=80',
        startDate: new Date('2026-07-10'),
        endDate: new Date('2026-07-22'),
        status: 'ACTIVE',
        visibility: 'PUBLIC',
        shareSlug: tripShareSlug,
        currency: 'EUR',
        budgetTarget: new Prisma.Decimal('4860.00'),
        budget: {
          create: {
            currency: 'EUR',
            totalPlanned: new Prisma.Decimal('4860.00'),
            totalSpent: new Prisma.Decimal('2310.00'),
            dailyAverage: new Prisma.Decimal('405.00')
          }
        },
        checklist: {
          create: {
            title: 'Packing checklist'
          }
        },
        sharedTrip: {
          create: {
            slug: tripShareSlug,
            isPublic: true
          }
        },
        stops: {
          create: [
            { order: 1, city: 'Berlin', country: 'Germany', region: 'Europe', arrivalDate: new Date('2026-07-10'), departureDate: new Date('2026-07-14') },
            { order: 2, city: 'Prague', country: 'Czech Republic', region: 'Europe', arrivalDate: new Date('2026-07-14'), departureDate: new Date('2026-07-18') },
            { order: 3, city: 'Vienna', country: 'Austria', region: 'Europe', arrivalDate: new Date('2026-07-18'), departureDate: new Date('2026-07-22') }
          ]
        }
      }
    });
  } else {
    const existingStops = await prisma.tripStop.count({
      where: { tripId: trip.id }
    });

    if (existingStops === 0) {
      await prisma.tripStop.createMany({
        data: [
          { tripId: trip.id, order: 1, city: 'Berlin', country: 'Germany', region: 'Europe', arrivalDate: new Date('2026-07-10'), departureDate: new Date('2026-07-14') },
          { tripId: trip.id, order: 2, city: 'Prague', country: 'Czech Republic', region: 'Europe', arrivalDate: new Date('2026-07-14'), departureDate: new Date('2026-07-18') },
          { tripId: trip.id, order: 3, city: 'Vienna', country: 'Austria', region: 'Europe', arrivalDate: new Date('2026-07-18'), departureDate: new Date('2026-07-22') }
        ]
      });
    }
  }

  const checklist =
    (await prisma.checklist.findUnique({ where: { tripId: trip.id } })) ??
    (await prisma.checklist.create({
      data: {
        tripId: trip.id,
        title: 'Packing checklist'
      }
    }));

  await prisma.sharedTrip.upsert({
    where: { tripId: trip.id },
    update: {},
    create: {
      tripId: trip.id,
      slug: tripShareSlug,
      isPublic: true
    }
  });

  const checklistItemCount = await prisma.checklistItem.count({
    where: { tripId: trip.id }
  });

  if (checklistItemCount === 0) {
    const items = [
      { label: 'Passport', category: 'Documents', quantity: 1, isPacked: false },
      { label: 'Universal adapter', category: 'Electronics', quantity: 1, isPacked: true },
      { label: 'Walking shoes', category: 'Clothing', quantity: 1, isPacked: false }
    ];

    for (const item of items) {
      await prisma.checklistItem.create({
        data: {
          checklistId: checklist.id,
          tripId: trip.id,
          label: item.label,
          category: item.category,
          quantity: item.quantity,
          isPacked: item.isPacked
        }
      });
    }
  }

  console.log(`Seeded user ${user.email} and trip ${trip.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });