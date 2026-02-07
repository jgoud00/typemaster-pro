import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-muted rounded-md',
                className
            )}
        />
    );
}

export function LessonCardSkeleton() {
    return (
        <div className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="border rounded-lg p-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-12" />
            </div>
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
}
