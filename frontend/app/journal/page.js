'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const demoTrips = [
  { id: 't1', name: 'Paris & Rome Adventure' },
  { id: 't2', name: 'Iceland Roadtrip' }
];

const demoNotes = [
  {
    id: 'n1',
    title: 'Hotel check-in details - Rome stop',
    body: 'check in after 2pm, room 302, breakfast included (7-10am)',
    tripId: 't1',
    day: 'Day 3: June 14 2025',
    stop: 'Rome Stop'
  },
  {
    id: 'n2',
    title: 'Dinner reservation - Trattoria da Mario',
    body: 'Booked for 7pm. Bring cash.',
    tripId: 't1',
    day: 'Day 3: June 14 2025',
    stop: 'Rome Stop'
  },
  {
    id: 'n3',
    title: 'Pack warm layers for Iceland',
    body: 'Windproof jacket + thermal base layers recommended.',
    tripId: 't2',
    day: 'Day 1: Aug 2 2025',
    stop: 'Reykjavik'
  }
];

export default function TripNotesPage() {
  const [query, setQuery] = useState('');
  const [tripId, setTripId] = useState(demoTrips[0].id);
  const [view, setView] = useState('All');
  const [notes, setNotes] = useState(demoNotes.filter((n) => n.tripId === tripId));

  function handleTripChange(e) {
    const id = e.target.value;
    setTripId(id);
    setNotes(demoNotes.filter((n) => n.tripId === id));
  }

  function addNote() {
    const title = prompt('Note title');
    if (!title) return;
    const body = prompt('Note body') || '';
    const newNote = { id: String(Date.now()), title, body, tripId, day: 'Unspecified', stop: '' };
    setNotes((s) => [newNote, ...s]);
  }

  function removeNote(id) {
    if (!confirm('Delete this note?')) return;
    setNotes((s) => s.filter((n) => n.id !== id));
  }

  function editNote(id) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const title = prompt('Edit title', note.title) || note.title;
    const body = prompt('Edit body', note.body) || note.body;
    setNotes((s) => s.map((n) => (n.id === id ? { ...n, title, body } : n)));
  }

  const filtered = notes.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()) || n.body.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-4 flex items-center gap-3">
        <Input placeholder="Search notes..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button variant="outline">Group by</Button>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort by...</Button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Trip notes</h3>
        <div>
          <Button onClick={addNote}>+ Add Note</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <select className="h-11 rounded-xl border px-3" value={tripId} onChange={handleTripChange}>
          {demoTrips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="ml-4 flex items-center gap-2">
          {['All', 'by Day', 'by stop'].map((v) => (
            <button key={v} onClick={() => setView(v)} className={`rounded-lg px-3 py-1 text-sm ${view === v ? 'bg-primary text-white' : 'border border-border bg-background'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((note) => (
          <Card key={note.id} className="rounded-lg">
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{note.title}</p>
                  <p className="text-sm text-muted-foreground">{note.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{note.day}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button onClick={() => editNote(note.id)} className="rounded bg-muted px-2 py-1 text-sm">✏️</button>
                    <button onClick={() => removeNote(note.id)} className="rounded bg-muted px-2 py-1 text-sm">🗑️</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
