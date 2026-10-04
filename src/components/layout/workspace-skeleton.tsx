import { Skeleton } from '@/components/ui/skeleton';

export function WorkspaceSkeleton({ withNavigation = false }: { withNavigation?: boolean }) {
  return <div role="status" aria-label="Loading workspace" aria-busy="true" className="workspace-skeleton">
    <span className="sr-only">Loading your workspace. Please wait.</span>
    {withNavigation && <div className="skeleton-navigation"><Skeleton className="h-9 w-36" /><div className="hidden md:flex gap-5"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-20" /></div><Skeleton className="h-9 w-20" /></div>}
    <div className="mx-auto w-full max-w-[1400px] px-5 py-10 md:px-10">
      <Skeleton className="mb-8 h-3 w-48" />
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-5"><Skeleton className="h-14 w-4/5" /><Skeleton className="h-14 w-3/4" /><Skeleton className="h-14 w-5/6" /><Skeleton className="mt-7 h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="mt-6 h-12 w-40" /></div>
        <div className="glass-loading-panel rounded-2xl p-7"><Skeleton className="h-3 w-32" /><Skeleton className="my-8 h-44 w-full" /><Skeleton className="h-4 w-4/5" /><Skeleton className="mt-4 h-3 w-3/5" /></div>
      </div>
      <div className="my-10 grid grid-cols-2 gap-5 md:grid-cols-4">{[0,1,2,3].map(i=><div className="glass-loading-panel rounded-xl p-5" key={i}><Skeleton className="h-3 w-2/3" /><Skeleton className="mt-5 h-8 w-1/2" /></div>)}</div>
      <div className="grid gap-5 md:grid-cols-3">{[0,1,2].map(i=><div className="glass-loading-panel rounded-xl p-6" key={i}><Skeleton className="h-10 w-10" /><Skeleton className="mt-5 h-5 w-3/4" /><Skeleton className="mt-4 h-3 w-full" /></div>)}</div>
    </div>
  </div>;
}
