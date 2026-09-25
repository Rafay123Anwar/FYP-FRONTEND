import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "orange" | "purple" | "blue";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  error:   "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400",
  warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  info:    "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  orange:  "bg-orange-50 text-[#FF6B00] border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  purple:  "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  blue:    "bg-blue-50 text-blue-700 border border-blue-200",
};

const DOT_VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-slate-400",
  success: "bg-emerald-500",
  error:   "bg-rose-500",
  warning: "bg-amber-500",
  info:    "bg-blue-500",
  orange:  "bg-[#FF6B00]",
  purple:  "bg-purple-500",
  blue:    "bg-blue-500",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  dot = false,
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      "badge",
      VARIANTS[variant],
      className
    )}
    {...props}
  >
    {dot && (
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", DOT_VARIANTS[variant])} />
    )}
    {children}
  </span>
);
