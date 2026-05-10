import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { activitySearchSchema } from '@/lib/validations';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const parsed = activitySearchSchema.safeParse({
    query: searchParams.get('q') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    destinationId: searchParams.get('destinationId') ?? undefined,
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
            { description: { contains: parsed.data.query, mode: 'insensitive' } }
          ]
        }
      : {}),
    ...(parsed.data.categoryId ? { categoryId: parsed.data.categoryId } : {}),
    ...(parsed.data.destinationId ? { destinationId: parsed.data.destinationId } : {})
  };

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: { category: true, destination: true },
      orderBy: [{ rating: 'desc' }, { estimatedCost: 'asc' }],
      skip: (parsed.data.page - 1) * parsed.data.pageSize,
      take: parsed.data.pageSize
    }),
    prisma.activity.count({ where })
  ]);

  return NextResponse.json({ activities, pagination: { ...parsed.data, total } });
}