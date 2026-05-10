'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { tripSchema, tripStopSchema } from '@/lib/validations';

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return session.user.id;
}

export async function createTripAction(values) {
  const userId = await requireUserId();
  const parsed = tripSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid trip payload' };
  }

  const trip = await prisma.$transaction(async (tx) => {
    const createdTrip = await tx.trip.create({
      data: {
        ownerId: userId,
        title: parsed.data.title,
        description: parsed.data.description,
        coverImageUrl: parsed.data.coverImageUrl || null,
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate,
        budgetTarget: parsed.data.budgetTarget ?? null,
        currency: parsed.data.currency,
        visibility: parsed.data.visibility,
        budget: {
          create: {
            currency: parsed.data.currency,
            totalPlanned: parsed.data.budgetTarget ?? 0,
            totalSpent: 0,
            dailyAverage: 0
          }
        },
        checklist: {
          create: {
            title: 'Packing checklist'
          }
        },
        sharedTrip: {
          create: {
            slug: randomUUID().slice(0, 8),
            isPublic: parsed.data.visibility === 'PUBLIC'
          }
        }
      }
    });

    return createdTrip;
  });

  revalidatePath('/dashboard');
  revalidatePath('/trips');
  return { ok: true, trip };
}

export async function updateTripAction(tripId, values) {
  const userId = await requireUserId();
  const parsed = tripSchema.partial().safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid update payload' };
  }

  const result = await prisma.trip.updateMany({
    where: { id: tripId, ownerId: userId },
    data: {
      ...parsed.data,
      coverImageUrl: parsed.data.coverImageUrl || undefined
    }
  });

  if (!result.count) {
    return { ok: false, message: 'Trip not found' };
  }

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  revalidatePath('/dashboard');
  return { ok: true, trip };
}

export async function deleteTripAction(tripId) {
  const userId = await requireUserId();

  const result = await prisma.trip.deleteMany({ where: { id: tripId, ownerId: userId } });

  if (!result.count) {
    return { ok: false, message: 'Trip not found' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/trips');
  return { ok: true };
}

export async function duplicateTripAction(tripId) {
  const userId = await requireUserId();

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, ownerId: userId },
    include: {
      stops: true,
      checklist: { include: { items: true } },
      budget: true
    }
  });

  if (!trip) {
    return { ok: false, message: 'Trip not found' };
  }

  const copiedTrip = await prisma.$transaction(async (tx) => {
    const created = await tx.trip.create({
      data: {
        ownerId: userId,
        title: `${trip.title} Copy`,
        description: trip.description,
        coverImageUrl: trip.coverImageUrl,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budgetTarget: trip.budgetTarget,
        currency: trip.currency,
        visibility: 'PRIVATE',
        budget: trip.budget
          ? { create: { currency: trip.budget.currency, totalPlanned: trip.budget.totalPlanned ?? 0, totalSpent: 0, dailyAverage: 0 } }
          : undefined,
        checklist: trip.checklist
          ? {
              create: {
                title: trip.checklist.title ?? 'Packing checklist'
              }
            }
          : undefined
      }
    });

    if (trip.checklist?.items?.length) {
      const createdChecklist = await tx.checklist.findFirst({ where: { tripId: created.id } });
      const checklistId = createdChecklist?.id;
      if (checklistId) {
        await tx.checklistItem.createMany({
          data: trip.checklist.items.map((item) => ({
            checklistId,
            tripId: created.id,
            label: item.label,
            category: item.category,
            quantity: item.quantity,
            notes: item.notes
          }))
        });
      }
    }

    if (trip.stops?.length) {
      await tx.tripStop.createMany({
        data: trip.stops.map((stop) => ({
          tripId: created.id,
          destinationId: stop.destinationId,
          order: stop.order,
          city: stop.city,
          region: stop.region,
          country: stop.country,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          notes: stop.notes,
          latitude: stop.latitude,
          longitude: stop.longitude,
          dailyBudgetEstimate: stop.dailyBudgetEstimate
        }))
      });
    }

    return created;
  });

  revalidatePath('/trips');
  return { ok: true, trip: copiedTrip };
}

export async function addTripStopAction(values) {
  const userId = await requireUserId();
  const parsed = tripStopSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid stop payload' };
  }

  const trip = await prisma.trip.findFirst({ where: { id: parsed.data.tripId, ownerId: userId } });
  if (!trip) {
    return { ok: false, message: 'Trip not found' };
  }

  const stop = await prisma.tripStop.create({ data: parsed.data });

  revalidatePath(`/trips/${parsed.data.tripId}`);
  revalidatePath(`/trips/${parsed.data.tripId}/itinerary`);
  return { ok: true, stop };
}

export async function getRecentTripsAction(limit = 3) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return [];
    }

    const trips = await prisma.trip.findMany({
      where: {
        ownerId: session.user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverImageUrl: true,
        startDate: true,
        endDate: true,
        status: true,
        visibility: true,
        currency: true,
        budget: {
          select: {
            totalSpent: true,
            totalPlanned: true
          }
        },
        stops: {
          select: {
            city: true,
            country: true
          },
          take: 3
        }
      },
      orderBy: {
        startDate: 'desc'
      },
      take: limit
    });

    return trips;
  } catch (error) {
    console.error('Error fetching recent trips:', error);
    return [];
  }
}

export async function getPublicRecentTripsAction(limit = 3) {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        visibility: 'PUBLIC'
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverImageUrl: true,
        startDate: true,
        endDate: true,
        status: true,
        currency: true,
        budget: {
          select: {
            totalSpent: true,
            totalPlanned: true
          }
        },
        stops: {
          select: {
            city: true,
            country: true
          },
          take: 3
        }
      },
      orderBy: {
        startDate: 'desc'
      },
      take: limit
    });

    return trips;
  } catch (error) {
    console.error('Error fetching public recent trips:', error);
    return [];
  }
}