'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="max-w-lg rounded-[2rem] border border-border bg-white/80 p-8 text-center shadow-xl backdrop-blur dark:bg-slate-950/70">
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="mt-3 text-sm text-muted-foreground">We hit an unexpected error while loading Traveloop.</p>
        <div className="mt-6">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}