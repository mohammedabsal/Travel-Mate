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
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: Avatar */}
          <div className="col-span-1">
            <div className="rounded-full overflow-hidden border border-border w-40 h-40 bg-background">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">Image of the User</div>
              )}
            </div>
          </div>

          {/* Middle: Details */}
          <div className="col-span-2">
            <Card className="rounded-[1rem]">
              <CardHeader>
                <CardTitle>{session.user.name ?? 'Your profile'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm defaultValues={{ name: session.user.name ?? '', bio: session.user.bio ?? '', image: session.user.image ?? '', locale: session.user.locale ?? 'en', currency: session.user.currency ?? 'USD', timezone: session.user.timezone ?? 'UTC' }} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preplanned and Previous Trips */}
        <div className="mt-8 grid gap-6">
          <section>
            <h3 className="mb-4 text-2xl font-semibold">Preplanned Trips</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Placeholder trip cards - wired to real data later */}
              {[1,2,3].map((i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <div className="h-36 bg-background rounded-md mb-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Trip {i}</p>
                      <p className="text-sm text-muted-foreground">Short description of planned trip</p>
                    </div>
                    <a href="#" className="rounded-md bg-primary px-3 py-1 text-white">View</a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-2xl font-semibold">Previous Trips</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map((i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <div className="h-36 bg-background rounded-md mb-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Trip {i + 3}</p>
                      <p className="text-sm text-muted-foreground">Short overview of the trip</p>
                    </div>
                    <a href="#" className="rounded-md bg-primary px-3 py-1 text-white">View</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}