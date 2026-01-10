import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards Skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>

      {/* Monthly Comparison Card Skeleton */}
      <Skeleton className="h-64 w-full" />

      {/* Charts Section Skeleton */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}
