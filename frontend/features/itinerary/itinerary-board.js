'use client';

import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ItineraryBoard({ initialStops = [] }) {
  const [stops, setStops] = useState(initialStops);

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <CardTitle>Itinerary timeline</CardTitle>
        <CardDescription>Drag to reorder stops and keep dates in sequence.</CardDescription>
      </CardHeader>
      <CardContent>
        <Reorder.Group axis="y" values={stops} onReorder={setStops} className="space-y-3">
          {stops.map((stop) => (
            <Reorder.Item key={stop.id} value={stop} className="cursor-grab rounded-2xl border border-border bg-background p-4 active:cursor-grabbing">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{stop.city}</p>
                  <p className="text-sm text-muted-foreground">{stop.country}</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </CardContent>
    </Card>
  );
}