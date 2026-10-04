import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-10 w-full min-w-0 rounded-xl border border-border-subtle bg-surface-elevated/50 px-3.5 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 selection:bg-brand/30 selection:text-brand placeholder:text-text-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-brand/50 focus-visible:ring-2 focus-visible:ring-brand/25',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
