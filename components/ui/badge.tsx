import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-zinc-800 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80": variant === "default",
          "border-transparent bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80": variant === "secondary",
          "border-transparent bg-red-900/50 text-red-500 hover:bg-red-900/40": variant === "destructive",
          "border-transparent bg-green-900/50 text-green-500": variant === "success",
          "border-transparent bg-amber-900/50 text-amber-500": variant === "warning",
          "text-zinc-50": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
