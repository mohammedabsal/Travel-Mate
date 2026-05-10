'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { tripSchema } from '@/lib/validations';
import { createTripAction } from '@/actions/trip-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function TripForm({ defaultValues }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: defaultValues ?? {
      title: '',
      description: '',
      coverImageUrl: '',
      startDate: '',
      endDate: '',
      budgetTarget: 0,
      currency: 'USD',
      visibility: 'PRIVATE'
    }
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createTripAction(values);
      if (!result.ok) {
        toast.error(result.message ?? 'Could not create trip');
        return;
      }

      toast.success('Trip created');
      window.location.href = `/trips/${result.trip.id}`;
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Trip title</label>
          <Input placeholder="Japan in spring" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Budget target</label>
          <Input type="number" min="0" step="0.01" placeholder="5000" {...register('budgetTarget')} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start date</label>
          <Input type="date" {...register('startDate')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">End date</label>
          <Input type="date" {...register('endDate')} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea placeholder="What is this trip about?" {...register('description')} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cover image URL</label>
          <Input placeholder="https://..." {...register('coverImageUrl')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Currency</label>
          <Input placeholder="USD" {...register('currency')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Visibility</label>
          <select className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm" {...register('visibility')}>
            <option value="PRIVATE">Private</option>
            <option value="SHARED">Shared</option>
            <option value="PUBLIC">Public</option>
          </select>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? 'Creating trip...' : 'Create trip'}
      </Button>
    </form>
  );
}