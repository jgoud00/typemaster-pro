'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)}
      {...props}
    />
  );
}

const tabsListVariants = cva('inline-flex w-fit items-center justify-center transition-all', {
  variants: {
    variant: {
      default:
        'bg-surface-elevated border border-border-subtle p-1 rounded-xl text-muted-foreground gap-1',
      navigation:
        'bg-muted/60 border border-border p-1 rounded-xl text-muted-foreground gap-1',
      segmented:
        'bg-surface-secondary border border-border-subtle p-1 rounded-xl text-muted-foreground gap-1',
      compact:
        'bg-surface-elevated/80 border border-border p-0.5 rounded-lg text-xs text-muted-foreground gap-0.5',
      line: 'gap-2 bg-transparent border-b border-border-subtle rounded-none p-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 focus-visible:ring-2 focus-visible:ring-brand/30',
  {
    variants: {
      variant: {
        default:
          'px-3.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-muted/60 data-[state=active]:text-foreground data-[state=active]:shadow-xs',
        navigation:
          'px-3.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-muted/60 data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-border',
        segmented:
          'px-3.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-brand/15 data-[state=active]:text-brand data-[state=active]:border data-[state=active]:border-brand/30',
        compact:
          'px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground data-[state=active]:bg-muted/60 data-[state=active]:text-foreground',
        line: 'px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground data-[state=active]:text-brand data-[state=active]:border-brand rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TabsTrigger({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsTriggerVariants>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'flex-1 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4',
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
