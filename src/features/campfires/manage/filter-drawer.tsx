"use client";

import { SquareDashedMousePointer, X } from "lucide-react";
import { useState } from "react";
import { AnimatedDrawer } from "@/components/builders/animated-drawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useManageCampfireCounts } from "@/hooks/campfires/use-manage-campfire-counts";
import { useManageCampfiresFilters } from "./manage-campfires-filter";
import { tabOptions } from "./right-side-section";

export const FilterDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [{ tab }, setSearchParams] = useManageCampfiresFilters();
  const { allCount, favCount, isLoading } = useManageCampfireCounts();

  return (
    <>
      <Button
        size="icon"
        className="rounded-full  lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <SquareDashedMousePointer size={20} />
      </Button>

      <AnimatedDrawer open={isOpen} onOpenChange={setIsOpen}>
        <AnimatedDrawer.Content showHandle={false}>
          <AnimatedDrawer.Body>
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-lg font-semibold text-foreground">Filter</h2>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <X className="text-muted-foreground" size={18} />
              </Button>
            </div>
            <ToggleGroup
              type="single"
              value={tab}
              onValueChange={(value) => {
                if (value) {
                  setSearchParams({ tab: value });
                  setIsOpen(false);
                }
              }}
              className="flex flex-col gap-2 w-full"
            >
              {tabOptions.map((option) => {
                const count = option.key === "favorites" ? favCount : allCount;

                return (
                  <ToggleGroupItem
                    key={option.key}
                    value={option.key}
                    className="group flex w-full items-center justify-between rounded-lg! p-3 text-sm transition-colors h-auto data-[state=on]:bg-primary data-[state=on]:font-semibold data-[state=on]:text-primary-foreground dark:data-[state=on]:bg-primary dark:data-[state=on]:text-primary-foreground  dark:text-neutral-300 dark:hover:bg-primary/60 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  >
                    <span>{option.label}</span>
                    {isLoading ? (
                      <Skeleton className="h-5 w-6 rounded-full" />
                    ) : (
                      <span className="rounded-full px-2 py-1 text-xs text-foreground bg-muted group-data-[state=on]:bg-background">
                        {count}
                      </span>
                    )}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </AnimatedDrawer.Body>
        </AnimatedDrawer.Content>
      </AnimatedDrawer>
    </>
  );
};
