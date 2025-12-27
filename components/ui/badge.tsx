import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",

        // Financial state badges - SOLID variants for better visibility
        paid: "border-transparent bg-success text-success-foreground shadow-sm hover:shadow-md",
        pending:
          "border-transparent bg-warning text-warning-foreground shadow-sm hover:shadow-md",
        overdue:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm animate-pulse-subtle",

        // Soft variants for secondary information
        "paid-soft":
          "bg-success/15 text-success border border-success/30 dark:bg-success/20",
        "pending-soft":
          "bg-warning/15 text-warning border border-warning/30 dark:bg-warning/20",
        "overdue-soft":
          "bg-destructive/15 text-destructive border border-destructive/30 dark:bg-destructive/20",

        // Functional variants
        success:
          "border-transparent bg-success/15 text-success border-success/30 dark:bg-success/20",
        warning:
          "border-transparent bg-warning/15 text-warning border-warning/30 dark:bg-warning/20",
        info: "border-transparent bg-info/15 text-info border-info/30 dark:bg-info/20",

        outline: "text-foreground border-border",

        // Custom variant for category badges with dynamic colors
        custom: "border-transparent shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
