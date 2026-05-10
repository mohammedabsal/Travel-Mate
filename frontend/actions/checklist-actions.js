'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checklistItemSchema } from '@/lib/validations';

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return session.user.id;
}

export async function toggleChecklistItemAction(itemId, packed) {
  const userId = await requireUserId();
  const item = await prisma.checklistItem.findFirst({
    where: { id: itemId, trip: { ownerId: userId } }
  });

  if (!item) {
    return { ok: false, message: 'Checklist item not found' };
  }

  const updated = await prisma.checklistItem.update({
    where: { id: itemId },
    data: {
      isPacked: packed,
      packedAt: packed ? new Date() : null
    }
  });

  revalidatePath(`/trips/${item.tripId}/checklist`);
  return { ok: true, item: updated };
}

export async function addChecklistItemAction(values) {
  const userId = await requireUserId();
  const parsed = checklistItemSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid checklist item' };
  }

  const trip = await prisma.trip.findFirst({ where: { id: parsed.data.tripId, ownerId: userId } });

  if (!trip) {
    return { ok: false, message: 'Trip not found' };
  }

  const item = await prisma.checklistItem.create({ data: parsed.data });
  revalidatePath(`/trips/${parsed.data.tripId}/checklist`);
  return { ok: true, item };
}