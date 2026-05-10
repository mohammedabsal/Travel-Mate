'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileSchema } from '@/lib/validations';

export async function updateProfileAction(values) {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, message: 'Unauthorized' };
  }

  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid profile details' };
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio,
      image: parsed.data.image || undefined,
      locale: parsed.data.locale,
      currency: parsed.data.currency,
      timezone: parsed.data.timezone
    }
  });

  return { ok: true, user };
}