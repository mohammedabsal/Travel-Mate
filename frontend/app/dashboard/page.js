import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AppShell } from '@/components/layout/app-shell';
import { DashboardOverview } from '@/features/dashboard/dashboard-overview';

export const metadata = {
  title: 'Dashboard'
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <AppShell>
      <DashboardOverview />
    </AppShell>
  );
}