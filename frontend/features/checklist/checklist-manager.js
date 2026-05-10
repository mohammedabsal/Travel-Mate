'use client';

import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toggleChecklistItemAction } from '@/actions/checklist-actions';

export function ChecklistManager({ initialItems = [], tripId }) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const packedCount = useMemo(() => items.filter((item) => item.isPacked).length, [items]);

  const handleToggle = (item) => {
    const nextPacked = !item.isPacked;
    setItems((current) => current.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, isPacked: nextPacked } : currentItem)));

    startTransition(async () => {
      const result = await toggleChecklistItemAction(item.id, nextPacked);

      if (!result.ok) {
        setItems((current) => current.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, isPacked: item.isPacked } : currentItem)));
        toast.error(result.message ?? 'Could not update item');
      }
    });
  };

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <CardTitle>Packing checklist</CardTitle>
        <CardDescription>{packedCount} of {items.length} packed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
            <span className={item.isPacked ? 'line-through text-muted-foreground' : ''}>{item.label}</span>
            <Button variant={item.isPacked ? 'secondary' : 'outline'} size="sm" onClick={() => handleToggle(item)} disabled={isPending}>
              {item.isPacked ? 'Packed' : 'Mark packed'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}