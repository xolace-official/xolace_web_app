import { Loader2 } from "lucide-react";
import React from "react";

const ModMemberTabSkeleton = () => {
  return (
    <div className="flex flex-col items-start w-full justify-start gap-6 animate-fade-in">
      {/* Loading display */}
      <div className="flex flex-col items-center justify-center w-full py-4 space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 rounded-full animate-pulse" />
          <Loader2 className="absolute inset-0 m-auto h-10 w-10 animate-spin text-ocean-500" />
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-xl text-neutral-900 dark:text-neutral-100">
            Loading Campfire
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
            Getting everything ready for managing your community...
          </p>
        </div>

        {/* Content skeleton */}
        <div className="w-full max-w-4xl mt-8 space-y-4">
          {/* Search bar skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-10 w-80 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
            <div className="flex gap-2">
              <div className="h-9 w-32 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
              <div className="h-9 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 p-4">
              <div className="grid grid-cols-4 gap-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-muted rounded animate-pulse"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModMemberTabSkeleton;
