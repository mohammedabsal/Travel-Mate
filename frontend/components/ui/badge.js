import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground shadow-sm',
    secondary: 'border-transparent bg-secondary text-secondary-foreground shadow-sm',
    outline: 'text-foreground bg-transparent border border-border'
  };

  return <span className={cn('inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium transition-colors tracking-wide', variants[variant], className)} {...props} />;
}