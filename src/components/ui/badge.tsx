import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        neutral: 'bg-muted/60 text-foreground border-border',
        brand: 'bg-primary/10 text-primary border-primary/30',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        error: 'bg-red-500/10 text-red-400 border-red-500/30',
        destructive: 'bg-red-500/20 text-red-300 border-red-500/30',
        achievement:
          'bg-gradient-to-r from-primary/15 to-yellow-500/15 text-primary border-primary/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
