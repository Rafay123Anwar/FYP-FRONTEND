import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div
    className={cn("card-base p-6 transition-all duration-200", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className, children, ...props
}) => (
  <div
    className={cn("mb-5 pb-4 border-b", className)}
    style={{ borderColor: "var(--color-border)" }}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className, children, ...props
}) => (
  <h3
    className={cn("text-base font-bold tracking-tight", className)}
    style={{ color: "var(--color-text)" }}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className, children, ...props
}) => (
  <p
    className={cn("text-xs mt-1", className)}
    style={{ color: "var(--color-muted)" }}
    {...props}
  >
    {children}
  </p>
);

