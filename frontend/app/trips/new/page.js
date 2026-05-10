import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TripForm } from '@/features/trips/trip-form';

export const metadata = {
  title: 'Create Trip'
};

export default async function NewTripPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <AppShell>
      <Card className="mx-auto max-w-3xl rounded-[2rem]">
        <CardHeader>
          <CardDescription>Trip builder</CardDescription>
          <CardTitle>Create a new trip</CardTitle>
        </CardHeader>
        <CardContent>
          <TripForm />
        </CardContent>
      </Card>
    </AppShell>
  );
}