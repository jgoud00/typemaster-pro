import * as React from 'react';
import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-[100px] w-full rounded-xl border border-border-subtle bg-surface-elevated/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-text-muted shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4',
        'focus-visible:border-brand/50 focus-visible:ring-2 focus-visible:ring-brand/25',
        'disabled:cursor-not-allowed disabled:opacity-50 resize-y',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
