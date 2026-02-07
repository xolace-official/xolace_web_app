import React from "react";
import { Card } from "@/components/ui/card";

const CampfireGuideSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row items-start w-full gap-8 max-w-6xl animate-fade-in">
      {/* Left Side - Settings Items (3/5 width on desktop) */}
      <div className="flex flex-col w-full lg:w-3/5 gap-6">
        {/* Mobile Preview Button Skeleton */}
        <div className="block lg:hidden">
          <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
        </div>

        {/* Settings Items */}
        <div className="flex flex-col w-full gap-4">
          {/* Toggle Items (2) */}
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <div
                key={`toggle-${index}`}
                className="flex w-full flex-col animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="group flex w-full items-center justify-between gap-5">
                  {/* Left side - Label and description */}
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-56 bg-muted/60 rounded animate-pulse" />
                  </div>

                  {/* Right side - Toggle switch */}
                  <div className="h-6 w-11 bg-muted rounded-full animate-pulse" />
                </div>
              </div>
            ))}

          {/* Select Items (2) */}
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <div
                key={`select-${index}`}
                className="flex w-full flex-col animate-fade-in"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="group flex w-full items-center justify-between gap-5">
                  {/* Left side - Label */}
                  <div className="flex-1">
                    <div className="h-5 w-28 bg-muted rounded animate-pulse" />
                  </div>

                  {/* Right side - Value and chevron */}
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}

          {/* Input Item */}
          <div
            className="flex w-full flex-col animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <div className="group flex w-full items-center justify-between gap-5">
              <div className="flex-1">
                <div className="h-5 w-36 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Resources Item */}
          <div
            className="flex w-full flex-col animate-fade-in"
            style={{ animationDelay: "500ms" }}
          >
            <div className="group flex w-full items-center justify-between gap-5">
              <div className="flex-1">
                <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                <div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Preview Card (2/5 width on desktop, hidden on mobile) */}
      <Card className="hidden lg:block w-full lg:w-2/5 items-start rounded-2xl shadow-md p-8 lg:sticky lg:top-6">
        <div className="flex w-full flex-col gap-4 pt-2 animate-fade-in">
          {/* Avatar and Title */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>

          {/* Welcome Message Alert */}
          <div className="flex w-full flex-col items-start gap-1">
            <div className="w-full rounded-xl bg-muted p-4 space-y-2">
              <div className="h-4 w-full bg-muted-foreground/20 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-muted-foreground/20 rounded animate-pulse" />
            </div>
            <div className="h-3 w-28 bg-muted rounded animate-pulse mt-1" />
          </div>

          {/* Resources Section */}
          <div className="flex w-full flex-col gap-2">
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />

            {/* Resource Items */}
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-5 bg-muted rounded-full animate-pulse" />
                </div>
              ))}
          </div>

          {/* Got It Button */}
          <div className="h-10 w-full bg-muted rounded-full animate-pulse" />

          {/* Footer Text */}
          <div className="h-3 w-48 bg-muted rounded animate-pulse mx-auto" />
        </div>
      </Card>
    </div>
  );
};

export default CampfireGuideSkeleton;
