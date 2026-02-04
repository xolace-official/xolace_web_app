import React from "react";

const SettingsTabSkeleton = () => {
  return (
    <div className="flex flex-col items-start w-full justify-start gap-4 max-w-2xl animate-fade-in">
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-4">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="pb-1 px-2">
                <div className="h-6 w-24 bg-muted rounded animate-pulse" />
              </div>
            ))}
        </div>

        <div className="w-full mt-4 space-y-6">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex w-full flex-col animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="group flex w-full items-center justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsTabSkeleton;
