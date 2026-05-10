import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem]">
        <CardHeader>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-64" />
        </CardHeader>
        <CardContent className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </CardContent>
      </Card>
      <Card className="rounded-[2rem]">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-16 w-full rounded-2xl" />)}
        </CardContent>
      </Card>
    </div>
  );
}