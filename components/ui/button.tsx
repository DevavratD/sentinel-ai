import { cn } from "@/lib/utils";
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-zinc-50 text-zinc-900 hover:bg-zinc-50/90 shadow": variant === "default",
            "bg-red-900 text-red-50 hover:bg-red-900/90 shadow-sm": variant === "destructive",
            "border border-zinc-800 bg-transparent hover:bg-zinc-800 hover:text-zinc-50": variant === "outline",
            "bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80": variant === "secondary",
            "hover:bg-zinc-800 hover:text-zinc-50": variant === "ghost",
            "text-zinc-50 underline-offset-4 hover:underline": variant === "link",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
