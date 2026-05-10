'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const initialTrips = [
  { id: 't1', name: 'Paris & Rome Adventure' },
  { id: 't2', name: 'Iceland Roadtrip' }
];

const initialSections = [
  {
    id: 's-docs',
    title: 'Documents',
    items: [
      { id: 'i1', label: 'Passport', done: true },
      { id: 'i2', label: 'Flight Tickets (printed)', done: true },
      { id: 'i3', label: 'Travel insurance', done: true },
      { id: 'i4', label: 'Hotel booking confirmation', done: false }
    ]
  },
  {
    id: 's-cloth',
    title: 'Clothing',
    items: [
      { id: 'i5', label: 'Casual shirts', done: true },
      { id: 'i6', label: 'Trousers / jeans', done: false },
      { id: 'i7', label: 'Comfortable walking shoes', done: false },
      { id: 'i8', label: 'Light jacket / windbreaker', done: false }
    ]
  },
  {
    id: 's-elect',
    title: 'Electronics',
    items: [
      { id: 'i9', label: 'Phone charger', done: true },
      { id: 'i10', label: 'Universal power adapter', done: false },
      { id: 'i11', label: 'Earphone / headphones', done: false }
    ]
  }
];

export default function PackingChecklistPage() {
  const [query, setQuery] = useState('');
  const [tripId, setTripId] = useState(initialTrips[0].id);
  const [sections, setSections] = useState(initialSections);

  const totals = useMemo(() => {
    const totalItems = sections.reduce((s, sec) => s + sec.items.length, 0);
    const doneItems = sections.reduce((s, sec) => s + sec.items.filter((i) => i.done).length, 0);
    return { totalItems, doneItems };
  }, [sections]);

  function toggleItem(sectionId, itemId) {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it))
        };
      })
    );
  }

  function resetAll() {
    setSections((prev) => prev.map((sec) => ({ ...sec, items: sec.items.map((it) => ({ ...it, done: false })) })));
  }

  function addItemToSection(sectionId) {
    const label = prompt('New item label');
    if (!label) return;
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? { ...sec, items: [...sec.items, { id: String(Date.now()), label, done: false }] }
          : sec
      )
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-4 flex items-center gap-3">
        <Input placeholder="Search checklist items" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button variant="outline">Group by</Button>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort by...</Button>
      </div>

      <h3 className="mb-2 text-xl font-semibold">Packing checklist</h3>

      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Trip:</span>
          <select className="h-11 rounded-xl border px-3" value={tripId} onChange={(e) => setTripId(e.target.value)}>
            {initialTrips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-6">
        <div className="mb-1 text-sm">Progress: {totals.doneItems}/{totals.totalItems} items packed</div>
        <div className="h-3 w-full rounded-xl bg-muted">
          <div className="h-3 rounded-xl bg-primary" style={{ width: `${(totals.doneItems / Math.max(1, totals.totalItems)) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((sec) => (
          <section key={sec.id}>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">{sec.title}</div>
              <div className="text-sm text-muted-foreground">
                {sec.items.filter((i) => i.done).length}/{sec.items.length}
              </div>
            </div>

            <div className="space-y-2">
              {sec.items
                .filter((it) => it.label.toLowerCase().includes(query.toLowerCase()))
                .map((it) => (
                  <label key={it.id} className="flex items-center gap-3">
                    <input type="checkbox" checked={it.done} onChange={() => toggleItem(sec.id, it.id)} />
                    <span className="text-sm">{it.label}</span>
                  </label>
                ))}
            </div>

            <div className="mt-3 flex gap-3">
              <Button variant="outline" size="sm" onClick={() => addItemToSection(sec.id)}>
                + add item to checklist
              </Button>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button variant="outline">Reset all</Button>
        <Button>Share Checklist</Button>
      </div>
    </div>
  );
}
