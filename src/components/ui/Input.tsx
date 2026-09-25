import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, type, ...props }, ref) => {
    const inputId = id || props.name;
    const [showPassword, setShowPassword] = useState(false);
    
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-muted)" }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--color-muted)" }}>
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={actualType}
            className={cn(
              "input-base",
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              error && "!border-rose-400 focus:!ring-rose-400/20 !ring-rose-400 bg-rose-50/20 dark:bg-rose-900/10",
              className
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors focus:outline-none hover:text-[var(--color-text)]"
              style={{ color: "var(--color-muted)" }}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : rightIcon ? (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none" style={{ color: "var(--color-muted)" }}>
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 font-medium flex items-center gap-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

