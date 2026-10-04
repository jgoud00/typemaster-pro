import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'relative flex flex-col rounded-2xl border text-card-foreground overflow-hidden transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-surface-secondary border-border-subtle shadow-sm py-6 gap-6',
        elevated: 'bg-surface-elevated border-border-strong shadow-md py-6 gap-6',
        interactive:
          'bg-surface-secondary border-border-subtle hover:border-brand/40 hover:bg-muted/60 hover:-translate-y-0.5 cursor-pointer shadow-sm py-6 gap-6',
        selected: 'bg-primary/5 border-brand/50 shadow-sm ring-1 ring-brand/30 py-6 gap-6',
        metric: 'bg-surface-secondary border-border-subtle p-5 gap-3',
        highlighted: 'bg-primary/5 border-brand/30 shadow-sm py-6 gap-6',
        glass:
          'bg-surface-secondary/80 backdrop-blur-xl border-border-subtle shadow-[0_8px_32px_rgba(0,0,0,0.4)] py-6 gap-6',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface CardProps extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold text-foreground', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
