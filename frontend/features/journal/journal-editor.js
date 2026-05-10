'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { saveJournalEntryAction } from '@/actions/journal-actions';

export function JournalEditor({ tripId, defaultContent = '' }) {
  const [content, setContent] = useState(defaultContent);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveJournalEntryAction({
        tripId,
        title: 'Daily entry',
        content,
        entryDate: new Date().toISOString(),
        isPrivate: true
      });

      if (!result.ok) {
        toast.error(result.message ?? 'Could not save entry');
        return;
      }

      toast.success('Journal entry saved');
      setContent('');
    });
  };

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <CardTitle>Trip journal</CardTitle>
        <CardDescription>Write notes, memories, and daily reflections.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="What happened today?" />
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isPending}>{isPending ? 'Saving...' : 'Save entry'}</Button>
        </div>
      </CardContent>
    </Card>
  );
}