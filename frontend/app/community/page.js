'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CommunityPage() {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Placeholder: fetch community posts later. For now use mocked items.
    setPosts([
      { id: 'p1', title: 'Best hidden cafes in Lisbon', author: 'Alice', excerpt: 'Found a lovely cafe near Alfama...' },
      { id: 'p2', title: 'Overnight train tips', author: 'Ben', excerpt: 'Sleep­ing on trains can be comfy if you...' },
      { id: 'p3', title: 'Paragliding in Interlaken', author: 'Cara', excerpt: 'Booked with SkyHigh, amazing views.' },
      { id: 'p4', title: 'Budget hacks for Europe', author: 'Dan', excerpt: 'Use regional buses and early bookings...' }
    ]);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-4 flex items-center gap-3">
        <Input placeholder="Search community posts" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button variant="outline">Group by</Button>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort by...</Button>
      </div>

      <h3 className="mb-4 text-2xl font-semibold">Community</h3>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="relative flex items-start gap-4">
            {/* Avatar column */}
            <div className="w-12 flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm">{post.author?.[0]}</div>
            </div>

            {/* Post card */}
            <div className="flex-1">
              <Card className="rounded-lg">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{post.author}</div>
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
    </div>
  );
}
