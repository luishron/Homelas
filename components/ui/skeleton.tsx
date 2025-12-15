import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted",
        className
      )}
      style={{ backgroundSize: '1000px 100%' }}
      {...props}
    />
  )
}

export { Skeleton }
