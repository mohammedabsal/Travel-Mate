"use client";

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }) {
  return <TabsPrimitive.List className={cn('inline-flex h-11 items-center justify-center rounded-2xl bg-muted p-1 text-muted-foreground', className)} {...props} />;
}

export function TabsTrigger({ className, ...props }) {
  return <TabsPrimitive.Trigger className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm', className)} {...props} />;
}

export function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn('mt-4 focus-visible:outline-none', className)} {...props} />;
}