'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { picsumBySeed } from '@/lib/image-fallback';

export default function ActivitiesSearchPage() {
  const toolbarSelectClass = 'h-11 min-w-[160px] appearance-none rounded-xl border border-cyan-200/60 bg-white/80 px-4 text-sm font-medium text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur focus:outline-none focus:ring-2 focus:ring-cyan-400';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupBy, setGroupBy] = useState('none');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('rating-desc');

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

  const processedResults = useMemo(() => {
    let list = [...results];

    if (filterBy === 'outdoor') {
      list = list.filter((item) => item.isOutdoor);
    } else if (filterBy === 'highly-rated') {
      list = list.filter((item) => Number(item.rating ?? 0) >= 4);
    } else if (filterBy === 'budget') {
      list = list.filter((item) => Number(item.estimatedCost ?? 0) <= 50);
    }

    if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'cost-asc') {
      list.sort((a, b) => Number(a.estimatedCost ?? 0) - Number(b.estimatedCost ?? 0));
    } else if (sortBy === 'cost-desc') {
      list.sort((a, b) => Number(b.estimatedCost ?? 0) - Number(a.estimatedCost ?? 0));
    } else {
      list.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    }

    return list;
  }, [filterBy, results, sortBy]);

  const groupedResults = useMemo(() => {
    if (groupBy === 'city') {
      return processedResults.reduce((acc, item) => {
        const key = item.destination?.city || 'Unknown city';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
    }

    if (groupBy === 'category') {
      return processedResults.reduce((acc, item) => {
        const key = item.category?.name || 'Uncategorized';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
    }

    return { Results: processedResults };
  }, [groupBy, processedResults]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Input placeholder="Search activities or places" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={groupBy} onChange={(event) => setGroupBy(event.target.value)} className={toolbarSelectClass}>
          <option value="none">Group: none</option>
          <option value="city">Group: city</option>
          <option value="category">Group: category</option>
        </select>
        <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)} className={toolbarSelectClass}>
          <option value="all">Filter: all</option>
          <option value="outdoor">Filter: outdoor</option>
          <option value="highly-rated">Filter: rating 4+</option>
          <option value="budget">Filter: budget friendly</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={toolbarSelectClass}>
          <option value="rating-desc">Sort: top rated</option>
          <option value="name-asc">Sort: name A-Z</option>
          <option value="cost-asc">Sort: low cost</option>
          <option value="cost-desc">Sort: high cost</option>
        </select>
      </div>

      <h3 className="mb-4 text-2xl font-semibold">Results</h3>

      <div className="space-y-4">
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {!loading && processedResults.length === 0 && <div className="text-sm text-muted-foreground">No results</div>}
        {Object.entries(groupedResults).map(([groupName, groupItems]) => (
          <div key={groupName} className="space-y-4">
            {groupBy !== 'none' && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{groupName}</p>}
            {groupItems.map((a) => (
          <Card key={a.id} className="rounded-lg">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="grid w-full gap-0 md:grid-cols-[180px_1fr]">
                  <div className="relative h-36 md:h-full">
                    <Image
                      src={picsumBySeed(`${a.destination?.city ?? 'city'}-${a.name}`, 900, 600)}
                      alt={a.name}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4">
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
                </div>
              </div>
            </CardContent>
          </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
