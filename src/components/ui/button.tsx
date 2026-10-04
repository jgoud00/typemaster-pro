import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground font-semibold hover:bg-brand-hover shadow-sm focus-visible:ring-primary/40 active:scale-[0.98]',
        primary:
          'bg-primary text-primary-foreground font-semibold hover:bg-brand-hover shadow-sm focus-visible:ring-primary/40 active:scale-[0.98]',
        destructive:
          'bg-red-500/90 text-white font-medium hover:bg-red-500 focus-visible:ring-red-500/30 active:scale-[0.98]',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-muted/60 hover:text-foreground hover:border-border shadow-xs active:scale-[0.98]',
        secondary:
          'bg-surface-elevated text-foreground border border-border hover:bg-accent hover:text-foreground active:scale-[0.98]',
        ghost:
          'text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3 rounded-xl',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 rounded-lg',
        lg: 'h-11 rounded-xl px-7 has-[>svg]:px-4 ',
        icon: 'size-9 rounded-lg',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 rounded-lg',
        'icon-lg': 'size-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
