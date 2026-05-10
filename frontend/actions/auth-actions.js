'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { signupSchema } from '@/lib/validations';

export async function signupAction(values) {
  const parsed = signupSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid signup details' };
  }

  const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (existingUser) {
    return { ok: false, message: 'An account already exists for that email' };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      phone: parsed.data.phone || null,
      city: parsed.data.city || null,
      country: parsed.data.country || null,
      bio: parsed.data.bio || null,
      image: parsed.data.image || null
    }
  });

  revalidatePath('/login');
  return { ok: true, message: 'Account created. You can sign in now.' };
}