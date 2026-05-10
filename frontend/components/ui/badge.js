import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    outline: 'text-foreground'
  };

  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors', variants[variant], className)} {...props} />;
}