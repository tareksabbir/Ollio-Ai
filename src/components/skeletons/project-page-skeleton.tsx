// components/skeletons/project-page-skeleton.tsx
export function ProjectPageSkeleton() {
  return (
    <div className="h-screen flex">
      {/* Left Panel Skeleton */}
      <div className="w-1/4 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel Skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="ml-auto flex gap-2">
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="h-full w-full bg-muted/30 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}

