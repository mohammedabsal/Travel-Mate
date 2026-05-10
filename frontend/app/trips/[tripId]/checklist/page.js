import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { ChecklistManager } from '@/features/checklist/checklist-manager';

export const metadata = { title: 'Packing Checklist' };

export default async function ChecklistPage({ params }) {
  const session = await auth();

  if (!session?.user) redirect('/login');

  const checklist = await prisma.checklist.findUnique({
    where: { tripId: params.tripId },
    include: { items: { orderBy: { createdAt: 'asc' } } }
  });

  return (
    <AppShell>
      <ChecklistManager initialItems={checklist?.items ?? []} tripId={params.tripId} />
    </AppShell>
  );
}