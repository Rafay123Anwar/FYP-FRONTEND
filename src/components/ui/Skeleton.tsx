import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <div className={cn("skeleton", className)} {...props} />
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8 animate-fade-in">
    {/* Welcome Banner Skeleton */}
    <Skeleton className="h-44 w-full rounded-2xl" />

    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-40 rounded-2xl" />
      <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>

    {/* Cards Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-52 rounded-2xl" />
      <Skeleton className="h-52 rounded-2xl" />
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <Skeleton className="h-14 w-64 rounded-xl" />
    <div className="flex gap-3 mb-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-11 w-32 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-14 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-28 rounded-xl" />
    <Skeleton className="h-11 w-40 rounded-xl" />
  </div>
);

export const ResumeSkeleton: React.FC = () => (
  <div className="space-y-4 animate-fade-in">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="card-base p-5 flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);
