'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { journalEntrySchema } from '@/lib/validations';

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return session.user.id;
}

export async function saveJournalEntryAction(values) {
  const userId = await requireUserId();
  const parsed = journalEntrySchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid journal entry' };
  }

  const trip = await prisma.trip.findFirst({ where: { id: parsed.data.tripId, ownerId: userId } });

  if (!trip) {
    return { ok: false, message: 'Trip not found' };
  }

  const entry = await prisma.journalEntry.create({
    data: {
      ...parsed.data,
      userId
    }
  });

  revalidatePath(`/trips/${parsed.data.tripId}/journal`);
  return { ok: true, entry };
}