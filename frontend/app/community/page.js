'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAvatarImage, picsumBySeed } from '@/lib/image-fallback';

export default function CommunityPage() {
  const toolbarSelectClass = 'h-11 min-w-[160px] appearance-none rounded-xl border border-cyan-200/60 bg-white/80 px-4 text-sm font-medium text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur focus:outline-none focus:ring-2 focus:ring-cyan-400';
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [groupBy, setGroupBy] = useState('none');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    // Placeholder: fetch community posts later. For now use mocked items.
    setPosts([
      { id: 'p1', title: 'Best hidden cafes in Lisbon', author: 'Alice', excerpt: 'Found a lovely cafe near Alfama...', city: 'Lisbon' },
      { id: 'p2', title: 'Overnight train tips', author: 'Ben', excerpt: 'Sleeping on trains can be comfy if you pick the right berth and packing cubes.', city: 'Prague' },
      { id: 'p3', title: 'Paragliding in Interlaken', author: 'Cara', excerpt: 'Booked with SkyHigh, amazing views and super safe instructors.', city: 'Interlaken' },
      { id: 'p4', title: 'Budget hacks for Europe', author: 'Dan', excerpt: 'Use regional buses and early bookings to cut city-to-city costs.', city: 'Vienna' }
    ]);
  }, []);

  const visiblePosts = useMemo(() => {
    let list = [...posts];
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery) {
      list = list.filter((post) => [post.title, post.excerpt, post.author, post.city]
        .some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery)));
    }

    if (filterBy === 'highlighted') {
      list = list.filter((post) => post.id === 'p3');
    } else if (filterBy === 'lisbon') {
      list = list.filter((post) => String(post.city).toLowerCase() === 'lisbon');
    } else if (filterBy === 'vienna') {
      list = list.filter((post) => String(post.city).toLowerCase() === 'vienna');
    }

    if (sortBy === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author-asc') {
      list.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'city-asc') {
      list.sort((a, b) => a.city.localeCompare(b.city));
    } else {
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [filterBy, posts, query, sortBy]);

  const groupedPosts = useMemo(() => {
    if (groupBy === 'author') {
      return visiblePosts.reduce((acc, post) => {
        if (!acc[post.author]) acc[post.author] = [];
        acc[post.author].push(post);
        return acc;
      }, {});
    }

    if (groupBy === 'city') {
      return visiblePosts.reduce((acc, post) => {
        if (!acc[post.city]) acc[post.city] = [];
        acc[post.city].push(post);
        return acc;
      }, {});
    }

    return { Community: visiblePosts };
  }, [groupBy, visiblePosts]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-4 flex items-center gap-3">
        <Input placeholder="Search community posts" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={groupBy} onChange={(event) => setGroupBy(event.target.value)} className={toolbarSelectClass}>
          <option value="none">Group: none</option>
          <option value="author">Group: author</option>
          <option value="city">Group: city</option>
        </select>
        <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)} className={toolbarSelectClass}>
          <option value="all">Filter: all</option>
          <option value="highlighted">Filter: highlighted</option>
          <option value="lisbon">Filter: Lisbon</option>
          <option value="vienna">Filter: Vienna</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={toolbarSelectClass}>
          <option value="recent">Sort: recent</option>
          <option value="title-asc">Sort: title A-Z</option>
          <option value="author-asc">Sort: author A-Z</option>
          <option value="city-asc">Sort: city A-Z</option>
        </select>
      </div>

      <h3 className="mb-4 text-2xl font-semibold">Community</h3>

      <div className="space-y-4">
        {Object.entries(groupedPosts).map(([groupName, groupPosts]) => (
          <div key={groupName} className="space-y-4">
            {groupBy !== 'none' && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{groupName}</p>}
            {groupPosts.map((post) => (
          <div key={post.id} className="relative flex items-start gap-4">
            {/* Avatar column */}
            <div className="w-12 flex-shrink-0">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border">
                <Image src={getAvatarImage(post.author)} alt={post.author} fill sizes="48px" className="object-cover" />
              </div>
            </div>

            {/* Post card */}
            <div className="flex-1">
              <Card className="rounded-lg">
                <CardContent className="p-0">
                  <div className="relative h-40 w-full">
                    <Image src={picsumBySeed(`${post.city}-${post.id}`, 1200, 600)} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 700px" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-4 text-sm font-medium text-white">{post.city}</div>
                  </div>
                  <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{post.author}</div>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Left-side tag flag for highlighted posts */}
            {post.id === 'p3' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 flex items-center">
                <div className="mr-2 h-3 w-3 rotate-45 bg-red-600" />
                <div className="rounded-full bg-red-600 px-3 py-1 text-sm text-white">Active Rhinoceros</div>
              </div>
            )}
          </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
