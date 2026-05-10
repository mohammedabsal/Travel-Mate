'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActivitiesSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchResults() {
      setLoading(true);
      try {
        const res = await fetch(`/api/activities?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (!mounted) return;
        setResults(json.activities ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const timeout = setTimeout(() => {
      fetchResults();
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Input placeholder="Search activities or places" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button variant="outline">Group by</Button>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort by...</Button>
      </div>

      <h3 className="mb-4 text-2xl font-semibold">Results</h3>

      <div className="space-y-4">
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {!loading && results.length === 0 && <div className="text-sm text-muted-foreground">No results</div>}
        {results.map((a) => (
          <Card key={a.id} className="rounded-lg">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-muted-foreground">{a.destination?.city ?? ''} · {a.category?.name ?? ''}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{a.description?.slice(0, 140)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{a.estimatedCost ? `${a.estimatedCost} ${a.currency ?? ''}` : ''}</p>
                  <p className="text-sm text-muted-foreground">{a.rating ? `★ ${a.rating}` : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
