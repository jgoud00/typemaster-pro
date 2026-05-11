"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showLabel?: boolean;
  animated?: boolean;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value = 0, indicatorClassName, showLabel, animated = true, ...props }, ref) => {
    const safeValue = Math.min(100, Math.max(0, value || 0));

    return (
      <div className="w-full flex items-center gap-3">
        <ProgressPrimitive.Root
          ref={ref}
          data-slot="progress"
          className={cn(
            "bg-primary/20 relative h-2 w-full overflow-visible rounded-full",
            className
          )}
          {...props}
        >
          {/* Ghost marker at 100% */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-white/20 rounded-full" />

          {/* 0% Pulsing Dot */}
          {safeValue === 0 && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.8)]" />
          )}

          <ProgressPrimitive.Indicator asChild>
            <motion.div
              data-slot="progress-indicator"
              className={cn("bg-primary h-full rounded-full shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)]", indicatorClassName)}
              initial={{ width: 0 }}
              animate={{ width: `${safeValue}%` }}
              transition={animated ? { type: "spring", stiffness: 100, damping: 20 } : { duration: 0 }}
            />
          </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Root>

        {showLabel && (
          <span className="text-xs font-mono text-content-muted w-8 text-right">
            {Math.round(safeValue)}%
          </span>
        )}
      </div>
    )
  }
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
