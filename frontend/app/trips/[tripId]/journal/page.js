import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AppShell } from '@/components/layout/app-shell';
import { JournalEditor } from '@/features/journal/journal-editor';

export const metadata = { title: 'Journal' };

export default async function JournalPage() {
  const session = await auth();

  if (!session?.user) redirect('/login');

  return (
    <AppShell>
      <JournalEditor tripId={params.tripId} />
    </AppShell>
  );
}