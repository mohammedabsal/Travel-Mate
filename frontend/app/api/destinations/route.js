import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { destinationSearchSchema } from '@/lib/validations';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const parsed = destinationSearchSchema.safeParse({
    query: searchParams.get('q') ?? undefined,
    region: searchParams.get('region') ?? undefined,
    country: searchParams.get('country') ?? undefined,
    page: searchParams.get('page') ?? 1,
    pageSize: searchParams.get('pageSize') ?? 12
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const where = {
    ...(parsed.data.query
      ? {
          OR: [
            { name: { contains: parsed.data.query, mode: 'insensitive' } },
            { city: { contains: parsed.data.query, mode: 'insensitive' } },
            { country: { contains: parsed.data.query, mode: 'insensitive' } }
          ]
        }
      : {}),
    ...(parsed.data.region ? { region: parsed.data.region } : {}),
    ...(parsed.data.country ? { country: parsed.data.country } : {})
  };

  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { costIndex: 'asc' }],
      skip: (parsed.data.page - 1) * parsed.data.pageSize,
      take: parsed.data.pageSize
    }),
    prisma.destination.count({ where })
  ]);

  return NextResponse.json({ destinations, pagination: { ...parsed.data, total } });
}