import * as React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  highlight?: boolean;
}

export function MetricCard({
  label,
  value,
  icon,
  subtext,
  trend,
  highlight = false,
  className,
  ...props
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'studio-metric relative p-5 transition-all duration-200 overflow-hidden',
        'bg-card border border-border',
        highlight && 'border-primary/30 shadow-[0_0_20px_rgba(245,158,11,0.08)]',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div
            className={cn(
              'p-1.5 rounded-lg bg-muted/60',
              highlight ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl lg:text-3xl font-semibold tabular-nums tracking-tight text-foreground">
          {value}
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-semibold font-mono',
              trend.isPositive ? 'text-emerald-400' : 'text-red-400',
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtext && <p className="text-xs text-muted-foreground mt-1 leading-5">{subtext}</p>}
    </div>
  );
}
