import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">The itinerary page you requested does not exist.</p>
        <Button asChild className="mt-6 rounded-2xl">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}