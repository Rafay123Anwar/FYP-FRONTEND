import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.99]";

  const variants = {
    primary:
      "bg-[#FF6B00] hover:bg-[#E55F00] text-white shadow-sm hover:shadow focus:ring-[#FF6B00]",
    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-sm focus:ring-slate-900",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 focus:ring-[#FF6B00]",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-5 py-3 text-base gap-2.5 font-semibold",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
};
