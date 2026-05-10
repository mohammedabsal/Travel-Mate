import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/features/profile/profile-form';

export const metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) redirect('/login');

  return (
    <AppShell>
      <Card className="mx-auto max-w-3xl rounded-[2rem]">
        <CardHeader>
          <CardTitle>Profile settings</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultValues={{ name: session.user.name ?? '', locale: 'en', currency: 'USD', timezone: 'UTC' }} />
        </CardContent>
      </Card>
    </AppShell>
  );
}