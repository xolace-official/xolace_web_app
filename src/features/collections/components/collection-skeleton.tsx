"use client";

import { cn } from "@/lib/utils";

interface CollectionCardSkeletonProps {
  className?: string;
}

export function CollectionCardSkeleton({
  className,
}: CollectionCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card p-4 animate-pulse",
        className,
      )}
    >
      {/* Icon skeleton */}
      <div className="h-12 w-12 rounded-lg bg-muted mb-3" />

      {/* Name skeleton */}
      <div className="h-5 w-24 rounded bg-muted mb-2" />

      {/* Item count skeleton */}
      <div className="h-4 w-16 rounded bg-muted" />
    </div>
  );
}

interface CollectionSkeletonGridProps {
  count?: number;
}

export function CollectionSkeletonGrid({
  count = 6,
}: CollectionSkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <CollectionCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
