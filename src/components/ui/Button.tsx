import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANTS = {
  primary:
    "bg-[#FF6B00] hover:bg-[#E55F00] active:bg-[#CC5400] text-white shadow-sm hover:shadow-md hover:shadow-orange-200 dark:hover:shadow-orange-900/40 focus-visible:ring-orange-500",
  secondary:
    "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-sm focus-visible:ring-slate-600",
  outline:
    "border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white focus-visible:ring-orange-500",
  ghost:
    "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus-visible:ring-slate-400",
  danger:
    "bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-sm hover:shadow-md hover:shadow-rose-200 focus-visible:ring-rose-500",
  success:
    "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md hover:shadow-emerald-200 focus-visible:ring-emerald-500",
};

const SIZES = {
  xs: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-sm gap-2.5 font-bold",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => (
  <button
    className={cn(
      "btn-base",
      "active:scale-[0.97] transition-all duration-150",
      VARIANTS[variant],
      SIZES[size],
      className
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? (
      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
    ) : leftIcon ? (
      <span className="shrink-0">{leftIcon}</span>
    ) : null}
    {children}
    {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
  </button>
);

