'use server';

import { prisma } from '@/lib/prisma';

export async function getFeaturedDestinations() {
  try {
    const destinations = await prisma.destination.findMany({
      where: {
        isFeatured: true
      },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        slug: true,
        imageUrl: true,
        description: true,
        costIndex: true,
        currency: true
      },
      take: 5
    });

    return destinations;
  } catch (error) {
    console.error('Error fetching featured destinations:', error);
    return [];
  }
}

export async function getAllDestinations() {
  try {
    const destinations = await prisma.destination.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        slug: true,
        imageUrl: true,
        description: true,
        costIndex: true,
        currency: true
      }
    });

    return destinations;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}
