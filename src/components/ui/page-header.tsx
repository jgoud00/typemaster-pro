import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  badge,
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn('studio-page-heading flex flex-col md:flex-row md:items-center justify-between gap-5', className)}
      {...props}
    >
      <div className="space-y-1.5">
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.8px] text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{actions}</div>}
    </div>
  );
}
