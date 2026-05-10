'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ItineraryBoard({ initialStops = [] }) {
  // We'll treat each section as a simple object for layout purposes.
  const [sections, setSections] = useState(() => {
    // Initialize with one section per existing stop for a gentle migration,
    // grouping a single stop into its own section.
    if (!initialStops || initialStops.length === 0) return [{ id: 's1', title: 'Section 1', start: '', end: '', budget: '' }];
    return initialStops.map((stop, idx) => ({ id: `s${idx + 1}`, title: `Section ${idx + 1}`, start: stop.arrivalDate ?? '', end: stop.departureDate ?? '', budget: '' }));
  });

  function addSection() {
    const next = sections.length + 1;
    setSections((s) => [...s, { id: `s${next}`, title: `Section ${next}`, start: '', end: '', budget: '' }]);
  }

  function updateSection(id, changes) {
    setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, ...changes } : sec)));
  }

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <CardTitle>Itinerary</CardTitle>
        <CardDescription>View your daily activities and associated expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sections.map((sec, secIndex) => (
            <section key={sec.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start gap-6">
                {/* Day label column */}
                <div className="w-24 flex-shrink-0">
                  <div className="inline-flex items-center justify-center rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium">Day {secIndex + 1}</div>
                </div>

                {/* Activities column (center) */}
                <div className="flex-1 space-y-4">
                  <h4 className="text-lg font-medium">{sec.title}</h4>
                  <div className="space-y-3">
                    {/* Show up to 3 activity rows as in wireframe; real data can be mapped to these */}
                    {[0, 1, 2].map((row) => (
                      <div key={row} className="grid grid-cols-[1fr_auto] gap-4 items-center">
                        <div className="h-14 rounded-lg border border-border bg-white/60 p-3">{sec.activities?.[row]?.name ?? 'Activity placeholder'}</div>
                        <div className="w-36">
                          <div className="h-12 rounded-lg border border-border bg-white/60 p-2 text-sm text-center">{sec.activities?.[row]?.cost ? `${sec.activities[row].cost}` : 'Expense'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: budget/expense summary column */}
                <div className="w-40 flex-shrink-0">
                  <div className="rounded-lg border border-border bg-background p-3 text-sm">
                    <p className="text-xs text-muted-foreground">Section Budget</p>
                    <p className="mt-2 text-lg font-semibold">{sec.budget || '—'}</p>
                  </div>
                </div>
              </div>
            </section>
          ))}

          <div className="mt-4">
            <Button onClick={addSection} size="lg" className="w-full">+ Add another Section</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}