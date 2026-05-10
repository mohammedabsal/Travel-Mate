'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { picsumBySeed } from '@/lib/image-fallback';

export default function AdminPanelPage() {
  const [query, setQuery] = useState('');
  const tabs = ['Manage Users', 'Popular cities', 'Popular Activities', 'User Trends and Analytics'];
  const [active, setActive] = useState(tabs[0]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-4 flex items-center gap-3">
        <Input placeholder="Search admin..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button variant="outline">Group by</Button>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort by...</Button>
      </div>

      <div className="mb-6 flex gap-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-XL px-4 py-2 text-sm ${active === t ? 'bg-primary text-white' : 'border border-border bg-background'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="relative">
        <Card className="rounded-2xl p-6">
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                    <div className="h-3 w-48 rounded bg-gray-200" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                    <div className="h-3 w-36 rounded bg-gray-200" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                    <div className="h-3 w-40 rounded bg-gray-200" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border border-border">
                    <Image src={picsumBySeed('admin-popular-cities', 600, 600)} alt="Popular cities" fill sizes="160px" className="object-cover" />
                  </div>
                </div>

                <div>
                  <div className="relative h-24 w-full overflow-hidden rounded">
                    <Image src={picsumBySeed('admin-activity-bars', 1200, 400)} alt="Activity trends" fill sizes="420px" className="object-cover" />
                    <div className="absolute inset-0 bg-orange-500/25" />
                  </div>
                </div>
              </div>

              <div>
                <div className="relative mb-6 h-64 w-full overflow-hidden rounded">
                  <Image src={picsumBySeed('admin-growth-lines', 1400, 700)} alt="User trends" fill sizes="560px" className="object-cover" />
                  <div className="absolute inset-0 bg-slate-900/30" />
                </div>

                <div className="space-y-3">
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-4/5 rounded bg-gray-200" />
                  <div className="h-3 w-11/12 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Left badge */}
        <div className="absolute -left-6 -top-3 flex items-center">
          <div className="mr-2 h-3 w-3 rotate-45 bg-red-600" />
          <Badge className="bg-red-600 text-white">Beloved Ibex</Badge>
        </div>

        {/* Right badge */}
        <div className="absolute -right-6 bottom-6 flex items-center">
          <Badge className="bg-emerald-700 text-white">Heat16</Badge>
          <div className="ml-2 h-3 w-3 rotate-45 bg-emerald-700" />
        </div>
      </div>
    </div>
  );
}
