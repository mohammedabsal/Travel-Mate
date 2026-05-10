'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { budgetSchema, expenseSchema } from '@/lib/validations';

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return session.user.id;
}

export async function upsertBudgetAction(values) {
  const userId = await requireUserId();
  const parsed = budgetSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid budget payload' };
  }

  const trip = await prisma.trip.findFirst({ where: { id: parsed.data.tripId, ownerId: userId } });

  if (!trip) {
    return { ok: false, message: 'Trip not found' };
  }

  const budget = await prisma.budget.upsert({
    where: { tripId: parsed.data.tripId },
    update: parsed.data,
    create: parsed.data
  });

  revalidatePath(`/trips/${parsed.data.tripId}/budget`);
  return { ok: true, budget };
}

export async function addExpenseAction(values) {
  const userId = await requireUserId();
  const parsed = expenseSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid expense payload' };
  }

  const trip = await prisma.trip.findFirst({ where: { id: parsed.data.tripId, ownerId: userId } });

  if (!trip) {
    return { ok: false, message: 'Trip not found' };
  }

  const expense = await prisma.expense.create({ data: parsed.data });

  await prisma.budget.update({
    where: { tripId: parsed.data.tripId },
    data: {
      totalSpent: { increment: parsed.data.amount }
    }
  });

  revalidatePath(`/trips/${parsed.data.tripId}/budget`);
  return { ok: true, expense };
}