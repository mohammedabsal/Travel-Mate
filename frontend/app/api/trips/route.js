import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { tripSchema } from '@/lib/validations';

export async function GET(request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get('page') ?? '1'), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') ?? '12'), 1), 50);

  const where = session?.user?.id
    ? { ownerId: session.user.id }
    : { visibility: 'PUBLIC' };

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      orderBy: { startDate: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { budget: true, stops: { orderBy: { order: 'asc' } } }
    }),
    prisma.trip.count({ where })
  ]);

  return NextResponse.json({ trips, pagination: { page, pageSize, total } });
}

export async function POST(request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = tripSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const trip = await prisma.trip.create({
    data: {
      ownerId: session.user.id,
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
      }
    }
  });

  return NextResponse.json({ trip }, { status: 201 });
}