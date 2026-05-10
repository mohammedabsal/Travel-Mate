import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { tripSchema } from '@/lib/validations';

export async function GET(_request, { params }) {
  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId },
    include: {
      stops: { orderBy: { order: 'asc' } },
      budget: true,
      checklist: { include: { items: true } },
      journalEntries: { orderBy: { entryDate: 'desc' } },
      sharedTrip: true
    }
  });

  if (!trip) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ trip });
}

export async function PUT(request, { params }) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = tripSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const trip = await prisma.trip.updateMany({
    where: { id: params.tripId, ownerId: session.user.id },
    data: {
      ...parsed.data,
      coverImageUrl: parsed.data.coverImageUrl || undefined
    }
  });

  return NextResponse.json({ trip });
}

export async function DELETE(_request, { params }) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.trip.deleteMany({ where: { id: params.tripId, ownerId: session.user.id } });
  return NextResponse.json({ ok: true });
}