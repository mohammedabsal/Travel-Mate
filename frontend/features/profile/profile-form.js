'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { profileSchema } from '@/lib/validations';
import { updateProfileAction } from '@/actions/profile-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ProfileForm({ defaultValues }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues ?? {
      name: '',
      bio: '',
      image: '',
      locale: 'en',
      currency: 'USD',
      timezone: 'UTC'
    }
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateProfileAction(values);
      if (!result.ok) {
        toast.error(result.message ?? 'Could not save profile');
        return;
      }

      toast.success('Profile preferences saved');
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input placeholder="Name" {...register('name')} />
        <Input placeholder="Avatar URL" {...register('image')} />
      </div>
      <Textarea placeholder="Short bio" {...register('bio')} />
      <div className="grid gap-4 md:grid-cols-3">
        <Input placeholder="Locale" {...register('locale')} />
        <Input placeholder="Currency" {...register('currency')} />
        <Input placeholder="Timezone" {...register('timezone')} />
      </div>
      <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save profile'}</Button>
    </form>
  );
}